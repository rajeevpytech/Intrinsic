/* Render the CURRENT React build with live public API data into styled per-route HTML. Read-only for the DB. */
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const frontend = path.resolve(__dirname, '..');
const build = path.resolve(frontend, process.env.BUILD_PATH || 'build');
const origin = (process.env.SEO_API_ORIGIN || 'https://intrinsicamerica.com').replace(/\/+$/, '');
const canonicalOrigin = (process.env.CANONICAL_ORIGIN || 'https://intrinsicamerica.com').replace(/\/+$/, '');
const NOT_FOUND_ROUTE = '/__styled-404__';
const mime = {'.js':'application/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.json':'application/json','.pdf':'application/pdf'};
const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');
const BASE_WIDTH = 1366;
// Same scaling ViewportScale applies after React mounts; applied pre-paint so wide screens don't jump.
const zoomBoot = `(function(){var d=document.documentElement;function a(){var w=d.clientWidth,z=w>${BASE_WIDTH}?(w/${BASE_WIDTH}).toFixed(4):"1";d.style.setProperty("--z",z);var s=document.getElementById("prerender-zoom");if(!s){s=document.createElement("style");s.id="prerender-zoom";(document.head||d).appendChild(s)}s.textContent=z==="1"?"":"body{zoom:"+z+"}"}a();window.addEventListener("resize",function(){if(document.getElementById("prerender-zoom"))a()})})();`;

async function writeAtomic(file, data) {
  await fs.mkdir(path.dirname(file), {recursive:true});
  const tmp = file + '.tmp-' + process.pid;
  await fs.writeFile(tmp, data);
  await fs.rename(tmp, file);
}

async function main() {
  const shellFile = path.join(build, '.react-shell.html');
  let shell;
  try { shell = await fs.readFile(shellFile, 'utf8'); }
  catch {
    shell = await fs.readFile(path.join(build, 'index.html'), 'utf8');
    if (shell.includes('data-prerendered=')) throw new Error('Rebuild first: no pristine React shell.');
    await writeAtomic(shellFile, shell);
  }
  await writeAtomic(path.join(build,'.prerender-template.html'), shell);
  const shellScripts = [...shell.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
  const sitemap = await fetch(origin + '/api/sitemap.xml', {signal: AbortSignal.timeout(30000)});
  if (!sitemap.ok) throw new Error('Public sitemap unavailable: ' + sitemap.status);
  const routes = [...new Set([...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(match => new URL(match[1].replace(/&amp;/g, '&')))
    .filter(url => url.origin === canonicalOrigin).map(url => url.pathname.replace(/(.)\/+$/, '$1')))];
  if (!routes.length) throw new Error('Sitemap contains no public routes.');
  const selected = process.env.PRERENDER_ROUTES ? process.env.PRERENDER_ROUTES.split(',').filter(Boolean) : [...routes, NOT_FOUND_ROUTE];
  const cache = new Map();
  const resourceCache = new Map();
  async function resource(url) {
    if (!resourceCache.has(url.href)) resourceCache.set(url.href,(async () => {
      const response = await fetch(url.href,{signal:AbortSignal.timeout(20000)});
      return {status:response.status, contentType:response.headers.get('content-type') || 'application/octet-stream', body:Buffer.from(await response.arrayBuffer())};
    })());
    return resourceCache.get(url.href);
  }
  await fs.mkdir(path.join(build, 'static/js'), {recursive:true});
  await fs.copyFile(path.join(__dirname,'prerender-boot.js'),path.join(build,'static/js/prerender-boot.js'));
  async function publicData(url) {
    url.searchParams.sort();
    const key = url.pathname + url.search;
    if (!cache.has(key)) cache.set(key, (async () => {
      const r = await fetch(origin + key, {signal: AbortSignal.timeout(30000)});
      if (!r.ok) throw new Error('Public API ' + key + ': ' + r.status);
      return r.json();
    })());
    return cache.get(key);
  }
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (selected.includes(url.pathname)) {
        res.writeHead(200, {'Content-Type':'text/html'}); res.end(shell); return;
      }
      const file = path.resolve(build, '.' + decodeURIComponent(url.pathname));
      if (!file.startsWith(build + path.sep)) throw new Error('Unsafe asset path');
      const data = await fs.readFile(file);
      res.writeHead(200, {'Content-Type':mime[path.extname(file).toLowerCase()] || 'application/octet-stream'});
      res.end(data);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const local = 'http://127.0.0.1:' + server.address().port;
  let browser;
  const pages = [];
  const failures = [];
  try {
    browser = await chromium.launch({headless:true, args:['--no-sandbox'], ...(process.env.SEO_CHROMIUM_PATH ? {executablePath:process.env.SEO_CHROMIUM_PATH} : {})});
    for (const route of selected) {
      const isNotFound = route === NOT_FOUND_ROUTE;
      if (!isNotFound && (!/^\/(?:[a-z0-9-]+\/?)*$/.test(route) || route.startsWith('/admin'))) throw new Error('Unsafe route: ' + route);
      const context = await browser.newContext({viewport:{width:BASE_WIDTH,height:900}, serviceWorkers:'block'});
      const page = await context.newPage();
      const apiPayload = {}, errors = [], missingImages = [];
      await context.addInitScript(() => {
        window.__INTRINSIC_PRERENDER__ = true;
        // Attributes added after React's render (e.g. AutoReveal's loading="lazy") are runtime state, not markup.
        new MutationObserver(list => list.forEach(m => {
          if (m.oldValue === null && (m.attributeName === 'loading' || m.attributeName === 'decoding')) m.target.setAttribute('data-pr-rt-' + m.attributeName, '1');
        })).observe(document, {subtree:true, attributes:true, attributeOldValue:true, attributeFilter:['loading','decoding']});
      });
      await page.route('**/*', async request => {
        const req = request.request(), url = new URL(req.url());
        try {
          if (req.method() !== 'GET') { await request.abort(); return; }
          if (url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/files/') && !url.pathname.startsWith('/api/og/')) {
            url.searchParams.sort();
            const key = url.pathname + url.search;
            const data = await publicData(url); apiPayload[key] = data;
            await request.fulfill({status:200, contentType:'application/json', body:JSON.stringify(data)}); return;
          }
          if (url.origin === local && !url.pathname.startsWith('/api/')) { await request.continue(); return; }
          if (['image','font','stylesheet'].includes(req.resourceType())) {
            if (url.origin === local) url.host = new URL(origin).host, url.protocol = new URL(origin).protocol;
            const response = await resource(url);
            if (response.status >= 400 && req.resourceType() === 'image') missingImages.push(url.pathname);
            await request.fulfill(response); return;
          }
          await request.abort();
        } catch (e) {
          if (url.pathname.startsWith('/api/') && req.resourceType() !== 'image') errors.push(e.message);
          await request.abort().catch(() => {});
        }
      });
      try {
        await page.goto(local + route, {waitUntil:'networkidle', timeout:90000});
        await page.waitForFunction(() => document.querySelector('main h1') && document.querySelector('link[rel="canonical"], meta[name="robots"]'), {timeout:30000});
        // Bring every section into view once so in-view entrance animations reach their final state.
        await page.evaluate(async () => {
          const step = Math.max(300, window.innerHeight * 0.8);
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
          window.scrollTo(0, 0);
        });
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.evaluate(() => document.fonts && document.fonts.ready);
        await page.waitForFunction(() => !document.getAnimations().some(a => { const t = a.effect && a.effect.getComputedTiming(); return a.playState === 'running' && t && isFinite(t.endTime); }), {timeout:8000}).catch(() => {});
        await page.waitForTimeout(300);
        if (errors.length) throw new Error(errors.join('; '));
        const snapshot = await page.evaluate(({route, canonicalOrigin, shellScripts, isNotFound}) => {
          const d = document.documentElement;
          d.setAttribute('data-prerendered','1');
          d.classList.remove('le-wait');
          d.style.removeProperty('--z');
          document.body.style.removeProperty('zoom');
          document.querySelectorAll('[data-le-ui]').forEach(el => el.remove());
          // Only the shell's own scripts may run again; drop runtime-injected ones (lazy chunks, analytics loaders).
          document.querySelectorAll('script[src]').forEach(el => { if (!shellScripts.includes(el.getAttribute('src'))) el.remove(); });
          document.querySelectorAll('[data-pr-rt-loading]').forEach(el => { el.removeAttribute('loading'); el.removeAttribute('data-pr-rt-loading'); });
          document.querySelectorAll('[data-pr-rt-decoding]').forEach(el => { el.removeAttribute('decoding'); el.removeAttribute('data-pr-rt-decoding'); });
          document.querySelectorAll('.areveal,.img-reveal').forEach(el => el.classList.add('is-in'));
          document.querySelectorAll('.treveal').forEach(el => el.classList.add('treveal-in'));
          document.querySelectorAll('.lr-reveal').forEach(el => el.classList.add('lr-reveal-in'));
          document.querySelectorAll('.hero-wipe').forEach(el => el.classList.add('hw-in'));
          document.querySelectorAll('script[type="application/ld+json"]:not([data-seo-managed])').forEach(el => el.remove());
          const canonical = document.querySelector('link[rel="canonical"]');
          if (canonical && !isNotFound) canonical.href = canonicalOrigin + route;
          if (isNotFound && canonical) canonical.remove();
          const style = document.createElement('style');
          style.id = 'prerender-visible';
          // Safety net only for hidden reveal *states*; never touches design transforms (e.g. hero scale()).
          const scope = s => 'html[data-prerendered] #prerender-snapshot ' + s + ',html[data-prerendered] #root:not([aria-hidden]) ' + s;
          const hidden = ['.areveal:not(.is-in)','.treveal:not(.treveal-in)','.lr-reveal:not(.lr-reveal-in)','.img-reveal:not(.is-in)'].map(scope).join(',');
          const gated = ['.hero-wipe:not(.hw-in)','.reveal:not(.is-visible)'].map(scope).join(',');
          style.textContent = hidden + '{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}' + gated + '{opacity:1!important;clip-path:none!important}';
          document.head.appendChild(style);
          const main = document.querySelector('main');
          return {html:'<!doctype html>\n'+d.outerHTML, h1s:document.querySelectorAll('main h1').length, text:main.innerText.length, title:document.title,
            robots:document.querySelector('meta[name="robots"]')?.content || '', canonical: document.querySelector('link[rel="canonical"]')?.href || '',
            heading:document.querySelector('main h1').textContent.trim()};
        }, {route, canonicalOrigin, shellScripts, isNotFound});
        if (!isNotFound) {
          if (snapshot.h1s !== 1 || snapshot.text < 250) throw new Error('incomplete React page');
          if (/noindex/i.test(snapshot.robots) || /page not found|^404$/i.test(snapshot.heading)) throw new Error('sitemap page rendered an error view');
        }
        const bootstrap = `<script>${zoomBoot}window.__INTRINSIC_PUBLIC_DATA__=${safeJson(apiPayload)};(function(){try{var d=window.__INTRINSIC_PUBLIC_DATA__;if(d['/api/theme'])localStorage.setItem('intr_theme_cache',JSON.stringify(d['/api/theme']));if(d['/api/custom-css'])localStorage.setItem('intr_custom_css_cache',JSON.stringify(d['/api/custom-css'].css||''));var edits={};(d['/api/live-edits']||[]).forEach(function(e){(edits[e.path]||(edits[e.path]=[])).push(e)});localStorage.setItem('intr_live_edits_cache',JSON.stringify(edits));localStorage.setItem('intr_live_edits_ready','1')}catch(e){}})();</script><script defer src="/static/js/prerender-boot.js"></script>`;
        // Bootstrap must precede all application scripts, including deferred CRA scripts.
        const html = snapshot.html.replace(/(<head[^>]*>)/i, (_, head) => head + bootstrap);
        const destination = isNotFound ? path.join(build, '.styled-404.html') : path.join(build, route.replace(/^\//,''), 'index.html');
        await writeAtomic(destination, html);
        pages.push({route,title:snapshot.title,heading:snapshot.heading,canonical:snapshot.canonical,missingImages:[...new Set(missingImages)]});
        console.log('Rendered ' + route + ' (' + snapshot.text + ' text characters)' + (missingImages.length ? ' MISSING IMAGES: ' + [...new Set(missingImages)].join(', ') : ''));
      } catch (e) {
        failures.push(route + ': ' + e.message);
        console.error('FAILED ' + route + ': ' + e.message);
      } finally {
        await context.close();
      }
    }
    const manifestFile = path.join(build,'styled-prerender-manifest.json');
    let previous = [];
    try { previous = JSON.parse(await fs.readFile(manifestFile,'utf8')).pages || []; } catch { /* first run */ }
    const merged = [...previous.filter(p => !pages.some(n => n.route === p.route)), ...pages];
    await writeAtomic(manifestFile, JSON.stringify({generatedAt:new Date().toISOString(),pages:merged},null,2));
    if (failures.length) throw new Error('Prerender failed for ' + failures.length + ' route(s):\n' + failures.join('\n'));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error.message || error); process.exitCode=1; });
