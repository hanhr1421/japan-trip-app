import fs from 'fs';import * as d3 from 'd3-geo';
const m=JSON.parse(fs.readFileSync('map.json'));
const proj=d3.geoMercator().fitSize([1000,440],{type:'Feature',geometry:{type:'MultiPoint',coordinates:[[135.15,34.25],[140.75,36.15]]}});
const k=proj.scale(),[tx,ty]=proj.translate();
const f=(lo,la)=>[tx+k*lo*Math.PI/180,ty-k*Math.log(Math.tan(Math.PI/4+la*Math.PI/360))];
console.log('check',proj([139.7,35.69]),f(139.7,35.69));
const REAL={minami:[35.6866,139.7008],yokocho:[35.6931,139.6998],kabuki:[35.6950,139.7019]};
for(const [id,[la,lo]] of Object.entries(REAL))console.log(id,'true xy',f(lo,la).map(v=>+v.toFixed(2)));
m.xy.minami=[814.4,114.4];m.xy.yokocho=[812.3,110.8];m.xy.kabuki=[815.6,110.4];
fs.writeFileSync('map.json',JSON.stringify(m));
const LL={};for(const [id,[x,y]] of Object.entries(m.xy)){const [lo,la]=proj.invert([x,y]);LL[id]=[+la.toFixed(5),+lo.toFixed(5)];}
Object.assign(LL,REAL);
fs.writeFileSync('ll.json',JSON.stringify({LL,MERC:{k:+k.toFixed(4),tx:+tx.toFixed(4),ty:+ty.toFixed(4)}}));
console.log(JSON.stringify({k,tx,ty}),LL.tocho,LL.narita,LL.yume);
