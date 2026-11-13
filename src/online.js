/* ---------- online layer (phone app only): weather + Fuji outlook, and group sync (shared plan, booking ticks, notice board) ----------
   Everything here is optional: with no signal the app keeps working from the saved plan. */
const SUPA={url:'https://ryzmxxlldyanzlgfyuav.supabase.co',key:'sb_publishable_3_ecdj83A_hNzScwsjxNuA_018e0AHY'};
async function rpc(fn,args){const r=await fetch(SUPA.url+'/rest/v1/rpc/'+fn,{method:'POST',headers:{'Content-Type':'application/json',apikey:SUPA.key},body:JSON.stringify(args||{})});
  if(!r.ok){let m='';try{m=(await r.json()).message||'';}catch(e){}const er=new Error(m||('http '+r.status));er.status=r.status;throw er;}return r.json();}
const GKEY='jp-trip-group-v1';
const GRP={code:'',name:'',joined:false,ver:-1,notices:[],bookings:{},last:0,dirty:false,dirtyNote:'',busy:false,draft:'',all:false,msg:'',server:null,applying:false,locs:[],share:false,myPos:null,watch:null,lastSent:0,skew:0};
try{const g=JSON.parse(localStorage.getItem(GKEY)||'null');if(g&&g.code&&g.name){GRP.code=g.code;GRP.name=g.name;GRP.joined=true;GRP.share=!!g.share;}}catch(e){}
function grpSave(){try{if(GRP.joined)localStorage.setItem(GKEY,JSON.stringify({code:GRP.code,name:GRP.name,share:GRP.share}));else localStorage.removeItem(GKEY);}catch(e){}}
const CHKEYS=['narita','osakaB','dawnB','tokyoB'];
const xKeys=m=>Object.keys(m||{}).filter(k=>k.slice(0,2)==='x:'&&m[k]===true).sort();
function planSnap(){const mine={};OPTS.forEach(o=>mine[o.k]=!!PLAN.mine[o.k]);xKeys(PLAN.mine).forEach(k=>mine[k]=true);const ch={};CHKEYS.forEach(k=>ch[k]=CH[k]);return {mode:PLAN.mode==='mine'?'mine':'full',route:'B',mine,ch};}
function normPlan(p){const mine={};OPTS.forEach(o=>mine[o.k]=p&&p.mine&&typeof p.mine[o.k]==='boolean'?p.mine[o.k]:!!PLAN.mine[o.k]);xKeys(p&&p.mine?p.mine:PLAN.mine).forEach(k=>mine[k]=true);const ch={};CHKEYS.forEach(k=>ch[k]=p&&p.ch&&OPT[k]&&OPT[k].opts[p.ch[k]]?p.ch[k]:CH[k]);return {mode:p&&p.mode==='mine'?'mine':'full',mine,ch};}
function applyRemotePlan(p){const n=normPlan(p);if(JSON.stringify(n)===JSON.stringify(planSnap()))return false;
  PLAN.mode=n.mode;PLAN.mine=n.mine;CHKEYS.forEach(k=>CH[k]=n.ch[k]);savePlan();GRP.applying=true;
  try{if(window.__mainOK)applyPlan();else{STOPS=stopsFor(onSet());renderToday();}}catch(e){}GRP.applying=false;return true;}
function bookLabel(k){try{const b=BOOKS.find(x=>x.k===k);return b?b.t:k;}catch(e){return k;}}
function bookWho(k){const b=GRP.joined&&GRP.bookings[k];return b&&b.done&&b.who?` <span class="muted">· by ${esc(b.who)}</span>`:'';}
function isBookKey(k){try{return BOOKS.some(b=>b.k===k);}catch(e){return false;}}
function setCk(k,v){CKD[k]=v;saveCk();if(APP&&GRP.joined&&isBookKey(k)){GRP.bookings[k]={done:v,who:GRP.name,at:Date.now()};
  rpc('trip_set_booking',{p_code:GRP.code,p_key:k,p_done:v,p_who:GRP.name,p_label:bookLabel(k)}).then(procState).catch(()=>grpNote('Could not reach the group. This tick is saved on your phone only; tick it again when you are online.'));}}
function grpNote(t){GRP.msg=t;updFeed();}
function procState(s){if(!s||typeof s!=='object')return;GRP.last=Date.now();GRP.msg='';GRP.notices=Array.isArray(s.notices)?s.notices:[];GRP.locs=Array.isArray(s.locs)?s.locs:[];if(s.now)GRP.skew=s.now-Date.now();updLocs();
  let ckChanged=false;const bk=s.bookings||{};GRP.bookings=bk;Object.keys(bk).forEach(k=>{if(isBookKey(k)&&!!CKD[k]!==!!bk[k].done){CKD[k]=!!bk[k].done;ckChanged=true;}});
  if(ckChanged){saveCk();try{if(window.__mainOK){updBookBtn();if(!active&&tab==='book')renderBook();if(!active&&tab==='prep')renderPrep();}}catch(e){}}
  const v=+s.plan_ver||0;
  if(v===0){GRP.ver=0;grpPushPlan('Set the group plan',true);}
  else if(GRP.dirty&&v===GRP.ver){grpPushPlan(GRP.dirtyNote,true);}
  else{const had=GRP.dirty;GRP.dirty=false;GRP.ver=v;const ch=applyRemotePlan(s.plan);if(had&&ch)GRP.msg='The group plan changed while you were offline, so the group’s version is shown.';else if(ch&&s.plan_by&&s.plan_by!==GRP.name)GRP.msg=`Plan updated by ${s.plan_by}.`;}
  if(s.conflict)GRP.msg='Someone changed the plan just before you. Their version is shown; make your change again if it is still needed.';
  updFeed();}
function grpPushPlan(note,force){if(!APP||!GRP.joined||GRP.applying)return;if(GRP.ver<0){GRP.dirty=true;GRP.dirtyNote=note;return;}
  GRP.dirty=true;GRP.dirtyNote=note;
  rpc('trip_set_plan',{p_code:GRP.code,p_plan:planSnap(),p_base_ver:GRP.ver,p_who:GRP.name,p_note:note||null}).then(s=>{GRP.dirty=false;if(s.conflict){GRP.ver=+s.plan_ver||0;applyRemotePlan(s.plan);procState(s);}else{GRP.ver=+s.plan_ver||GRP.ver;GRP.last=Date.now();GRP.notices=s.notices||GRP.notices;GRP.msg='';updFeed();}})
   .catch(()=>grpNote('No connection: your change is saved on this phone and will be sent to the group when you are back online.'));}
function grpSync(){if(!APP||!GRP.joined||GRP.busy||document.hidden||!navigator.onLine)return;GRP.busy=true;
  rpc('trip_get',{p_code:GRP.code}).then(procState).catch(e=>{if(/bad_code/.test(e.message)){GRP.joined=false;GRP.code='';grpSave();GRP.msg='That group code is no longer valid. Ask the organiser for the new one.';drawGrp();}else updFeed();}).finally(()=>{GRP.busy=false;});}
function grpJoin(){const nm=(document.getElementById('gName').value||'').trim().slice(0,24),cd=(document.getElementById('gCode').value||'').trim().toLowerCase();const m=document.getElementById('gMsg');
  if(!nm||!cd){m.textContent='Enter your name and the group code.';return;}if(!navigator.onLine){m.textContent='You are offline. Join when you have a connection.';return;}m.textContent='Joining…';
  rpc('trip_get',{p_code:cd}).then(s=>{GRP.code=cd;GRP.name=nm;GRP.joined=true;GRP.share=false;GRP.ver=-1;GRP.dirty=false;grpSave();drawGrp();procState(s);})
   .catch(e=>{m.textContent=/bad_code/.test(e.message)?'That code is not right. Check it with the organiser.':'Could not reach the group server. Try again in a moment.';});}
function grpLeave(){if(GRP.share)shareStop(true);GRP.locs=[];updLocs();GRP.joined=false;GRP.code='';GRP.notices=[];GRP.bookings={};GRP.ver=-1;GRP.msg='';grpSave();drawGrp();}
function grpPost(){const i=document.getElementById('gText');const t=(i.value||'').trim();if(!t)return;if(!navigator.onLine){grpNote('You are offline. The message was not sent.');return;}
  const b=document.getElementById('gPost');b.disabled=true;rpc('trip_post_notice',{p_code:GRP.code,p_body:t.slice(0,280),p_who:GRP.name}).then(s=>{i.value='';GRP.draft='';procState(s);}).catch(e=>grpNote(/too_many/.test(e.message)?'Too many messages in a minute. Wait a little.':'The message was not sent. Try again.')).finally(()=>{b.disabled=false;});}
function gTime(ms){const d=new Date(ms),n=new Date();const hm2=p2(d.getHours())+':'+p2(d.getMinutes());return d.toDateString()===n.toDateString()?hm2:`${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${hm2}`;}
function feedHTML(){const L=GRP.notices;if(!L.length)return '<p class="muted" style="font-size:12.5px;margin:6px 0">No messages yet. Plan changes and bookings will also show here.</p>';
  const show=GRP.all?L:L.slice(0,5);return show.map(n=>`<div class="gn${n.kind==='system'?' sys':''}"><small>${esc(n.author)} · ${gTime(n.at)}</small><div>${esc(n.body)}</div>${n.kind==='note'&&n.author===GRP.name?`<button class="gx" data-del="${+n.id}" aria-label="Delete this message">×</button>`:''}</div>`).join('')+(L.length>5?`<button class="lk gmore" id="gMore">${GRP.all?'Show fewer':`Show all ${L.length}`}</button>`:'');}
function statTxt(){if(!navigator.onLine)return 'offline · showing the last synced version';if(!GRP.last)return 'connecting…';return 'synced '+gTime(GRP.last);}
function updFeed(){const f=document.getElementById('gFeed');if(!f)return;f.innerHTML=feedHTML();const st=document.getElementById('gStat');if(st)st.textContent=statTxt();const m=document.getElementById('gNote');if(m){m.textContent=GRP.msg;m.hidden=!GRP.msg;}
  f.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>rpc('trip_delete_notice',{p_code:GRP.code,p_id:+b.dataset.del}).then(procState).catch(()=>grpNote('Could not delete it. Try again.')));
  const mo=document.getElementById('gMore');if(mo)mo.onclick=()=>{GRP.all=!GRP.all;updFeed();};}
function drawGrp(){const el=document.getElementById('grp');if(!el)return;
  if(!GRP.joined){el.innerHTML=`<h4>Group sync</h4><p class="muted">Share one plan, the booking ticks and a notice board with the others. The organiser has the group code.</p>
    <div class="grow"><input id="gName" maxlength="24" placeholder="Your name" autocomplete="given-name"><input id="gCode" maxlength="64" placeholder="Group code" autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false"></div>
    <div class="grow"><button class="btn pri" id="gJoin">Join the group</button><span class="muted" id="gMsg">${esc(GRP.msg||'')}</span></div><p class="muted" id="gSrv">${GRP.server===true?'Group server: connected':GRP.server===false?'Group server: not reachable right now':''}</p>`;
    document.getElementById('gJoin').onclick=grpJoin;
    if(GRP.server===null&&navigator.onLine){GRP.server=undefined;rpc('trip_ping').then(()=>GRP.server=true).catch(()=>GRP.server=false).finally(()=>{const s=document.getElementById('gSrv');if(s)s.textContent=GRP.server?'Group server: connected':'Group server: not reachable right now';});}
    return;}
  el.innerHTML=`<div class="grp-h"><h4>Group board</h4><span class="muted"><b>${esc(GRP.name)}</b> · <span id="gStat">${statTxt()}</span></span></div>
    <p class="gnote" id="gNote" ${GRP.msg?'':'hidden'}>${esc(GRP.msg)}</p>
    <div class="grow"><input id="gText" maxlength="280" placeholder="Message everyone, e.g. Meet at the East Exit 21:00" value="${esc(GRP.draft)}"><button class="btn pri" id="gPost">Post</button></div>
    <div id="gFeed"></div>
    <h4 style="margin-top:12px">Where is everyone</h4><label class="chk gshare"><input type="checkbox" id="gShare" ${GRP.share?'checked':''}> <span>Share my location with the group</span></label>
    <p class="muted" style="margin-top:2px">Only while this app is open on your screen. Switch it off to remove your position.</p><div id="gLocs"></div><p class="muted" style="font-size:11.5px;margin:8px 0 0">The plan and “Booked” ticks are shared with the group. <button class="lk" id="gLeave">Leave group</button></p>`;
  const i=document.getElementById('gText');i.oninput=()=>GRP.draft=i.value;i.onkeydown=e=>{if(e.key==='Enter')grpPost();};
  document.getElementById('gPost').onclick=grpPost;document.getElementById('gLeave').onclick=grpLeave;
  const sh=document.getElementById('gShare');sh.onchange=()=>{if(sh.checked)shareStart();else shareStop(true);};updFeed();updLocs();}
if(APP){addEventListener('load',()=>setTimeout(()=>{grpSync();if(GRP.joined&&GRP.share)shareStart();},900));setInterval(grpSync,25000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){grpSync();loadWx();}});addEventListener('online',()=>{grpSync();loadWx();updFeed();});addEventListener('offline',updFeed);}

/* opt-in location sharing: sent only while the app is open, removed when switched off, hidden by the server after 2 hours */
function shareSend(force){const p=GRP.myPos;if(!p||!GRP.joined||!GRP.share||!navigator.onLine)return;if(!force&&Date.now()-GRP.lastSent<45000)return;GRP.lastSent=Date.now();
  rpc('trip_set_loc',{p_code:GRP.code,p_who:GRP.name,p_lat:+p.la.toFixed(5),p_lon:+p.lo.toFixed(5),p_acc:Math.round(p.acc||0)}).then(procState).catch(()=>{});}
function shareStart(){if(!navigator.geolocation){GRP.share=false;grpNote('This browser cannot share location.');drawGrp();return;}GRP.share=true;grpSave();
  if(GRP.watch!=null){try{navigator.geolocation.clearWatch(GRP.watch);}catch(e){}}
  try{GRP.watch=navigator.geolocation.watchPosition(pos=>{const first=!GRP.myPos;GRP.myPos={la:pos.coords.latitude,lo:pos.coords.longitude,acc:pos.coords.accuracy};shareSend(first);updLocs();},
    err=>{if(err&&err.code===1){shareStop(false);GRP.msg='Location is blocked for this app, so sharing is off. Allow location in your phone settings, then switch it on again.';drawGrp();}},{enableHighAccuracy:true,maximumAge:30000,timeout:20000});}catch(e){shareStop(false);}}
function shareStop(clear){if(GRP.watch!=null){try{navigator.geolocation.clearWatch(GRP.watch);}catch(e){}GRP.watch=null;}GRP.share=false;GRP.lastSent=0;grpSave();
  if(clear&&GRP.joined&&GRP.code){const c=GRP.code,n=GRP.name;rpc('trip_clear_loc',{p_code:c,p_who:n}).then(s=>{if(GRP.joined)procState(s);}).catch(()=>grpNote('Could not reach the group to remove your position. It disappears by itself after 2 hours.'));}
  GRP.locs=GRP.locs.filter(l=>l.name!==GRP.name);updLocs();}
function agoTxt(at){const m=Math.max(0,Math.round((Date.now()+GRP.skew-at)/6e4));return m<1?'just now':m<60?`${m} min ago`:`${Math.floor(m/60)} h ${m%60} min ago`;}
function nearPlace(la,lo){let k=null,d=1e9;Object.keys(PLACES).forEach(id=>{if(!LL[id])return;const x=hav(la,lo,LL[id][0],LL[id][1]);if(x<d){d=x;k=id;}});return k&&d<60?{k,d}:null;}
function updLocs(){try{if(window.__mainOK)showPals(GRP.joined?GRP.locs:[]);}catch(e){}const el=document.getElementById('gLocs');if(!el)return;
  const me=GRP.myPos,L=GRP.locs.filter(l=>l.name!==GRP.name);let h='';
  if(GRP.share)h+=`<div class="gl"><div><b>You</b> <small>${me?'sharing now':'finding your position…'}</small></div></div>`;
  h+=L.map(l=>{const np=nearPlace(l.lat,l.lon),old=Date.now()+GRP.skew-l.at>6e5;
    return `<div class="gl${old?' old':''}"><div><b>${esc(l.name)}</b> <small>${agoTxt(l.at)}${old?' · app closed or no signal':''}</small><div class="muted">${me?fmtKm(hav(me.la,me.lo,l.lat,l.lon))+' from you':'Switch on sharing to see the distance from you'}${np?` · ${np.d<.15?'at':fmtKm(np.d)+' from'} ${esc(shortName(np.k))}`:''}</div></div>
     <div class="tbtn"><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lon}&travelmode=walking" target="_blank" rel="noopener">Directions ↗</a>${window.__mainOK?`<button class="btn" data-pal="${esc(l.name)}">On the map</button>`:''}</div></div>`;}).join('');
  if(!L.length)h+=`<p class="muted" style="margin:6px 0 0">${GRP.share?'Nobody else is sharing right now.':'Nobody is sharing right now.'}</p>`;
  el.innerHTML=h;el.querySelectorAll('[data-pal]').forEach(b=>b.onclick=()=>{try{palFly(b.dataset.pal);}catch(e){}});}
if(APP)setInterval(()=>{if(!document.hidden){shareSend(false);if(document.getElementById('gLocs'))updLocs();}},30000);

/* weather and Mt Fuji outlook (Open-Meteo, free, no account) */
const WXKEY='jp-trip-wx-v2';let WX=null;try{WX=JSON.parse(localStorage.getItem(WXKEY)||'null');}catch(e){}
const WMO=c=>c===0?'Clear':c===1?'Mostly clear':c===2?'Partly cloudy':c===3?'Overcast':c<=48?'Fog':c<=57?'Drizzle':c<=67?'Rain':c<=77?'Snow':c<=82?'Showers':c<=86?'Snow showers':'Thunderstorm';
let wxBusy=false;
function loadWx(){if(!APP||wxBusy||!navigator.onLine)return;if(WX&&Date.now()-WX.t<36e5)return;wxBusy=true;
  const base='https://api.open-meteo.com/v1/forecast?timezone=Asia%2FTokyo&forecast_days=16',dl='&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max';
  const get=u=>fetch(u).then(r=>{if(!r.ok)throw new Error('wx');return r.json();});
  Promise.allSettled([get(base+'&latitude=35.5011&longitude=138.7679'+dl),get(base+'&latitude=35.6896&longitude=139.7006'+dl),get(base+'&latitude=35.3606&longitude=138.7274&hourly=cloud_cover_low,cloud_cover_mid')]).then(rs=>{
    const day=(r,date)=>{try{const d=r.value.daily,i=d.time.indexOf(date);if(i<0)return null;const v={c:d.weather_code[i],hi:d.temperature_2m_max[i],lo:d.temperature_2m_min[i],r:d.precipitation_probability_max[i]};return v.c==null||v.hi==null?null:v;}catch(e){return null;}};
    const fuji=(date,h0,h1)=>{try{const h=rs[2].value.hourly;let s=0,n=0;h.time.forEach((t,i)=>{if(t.slice(0,10)===date){const hr=+t.slice(11,13);if(hr>=h0&&hr<=h1&&h.cloud_cover_low[i]!=null){s+=Math.max(h.cloud_cover_low[i],h.cloud_cover_mid[i]||0);n++;}}});return n?Math.round(s/n):null;}catch(e){return null;}};
    const out={t:Date.now(),fri:day(rs[0],'2026-11-20'),sat:day(rs[1],'2026-11-21'),sun:day(rs[1],'2026-11-22'),fFri:fuji('2026-11-20',12,16),fSat:fuji('2026-11-21',6,9)};
    if(out.fri||out.sat||out.sun||out.fFri!=null){WX=out;try{localStorage.setItem(WXKEY,JSON.stringify(WX));}catch(e){}}drawWx();}).finally(()=>{wxBusy=false;});}
function drawWx(){const el=document.getElementById('wx');if(!el)return;
  if(!WX){el.innerHTML=`<h4>Weather</h4><p class="muted">${navigator.onLine?'Loading the forecast…':'The forecast loads when you are online.'}</p>`;return;}
  const row=(lab,v)=>`<div class="wr"><span>${lab}</span><b>${v?`${WMO(v.c)}, ${Math.round(v.lo)}–${Math.round(v.hi)}°C${v.r!=null?`, rain ${Math.round(v.r)}%`:''}`:'not in the forecast yet'}</b></div>`;
  const fj=(lab,c)=>`<div class="wr"><span>${lab}</span><b>${c==null?'not in the forecast yet':c<30?`likely visible (cloud ${c}%)`:c<60?`partly hidden (cloud ${c}%)`:`likely hidden (cloud ${c}%)`}</b></div>`;
  el.innerHTML=`<h4>Weather</h4>${row('Fri 20 · Kawaguchiko',WX.fri)}${row('Sat 21 · Tokyo',WX.sat)}${row('Sun 22 · Tokyo',WX.sun)}<h4 style="margin-top:10px">Mt Fuji outlook</h4>${fj('Fri · Oishi Park, Chureito (12–16h)',WX.fFri)}${fj('Sat · sunrise at Kogamasao (06–09h)',WX.fSat)}
   <p class="muted">A guide only: cloud forecast around the mountain for the hours shown. Updated ${gTime(WX.t)}. On the day check <a class="lk" href="https://isfujivisible.com/" target="_blank" rel="noopener">isfujivisible.com ↗</a>. Weather data by <a class="lk" href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo.com</a>.</p>`;}
