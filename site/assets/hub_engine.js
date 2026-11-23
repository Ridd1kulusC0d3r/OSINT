(function(){
const $=s=>document.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={get(k,d){try{const v=localStorage.getItem('bib:'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('bib:'+k,JSON.stringify(v))}catch(e){}}};
window.toast=function(t){const e=$('#toast');e.textContent=t||'Copiado!';e.style.display='block';clearTimeout(e._t);e._t=setTimeout(()=>e.style.display='none',1400)};
async function copyText(t,msg){try{await navigator.clipboard.writeText(t);toast(msg)}catch(e){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast(msg)}catch(_){toast('Selecione e copie manualmente')}ta.remove()}}
const MODS=window.MODS, WAIT=window.WAIT||[];
/* theme */
if(LS.get('theme','dark')==='light')document.documentElement.classList.add('light');
$('#themeBtn').onclick=()=>{const l=document.documentElement.classList.toggle('light');LS.set('theme',l?'light':'dark')};
$('#menuBtn').onclick=()=>$('#side').classList.toggle('open');

/* ---------- per-module init ---------- */
const S={};
MODS.forEach(M=>{
  const id=M.id,P=id+'-',D=M.D,root=document.getElementById('view-'+id);
  const st=S[id]={P,D,root,secs:$$('section.sec',root),done:LS.get(id+':done',{}),mdone:LS.get(id+':missions',{}),ans:LS.get(id+':quiz',{}),forms:LS.get(id+':forms',{})};
  st.secs.forEach(s=>{const r=document.createElement('div');r.className='done-row';r.innerHTML=`<button class="btn" data-done="${s.id}" data-mod="${id}"></button>`;s.appendChild(r)});
  const g=x=>document.getElementById(P+x);
  /* forms */
  if(g('rafSum')){const items=['Considerações gerais','Programação do evento','Previsão do tempo','Transporte público','Trânsito','Notícias relevantes','Monitoramento de redes sociais','Manifestações populares','Segurança pública','Cyber ativismo','Outras informações','Considerações finais'];const lv=['—','Sem relevância','Pouco relevante','Relevante','Muito relevante'];
    g('rafSum').innerHTML=items.map(i=>`<div style="display:grid;grid-template-columns:1fr 170px;gap:8px;align-items:center;margin:4px 0"><span style="font-size:13.5px">${i}</span><select data-k="Sumário · ${i}">${lv.map(l=>`<option>${l}</option>`).join('')}</select></div><textarea data-k="${i}" placeholder="${i}: conteúdo" style="min-height:40px;margin-bottom:6px"></textarea>`).join('')}
  $$('.form [data-k]',root).forEach(el=>{const f=el.closest('.form').id;const k=f+'|'+el.dataset.k;if(st.forms[k]!=null)el.value=st.forms[k];el.addEventListener('input',()=>{st.forms[k]=el.value;LS.set(id+':forms',st.forms)})});
  /* missions */
  st.renderMissions=()=>{const el=g('missionList');if(!el)return;el.innerHTML=D.missions.map((m,i)=>`<label class="mission ${st.mdone[i]?'ok':''}"><input type="checkbox" data-m="${i}" ${st.mdone[i]?'checked':''}><div><div class="mt">${i+1}. ${esc(m[0])}</div><div class="md">${esc(m[1])} <a href="#${P}${m[2]}">→ seção</a></div></div></label>`).join('')};
  st.renderMissions();
  if(g('missionList'))g('missionList').addEventListener('change',e=>{st.mdone[e.target.dataset.m]=e.target.checked;LS.set(id+':missions',st.mdone);st.renderMissions();paint()});
  /* quiz */
  st.renderQuiz=()=>{const el=g('quizList');if(!el)return;const Q=D.Q;el.innerHTML=Q.map((q,i)=>`<div class="q ${st.ans[i]!=null?'answered':''}" data-q="${i}"><b>${i+1}. ${esc(q[0])}</b><div class="opts">${q[1].map((o,j)=>{let c='';if(st.ans[i]!=null){if(j===q[2])c='right';else if(j===st.ans[i])c='wrong'}return `<button class="o ${c}" data-o="${j}">${esc(o)}</button>`}).join('')}</div><div class="ex">${st.ans[i]===q[2]?'✓ ':'✗ '}${esc(q[3])}</div></div>`).join('');
    const n=Object.keys(st.ans).length,ok=Object.entries(st.ans).filter(([i,v])=>Q[i][2]===v).length;g('score').textContent=`Acertos: ${ok} / ${n}`+(n===Q.length?` · ${Math.round(100*ok/Q.length)}%`:'')};
  st.renderQuiz();
  if(g('quizList')){g('quizList').addEventListener('click',e=>{const b=e.target.closest('button.o');if(!b)return;const i=+b.closest('.q').dataset.q;if(st.ans[i]!=null)return;st.ans[i]=+b.dataset.o;LS.set(id+':quiz',st.ans);st.renderQuiz()});
    g('quizReset').onclick=()=>{st.ans={};LS.set(id+':quiz',st.ans);st.renderQuiz()}}
  /* flash + gloss */
  if(g('fc')){let fi=0;const G=D.G;const fc=()=>{g('fcF').textContent=G[fi][0];g('fcB').textContent=G[fi][1];g('fcN').textContent=`${fi+1} / ${G.length}`;g('fc').classList.remove('flip')};
    g('fc').onclick=()=>g('fc').classList.toggle('flip');g('fcPrev').onclick=()=>{fi=(fi-1+G.length)%G.length;fc()};g('fcNext').onclick=()=>{fi=(fi+1)%G.length;fc()};fc();
    g('glossTable').innerHTML='<tr><th>Termo</th><th>Significado</th></tr>'+G.map(x=>`<tr><td><b>${esc(x[0])}</b></td><td>${esc(x[1])}</td></tr>`).join('')}
  /* ebook index */
  if(D.ebook&&g('ebookIdx')){const box=g('ebookIdx'),names=D.ebookNames||{};const lab=u=>u.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'');
    const draw=q=>{q=(q||'').toLowerCase();box.innerHTML=Object.entries(D.ebook).map(([c,arr])=>{const f=arr.filter(u=>!q||u.toLowerCase().includes(q));if(!f.length)return'';return `<details ${q?'open':''}><summary>${esc(names[c]||c)} <span class="tag">${f.length}</span></summary><div class="body"><ol class="links">${f.map(u=>`<li><a href="${esc(u)}">${esc(lab(u))}</a></li>`).join('')}</ol></div></details>`}).join('')||'<p class="progtxt">Nada encontrado.</p>'};
    draw();const s=g('ebookSearch');if(s)s.addEventListener('input',()=>draw(s.value))}
  const ra=g('resetAll');if(ra)ra.onclick=()=>{st.done={};st.mdone={};st.ans={};LS.set(id+':done',{});LS.set(id+':missions',{});LS.set(id+':quiz',{});st.renderMissions();st.renderQuiz();paint();toast('Progresso do módulo zerado')};
  if(window.MODX&&window.MODX[id])try{window.MODX[id](P,D)}catch(e){console.error(e)}
});

/* ---------- global delegated handlers ---------- */
document.addEventListener('click',e=>{
  const d=e.target.closest('[data-done]');if(d){const st=S[d.dataset.mod];st.done[d.dataset.done]=!st.done[d.dataset.done];LS.set(d.dataset.mod+':done',st.done);paint();return}
  const c=e.target.closest('[data-copy]');if(c){const pre=document.getElementById(c.dataset.copy);copyText(pre.textContent.replace(/^Copiar/,'').trim());return}
  const cf=e.target.closest('[data-copy-form]');if(cf){const f=document.getElementById(cf.dataset.copyForm);let out=`# ${cf.dataset.title}\n`;f.querySelectorAll('[data-k]').forEach(el=>{if(el.value&&el.value!=='—')out+=`\n**${el.dataset.k}:** ${el.value}`});copyText(out);return}
  const cl=e.target.closest('[data-clear]');if(cl){const f=document.getElementById(cl.dataset.clear);const mod=f.closest('.mod').dataset.mod;const st=S[mod];f.querySelectorAll('[data-k]').forEach(el=>{el.value=el.tagName==='SELECT'?'—':'';delete st.forms[f.id+'|'+el.dataset.k]});LS.set(mod+':forms',st.forms);f.querySelectorAll('input,textarea').forEach(x=>x.dispatchEvent(new Event('input')));return}
});

/* ---------- progress ---------- */
function prog(id){const st=S[id];const n=st.secs.filter(s=>st.done[s.id]).length;return{n,t:st.secs.length,p:st.secs.length?Math.round(100*n/st.secs.length):0}}
let cur='inicio';
function paint(){
  MODS.forEach(M=>{const st=S[M.id];st.secs.forEach(s=>{const dd=!!st.done[s.id];const b=s.querySelector(`[data-done="${s.id}"]`);b.textContent=dd?'✓ Concluída (desfazer)':'Marcar como concluída';b.className='btn'+(dd?' pri':'');const a=document.querySelector(`.navsec a[data-id="${s.id}"]`);if(a)a.classList.toggle('done',dd)});
    const a=document.querySelector(`.mods a[data-mod="${M.id}"] .mp`);if(a)a.textContent=prog(M.id).p+'%'});
  const tot=MODS.reduce((a,M)=>{const p=prog(M.id);a.n+=p.n;a.t+=p.t;return a},{n:0,t:0});
  $('#progBar').style.width=(tot.t?100*tot.n/tot.t:0)+'%';$('#progTxt').textContent=`${tot.n} de ${tot.t} seções concluídas no total`;
  if(cur==='inicio')renderHome();
}

/* ---------- sidebar ---------- */
const VIEWS=[['inicio','Início'],['central','Central de pivôs'],['roteiros','Roteiros de investigação'],['simulado','Simulado e flashcards'],['biblia','Bíblias'],['caderno','Meu caderno'],['livro','Livro (esqueleto)'],['treinamento','Treinamento (esqueleto)']];
$('#modsNav').innerHTML=VIEWS.map(v=>`<a href="#${v[0]}" data-view="${v[0]}">${v[1]}</a>`).join('')+'<div class="navh">Módulos</div>'+MODS.map(M=>`<a href="#${M.id}" data-mod="${M.id}" data-view="${M.id}">${M.n} · ${esc(M.short)}<span class="mp"></span></a>`).join('')+(WAIT.length?`<a class="wait" href="#inicio" title="${esc(WAIT.map(w=>w[0]).join(' · '))}">+ ${WAIT.length} aguardando material<span class="mp">◌</span></a>`:'');
function buildSecNav(id){const box=$('#navSec');if(!S[id]){box.innerHTML='';$('#navSecH').style.display='none';return}$('#navSecH').style.display='';let last='';box.innerHTML=S[id].secs.map(s=>{const g=s.dataset.group||'';let h='';if(g!==last){last=g;h=`<li class="grp">${esc(g)}</li>`}const t=s.querySelector('h2').textContent.replace(/^\s*\S+\s+/,'').trim();return h+`<li><a href="#${s.id}" data-id="${s.id}"><span class="ck">✓</span>${esc(t)}</a></li>`}).join('');paint()}
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting)$$('.navsec a').forEach(a=>a.classList.toggle('on',a.dataset.id===en.target.id))})},{rootMargin:'-30% 0px -60% 0px'});
MODS.forEach(M=>S[M.id].secs.forEach(s=>io.observe(s)));
$('#side').addEventListener('click',e=>{if(e.target.closest('a'))$('#side').classList.remove('open')});

/* ---------- router ---------- */
function route(){
  let h=decodeURIComponent(location.hash.slice(1))||'inicio';
  let view=h,anchor=null;
  const m=h.match(/^(m\d\d)(?:-(.+))?$/);
  if(m&&S[m[1]]){view=m[1];anchor=m[2]?h:null}
  else if(!VIEWS.some(v=>v[0]===h)){const el=document.getElementById(h);if(el&&el.closest('.view')){view=el.closest('.view').id.replace('view-','')}else view='inicio'}
  cur=view;
  $$('.view').forEach(v=>v.classList.toggle('on',v.id==='view-'+view));
  $$('#modsNav a').forEach(a=>a.classList.toggle('on',a.dataset.view===view));
  buildSecNav(view);
  if(view==='inicio')renderHome();if(view==='biblia')renderBible();if(view==='livro')renderBook();if(view==='treinamento')renderTrain();if(window.PLUS&&window.PLUS.views[view])window.PLUS.views[view]();
  document.title=(S[view]?MODS.find(x=>x.id===view).title+' · ':'')+'bíblia osint';
  requestAnimationFrame(()=>{const t=anchor?document.getElementById(anchor):null;if(t)t.scrollIntoView();else if(!anchor||!m)window.scrollTo(0,0)});
}
window.addEventListener('hashchange',route);

/* ---------- focus / next action ---------- */
function nextAction(){
  const order=S[cur]?[cur,...MODS.map(M=>M.id).filter(x=>x!==cur)]:MODS.map(M=>M.id);
  for(const id of order){const st=S[id];const s=st.secs.find(s=>!st.done[s.id]&&!(st.D.skip||[]).includes(s.id.slice(st.P.length)));
    if(s)return{type:'sec',mod:id,id:s.id,title:'Estudar: '+s.querySelector('h2').textContent.replace(/^\s*\S+\s+/,''),desc:(s.querySelector('.lead')||{}).textContent||'',meta:`Módulo ${id.slice(1)} · leitura`};
    const i=st.D.missions.findIndex((m,i)=>!st.mdone[i]);
    if(i>-1)return{type:'mis',mod:id,i,id:st.P+st.D.missions[i][2],title:st.D.missions[i][0],desc:st.D.missions[i][1],meta:`Módulo ${id.slice(1)} · missão ${i+1} de ${st.D.missions.length}`}}
  return null}
let fa=null;
function openFocus(){fa=nextAction();if(!fa){$('#fMeta').textContent='Tudo feito';$('#fTitle').textContent='Todos os módulos disponíveis concluídos';$('#fDesc').textContent='Traga o próximo módulo — e revise os flashcards.';$('#fGo').style.display='none';$('#fDone').style.display='none'}else{$('#fMeta').textContent=fa.meta;$('#fTitle').textContent=fa.title;$('#fDesc').textContent=fa.desc;$('#fGo').href='#'+fa.id;$('#fGo').style.display='';$('#fDone').style.display=''}$('#focus').classList.add('on')}
$('#fab').onclick=openFocus;$('#fClose').onclick=()=>$('#focus').classList.remove('on');$('#fGo').onclick=()=>$('#focus').classList.remove('on');
$('#fDone').onclick=()=>{if(fa){const st=S[fa.mod];if(fa.type==='sec'){st.done[fa.id]=true;LS.set(fa.mod+':done',st.done)}else{st.mdone[fa.i]=true;LS.set(fa.mod+':missions',st.mdone);st.renderMissions()}paint()}openFocus()};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#focus').classList.remove('on')});

/* ---------- home ---------- */
function renderHome(){
  const B=window.BIB||[];const gl=MODS.reduce((a,M)=>a+M.D.G.length,0);const qq=MODS.reduce((a,M)=>a+M.D.Q.length,0);const secs=MODS.reduce((a,M)=>a+S[M.id].secs.length,0);
  $('#homeStats').innerHTML=[[MODS.length,'módulos prontos'],[secs,'seções'],[B.length,'links na bíblia'],[gl,'termos no glossário'],[qq,'questões']].map(x=>`<div class="box"><div class="stat">${x[0]}</div><div class="statl">${x[1]}</div></div>`).join('');
  $('#homeCards').innerHTML=MODS.map(M=>{const p=prog(M.id);return `<a class="mcard" href="#${M.id}"><div class="mn">MÓDULO ${M.n} · ${p.p}%</div><h3>${esc(M.title)}</h3><p>${esc(M.sub)}</p><div class="prog"><i style="width:${p.p}%"></i></div><div class="progtxt">${p.n}/${p.t} seções · ${M.D.missions.length} missões · ${M.D.Q.length} questões</div></a>`}).join('')+WAIT.map(w=>`<div class="mcard wait"><div class="mn">AGUARDANDO MATERIAL</div><h3>${esc(w[0])}</h3><p>${esc(w[1])}</p></div>`).join('');
}
$('#homeNext').onclick=openFocus;

/* ---------- bible ---------- */
const nk=u=>String(u).replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'').toLowerCase();
let btab='ferr';
function renderBible(){
  $$('#bibTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===btab));
  const box=$('#bibBody');
  if(btab==='ferr'){const B=window.BIB;const mods=[...new Set(B.map(x=>x.m))];
    box.innerHTML=`<div class="form builder"><div><label>Buscar</label><input id="bibQ" placeholder="ex.: whois, exif, vpn, cnpj"></div><div><label>Módulo</label><select id="bibM"><option value="">Todos</option>${mods.map(m=>`<option>${m}</option>`).join('')}</select></div><div><label>Mostrar</label><select id="bibS"><option value="">Tudo</option><option value="fav">★ Favoritos</option><option value="ok">Funcionou na revisão</option><option value="off">Fora do ar na revisão</option><option value="pago">Pago</option><option value="nooff">Esconder fora do ar</option></select></div></div><p class="progtxt" id="bibN"></p><div id="bibList"></div>`;
    const draw=()=>{const q=$('#bibQ').value.toLowerCase(),mm=$('#bibM').value,ss=$('#bibS').value,fav=LS.get('fav',{});const stOf=x=>/fora do ar/i.test(x.g||'')?'off':/funcionou/i.test(x.g||'')?'ok':/pago|gr[áa]tis/i.test(x.g||'')?'pago':'';const f=B.filter(x=>(!mm||x.m===mm)&&(!q||(x.t+' '+x.u+' '+x.d+' '+x.s).toLowerCase().includes(q))&&(!ss||(ss==='fav'?fav[nk(x.u)]:ss==='nooff'?stOf(x)!=='off':stOf(x)===ss)));$('#bibN').textContent=`${f.length} de ${B.length} links`;
      $('#bibList').innerHTML='<table class="bt"><tr><th>Mód.</th><th>Ferramenta / link</th><th>Onde aparece</th></tr>'+f.slice(0,600).map(x=>`<tr><td>${x.m}</td><td><button class="fav ${fav[nk(x.u)]?'on':''}" data-fav="${esc(x.u)}" data-ft="${esc(x.t)}" title="Favoritar">★</button> <a href="${esc(x.u)}">${esc(x.t)}</a>${x.g?` <span class="tag ${stOf(x)==='off'?'off':'lin'}">${esc(x.g)}</span>`:''}${x.d?`<div class="progtxt">${esc(x.d)}</div>`:''} <button class="btn gbtn" data-gu="${esc(x.u)}" data-gt="${esc(x.t)}" data-gd="${esc(x.d||'')}" data-gs="${esc(x.s||'')}" data-ga="${esc(x.a||'')}" data-gg="${esc(x.g||'')}" data-gp="${esc(x.p||'')}" data-gk="${esc(x.k||'')}">Como usar</button></td><td><a href="#${x.a}">${esc(x.s)}</a></td></tr>`).join('')+'</table>'+(f.length>600?'<p class="progtxt">Mostrando 600 — refine a busca.</p>':'')};
    $('#bibQ').oninput=draw;$('#bibM').onchange=draw;$('#bibS').onchange=draw;draw()}
  if(btab==='glos'){const G=MODS.flatMap(M=>M.D.G.map(g=>[g[0],g[1],M.n,M.id])).sort((a,b)=>a[0].localeCompare(b[0],'pt'));
    box.innerHTML=`<div class="form"><input id="glQ" placeholder="Filtrar termos…"></div><div id="glL"></div>`;const draw=()=>{const q=$('#glQ').value.toLowerCase();$('#glL').innerHTML='<table><tr><th>Termo</th><th>Significado</th><th>Mód.</th></tr>'+G.filter(g=>!q||(g[0]+g[1]).toLowerCase().includes(q)).map(g=>`<tr><td><b>${esc(g[0])}</b></td><td>${esc(g[1])}</td><td><a href="#${g[3]}-flash">${g[2]}</a></td></tr>`).join('')+'</table>'};$('#glQ').oninput=draw;draw()}
  if(btab==='faq'){const F=window.FAQALL||[];box.innerHTML=F.map(f=>`<details><summary>${esc(f.q)} <span class="tag">${f.m}</span></summary><div class="body"><p>${esc(f.a)}</p>${f.l?`<p><a href="#${f.l}">→ ver no módulo</a></p>`:''}</div></details>`).join('')}
  if(btab==='leis'){const L=window.LAWS||[];box.innerHTML='<table><tr><th>Norma</th><th>O que importa para OSINT</th><th>Onde</th></tr>'+L.map(l=>`<tr><td><b>${l[0]}</b></td><td>${esc(l[1])}</td><td>${l[2].map(a=>`<a href="#${a}">${a.slice(0,3).toUpperCase()}</a>`).join(' ')}</td></tr>`).join('')+'</table><p class="progtxt">Mapa de estudo, não parecer jurídico. Confira o texto vigente antes de citar.</p>'}
  if(btab==='guia'&&window.GUIA){window.GUIA.renderTab(box)}
  if(btab==='labs'){const Lb=window.LABS||[];box.innerHTML='<div class="cards">'+Lb.map(l=>`<a class="mcard" href="#${l[2]}"><div class="mn">${l[3]}</div><h3>${esc(l[0])}</h3><p>${esc(l[1])}</p></a>`).join('')+'</div>'}
}
$('#bibTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;btab=b.dataset.t;renderBible()});

/* ---------- book ---------- */
const VW=['central','roteiros','simulado','caderno','biblia'];const ok=x=>!!(S[x.slice(0,3)]||VW.includes(x));const ready=src=>src.every(ok);
function bookStatus(c){if(!c.src.length)return['esqueleto','mid'];return ready(c.src)?['material completo · pronto para redação','']:(c.src.some(ok)?['material parcial','mid']:['aguardando material','wait'])}
function renderBook(){const B=window.BOOK;let pages=0,readyP=0;const rows=B.parts.map(p=>{const ch=p.ch.map(c=>{pages+=c.p;const s=bookStatus(c);if(!s[1])readyP+=c.p;return `<details><summary>Cap. ${c.n} — ${esc(c.t)} <span class="chip ${s[1]}">${s[0]}</span> <span class="tag">~${c.p} p.</span></summary><div class="body"><ol>${c.s.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>${c.src.length?`<p class="progtxt">Fontes: ${c.src.map(x=>ok(x)?`<a href="#${x}">${x}</a>`:`<span style="color:var(--rosa)">${x}</span>`).join(' · ')}</p>`:''}</div></details>`}).join('');return `<h3>${esc(p.t)}</h3>${p.d?`<p class="progtxt">${esc(p.d)}</p>`:''}${ch}`}).join('');
  $('#bookBody').innerHTML=`<div class="grid"><div class="box"><div class="stat">${pages}</div><div class="statl">páginas estimadas</div></div><div class="box"><div class="stat">${B.parts.reduce((a,p)=>a+p.ch.length,0)}</div><div class="statl">capítulos</div></div><div class="box"><div class="stat">${Math.round(100*readyP/pages)}%</div><div class="statl">com material completo</div></div></div>`+rows}
$('#bookCopy').onclick=()=>{const B=window.BOOK;let md=`# ${B.title}\n\n_${B.sub}_\n`;B.parts.forEach(p=>{md+=`\n## ${p.t}\n`;p.ch.forEach(c=>{md+=`\n### Capítulo ${c.n} — ${c.t} (~${c.p} p.) [${bookStatus(c)[0]}]\n`+c.s.map((x,i)=>`${c.n}.${i+1} ${x}`).join('\n')+'\n'})});copyText(md,'Esqueleto copiado (Markdown)')};

/* ---------- training ---------- */
function renderTrain(){const T=window.TRAIN;let h=0;
  const enc=T.enc.map(e=>{h+=e.h;const s=bookStatus({src:e.src});return `<details><summary>${esc(e.id)} — ${esc(e.t)} <span class="chip ${s[1]}">${s[1]==='wait'?'aguardando material':s[1]==='mid'?'material parcial':'pronto para montar'}</span> <span class="tag">${e.h}h</span></summary><div class="body">
  <table><tr><td><b>Objetivos</b></td><td><ul>${e.obj.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></td></tr><tr><td><b>Conteúdo</b></td><td>${esc(e.c)}</td></tr><tr><td><b>Laboratório</b></td><td>${esc(e.lab)}</td></tr><tr><td><b>Entregável</b></td><td>${esc(e.ent)}</td></tr><tr><td><b>Avaliação</b></td><td>${esc(e.av)}</td></tr><tr><td><b>Base de estudo</b></td><td>${e.src.map(x=>ok(x)?`<a href="#${x}">${x}</a>`:`<span style="color:var(--rosa)">${x}</span>`).join(' · ')||'—'}</td></tr></table></div></details>`}).join('');
  $('#trainBody').innerHTML=`<div class="grid two">${T.meta.map(m=>`<div class="box"><h4>${esc(m[0])}</h4>${esc(m[1])}</div>`).join('')}</div><div class="grid" style="margin-top:12px"><div class="box"><div class="stat">${T.enc.length}</div><div class="statl">encontros</div></div><div class="box"><div class="stat">${h}h</div><div class="statl">carga síncrona</div></div><div class="box"><div class="stat">${MODS.reduce((a,M)=>a+M.D.Q.length,0)}</div><div class="statl">questões no banco</div></div></div><h3>Trilha de encontros</h3>${enc}<h3>Kit do instrutor</h3><div id="kit"></div><h3>Rubrica do caso final</h3><table><tr><th>Critério</th><th>Peso</th><th>O que se espera</th></tr>${T.rub.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${r[1]}%</td><td>${esc(r[2])}</td></tr>`).join('')}</table>`;
  const kit=LS.get('kit',{});$('#kit').innerHTML=T.kit.map((k,i)=>`<label class="chk"><input type="checkbox" data-k="${i}" ${kit[i]?'checked':''}><span>${esc(k)}</span></label>`).join('');$('#kit').onchange=e=>{kit[e.target.dataset.k]=e.target.checked;LS.set('kit',kit)}}
$('#trainCopy').onclick=()=>{const T=window.TRAIN;let md=`# ${T.title}\n\n_${T.sub}_\n\n`+T.meta.map(m=>`- **${m[0]}:** ${m[1]}`).join('\n')+'\n\n## Encontros\n';T.enc.forEach(e=>{md+=`\n### ${e.id} — ${e.t} (${e.h}h)\n- Objetivos: ${e.obj.join('; ')}\n- Conteúdo: ${e.c}\n- Laboratório: ${e.lab}\n- Entregável: ${e.ent}\n- Avaliação: ${e.av}\n`});md+='\n## Rubrica do caso final\n'+T.rub.map(r=>`- ${r[0]} (${r[1]}%): ${r[2]}`).join('\n')+'\n\n## Kit do instrutor\n'+T.kit.map(k=>`- [ ] ${k}`).join('\n');copyText(md,'Esqueleto copiado (Markdown)')};

window.HUB={S,LS,esc,copyText,MODS,prog,paint,route,nk,openFocus,setBibTab:t=>{btab=t}};
paint();route();
})();
