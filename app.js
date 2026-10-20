'use strict';
const KEY='typefast.v1';
const seg=new Intl.Segmenter?new Intl.Segmenter('hi',{granularity:'grapheme'}):null;
const G=s=>seg?Array.from(seg.segment(s),x=>x.segment):Array.from(s);
const INS={KeyQ:['ौ','औ'],KeyW:['ै','ऐ'],KeyE:['ा','आ'],KeyR:['ी','ई'],KeyT:['ू','ऊ'],KeyY:['ब','भ'],KeyU:['ह','ङ'],KeyI:['ग','घ'],KeyO:['द','ध'],KeyP:['ज','झ'],BracketLeft:['ड','ढ'],BracketRight:['़','ञ'],
 KeyA:['ो','ओ'],KeyS:['े','ए'],KeyD:['्','अ'],KeyF:['ि','इ'],KeyG:['ु','उ'],KeyH:['प','फ'],KeyJ:['र','ऱ'],KeyK:['क','ख'],KeyL:['त','थ'],Semicolon:['च','छ'],Quote:['ट','ठ'],
 KeyZ:['ॆ','ऎ'],KeyX:['ं','ँ'],KeyC:['म','ण'],KeyV:['न','ऩ'],KeyB:['व','ऴ'],KeyN:['ल','ळ'],KeyM:['स','श'],Comma:[',','ष'],Period:['.','।'],Slash:['य','य़'],
 Digit1:['१','ऍ'],Digit2:['२','ॅ'],Digit3:['३','्र'],Digit4:['४','र्'],Digit5:['५','ज्ञ'],Digit6:['६','त्र'],Digit7:['७','क्ष'],Digit8:['८','श्र'],Digit9:['९','('],Digit0:['०',')']};
const ROWS=[['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0'],['KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight'],['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote'],['KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash']];
const LAT={KeyQ:'Q',KeyW:'W',KeyE:'E',KeyR:'R',KeyT:'T',KeyY:'Y',KeyU:'U',KeyI:'I',KeyO:'O',KeyP:'P',KeyA:'A',KeyS:'S',KeyD:'D',KeyF:'F',KeyG:'G',KeyH:'H',KeyJ:'J',KeyK:'K',KeyL:'L',KeyZ:'Z',KeyX:'X',KeyC:'C',KeyV:'V',KeyB:'B',KeyN:'N',KeyM:'M',BracketLeft:'[',BracketRight:']',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/',Digit1:'1',Digit2:'2',Digit3:'3',Digit4:'4',Digit5:'5',Digit6:'6',Digit7:'7',Digit8:'8',Digit9:'9',Digit0:'0'};
let P=Object.assign({lang:'en',min:1,inscript:false},store.get(KEY+'.pref',{}));
let hist=store.get(KEY+'.hist',[]);
let run=null,tab='test';
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function buildText(){const pool=shuffle(TEXTS[P.lang]);const need=Math.max(260,P.min*60*6);let t=[];let len=0;let i=0;while(len<need){t.push(pool[i%pool.length]);len+=G(pool[i%pool.length]).length;i++}return t.join(' ')}
function savePref(){store.set(KEY+'.pref',P)}
function render(){
 $('#app').innerHTML=`<div class="tabs"><button data-t="test" class="${tab==='test'?'on':''}">Test</button><button data-t="hist" class="${tab==='hist'?'on':''}">Mere scores</button></div><div id="v"></div>`;
 $$('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;if(tab==='test')newRun();render();scrollTo(0,0)});
 tab==='test'?vTest($('#v')):vHist($('#v'));
}
function newRun(){clearInterval(run&&run.timer);run={text:buildText(),started:0,done:false,left:P.min*60,timer:null}}
function vTest(el){
 if(!run)newRun();
 const hi=P.lang==='hi';
 el.innerHTML=`<div class="card"><div class="row"><div class="seg" role="group" aria-label="Bhasha"><button data-l="en" class="${!hi?'on':''}">English</button><button data-l="hi" class="${hi?'on':''}">हिन्दी</button></div>
 <div class="seg" role="group" aria-label="Samay">${[1,2,3,5].map(m=>`<button data-m="${m}" class="${P.min===m?'on':''}">${m} min</button>`).join('')}</div></div>
 ${hi?`<label class="row" style="gap:10px;margin-top:10px;flex-wrap:nowrap;align-items:flex-start"><input type="checkbox" id="ins" style="flex:0 0 22px;margin-top:3px" ${P.inscript?'checked':''}><span>Inscript keyboard mode (computer ki English keyboard se Hindi type karein)</span></label>
 <p class="muted" style="margin:4px 0 0;font-size:.85rem">Phone par apna Hindi keyboard (Gboard) use karein, ye mode band rakhein. Computer par Hindi keyboard installed ho to bhi band rakhein.</p>`:''}</div>
 <div class="card"><div class="hud"><div><b id="h-t">${fmtT(run.left)}</b><span>Samay</span></div><div><b id="h-w">0</b><span>WPM</span></div><div><b id="h-a">100%</b><span>Accuracy</span></div></div>
 <div class="passage ${hi?'hi':''}" id="ps" lang="${hi?'hi':'en'}" aria-label="Type karne ka text"></div>
 <textarea id="inp" class="${hi?'hi':''}" lang="${hi?'hi':'en'}" placeholder="Yahan type karna shuru karein. Timer pehle akshar se chalega." spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" aria-label="Typing area"></textarea>
 <div class="row" style="margin-top:10px"><button class="btn" id="rs">Naya text (Esc)</button><span class="muted" style="font-size:.85rem">Backspace se galti sudhar sakte hain.</span></div></div>
 ${hi?kbHTML():''}`;
 $$('[data-l]').forEach(b=>b.onclick=()=>{P.lang=b.dataset.l;savePref();newRun();render()});
 $$('[data-m]').forEach(b=>b.onclick=()=>{P.min=+b.dataset.m;savePref();newRun();render()});
 if($('#ins'))$('#ins').onchange=e=>{P.inscript=e.target.checked;savePref();$('#inp').focus()};
 $('#rs').onclick=()=>{newRun();render();$('#inp').focus()};
 const inp=$('#inp');
 run.tg=G(run.text);paintPassage('');
 inp.addEventListener('input',()=>onInput());
 inp.addEventListener('paste',e=>e.preventDefault());inp.addEventListener('drop',e=>e.preventDefault());
 inp.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();$('#rs').click();return}
  if(run.done){e.preventDefault();return}
  if(P.lang==='hi'&&P.inscript&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&INS[e.code]&&!e.isComposing){e.preventDefault();const ch=INS[e.code][e.shiftKey?1:0];const s=inp.selectionStart;inp.setRangeText(ch,inp.value.length,inp.value.length,'end');onInput();}
 });
 setTimeout(()=>inp.focus(),50);
}
const fmtT=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function stats(typed,final){
 const tg=run.tg,ty=G(typed.normalize('NFC'));
 let ok=0,okcp=0;
 const upto=final?ty.length:Math.max(0,ty.length-1); // last grapheme still being composed while typing
 for(let i=0;i<upto&&i<tg.length;i++){if(ty[i]===tg[i]){ok++;okcp+=Array.from(tg[i]).length}}
 const cp=Array.from(typed).length;
 return{ty,ok,okcp,counted:Math.min(upto,tg.length),cp,upto};
}
function paintPassage(typed){
 const ty=G(typed.normalize('NFC')),tg=run.tg;
 let h='';for(let i=0;i<tg.length;i++){
  let c='pend';
  if(i<ty.length-1||(i===ty.length-1&&run.done))c=ty[i]===tg[i]?'ok':'bad';
  else if(i===ty.length-1)c=ty[i]===tg[i]?'ok':tg[i].startsWith(ty[i])?'cur':'bad';
  else if(i===ty.length)c='cur';
  h+=`<span class="${c}">${esc(tg[i])}</span>`}
 const ps=$('#ps');ps.innerHTML=h;
 const cur=ps.querySelector('.cur');if(cur){const t=cur.offsetTop;ps.scrollTop=Math.max(0,t-ps.clientHeight/2)}
}
function onInput(){
 const inp=$('#inp');if(run.done)return;
 const typed=inp.value;
 if(!run.started&&typed.length){run.started=Date.now();run.timer=setInterval(tickT,250)}
 const s=stats(typed,false);paintPassage(typed);hud(typed);
 if(s.ty.length>=run.tg.length&&typed.normalize('NFC').endsWith(run.tg[run.tg.length-1]))finish();
}
function elapsed(){return run.started?Math.max(1,(Date.now()+(window.__skew||0)-run.started)/1000):0}
function tickT(){
 const el=elapsed();run.left=Math.max(0,P.min*60-Math.floor(el));
 const t=$('#h-t');if(t)t.textContent=fmtT(run.left);hud($('#inp')?$('#inp').value:'');
 if(el>=P.min*60)finish();
}
function hud(typed){
 const el=Math.max(elapsed(),1);const s=stats(typed,false);
 const w=run.started?Math.round(s.okcp/5/(el/60)):0;
 const a=s.counted?Math.round(s.ok/s.counted*100):100;
 const hw=$('#h-w'),ha=$('#h-a');if(hw)hw.textContent=w;if(ha)ha.textContent=a+'%';
}
function finish(){
 if(run.done)return;run.done=true;clearInterval(run.timer);
 const inp=$('#inp');const typed=inp.value;inp.blur();
 const el=Math.min(P.min*60,Math.max(1,elapsed()));
 const s=stats(typed,true);
 const net=Math.round(s.okcp/5/(el/60)),gross=Math.round(s.cp/5/(el/60));
 const acc=s.counted?Math.round(s.ok/s.counted*100):0;
 const r={d:Date.now(),lang:P.lang,min:P.min,net,gross,acc,ok:s.ok,bad:s.counted-s.ok,sec:Math.round(el)};
 if(s.counted>=5){hist.unshift(r);hist=hist.slice(0,50);store.set(KEY+'.hist',hist)}
 paintPassage(typed);
 const best=Math.max(0,...hist.filter(h=>h.lang===P.lang&&h!==r).map(h=>h.net));
 const m=document.createElement('div');m.className='modal';m.setAttribute('role','dialog');m.setAttribute('aria-label','Result');
 m.innerHTML=`<div><h2>Aapka result</h2><div class="big">${net} <span style="font-size:1.1rem;-webkit-text-fill-color:var(--muted)">WPM</span></div>${s.counted<5?'<p class="muted">Bahut kam type kiya, score save nahi hua.</p>':net>best&&best>0?'<p style="color:var(--ok);font-weight:700">Naya best score!</p>':''}
 <div class="res"><div><b>${acc}%</b><span>Accuracy</span></div><div><b>${gross}</b><span>Gross WPM</span></div><div><b>${s.ok}</b><span>Sahi akshar</span></div><div><b>${s.counted-s.ok}</b><span>Galat</span></div></div>
 <p class="muted" style="font-size:.85rem">Net WPM = sahi likhe akshar ÷ 5 ÷ minute. 5 akshar = 1 shabd (English aur Hindi dono).</p>
 <div class="row"><button class="btn pri" id="again">Dobara try karo</button><button class="btn" id="cpy">Result copy karo</button><button class="btn" id="cls">Band karo</button></div></div>`;
 document.body.appendChild(m);
 $('#again').onclick=()=>{m.remove();newRun();render()};
 $('#cls').onclick=()=>m.remove();
 $('#cpy').onclick=()=>copyText(`Maine ${P.lang==='hi'?'Hindi':'English'} typing test me ${net} WPM, ${acc}% accuracy payi (${P.min} min).`);
 $('#again').focus();
}
function vHist(el){
 const h=hist;
 const best=(l)=>Math.max(0,...h.filter(x=>x.lang===l).map(x=>x.net));
 el.innerHTML=`<div class="card"><div class="res"><div><b>${best('en')}</b><span>Best English WPM</span></div><div><b>${best('hi')}</b><span>Best Hindi WPM</span></div><div><b>${h.length}</b><span>Total tests</span></div></div>${h.length>1?spark(h):''}</div>
 <div class="card">${h.length?`<table><thead><tr><th>Date</th><th>Type</th><th>WPM</th><th>Acc.</th></tr></thead><tbody>${h.map(x=>`<tr><td>${new Date(x.d).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td><td>${x.lang==='hi'?'हिन्दी':'English'} · ${x.min}m</td><td><b>${x.net}</b></td><td>${x.acc}%</td></tr>`).join('')}</tbody></table><div class="row" style="margin-top:10px"><button class="btn sm bad" id="clr">Saare scores hatao</button></div>`:'<div class="empty">Abhi koi score nahi. Pehla test dein.</div>'}</div>`;
 const c=$('#clr');if(c)c.onclick=()=>{if(confirm('Saare scores delete karein?')){hist=[];store.set(KEY+'.hist',hist);render()}};
}
function spark(h){const a=[...h].reverse().slice(-20),mx=Math.max(...a.map(x=>x.net),1),W=300,H=70;
 const pts=a.map((x,i)=>[i*(W/(a.length-1)),H-4-(x.net/mx)*(H-12)]);
 return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="WPM trend"><polyline fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" points="${pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ')}"/></svg>`}
function kbHTML(){return `<details class="card"><summary>Inscript key chart (kaun si key se kya)</summary><div class="kb">${ROWS.map((r,i)=>`<div class="kbr" style="margin-left:${i*12}px">${r.map(c=>`<div class="key"><small>${LAT[c]}</small>${INS[c][0]}<i>${INS[c][1]}</i></div>`).join('')}</div>`).join('')}</div><p class="muted" style="font-size:.85rem;margin-bottom:0">Neeche wala akshar normal key se, neele wala Shift ke saath. Matra ke liye pehle consonant, phir matra key. Aadha akshar ke liye consonant ke baad "्" (D key), phir agla consonant.</p></details>`}
render();
window.__t={G,INS};
