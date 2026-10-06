/* Browser checks of the styled-initial-HTML startup against a running site (default: local nginx).
   Usage: NODE_PATH=<tools>/node_modules BASE=http://localhost:8080 node frontend/scripts/e2e-styled-check.cjs [routes...] */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const BASE = (process.env.BASE || 'http://localhost:8080').replace(/\/+$/, '');
const OUT = process.env.OUT || '/root/e2e-out';
const JS_DELAY = Number(process.env.JS_DELAY || 2500);
const API_DELAY = Number(process.env.API_DELAY || 900);
fs.mkdirSync(OUT, { recursive: true });

const sampler = () => {
  window.__samples = [];
  const visible = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height > 0 && r.width > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[aria-hidden="true"]'); };
  const opacityChain = (el) => { let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity || '1'); return o; };
  const tick = () => {
    requestAnimationFrame(tick);
    try { if (document.body && window.__samples.length < 1500) {
      const snap = document.getElementById('prerender-snapshot');
      const mains = [...document.querySelectorAll('main')].filter(visible);
      const main = mains[0];
      const h1 = main && main.querySelector('h1');
      const headers = [...document.querySelectorAll('[data-testid="site-header"]')].filter(visible).length;
      window.__samples.push({ t: Math.round(performance.now()), phase: (snap || document.documentElement.hasAttribute('data-prerendered')) ? 'snapshot' : (document.getElementById('root')?.children.length ? 'react' : 'empty'),
        mains: mains.length, headers, h1: h1 ? h1.textContent.trim().replace(/\s+/g, ' ') : null, h1top: h1 ? Math.round(h1.getBoundingClientRect().top) : null,
        h1visible: h1 ? h1.getBoundingClientRect().height > 0 : false, opacity: main ? Math.round(opacityChain(main) * 100) / 100 : 0,
        h1opacity: h1 ? Math.round(opacityChain(h1) * 100) / 100 : 0, fontFamily: h1 ? getComputedStyle(h1).fontFamily.split(',')[0] : '' });
    } } catch (e) { window.__sampleError = String(e); }
  };
  requestAnimationFrame(tick);
};

const IGNORE = /posthog|emergent\.sh|emergentagent|google-analytics|googletagmanager/;

async function run(browser, route, device) {
  const ctxOpts = device === 'mobile' ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1440, height: 900 } };
  const result = { route, device, problems: [] };
  // 1) JavaScript disabled: the real styled page must be visible
  {
    const ctx = await browser.newContext({ ...ctxOpts, javaScriptEnabled: false });
    const page = await ctx.newPage();
    const resp = await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1800); // approved CSS-only entrance animations (page-in 0.6s, revealChild ~1.6s) complete without JS
    const info = await page.evaluate(() => {
      const h = document.querySelector('[data-testid="site-header"]'); const h1 = document.querySelector('main h1');
      const hr = h && h.getBoundingClientRect();
      return { status: 0, header: hr ? { w: Math.round(hr.width), h: Math.round(hr.height), pos: getComputedStyle(h).position } : null,
        h1: h1 ? h1.textContent.trim().replace(/\s+/g, ' ') : null, h1Font: h1 ? getComputedStyle(h1).fontFamily : '', h1Opacity: h1 ? getComputedStyle(h1).opacity : '0',
        sheets: document.styleSheets.length, title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href || '' };
    });
    result.noJs = { status: resp.status(), ...info };
    if (resp.status() !== 200) result.problems.push('noJS status ' + resp.status());
    if (!info.header || info.header.w < 300) result.problems.push('noJS header missing/unstyled');
    if (!info.h1 || !/Playfair|serif/i.test(info.h1Font) || info.h1Opacity !== '1') result.problems.push('noJS H1 not styled/visible: ' + info.h1Font + ' op=' + info.h1Opacity);
    if (device === 'desktop' || /^\/$|cybersecurity|healthcare|financial|non-profit|resources|contact/.test(route)) await page.screenshot({ path: path.join(OUT, `${device}-nojs${route.replace(/\//g, '_') || '_'}.png`) });
    await ctx.close();
  }
  // 2) Slow JS + slow API cold load: no blank frame, no duplicate sections, no heading change, no fade/jump
  {
    const ctx = await browser.newContext(ctxOpts);
    await ctx.addInitScript(sampler);
    const page = await ctx.newPage();
    const errors = [], failed = [];
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !IGNORE.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
    page.on('requestfailed', (r) => { if (!IGNORE.test(r.url())) failed.push('failed ' + r.url() + ' ' + (r.failure()?.errorText || '')); });
    page.on('response', (r) => { if (r.status() >= 400 && !IGNORE.test(r.url())) failed.push(r.status() + ' ' + r.url()); });
    await page.route('**/*', async (rt) => {
      const u = rt.request().url();
      if (/\/static\/js\/main\.[^/]+\.js$/.test(u)) await new Promise((r) => setTimeout(r, JS_DELAY));
      else if (/\/api\/(?!files|og)/.test(u) && rt.request().resourceType() !== 'document') await new Promise((r) => setTimeout(r, API_DELAY));
      await rt.continue();
    });
    await page.goto(BASE + route, { waitUntil: 'commit', timeout: 60000 });
    const tag = `${device}${route.replace(/\//g, '_') || '_'}`;
    // Snapshot fully faded-in and still non-interactive -> "before" frame of the swap.
    await page.waitForFunction(() => { const h = document.querySelector('main h1'); return document.documentElement.hasAttribute('data-prerendered') && h && getComputedStyle(document.querySelector('.page-in') || h).opacity === '1'; }, { timeout: 20000 }).catch(() => {});
    if (await page.evaluate(() => document.documentElement.hasAttribute('data-prerendered'))) await page.screenshot({ path: path.join(OUT, `pre-${tag}.png`), animations: 'disabled' });
    else result.problems.push('could not capture snapshot frame (swap too fast for the test)');
    await page.waitForFunction(() => !document.documentElement.hasAttribute('data-prerendered') && !document.getElementById('prerender-snapshot') && document.querySelector('#root main h1'), { timeout: 45000 });
    const shotSnap = null;
    await page.waitForTimeout(1500);
    if (process.env.DUMP) console.log('dbg', await page.evaluate(() => [performance.now() | 0, window.__samples.length, document.documentElement.hasAttribute('data-prerendered')]));
    const samples = await page.evaluate(() => window.__samples);
    const sampleError = await page.evaluate(() => window.__sampleError);
    if (sampleError) console.log('sampler error: ' + sampleError);
    if (process.env.DUMP) fs.writeFileSync(path.join(OUT, 'samples' + route.replace(/\//g, '_') + '-' + device + '.json'), JSON.stringify(samples));
    const painted = samples.filter((s) => s.mains > 0);
    const firstPaint = painted[0];
    // The approved 0.6s .page-in load fade runs on the styled snapshot; judge stability once it is opaque.
    const settledIdx = samples.findIndex((s) => s.mains > 0 && s.h1opacity >= 0.99);
    const fadeMs = settledIdx >= 0 && firstPaint ? samples[settledIdx].t - firstPaint.t : null;
    const after = settledIdx >= 0 ? samples.slice(settledIdx) : [];
    const h1s = [...new Set(after.map((s) => s.h1))];
    const blank = after.filter((s) => s.mains === 0 || !s.h1visible);
    const dup = after.filter((s) => s.mains > 1 || s.headers > 1);
    const tops = after.map((s) => s.h1top).filter((v) => v != null);
    const jump = tops.length ? Math.max(...tops) - Math.min(...tops) : 0;
    const minOpacity = after.length ? Math.min(...after.map((s) => s.h1opacity)) : 0;
    const swapAt = (samples.find((s) => s.phase === 'react') || {}).t;
    if (!after.some((s) => s.phase === 'react')) result.problems.push('swap not observed after settle');
    result.slow = { fadeMs, firstPaintMs: firstPaint && firstPaint.t, firstPaintPhase: firstPaint && firstPaint.phase, swapMs: swapAt, frames: after.length,
      headings: h1s, blankFrames: blank.length, duplicateFrames: dup.length, h1Jump: jump, minH1Opacity: minOpacity, font: firstPaint && firstPaint.fontFamily };
    if (!firstPaint || firstPaint.phase !== 'snapshot') result.problems.push('first paint was not the styled snapshot');
    if (fadeMs == null || fadeMs > 1000) result.problems.push('page not fully visible within 1s of first paint (' + fadeMs + 'ms)');
    if (h1s.length !== 1) result.problems.push('heading changed: ' + JSON.stringify(h1s));
    if (blank.length) result.problems.push(blank.length + ' blank/hidden-H1 frames');
    if (dup.length) result.problems.push(dup.length + ' duplicate-section frames');
    if (jump > 2) result.problems.push('H1 moved ' + jump + 'px during startup');
    if (minOpacity < 0.99) result.problems.push('H1 faded (min opacity ' + minOpacity + ') during startup');
    result.errors = [...new Set(errors)]; result.failedRequests = [...new Set(failed)];
    if (result.errors.length) result.problems.push('console/page errors: ' + result.errors.length);
    if (result.failedRequests.length) result.problems.push('failed requests: ' + result.failedRequests.length);
    if (/undefined\/api/.test(failed.join(' '))) result.problems.push('/undefined/api request');
    await page.screenshot({ path: path.join(OUT, `post-${tag}.png`), animations: 'disabled' });
    void shotSnap;
    await ctx.close();
  }
  return result;
}

(async () => {
  let routes = process.argv.slice(2);
  if (!routes.length) {
    const xml = await (await fetch(BASE + '/sitemap.xml')).text();
    routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  }
  const devices = (process.env.DEVICES || 'desktop,mobile').split(',');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const results = [];
  try {
    for (const route of routes) for (const device of devices) {
      try { const r = await run(browser, route, device); results.push(r); console.log((r.problems.length ? 'FAIL ' : 'PASS ') + device.padEnd(7) + route + (r.problems.length ? '  -> ' + r.problems.join('; ') : '') + `  [paint ${r.slow.firstPaintMs}ms snapshot, swap ${r.slow.swapMs}ms]`); }
      catch (e) { results.push({ route, device, problems: ['exception: ' + e.message] }); console.log('FAIL ' + device + ' ' + route + ' exception ' + e.message); }
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
  const bad = results.filter((r) => r.problems.length);
  console.log(`\n${results.length - bad.length}/${results.length} passed`);
  process.exitCode = bad.length ? 1 : 0;
})();
