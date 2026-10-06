/* Browser checks against staged output before it becomes production. */
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const build = path.resolve(__dirname,'..',process.env.BUILD_PATH || 'build');
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
const assetCache = new Map();
async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(build,'styled-prerender-manifest.json'),'utf8'));
  const routes = process.env.VERIFY_ROUTES ? process.env.VERIFY_ROUTES.split(',') : manifest.pages.map(page => page.route).filter(route => !route.startsWith('/__'));
  const assetOrigin = new URL(process.env.ASSET_ORIGIN || 'https://intrinsicamerica.com');
  const server = http.createServer(async (req,res) => {
    try {
      const url = new URL(req.url,'http://localhost');
      const relative = url.pathname.endsWith('/') ? url.pathname+'index.html' : path.extname(url.pathname) ? url.pathname : url.pathname+'/index.html';
      const file = path.resolve(build,'.'+decodeURIComponent(relative));
      if (!file.startsWith(build+path.sep)) throw new Error('Unsafe path');
      const data = await fs.readFile(file);
      res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});res.end(data);
    } catch {res.writeHead(404);res.end('Not found');}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const local='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.SEO_CHROMIUM_PATH?{executablePath:process.env.SEO_CHROMIUM_PATH}:{})});
  try {
    for(const route of routes){
      const file=path.join(build,route.replace(/^\//,''),'index.html');
      const html=await fs.readFile(file,'utf8');
      const match=html.match(/window\.__INTRINSIC_PUBLIC_DATA__=(.*?);\(function\(/s);
      if(!match)throw new Error('Missing public bootstrap: '+route);
      const data=JSON.parse(match[1]);
      async function intercept(request,delay){
        const req=request.request(),url=new URL(req.url());
        if(req.method()!=='GET'){await request.abort();return;}
        if(url.pathname.startsWith('/api/')&&!url.pathname.startsWith('/api/files/')&&!url.pathname.startsWith('/api/og/')){
          url.searchParams.sort();const key=url.pathname+url.search;
          if(!(key in data))throw new Error('Unexpected public API: '+key);
          if(delay)await new Promise(resolve=>setTimeout(resolve,500));
          await request.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data[key])});return;
        }
        if(url.origin===local&&!url.pathname.startsWith('/api/')){
          if(delay&&url.pathname.endsWith('.js')&&!url.pathname.endsWith('prerender-boot.js'))await new Promise(resolve=>setTimeout(resolve,1500));
          await request.continue();return;
        }
        if(['image','stylesheet','font'].includes(req.resourceType())){
          if(url.origin===local)url.host=assetOrigin.host,url.protocol=assetOrigin.protocol;
          if(!assetCache.has(url.href))assetCache.set(url.href,(async()=>{
            const r=await fetch(url.href,{signal:AbortSignal.timeout(20000)});
            return {status:r.status,contentType:r.headers.get('content-type')||'application/octet-stream',body:Buffer.from(await r.arrayBuffer())};
          })());
          await request.fulfill(await assetCache.get(url.href));return;
        }
        await request.abort();
      }
      const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1366,height:900}});
      const staticPage=await noJs.newPage();await staticPage.route('**/*',r=>intercept(r,false));
      await staticPage.goto(local+route,{waitUntil:'networkidle'});
      await staticPage.locator('main h1').waitFor({state:'visible'});
      const staticTitle=await staticPage.locator('main h1').innerText();
      if(!await staticPage.locator('[data-testid="site-header"]').count())throw new Error('Actual navigation missing: '+route);
      const header=await staticPage.locator('[data-testid="site-header"]').boundingBox();
      if(!header||header.width<1000||header.height<30)throw new Error('Unstyled navigation: '+route);
      await noJs.close();
      const interactive=await browser.newContext({viewport:{width:1366,height:900},reducedMotion:'reduce'});
      const page=await interactive.newPage();const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.route('**/*',r=>intercept(r,true));
      await page.goto(local+route,{waitUntil:'commit'});
      await page.locator('#prerender-snapshot main h1').waitFor({state:'visible'});
      if(await page.locator('#prerender-snapshot main h1').innerText()!==staticTitle)throw new Error('Initial content changed: '+route);
      await page.waitForFunction(()=>!document.getElementById('prerender-snapshot')&&!document.documentElement.hasAttribute('data-prerendered'),{timeout:30000});
      await page.locator('#root main h1').waitFor({state:'visible'});
      const interactiveTitle=await page.locator('#root main h1').innerText();
      if(interactiveTitle!==staticTitle)throw new Error('Interactive content changed: '+route+' '+JSON.stringify({staticTitle,interactiveTitle}));
      if(errors.length)throw new Error(route+': '+errors.join('; '));
      console.log('PASS styled/no-JS/slow-mount: '+route);
      await interactive.close();
    }
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
