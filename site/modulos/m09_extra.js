window.MODX=window.MODX||{};
/* Kit genérico de mapas mentais (usado pelos módulos 09 e 10) */
window.MMKIT=window.MMKIT||(function(){
 const LSg=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
 const LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
 async function cp(t,msg){try{await navigator.clipboard.writeText(t);window.toast&&window.toast(msg||'Copiado')}catch(_){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');window.toast&&window.toast(msg||'Copiado')}catch(__){}ta.remove()}}
 const xe=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function domTree(li){const row=li.querySelector(':scope>.mmrow');const t=row.querySelector('.mmt');const n={t:t.textContent.trim(),kids:[]};
  if(t.tagName==='A'&&!t.classList.contains('mmq'))n.u=t.getAttribute('href');if(t.dataset&&t.dataset.q)n.q=t.dataset.q;
  const k=row.querySelector('.mmk');if(k)n.k=k.textContent;const c=row.querySelector('.mmc');if(c)n.c=c.textContent;
  const a=[...row.querySelectorAll('.mma a')].map(x=>x.getAttribute('href').slice(1));if(a.length)n.a=a.join(',');
  const nt=li.querySelector(':scope>.mmn-note');if(nt)n.n=nt.textContent;
  const ul=li.querySelector(':scope>ul');if(ul)n.kids=[...ul.children].map(domTree);return n}
 const mapObj=mm=>({t:mm.dataset.root,kids:[...mm.querySelector(':scope>ul').children].map(domTree)});
 function toDSL(o){const out=[o.t];const w=(n,d)=>{let s='  '.repeat(d)+n.t;['u','a','c','n','k','q'].forEach(k=>{if(n[k])s+=' :: '+k+'='+n[k]});out.push(s);n.kids.forEach(c=>w(c,d+1))};o.kids.forEach(c=>w(c,1));return out.join('\n')}
 function toOPML(o){const w=(n,d)=>{const att=`text="${xe(n.t)}"`+(n.u?` _note="${xe(n.u)}" url="${xe(n.u)}"`:'')+(n.n&&!n.u?` _note="${xe(n.n)}"`:'');return '  '.repeat(d)+(n.kids.length?`<outline ${att}>\n${n.kids.map(c=>w(c,d+1)).join('\n')}\n${'  '.repeat(d)}</outline>`:`<outline ${att}/>`)};
  return `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n<head><title>${xe(o.t)}</title></head>\n<body>\n${w(o,1)}\n</body>\n</opml>`}
 function toMermaid(o){const cl=s=>String(s).replace(/[()\[\]{}"]/g,' ').replace(/\s+/g,' ').trim();const out=['mindmap',`  root((${cl(o.t)}))`];const w=(n,d)=>{out.push('  '.repeat(d)+cl(n.t));n.kids.forEach(c=>w(c,d+1))};o.kids.forEach(c=>w(c,2));return out.join('\n')}
 function toMD(o){const out=['# '+o.t,''];const w=(n,d)=>{out.push('  '.repeat(d)+'- '+(n.u?`[${n.t}](${n.u})`:n.t)+(n.c?` — ${n.c}`:'')+(n.n?` _(${n.n})_`:''));n.kids.forEach(c=>w(c,d+1))};o.kids.forEach(c=>w(c,0));return out.join('\n')}
 const FMT={opml:toOPML,mermaid:toMermaid,md:toMD};
 function init(viewId,prefix){const view=document.getElementById(viewId);if(!view)return;
  view.querySelectorAll('.mm').forEach(mm=>{const key=mm.dataset.map;const sec=mm.closest('section');const bar=sec&&sec.querySelector('.mmbar');
   const SK=prefix+'mm:'+key;let st=LSg(SK,{});const save=()=>LSs(SK,st);
   mm.querySelectorAll('li.has').forEach(li=>{const b=document.createElement('button');b.className='mmtg';b.type='button';b.setAttribute('aria-label','abrir ou fechar');li.querySelector(':scope>.mmrow').prepend(b);b.onclick=()=>li.classList.toggle('open')});
   [...mm.querySelector(':scope>ul').children].forEach(li=>li.classList.add('open'));
   const boxes=[...mm.querySelectorAll('.mmck')];
   const paint=()=>{let n=0;boxes.forEach(b=>{const p=b.closest('li').dataset.p;b.checked=!!st[p];b.closest('li').classList.toggle('done',!!st[p]);if(st[p])n++});const pr=bar&&bar.querySelector('.mmprog');if(pr)pr.textContent=`${n} de ${boxes.length} ramos percorridos`};
   mm.addEventListener('change',e=>{const b=e.target.closest('.mmck');if(!b)return;const p=b.closest('li').dataset.p;if(b.checked)st[p]=1;else delete st[p];save();paint()});
   paint();if(!bar)return;
   const x=bar.querySelector('.mmx');const qs=[...mm.querySelectorAll('a.mmq')];
   const upd=()=>{const v=x?x.value.trim():'';qs.forEach(a=>{const q=a.dataset.q.replace(/\{x\}/g,v||'<termo>');a.href='https://www.google.com/search?q='+encodeURIComponent(q);const c=a.parentNode.querySelector('.mmqc');if(c)c.textContent=q})};
   if(x){x.value=LSg(prefix+'x:'+key,'');x.addEventListener('input',()=>{LSs(prefix+'x:'+key,x.value);upd()})}upd();
   const B=s=>bar.querySelector(s);
   if(B('.mmall'))B('.mmall').onclick=()=>mm.querySelectorAll('li.has').forEach(li=>li.classList.add('open'));
   if(B('.mmnone'))B('.mmnone').onclick=()=>mm.querySelectorAll('li.has').forEach(li=>li.classList.remove('open'));
   if(B('.mmzero'))B('.mmzero').onclick=()=>{st={};save();paint()};
   if(B('.mmpv'))B('.mmpv').onclick=()=>{const v=x?x.value.trim():'';if(!v){window.toast&&window.toast('Digite o dado no campo do mapa');x&&x.focus();return}location.hash='#central';setTimeout(()=>{const i=document.getElementById('pvIn');if(i){i.value=v;i.dispatchEvent(new Event('input'))}},80)};
   if(B('.mmexp'))B('.mmexp').onclick=()=>{let m=bar.querySelector('.mmmenu');if(m){m.remove();return}m=document.createElement('div');m.className='mmmenu done-row';m.style.justifyContent='flex-start';m.innerHTML='<button class="btn" data-f="opml">OPML (XMind, FreeMind)</button><button class="btn" data-f="mermaid">Mermaid</button><button class="btn" data-f="md">Markdown</button><button class="btn" data-f="ck">Checklist do que falta</button>';bar.appendChild(m);
    m.onclick=ev=>{const f=ev.target.dataset.f;if(!f)return;const o=mapObj(mm);if(f==='ck'){const out=['# Falta percorrer — '+o.t];mm.querySelectorAll('li').forEach(li=>{if(!st[li.dataset.p]&&!li.classList.contains('has')){const path=[];let el=li;while(el&&el.matches&&el.matches('li')){path.unshift(el.querySelector(':scope>.mmrow .mmt').textContent.trim());el=el.parentNode.closest('li')}out.push('- [ ] '+path.join(' › '))}});cp(out.join('\n'),'Checklist copiado');return}cp(FMT[f](o),f.toUpperCase()+' copiado')}};
   if(B('.mmedit'))B('.mmedit').onclick=()=>{const t=document.getElementById('m08-me_in');if(!t){window.toast&&window.toast('Editor do Módulo 08 indisponível');return}t.value=toDSL(mapObj(mm));t.dispatchEvent(new Event('input'));location.hash='#m08-lab-mapa'};
  })}
 return {init,cp,mapObj,toDSL,FMT};
})();

window.MODX.m09=function(P,D){
const $=s=>document.getElementById(P+s);
window.MMKIT.init('view-m09','bib:m09:');
/* abrir <details> quando o link aponta para dentro dele */
function openTarget(){const h=decodeURIComponent(location.hash.slice(1));if(!h.startsWith(P))return;const el=document.getElementById(h);if(!el)return;let d=el.tagName==='DETAILS'?el:el.closest('details');while(d){d.open=true;d=d.parentElement&&d.parentElement.closest('details')}setTimeout(()=>el.scrollIntoView(),30)}
window.addEventListener('hashchange',openTarget);setTimeout(openTarget,50);
/* buscador do OSINT Framework */
const cats=[...document.querySelectorAll('#'+P+'lab-osf details.osfcat')];const cards=[...document.querySelectorAll('#'+P+'lab-osf .tool.osf')];
let txt=null;
function of(){const q=$('of_q').value.trim().toLowerCase(),c=$('of_cat').value,L=$('of_live').checked,F=$('of_free').checked,S=$('of_pass').checked,R=$('of_noreg').checked,W=$('of_web').checked;
 if(!txt)txt=new Map(cards.map(t=>[t,t.textContent.toLowerCase()]));let n=0;const any=q||c||L||F||S||R||W;
 cats.forEach(d=>{let m=0;const okc=!c||d.dataset.cat===c;d.querySelectorAll('.tool.osf').forEach(t=>{const ok=okc&&(!q||q.split(/\s+/).every(w=>txt.get(t).includes(w)))&&(!L||t.dataset.live==='1')&&(!F||t.dataset.free==='1')&&(!S||t.dataset.pass==='1')&&(!R||t.dataset.noreg==='1')&&(!W||t.dataset.web==='1');t.style.display=ok?'':'none';if(ok)m++});
  d.querySelectorAll('h4.osfh').forEach(h=>{const g=h.nextElementSibling;h.style.display=g&&[...g.children].some(x=>x.style.display!=='none')?'':'none'});
  d.style.display=m?'':'none';if(any)d.open=m>0&&(!!q||!!c||m<60);n+=m});
 $('of_n').textContent=`${n} de ${cards.length} ferramentas`}
['of_q','of_cat','of_live','of_free','of_pass','of_noreg','of_web'].forEach(k=>{const el=$(k);el.addEventListener(el.tagName==='SELECT'||el.type==='checkbox'?'change':'input',of)});
$('of_n').textContent=`${cards.length} ferramentas`;
};
