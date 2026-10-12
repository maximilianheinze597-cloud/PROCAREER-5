const UTK='procareer_ut_v1',PACK=10000;
const STARS_DEF=[['Kian Moreau','ST',93],['Theo Falkner','CAM',90],['Ayden Rossi','CAM',89],['Nico Valdez','LW',88],['Jonas Marlow','CB',88],['Leon Hartwig','CM',87],['Mats Ferrero','RW',87],['Emil Santoro','GK',87],['Luca Brandt','CDM',86],['Finn Aurich','LB',86],['Noah Lindqvist','RB',85],['Dario Keller','ST',85]];
let STARS=STARS_DEF.map(x=>x.slice());
try{const st=JSON.parse(localStorage.getItem('procareer_stars')||'null');if(Array.isArray(st)&&st.length>=3)STARS=st}catch(e){}
const fmt=n=>Math.round(n).toLocaleString('de-DE');
const UT={s:null,
 att(ovr,role){const a={};for(const k of KEYS)a[k]=clamp(ovr+RI(-6,4),20,99);if(role==='GK'){for(const k of KEYS)if(k!=='gk')a[k]=35;a.gk=ovr}else a.gk=15;return a},
 card(name,pos,ovr){const role=ROLE[pos];return{id:'c'+(this.s.seq++),name,pos,role,ovr,att:this.att(ovr,role),rar:ovr>=88?'wo':ovr>=82?'gold':ovr>=75?'silver':'bronze'}},
 price(c){return Math.round(150*Math.exp((c.ovr-60)/5.5)/50)*50},
 init(){this.s={v:1,coins:50000,seq:1,cards:[],form:'4-3-3',slots:[],w:0,d:0,l:0};
  for(const p of['GK','CB','CB','LB','RB','CM','CM','CDM','LW','ST','RW','CB','CM','ST'])this.s.cards.push(this.card(FN[RI(0,15)]+' '+LN[RI(0,15)],p,RI(57,65)));
  this.autoFill(true);this.save()},
 ensure(){if(this.s)return;try{const d=JSON.parse(localStorage.getItem(UTK)||'null');if(d&&d.v===1&&Array.isArray(d.cards)&&typeof d.coins==='number'&&FORMS[d.form]){this.s=d;return}}catch(e){}this.init()},
 save(){try{localStorage.setItem(UTK,JSON.stringify(this.s))}catch(e){}},
 eff(c,r){return c.role===r?c.ovr:Math.max(20,c.ovr-(r==='GK'||c.role==='GK'?40:12))},
 autoFill(reset){const u=this.s,fo=FORMS[u.form];if(reset||u.slots.length!==fo.length)u.slots=fo.map(()=>null);
  fo.forEach(([r],i)=>{if(u.slots[i])return;const used=new Set(u.slots);let best=null;for(const c of u.cards){if(used.has(c.id))continue;if(!best||this.eff(c,r)>this.eff(best,r))best=c}if(best)u.slots[i]=best.id});this.save()},
 teamOvr(){const u=this.s,fo=FORMS[u.form];let t=0;fo.forEach(([r],i)=>{const c=u.cards.find(k=>k.id===u.slots[i]);t+=c?this.eff(c,r):30});return Math.round(t/11)},
 setForm(f){if(!FORMS[f])return;this.s.form=f;this.autoFill(true)},
 assign(i,id){const u=this.s,j=u.slots.indexOf(id);if(j>=0&&j!==i)u.slots[j]=u.slots[i];u.slots[i]=id;this.save()},
 pick(roll){const top=STARS.filter(x=>x[2]>=88),hi=top.length?top:STARS.filter(x=>x[2]>=85),mid=STARS.filter(x=>x[2]>=82&&x[2]<=87);
  if(roll==='wo'){const s=(hi.length?hi:STARS)[RI(0,(hi.length?hi:STARS).length-1)];return this.card(s[0],ROLE[s[1]]?s[1]:'ST',clamp(+s[2]||88,50,99))}
  const pos=Object.keys(ROLE)[RI(0,9)],nm=FN[RI(0,15)]+' '+LN[RI(0,15)];
  if(roll==='gold')return this.card(nm,pos,RI(82,87));if(roll==='silver')return this.card(nm,pos,RI(75,81));return this.card(nm,pos,RI(62,74))},
 buyPack(){const u=this.s;if(u.coins<PACK)return null;u.coins-=PACK;const out=[];
  for(let i=0;i<5;i++){const r=Math.random();out.push(this.pick(r<.012?'wo':r<.10?'gold':r<.45?'silver':'bronze'))}
  if(!out.some(c=>c.ovr>=75)){out[0]=this.pick('silver')}out.sort((a,b)=>a.ovr-b.ovr);u.cards.push(...out);this.save();return out},
 sell(id){const u=this.s,c=u.cards.find(k=>k.id===id);if(!c)return 0;const p=this.price(c);u.coins+=p;u.cards=u.cards.filter(k=>k.id!==id);u.slots=u.slots.map(x=>x===id?null:x);this.save();return p},
 lineup(){const u=this.s;return FORMS[u.form].map(([r,x,z],i)=>{const c=u.cards.find(k=>k.id===u.slots[i]),e=this.eff(c,r),f=e/c.ovr,att={};for(const k in c.att)att[k]=Math.round(c.att[k]*f);if(r==='GK')att.gk=e;return{id:c.id,name:c.name,pos:c.pos,role:r,ovr:e,att,slotRole:r,fx:x,fz:z,me:false}})},
 reward(res){const u=this.s,w=res.score[0]>res.score[1],d=res.score[0]===res.score[1],c=(w?2500:d?1000:400)+150*res.score[0];u.coins+=c;if(w)u.w++;else if(d)u.d++;else u.l++;this.save();return c},
 add(c){this.ensure();this.s.coins+=c;this.save()}};
