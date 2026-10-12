const { chromium } = require('C:/Users/ARTIST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('C:/Users/ARTIST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
(async()=>{
const out = path.resolve('tmp/work-intro-capture');
await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--no-sandbox']});
const errors=[]; const bad=[];
for (let run=1; run<=2; run++) {
  const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(`run${run} pageerror: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error') errors.push(`run${run} console: ${m.text()}`)});
  page.on('response',r=>{if(r.status()>=400)bad.push({run,status:r.status(),url:r.url()})});
  const dir=path.join(out,`run${run}`); await fs.mkdir(dir,{recursive:true});
  await page.goto('http://127.0.0.1:3000/work',{waitUntil:'commit'});
  await page.locator('.showcase-shell').waitFor({state:'attached',timeout:15000});
  const start=Date.now(); const frames=[]; const poses=[];
  for(let i=0;i<=120;i++){
    const deadline=start+i*50; const delay=deadline-Date.now(); if(delay>0) await new Promise(resolve=>setTimeout(resolve,delay));
    const file=path.join(dir,`f${String(i).padStart(3,'0')}.jpg`);
    await page.screenshot({path:file,type:'jpeg',quality:82});
    const ms=Date.now()-start;
    const pose=await page.evaluate(()=>({tiles:[...document.querySelectorAll('[data-showcase-tile]')].map(t=>{const r=t.getBoundingClientRect(),s=getComputedStyle(t);return {x:r.x,y:r.y,w:r.width,h:r.height,opacity:Number(s.opacity),visibility:s.visibility,transform:s.transform}}),intro:document.querySelector('.showcase-shell')?.getAttribute('data-intro')}));
    frames.push({i,t:Number((ms/1000).toFixed(3)),file}); poses.push({i,t:Number((ms/1000).toFixed(3)),...pose});
  }
  const imgResults=[];
  for(const f of frames){
    const {data,info}=await sharp(f.file).removeAlpha().raw().toBuffer({resolveWithObject:true}); const bg=[data[15],data[16],data[17]];
    let minX=info.width,minY=info.height,maxX=-1,maxY=-1;
    for(let y=180;y<info.height;y++) for(let x=0;x<info.width;x++){const p=(y*info.width+x)*info.channels;if(Math.abs(data[p]-bg[0])+Math.abs(data[p+1]-bg[1])+Math.abs(data[p+2]-bg[2])>45){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
    imgResults.push({i:f.i,t:f.t,empty:maxX<0,bbox:maxX<0?null:{x:[minX,maxX],y:[minY,maxY]},vw:maxX<0?null:[Number((minX/19.2).toFixed(1)),Number((maxX/19.2).toFixed(1))],vh:maxX<0?null:[Number((minY/10.8).toFixed(1)),Number((maxY/10.8).toFixed(1))]});
  }
  const contacts=[];
  for(let i=0;i<24;i++){const idx=Math.round(i*5); contacts.push({input:frames[idx].file,left:(i%6)*320,top:Math.floor(i/6)*180});}
  await sharp({create:{width:1920,height:720,channels:3,background:'#111'}}).composite(await Promise.all(contacts.map(async c=>({input:await sharp(c.input).resize(320,180).jpeg({quality:80}).toBuffer(),left:c.left,top:c.top})))).jpeg({quality:88}).toFile(path.join(out,`contact-run${run}.jpg`));
  await fs.writeFile(path.join(out,`metrics-run${run}.json`),JSON.stringify({poses,bboxes:imgResults},null,2));
  await context.close();
}
await fs.writeFile(path.join(out,'capture-results.json'),JSON.stringify({errors,bad},null,2));
await browser.close();

})().catch(e=>{console.error(e);process.exitCode=1});



