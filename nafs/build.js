// Compiles app.jsx into index.html (no in-browser Babel needed).
// Usage: node build.js /path/to/@babel/standalone/babel.min.js
const fs=require('fs'),path=require('path');
const Babel=require(process.argv[2]);
const src=fs.readFileSync(path.join(__dirname,'app.jsx'),'utf8');
const out=Babel.transform(src,{presets:['react'],comments:false}).code;
const tpl=fs.readFileSync(path.join(__dirname,'template.html'),'utf8');
fs.writeFileSync(path.join(__dirname,'index.html'),tpl.replace('/*APP*/',()=>'(function(){\n'+out+'\n})();'));
console.log('built',out.length);
