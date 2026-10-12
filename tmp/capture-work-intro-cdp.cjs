const { chromium } = require('C:/Users/ARTIST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('C:/Users/ARTIST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('node:fs/promises'); const path = require('node:path');
(async()=>{
const out=path.resolve('tmp/work-intro-capture'); await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});const errors=[],bad=[];
for(let run=1;run<=2;run++){
 const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(`run${run} pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`run${run} console: ${m.text()}`)});page.on('response',r=>{if(r.status()>=400)bad.push({run,status:r.status(),url:r.url()})});
 const cdp=await context.newCDPSession(page), frames=[];let startedAt=null,nextAt=0;
 cdp.on('Page.screencastFrame',async({data,sessionId,metadata})=>{try{if(startedAt===null)startedAt=metadata.timestamp;const t=metadata.timestamp-startedAt;if(t+0.001>=nextAt&&frames.length<121){frames.push({t,data});nextAt+=.05;}await cdp.send('Page.screencastFrameAck',{sessionId});}catch{}});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:82,maxWidth:1920,maxHeight:1080,everyNthFrame:1});
 if(run===1) await page.goto('http://127.0.0.1:3000/work',{waitUntil:'commit'}); else await page.reload({waitUntil:'commit'});
 const wallStart=Date.now();await new Promise(r=>setTimeout(r,6200));await cdp.send('Page.stopScreencast');
 const dir=path.join(out,`run${run}`);await fs.mkdir(dir,{recursive:true});for(let i=0;i<frames.length;i++)await fs.writeFile(path.join(dir,`f${String(i).padStart(3,'0')}.jpg`),Buffer.from(frames[i].data,'base64'));
 const poses=await page.evaluate(()=>({intro:document.querySelector('.showcase-shell')?.getAttribute('data-intro'),viewport:{width:innerWidth,height:innerHeight},tiles:[...document.querySelectorAll('[data-showcase-tile]')].map(t=>{const r=t.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,transform:getComputedStyle(t).transform}})}));
 const bboxes=[];for(let i=0;i<frames.length;i++){
  const file=path.join(dir,`f${String(i).padStart(3,'0')}.jpg`);const {data,info}=await sharp(file).resize(960,540).removeAlpha().raw().toBuffer({resolveWithObject:true});const bg=[data[0],data[1],data[2]];let minX=960,minY=540,maxX=-1,maxY=-1;
  for(let y=90;y<540;y++)for(let x=0;x<960;x++){const p=(y*960+x)*info.channels;if(Math.abs(data[p]-bg[0])+Math.abs(data[p+1]-bg[1])+Math.abs(data[p+2]-bg[2])>45){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
  bboxes.push({i,t:Number(frames[i].t.toFixed(3)),empty:maxX<0,vw:maxX<0?null:[Number((minX/9.6).toFixed(1)),Number((maxX/9.6).toFixed(1))],vh:maxX<0?null:[Number(((minY*2+0)/10.8).toFixed(1)),Number(((maxY*2)/10.8).toFixed(1))]});
 }
 const comp=[];for(let i=0;i<24&&i*5<frames.length;i++){const input=path.join(dir,`f${String(i*5).padStart(3,'0')}.jpg`);comp.push({input:await sharp(input).resize(320,180).jpeg({quality:82}).toBuffer(),left:(i%6)*320,top:Math.floor(i/6)*180});}
 await sharp({create:{width:1920,height:720,channels:3,background:'#111'}}).composite(comp).jpeg({quality:88}).toFile(path.join(out,`contact-run${run}.jpg`));
 await fs.writeFile(path.join(out,`metrics-run${run}.json`),JSON.stringify({frameCount:frames.length,wallElapsedMs:Date.now()-wallStart,poses,bboxes},null,2));await context.close();
}
await fs.writeFile(path.join(out,'capture-results.json'),JSON.stringify({errors,bad},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
