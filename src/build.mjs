// Build the phone app (public/) and the Claude artifact page (dist/artifact.html) from the template.
// Run from the repo root:  cd src && npm install && node build.mjs
import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.join(here,'..');
const m=JSON.parse(fs.readFileSync(path.join(here,'map.json'))),ll=fs.readFileSync(path.join(here,'ll.json'),'utf8');
const APPURL=process.env.APPURL||'https://japan-trip-app-wine.vercel.app/';
const tpl=fs.readFileSync(path.join(here,'trip-map.template.html'),'utf8').replace('__D__',m.d).replace('__XY__',JSON.stringify(m.xy)).replace('__LL__',ll).replace('__APPURL__',APPURL).replace('/*__ONLINE__*/',()=>fs.readFileSync(path.join(here,'online.js'),'utf8'));
const PWAHEAD=`<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#0f1a2a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Japan Trip">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">`;
const out=(app,three,orbit)=>tpl.replace('__APP__',app?'true':'false').replace('__PWAHEAD__',app?PWAHEAD:'').replace('__THREE__',three).replace('__ORBIT__',orbit);
const pub=path.join(root,'public');fs.mkdirSync(path.join(pub,'lib'),{recursive:true});fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(pub,'index.html'),out(true,'lib/three.min.js','lib/OrbitControls.js'));
fs.writeFileSync(path.join(root,'dist','artifact.html'),out(false,'https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js','https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js'));
const nm=path.join(here,'node_modules','three');
if(fs.existsSync(nm)){fs.copyFileSync(path.join(nm,'build','three.min.js'),path.join(pub,'lib','three.min.js'));fs.copyFileSync(path.join(nm,'examples','js','controls','OrbitControls.js'),path.join(pub,'lib','OrbitControls.js'));}
const ver=new Date().toISOString().replace(/[-:T]/g,'').slice(0,12);
fs.writeFileSync(path.join(pub,'sw.js'),fs.readFileSync(path.join(here,'sw.template.js'),'utf8').replace('__VERSION__',ver));
console.log('built public/ and dist/artifact.html · sw',ver,'· app URL',APPURL);
