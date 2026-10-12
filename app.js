const $=s=>document.querySelector(s),V=$('#view');let tab='home',match=null,toast='';
const TABS=[['home','Start'],['play','Spiel'],['team','Team'],['shop','Shop'],['train','Training'],['tac','Taktik'],['table','Tabelle'],['mkt','Markt'],['online','Online'],['sys','System']];
const cn=id=>CLUBS[id].name,ovrBar=(l,v)=>`<div class="row"><span>${l}</span><b>${Math.round(v)}</b></div><div class="bar"><i style="width:${v}%"></i></div>`;
const POS=['ST','LW','RW','CAM','CM','CDM','CB','LB','RB','GK'];
function saved(ok){const e=$('#saved');e.textContent=ok===false?'Speichern fehlgeschlagen':'Gespeichert '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}
const FREE=[['home','Karriere'],['team','Team'],['shop','Shop']];
function nav(){$('#nav').innerHTML=(Career.s?TABS:FREE).map(([k,l])=>`<button data-tab="${k}" class="${tab===k?'on':''}">${l}</button>`).join('')}
function render(){UT.ensure();$('#coins').textContent='🪙 '+fmt(UT.s.coins);nav();const s=Career.s;if(!s&&!['team','shop'].includes(tab)){V.innerHTML=createView();return}V.innerHTML=({home,play,team,shop,train,tac,table,mkt,online,sys})[tab]()+(toast?`<div class="card">${toast}</div>`:'');toast=''}
function createView(){return`<div class="card"><h2>Neue Karriere</h2>
<label>Name</label><input id="n" value="Alex Neumann"><label>Alter</label><input id="a" type="number" min="16" max="34" value="18">
<label>Nationalität</label><input id="nat" value="Deutschland"><label>Position</label><select id="p">${POS.map(p=>`<option>${p}</option>`).join('')}</select>
<label>Größe (cm)</label><input id="h" type="number" value="182"><label>Fuß</label><select id="f"><option>rechts</option><option>links</option></select>
<label>Startverein</label><select id="c">${LEAGUES.map((l,li)=>`<optgroup label="${l}">${CLUBS.filter(c=>c.lg===li).map(c=>`<option value="${c.id}">${c.name} (Stärke ${c.str})</option>`).join('')}</optgroup>`).join('')}</select>
<label>Schwierigkeit</label><select id="d"><option value="0">Leicht</option><option value="1" selected>Normal</option><option value="2">Schwer</option></select>
<button data-act="create">Karriere starten</button><button class="s" data-act="loadfile">Spielstand importieren</button><button class="s" data-act="utonly">Nur Mein Team & Shop</button></div>`}
function home(){const s=Career.s,m=s.me,f=Career.userFix(),tb=Career.sorted(),pos=tb.findIndex(e=>+e[0]===s.club)+1,avg=m.st.rat.length?(m.st.rat.reduce((a,b)=>a+b,0)/m.st.rat.length).toFixed(2):'–';
 return`<div class="card"><h2>${m.name}</h2><div class="row"><span>${m.pos} · ${m.age} J. · ${m.nat}</span><b style="font-size:28px;color:var(--ac)">${Math.round(m.ovr)}</b></div>
<div class="row"><span>Verein</span><b>${cn(s.club)}</b></div><div class="row"><span>Liga</span><b>${LEAGUES[s.lg[s.club]]}</b></div><div class="row"><span>Saison ${s.season} · Spieltag</span><b>${s.md+1}/${MDS}</b></div>
<div class="row"><span>Tabellenplatz</span><b>${pos}.</b></div><div class="row"><span>Form / Fitness</span><b>${Math.round(m.form)} / ${Math.round(100-m.fatigue)}${m.inj?' · verletzt '+m.inj:''}</b></div>
<div class="row"><span>Vertrag</span><b>${s.contract.years} J. · ${s.contract.wage} T€/Woche</b></div><div class="row"><span>Marktwert</span><b>${Career.value(m)} Mio €</b></div>
<div class="row"><span>Saison: Spiele/Tore/Vorlagen/Ø</span><b>${m.st.apps}/${m.st.goals}/${m.st.ass}/${avg}</b></div></div>
<div class="card"><h3>Attribute</h3>${KEYS.filter(k=>m.role==='GK'?k==='gk':k!=='gk').map(k=>ovrBar({pac:'Tempo',sho:'Abschluss',pas:'Passspiel',dri:'Dribbling',def:'Verteidigung',phy:'Physis',gk:'Torwart'}[k],m.att[k])).join('')}
<small>Potenzial: ${Math.round(m.pot)}</small></div>
<div class="card"><h3>Neuigkeiten</h3>${s.news.slice(0,5).map(n=>`<div class="row">${n}</div>`).join('')}</div>
${s.hist.length?`<div class="card"><h3>Karrierehistorie</h3>${s.hist.map(h=>`<div class="row"><span>S${h.season} ${h.club} (${h.lg||''} ${h.pos}.)</span><span>${h.apps}Sp ${h.goals}T ${h.ass}V Ø${h.avg} · Meister: ${h.champ}</span></div>`).join('')}</div>`:''}`}
function play(){const s=Career.s,f=Career.userFix(),h=f[0]===s.club;return`<div class="card"><h2>Spieltag ${s.md+1}</h2><div class="row"><span>${cn(f[0])}</span><b>vs</b><span>${cn(f[1])}</span></div>
<small>${h?'Heimspiel in der '+CLUBS[f[0]].stadium:'Auswärtsspiel'}${s.me.inj?' · du bist verletzt (kein Einsatz)':''}</small><br>
${s.me.inj?'':'<button data-act="play3d">3D-Spiel starten</button>'}<button class="s" data-act="sim">Simulieren</button>
<p><small>PC: WASD/Pfeile, J Pass, K Steilpass, L/Leertaste Schuss, Shift Sprint, U Grätsche, Q Wechsel.</small></p></div>
${s.res.length?`<div class="card"><h3>Letzter Spieltag</h3>${s.res[s.res.length-1].map(r=>`<div class="row"><span>${cn(r[0])}</span><b>${r[2]}:${r[3]}</b><span>${cn(r[1])}</span></div>`).join('')}</div>`:''}`}
function train(){const s=Career.s,m=s.me;const types=m.role==='GK'?['Torwart','Kraft','Passspiel']:['Abschluss','Passspiel','Dribbling','Sprint','Verteidigung','Kraft'];
 return`<div class="card"><h2>Training</h2><div class="row"><span>Einheiten diese Woche</span><b>${s.sess}/3</b></div><div class="row"><span>Müdigkeit</span><b>${Math.round(m.fatigue)}%</b></div>
${types.map(t=>`<button data-train="${t}">${t}</button>`).join('')}<button class="s" data-act="rest">Ruhetag</button></div>`}
function tac(){const t=Career.s.tac;return`<div class="card"><h2>Taktik & Aufstellung</h2><label>Formation</label><select data-tac="form">${Object.keys(FORMS).map(f=>`<option ${f===t.form?'selected':''}>${f}</option>`).join('')}</select>
<label>Spielweise</label><select data-tac="style"><option value="0" ${t.style==0?'selected':''}>Defensiv</option><option value="1" ${t.style==1?'selected':''}>Ausgewogen</option><option value="2" ${t.style==2?'selected':''}>Offensiv</option></select>
<label>Pressing</label><select data-tac="press"><option value="0.2" ${t.press==.2?'selected':''}>Niedrig</option><option value="0.5" ${t.press==.5?'selected':''}>Mittel</option><option value="0.8" ${t.press==.8?'selected':''}>Hoch</option></select>
<small>Die Aufstellung wird automatisch nach Stärke und Position gewählt; dein Spieler steht in der Startelf.</small></div>
<div class="card"><h3>Kader</h3>${Career.s.squads[Career.s.club].slice().sort((a,b)=>b.ovr-a.ovr).map(p=>`<div class="row ${p.id==='ME'?'':''}"><span>${p.pos} ${p.name}${p.id==='ME'?' ★':''}</span><b>${Math.round(p.ovr)}</b></div>`).join('')}</div>`}
function table(){const s=Career.s;return`<div class="card"><h2>${LEAGUES[s.lg[s.club]]} · Saison ${s.season}</h2><table><tr><th>#</th><th>Verein</th><th>Sp</th><th>T</th><th>Pkt</th></tr>
${Career.sorted().map(([id,t],i)=>`<tr class="${+id===s.club?'me':''}"><td>${i+1}</td><td>${cn(id)}</td><td>${t.p}</td><td>${t.gf}:${t.ga}</td><td>${t.pts}</td></tr>`).join('')}</table></div>`}
function mkt(){const s=Career.s;return`<div class="card"><h2>Angebote</h2>${s.offers.length?s.offers.map((o,i)=>`<div class="row"><span>${cn(o.club)} · ${o.years} J. · ${o.wage} T€/Wo</span><button data-offer="${i}">Annehmen</button></div>`).join(''):'<small>Aktuell keine Angebote.</small>'}</div>
<div class="card"><h3>Transfermarkt (Ansicht)</h3>${Object.values(s.squads).flat().filter(p=>p.id!=='ME').sort((a,b)=>b.ovr-a.ovr).slice(0,12).map(p=>`<div class="row"><span>${p.pos} ${p.name} (${p.age})</span><b>${Math.round(p.ovr)}</b></div>`).join('')}</div>`}
function sys(){const o=App.opt;return`<div class="card"><h2>System</h2><label>Grafikqualität</label><select data-opt="q"><option value="0" ${o.q==0?'selected':''}>Niedrig</option><option value="1" ${o.q==1?'selected':''}>Mittel</option><option value="2" ${o.q==2?'selected':''}>Hoch (Schatten)</option></select>
<label>Lautstärke</label><input type="range" min="0" max="1" step=".1" value="${Sfx.vol}" data-opt="vol"><label>Ton</label><select data-opt="snd"><option value="1" ${Sfx.on?'selected':''}>An</option><option value="0" ${Sfx.on?'':'selected'}>Aus</option></select>
<label>Kommentator (Sprache & Untertitel)</label><select data-opt="com"><option value="1" ${App.opt.com!==0?'selected':''}>An</option><option value="0" ${App.opt.com===0?'selected':''}>Aus</option></select>
<label>Stadionatmosphäre im Spiel</label><select data-opt="amb"><option value="1" ${App.opt.amb!==0?'selected':''}>An</option><option value="0" ${App.opt.amb===0?'selected':''}>Aus</option></select>
<button data-act="save">Speichern</button><button class="s" data-act="export">Export (JSON)</button><button class="s" data-act="loadfile">Import</button><button class="s" data-act="new">Neue Karriere</button></div>
<div class="card"><h3>Packs: Top-Spieler anpassen</h3><small>Eine Zeile pro Spieler: Name;Position;GES (Positionen: ST, LW, RW, CAM, CM, CDM, CB, LB, RB, GK). Diese Liste speist die Walkouts (GES 85+). Echte Namen und Werte trägst du hier selbst ein.</small><textarea id="stars" rows="8">${STARS.map(x=>x.join(';')).join('\n')}</textarea><button data-act="stars">Speichern</button><button class="s" data-act="resetstars">Zurücksetzen</button></div>
<div class="card"><h3>Vereinsnamen anpassen</h3><small>Ein Name pro Zeile (${CLUBS.length} Zeilen, Reihenfolge wie bei der Vereinsauswahl). Eigene Namen trägst du hier selbst ein.</small>
<textarea id="names" rows="8" style="width:100%;background:#0b1520;color:#e8f0f7;border:1px solid #2a4260;border-radius:8px;padding:8px;font-size:14px">${CLUBS.map(c=>c.name).join('\n')}</textarea>
<button data-act="names">Namen speichern</button><button class="s" data-act="resetnames">Zurücksetzen</button></div>`}
const App={opt:{q:1}};
try{Object.assign(App.opt,JSON.parse(localStorage.getItem('procareer_opt')||'{}'))}catch(e){}

const posn=c=>c.name.split(' ').pop();
function team(){const u=UT.s,fo=FORMS[u.form],ov=UT.teamOvr();
 const sl=fo.map(([r,x,z],i)=>{const c=u.cards.find(k=>k.id===u.slots[i]);return`<button class="slot ${c?c.rar:'empty'}" style="left:${50+z*40}%;top:${7+(1-x)*86}%" data-slot="${i}"><b>${c?UT.eff(c,r):'+'}</b><i>${r}</i><em>${c?posn(c):''}</em></button>`}).join('');
 return`<div class="card"><h2>Mein Team</h2><div class="row"><span>Gesamtstärke (live)</span><b style="font-size:26px;color:var(--ac)">${ov}</b></div><div class="row"><span>Bilanz S/U/N</span><b>${u.w}/${u.d}/${u.l}</b></div>
<label>Formation</label><select data-utform>${Object.keys(FORMS).map(f=>`<option ${f===u.form?'selected':''}>${f}</option>`).join('')}</select>
<div class="pitch">${sl}</div><button data-act="utplay">Spiel starten (3D)</button><button class="s" data-act="utfill">Auto-Aufstellung</button>
<p><small>Tippe einen Platz, um einen Spieler zu wählen. Falsche Position: −12 GES. Sieg +2.500, Remis +1.000, Niederlage +400 Coins, dazu 150 pro Tor.</small></p></div>
<div class="card"><h3>Sammlung (${u.cards.length})</h3>${u.cards.slice().sort((a,b)=>b.ovr-a.ovr).map(c=>`<div class="row"><span><b class="rar ${c.rar}">${c.ovr}</b> ${c.pos} ${c.name}</span><button class="s" data-sell="${c.id}">Verkaufen ${fmt(UT.price(c))}</button></div>`).join('')}</div>`}
function shop(){const u=UT.s;return`<div class="card"><h2>Shop</h2><div class="row"><span>Deine Coins</span><b>🪙 ${fmt(u.coins)}</b></div>
<p>Pack mit 5 Spielern, garantiert mindestens ein Spieler ab GES 75. Kleine Chance auf einen Walkout (GES 88+).</p>
<button data-act="openpack" ${u.coins<PACK?'disabled':''}>Pack öffnen · ${fmt(PACK)} Coins</button><small>Coins verdienst du durch Siege (Karriere und Mein Team).</small></div>`}
function showPick(i){const u=UT.s,r=FORMS[u.form][i][0],pk=$('#pick');pk.hidden=false;
 pk.innerHTML=`<h3>Platz ${r}: Spieler wählen</h3><button class="s" data-act="pickclose">Schließen</button>`+u.cards.slice().sort((a,b)=>UT.eff(b,r)-UT.eff(a,r)).map(c=>`<div class="card row"><span><b class="rar ${c.rar}">${UT.eff(c,r)}</b> ${c.pos} ${c.name}${u.slots.includes(c.id)?' · aufgestellt':''}</span><button data-pickc="${c.id}" data-pi="${i}">Wählen</button></div>`).join('')}
function reveal(c){return new Promise(res=>{const ov=$('#pack'),wo=c.ovr>=88;
 ov.innerHTML=`<div class="beams ${wo?'wo':''}"></div><div class="stage"><div class="hint">${wo?'WALKOUT!':'Tippen zum Aufdecken'}</div><div class="pcard back" id="pc"><span>?</span></div></div>`;
 const pc=$('#pc'),hint=ov.querySelector('.hint');let step=0;
 const show=()=>{pc.className='pcard '+c.rar;pc.innerHTML=`<b>${c.ovr}</b><i>${c.pos}</i><em>${c.name}</em>`;hint.textContent=wo?'⭐ TOP-SPIELER ⭐':'Tippen für weiter';step=2};
 const tap=()=>{if(step===0){step=1;pc.classList.add('flip');setTimeout(show,wo?1800:350)}else if(step===2){ov.removeEventListener('click',tap);res()}};
 ov.addEventListener('click',tap);if(wo)setTimeout(tap,1200)})}
async function openPack(){const cards=UT.buyPack();if(!cards){alert('Nicht genug Coins.');return}$('#coins').textContent='🪙 '+fmt(UT.s.coins);const ov=$('#pack');ov.hidden=false;
 for(const c of cards)await reveal(c);ov.hidden=true;ov.innerHTML='';render()}
function startUT(){if(typeof THREE==='undefined'){alert('Three.js konnte nicht geladen werden.');return}const u=UT.s;UT.autoFill();if(u.slots.some(x=>!x)){alert('Aufstellung unvollständig.');return}
 Sfx.init();const ov=UT.teamOvr(),oc=CLUBS.slice().sort((a,b)=>Math.abs(a.str-ov)-Math.abs(b.str-ov)).slice(0,3)[RI(0,2)],form=u.form;
 const mine={club:{id:100,name:'Mein Team'},lineup:UT.lineup(),tac:{form,style:1,press:.5,line:0},kit:0x2ecc71};
 const opp={club:oc,lineup:lineup(makeSquad(oc),form,null),tac:{form,style:1,press:.5,line:0},kit:oc.col===0x2ecc71?oc.col2:oc.col};
 $('#game').hidden=false;$('#err').hidden=true;
 try{match=new Match($('#c'),mine,opp,App.opt,res=>endUT(res,oc))}catch(e){$('#game').hidden=true;$('#err').hidden=false;$('#err').textContent='3D konnte nicht gestartet werden: '+e.message}}
function endUT(res,oc){if(match){match.dispose();match=null}$('#game').hidden=true;const c=UT.reward(res);tab='team';
 toast=`<h3>Endergebnis ${res.score[0]}:${res.score[1]} gegen ${oc.name}</h3><div class="row"><span>Belohnung</span><b>🪙 +${fmt(c)}</b></div>`;render()}
function startMatch(){if(typeof THREE==='undefined'){alert('Three.js konnte nicht geladen werden (Internetverbindung / CDN prüfen).');return}
 Sfx.init();const s=Career.s,f=Career.userFix(),uh=f[0]===s.club;const opp=Career.lineupFor(uh?f[1]:f[0]),mine=Career.lineupFor(s.club);
 mine.kit=CLUBS[s.club].col;opp.kit=opp.club.col===mine.kit||Math.abs(opp.club.col-mine.kit)<0x101010?opp.club.col2:opp.club.col;
 // Nutzerteam spielt im Match immer von links nach rechts (Team 0)
 $('#game').hidden=false;$('#err').hidden=true;
 try{match=new Match($('#c'),mine,opp,App.opt,res=>endMatch(res,uh))}catch(e){$('#game').hidden=true;$('#err').hidden=false;$('#err').textContent='3D konnte nicht gestartet werden: '+e.message}}
function endMatch(res,uh){if(match){match.dispose();match=null}$('#game').hidden=true;const s=Career.s;
 if(res.score[0]>res.score[1])UT.add(2000);else if(res.score[0]===res.score[1])UT.add(500);
 const end=Career.finish({score:uh?res.score:res.score,goals:res.goals,ass:res.ass,rating:res.rating});saved(true);
 const st=res.stats;toast=`<h3>Endergebnis ${res.score[0]}:${res.score[1]}</h3><div class="row"><span>Deine Bewertung</span><b>${res.rating}</b></div>
 ${[['Ballbesitz %','poss'],['Schüsse','shots'],['aufs Tor','on'],['Pässe','pass'],['angekommen','ok'],['Ecken','corners'],['Fouls','fouls'],['Paraden','saves']].map(([l,k])=>`<div class="row"><span>${st[0][k]}</span><span>${l}</span><span>${st[1][k]}</span></div>`).join('')}
 ${res.ev.filter(e=>!e.card).map(e=>`<div class="row">${e.m}' Tor ${e.t?'Gegner':'Eigenes Team'}: ${e.name}${e.ass?' (Vorlage '+e.ass+')':''}</div>`).join('')}
 ${end?`<p><b>Saison ${end.season} beendet:</b> Platz ${end.pos}, Meister ${end.champ}.</p>`:''}`;tab='home';render()}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const s=Career.s;
 if(t.dataset.tab){tab=t.dataset.tab;render();return}
 if(t.dataset.slot!==undefined){showPick(+t.dataset.slot);return}
 if(t.dataset.pickc){UT.assign(+t.dataset.pi,t.dataset.pickc);$('#pick').hidden=true;render();return}
 if(t.dataset.sell){const c=UT.s.cards.find(k=>k.id===t.dataset.sell);if(c&&confirm(c.name+' für '+fmt(UT.price(c))+' Coins verkaufen?')){UT.sell(c.id);render()}return}
 if(t.dataset.train){toast=Career.train(t.dataset.train);saved(true);render();return}
 if(t.dataset.offer){Career.accept(+t.dataset.offer);saved(true);render();return}
 switch(t.dataset.act){
  case'create':Career.create({name:$('#n').value,age:clamp(+$('#a').value||18,16,34),nat:$('#nat').value,pos:$('#p').value,height:+$('#h').value,foot:$('#f').value,club:+$('#c').value,diff:+$('#d').value});saved(true);tab='home';render();break;
  case'play3d':startMatch();break;
  case'sim':endMatch((()=>{const f=Career.userFix(),g=Career.simGoals(f[0],f[1]),uh=f[0]===s.club;return{score:uh?g:[g[1],g[0]],goals:0,ass:0,rating:6.3,ev:[],stats:[0,1].map(()=>({poss:50,shots:0,on:0,pass:0,ok:0,corners:0,fouls:0,saves:0}))}})(),Career.userFix()[0]===s.club);break;
  case'rest':toast=Career.rest();saved(true);render();break;
  case'save':saved(Career.save());break;
  case'new':if(confirm('Aktuelle Karriere wirklich verwerfen?')){Career.s=null;render()}break;
  case'export':{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(Career.s)],{type:'application/json'}));a.download='procareer-save.json';a.click();break}
  case'loadfile':{const i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=()=>{const r=new FileReader();r.onload=()=>{if(Career.load(r.result)){Career.save();saved(true);tab='home'}else alert('Spielstand beschädigt oder falsche Version.');render()};r.readAsText(i.files[0])};i.click();break}
  case'names':{const v=$('#names').value.split('\n').map(x=>x.trim());if(v.length<CLUBS.length||v.slice(0,CLUBS.length).some(x=>!x))alert('Bitte genau '+CLUBS.length+' nicht-leere Zeilen eingeben.');else{v.slice(0,CLUBS.length).forEach((n,i)=>CLUBS[i].name=n.slice(0,28));try{localStorage.setItem('procareer_names',JSON.stringify(v.slice(0,CLUBS.length)))}catch(x){}render()}break}
  case'resetnames':try{localStorage.removeItem('procareer_names')}catch(x){}location.reload();break;
  case'quit':if(!match)break;if(match.view){Net.send({k:'bye'});match.dispose();match=null;$('#game').hidden=true;render()}else if(confirm('Spiel beenden? Der aktuelle Stand wird gewertet.'))match.finish();break;
  case'openpack':openPack();break;
  case'utplay':startUT();break;
  case'utfill':UT.autoFill(true);render();break;
  case'pickclose':$('#pick').hidden=true;break;
  case'utonly':tab='team';render();break;
  case'amb':App.opt.amb=App.opt.amb===0?1:0;try{localStorage.setItem('procareer_opt',JSON.stringify(App.opt))}catch(x){}if(match){App.opt.amb===0?Sfx.ambStop():(Sfx.init(),Sfx.ambStart())}break;
  case'stars':{const rows=$('#stars').value.split('\n').map(l=>l.split(';').map(x=>x.trim())).filter(r=>r.length>=3&&r[0]&&ROLE[r[1]]&&+r[2]>=50&&+r[2]<=99).map(r=>[r[0].slice(0,24),r[1],+r[2]]);if(rows.length<3)alert('Mindestens 3 gültige Zeilen: Name;Position;GES');else{STARS=rows;try{localStorage.setItem('procareer_stars',JSON.stringify(rows))}catch(x){}render()}break}
  case'resetstars':try{localStorage.removeItem('procareer_stars')}catch(x){}location.reload();break;
  case'ohost':ohost();break;
  case'ojoin':Net.close();Net.role='guest';ol.code='';ol.msg='';render();break;
  case'oanswer':oanswer();break;
  case'oconnect':oconnect();break;
  case'ocopy':try{navigator.clipboard.writeText(ol.code)}catch(x){}{const e=$('#ocode');if(e)e.select()}break;
  case'ostart':hostStart();break;
  case'oreset':Net.close();Net.role=null;ol.code='';ol.msg='';render();break}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.tac){Career.s.tac[t.dataset.tac]=t.dataset.tac==='form'?t.value:+t.value;Career.save();saved(true)}
 if(t.id==='oc')ol.club=+t.value;
 if(t.dataset.utform!==undefined){UT.setForm(t.value);render();return}
 if(t.dataset.opt){const k=t.dataset.opt;if(k==='q')App.opt.q=+t.value;if(k==='vol')Sfx.vol=+t.value;if(k==='snd')Sfx.on=t.value==='1';if(k==='amb')App.opt.amb=+t.value;if(k==='com'){App.opt.com=+t.value;Com.on=!!App.opt.com}try{localStorage.setItem('procareer_opt',JSON.stringify(App.opt))}catch(x){}}});

// ===== Online (WebRTC, Direktverbindung ohne Server; manueller Code-Austausch)
const ol={code:'',msg:'',gc:1,club:null};
const Net={pc:null,ch:null,role:null,open:false,state:'',onmsg:null,
 mk(){const pc=this.pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
  pc.onconnectionstatechange=()=>{this.state=pc.connectionState;if(['failed','closed','disconnected'].includes(pc.connectionState)&&match&&this.role)netLost();if(tab==='online'&&!match)render()};return pc},
 wait(pc){return new Promise(r=>{if(pc.iceGatheringState==='complete')return r();const f=()=>{if(pc.iceGatheringState==='complete'){pc.removeEventListener('icegatheringstatechange',f);r()}};pc.addEventListener('icegatheringstatechange',f);setTimeout(r,4500)})},
 bind(ch){this.ch=ch;ch.onopen=()=>{this.open=true;if(this.role==='guest')this.send({k:'hello',club:ol.club!=null?ol.club:(Career.s?Career.s.club:1)});if(tab==='online'&&!match)render()};
  ch.onmessage=e=>{try{this.onmsg(JSON.parse(e.data))}catch(x){}};ch.onclose=()=>{this.open=false;if(match&&this.role)netLost()}},
 async host(){this.close();this.role='host';const pc=this.mk();this.bind(pc.createDataChannel('g'));await pc.setLocalDescription(await pc.createOffer());await this.wait(pc);return btoa(JSON.stringify(pc.localDescription))},
 async accept(code){this.close();this.role='guest';const pc=this.mk();pc.ondatachannel=e=>this.bind(e.channel);await pc.setRemoteDescription(JSON.parse(atob(code.replace(/\s/g,''))));await pc.setLocalDescription(await pc.createAnswer());await this.wait(pc);return btoa(JSON.stringify(pc.localDescription))},
 async finish(code){await this.pc.setRemoteDescription(JSON.parse(atob(code.replace(/\s/g,''))))},
 send(o){if(this.ch&&this.ch.readyState==='open')try{this.ch.send(JSON.stringify(o))}catch(e){}},
 close(){try{this.ch&&this.ch.close();this.pc&&this.pc.close()}catch(e){}this.pc=this.ch=null;this.open=false}};
const ACTS=['pass','through','shoot','shootdown','shootup','skill','tackle','second','switch'];
Net.onmsg=m=>{if(!m||typeof m!=='object')return;
 if(m.k==='hello'){ol.gc=clamp(+m.club||1,0,CLUBS.length-1);if(tab==='online'&&!match)render()}
 else if(m.k==='i'&&match&&!match.view){const I=match.inp[1];I.x=clamp(+m.x||0,-1,1);I.z=clamp(+m.z||0,-1,1);I.sprint=!!m.sp}
 else if(m.k==='a'&&match&&!match.view&&ACTS.includes(m.a))match.press(m.a,1);
 else if(m.k==='bye'&&match&&!match.view)match.finish();
 else if(m.k==='cfg'&&!match&&Array.isArray(m.L))startViewer(m);
 else if(m.k==='s'&&match&&match.view)match.snapIn(m);
 else if(m.k==='end'&&match&&match.view)onlineEnd(m.res)};
function netLost(){if(match){match.dispose();match=null}$('#game').hidden=true;toast='Verbindung getrennt.';render()}
async function ohost(){ol.code='';ol.msg='Erzeuge Code …';render();try{ol.code=await Net.host();ol.msg='Code erzeugt – an den Mitspieler schicken.'}catch(e){ol.msg='Fehler: '+e.message}render()}
async function oanswer(){try{ol.code=await Net.accept($('#oin').value);ol.msg='Antwort erzeugt – an den Host schicken.'}catch(e){ol.msg='Code ungültig.'}render()}
async function oconnect(){try{await Net.finish($('#oin').value);ol.msg='Verbinde …'}catch(e){ol.msg='Antwort-Code ungültig.'}render()}
function hostStart(){if(typeof THREE==='undefined'){alert('Three.js konnte nicht geladen werden.');return}const s=Career.s;if(!Net.open||!s){alert(s?'Keine Verbindung.':'Der Host braucht eine begonnene Karriere (Kader).');return}Sfx.init();
 const gc=ol.gc===s.club?(s.club+1)%CLUBS.length:ol.gc,mine=Career.lineupFor(s.club),opp=Career.lineupFor(gc);
 mine.kit=CLUBS[s.club].col;opp.kit=Math.abs(CLUBS[gc].col-mine.kit)<0x101010?CLUBS[gc].col2:CLUBS[gc].col;
 Net.send({k:'cfg',c:[s.club,gc],L:[mine.lineup,opp.lineup],kit:[mine.kit,opp.kit],tac:[mine.tac,opp.tac]});
 $('#game').hidden=false;$('#err').hidden=true;
 try{match=new Match($('#c'),mine,opp,{...App.opt,remote:true,onSnap:o=>Net.send({k:'s',...o})},res=>onlineEnd(res,true))}catch(e){$('#game').hidden=true;$('#err').hidden=false;$('#err').textContent='3D konnte nicht gestartet werden: '+e.message}}
function startViewer(c){if(typeof THREE==='undefined'){alert('Three.js konnte nicht geladen werden.');return}Sfx.init();
 const ok=Array.isArray(c.c)&&c.c.every(i=>CLUBS[i])&&c.L.length===2&&c.L.every(l=>Array.isArray(l)&&l.length===11);if(!ok)return;
 const mk=i=>({club:CLUBS[c.c[i]],lineup:c.L[i],kit:+c.kit[i],tac:c.tac[i]});$('#game').hidden=false;$('#err').hidden=true;
 try{match=new Match($('#c'),mk(0),mk(1),{...App.opt,view:true,onInput:o=>Net.send({k:'i',...o}),onAct:a=>Net.send({k:'a',a})},()=>{})}catch(e){$('#game').hidden=true;$('#err').hidden=false;$('#err').textContent='3D konnte nicht gestartet werden: '+e.message}}
function onlineEnd(res,host){if(host)Net.send({k:'end',res});if(match){match.dispose();match=null}$('#game').hidden=true;tab='online';
 toast=`<h3>Online-Endergebnis ${res.score[0]}:${res.score[1]}</h3><small>Freundschaftsspiel – kein Einfluss auf die Karriere.</small>`;render()}
function online(){const st=Net.open?'Verbunden ✓':(Net.pc?'Verbinde … ('+(Net.state||'wartet')+')':'Nicht verbunden'),sel=ol.club!=null?ol.club:(Career.s?Career.s.club:1);
 return`<div class="card"><h2>Online-Freundschaftsspiel</h2><small>Direktverbindung zwischen zwei Geräten (WebRTC), ohne eigenen Server. Beide brauchen diese Seite offen. Die Codes tauscht ihr per Kopieren/Einfügen aus (z. B. WhatsApp). Zählt nicht für die Karriere. Der Host braucht eine begonnene Karriere.</small>
<div class="row"><span>Status</span><b>${st}</b></div>
<label>Dein Verein (wenn du beitrittst)</label><select id="oc">${CLUBS.map(c=>`<option value="${c.id}" ${c.id===sel?'selected':''}>${cn(c.id)}</option>`).join('')}</select>
${!Net.role?`<button data-act="ohost">Spiel hosten</button><button class="s" data-act="ojoin">Spiel beitreten</button>`:''}
${Net.role==='host'?`<label>1. Diesen Code an den Mitspieler schicken</label><textarea id="ocode" rows="3" readonly>${ol.code}</textarea><button class="s" data-act="ocopy">Code kopieren</button><label>2. Antwort-Code des Mitspielers einfügen</label><textarea id="oin" rows="3"></textarea><button data-act="oconnect">Verbinden</button>${Net.open?`<p>Gegner-Verein: <b>${cn(ol.gc)}</b></p><button data-act="ostart">Spiel starten</button>`:''}`:''}
${Net.role==='guest'?`<label>1. Code des Hosts einfügen</label><textarea id="oin" rows="3"></textarea><button data-act="oanswer">Antwort erzeugen</button>${ol.code?`<label>2. Diesen Antwort-Code an den Host schicken</label><textarea id="ocode" rows="3" readonly>${ol.code}</textarea><button class="s" data-act="ocopy">Code kopieren</button>`:''}${Net.open?'<p>Verbunden – warte, bis der Host startet.</p>':''}`:''}
${Net.role?`<button class="s" data-act="oreset">Zurücksetzen</button>`:''}<small> ${ol.msg}</small></div>`}
// Touch-Steuerung
(function(){const j=$('#joy'),k=j.firstElementChild;let id=null;const mv=e=>{const r=j.getBoundingClientRect(),dx=e.clientX-r.left-65,dz=e.clientY-r.top-65,l=Math.min(1,Math.hypot(dx,dz)/50),a=Math.atan2(dz,dx);
 const x=Math.cos(a)*l,z=Math.sin(a)*l;if(match){match.inp[0].x=l>.15?x:0;match.inp[0].z=l>.15?z:0}k.style.transform=`translate(${x*40}px,${z*40}px)`};
 j.addEventListener('pointerdown',e=>{id=e.pointerId;j.setPointerCapture(id);mv(e)});j.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e)});
 const up=e=>{if(e.pointerId===id){id=null;if(match)match.inp[0].x=match.inp[0].z=0;k.style.transform=''}};j.addEventListener('pointerup',up);j.addEventListener('pointercancel',up);
 document.querySelectorAll('#btns button').forEach(b=>{const a=b.dataset.k;let t0=0;
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(!match)return;t0=performance.now();if(a==='sprint')match.inp[0].sprint=true;else if(a==='shoot')match.press('shootdown');else match.press(a)});
  const up=()=>{if(!match||!t0)return;if(a==='sprint'){match.inp[0].sprint=false;if(performance.now()-t0<200)match.press('skill')}else if(a==='shoot')match.press('shootup');t0=0};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)})})();
addEventListener('error',e=>{const d=$('#err');d.hidden=false;d.textContent='JavaScript-Fehler: '+e.message});
try{const n=JSON.parse(localStorage.getItem('procareer_names')||'null');if(Array.isArray(n))n.forEach((x,i)=>{if(CLUBS[i]&&typeof x==='string'&&x)CLUBS[i].name=x.slice(0,28)})}catch(e){}
Com.on=App.opt.com!==0;
Career.load();render();if(Career.s)saved(true);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
