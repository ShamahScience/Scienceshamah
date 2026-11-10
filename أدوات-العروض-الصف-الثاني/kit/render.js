const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const dir=process.argv[2];const b=await chromium.launch();const p=await b.newPage();
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.svg'))){
 const s=fs.readFileSync(path.join(dir,f),'utf8');const m=s.match(/viewBox="0 0 (\d+) (\d+)"/);let w=+m[1],h=+m[2];
 const sc=w<=600?2:1; await p.setViewportSize({width:w*sc,height:h*sc});
 await p.setContent(`<html><body style="margin:0;background:transparent">${s.replace('<svg ',`<svg width="${w*sc}" height="${h*sc}" `)}</body></html>`);
 await p.screenshot({path:path.join(dir,f.replace('.svg','.png')),omitBackground:true,clip:{x:0,y:0,width:w*sc,height:h*sc}});}
await b.close();})();
