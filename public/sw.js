/* Offline support: the whole trip app is saved on the phone after the first visit */
const V='202611131627';const CORE='trip-core-'+V,FONTS='trip-fonts-v1';
const PRE=['./','index.html','lib/three.min.js','lib/OrbitControls.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','trip.ics'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('trip-core-')&&k!==CORE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(r.mode==='navigate'||(u.origin===location.origin&&(u.pathname.endsWith('/')||u.pathname.endsWith('index.html')))){
    // newest version when online, saved copy when offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CORE).then(c=>c.put('index.html',cp));return res;}).catch(()=>caches.match('index.html').then(m=>m||caches.match('./'))));return;}
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;}).catch(()=>m);return m||f;})));return;}
  if(u.origin===location.origin){e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CORE).then(c=>c.put(r,cp));}return res;})));}
});
