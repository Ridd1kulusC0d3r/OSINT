window.MODX=window.MODX||{};
window.MODX.m02=function(P,D){
const $=s=>s==='#toast'?document.getElementById('toast'):document.getElementById(P+s.slice(1));
const st={get(k,d){try{const v=localStorage.getItem('bib:m02:'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('bib:m02:'+k,JSON.stringify(v))}catch(e){}}};
function checklist(el,key,items){if(!el)return;const s=st.get(key,{});el.innerHTML=items.map((t,i)=>`<label class="chk"><input type="checkbox" data-i="${i}" ${s[i]?'checked':''}><span>${t}</span></label>`).join('');el.addEventListener('change',e=>{s[e.target.dataset.i]=e.target.checked;st.set(key,s)})}
checklist($('#opsecList'),'opsec',['VM ou pen drive exclusivo, com snapshot limpo','Rede não corporativa','VPN com IP coerente com a cidade da persona','Fuso e idioma do navegador coerentes','Nenhuma conta pessoal logada no navegador','Bloqueadores instalados e navegador testado','E-mail durável + autenticador','Telefone VoIP próprio do AVI','Foto checada por busca reversa e sem EXIF','Plano de “envelhecimento” da conta (sem pressa)']);
checklist($('#aviChecks'),'avichk',['Finalidade e base legal registradas','Nome buscado entre aspas: não pertence a ninguém conhecido','CPF conferido na situação cadastral','Endereço conferido no Maps (não é a casa de alguém)','Foto: não é de pessoa real / busca reversa limpa','EXIF removido','Linguagem e interesses coerentes com o meio do alvo','Rotina de postagem definida','Nenhuma conexão com perfis reais ou do trabalho','Documentado no relatório de planejamento']);
/* dork builder */
const ids=['exact','or','not','site','ft','title','url','text'];
const saved=st.get('dork',{});
ids.forEach(k=>{const e=$('#dk_'+k); if(saved[k])e.value=saved[k]; e.addEventListener('input',build); e.addEventListener('change',build)});
const split=v=>v.split(',').map(s=>s.trim()).filter(Boolean);
const q=s=>/\s/.test(s)?`"${s}"`:s;
function build(){
  const v={};ids.forEach(k=>v[k]=$('#dk_'+k).value.trim());st.set('dork',v);
  const p=[];
  if(v.exact)p.push(`"${v.exact.replace(/"/g,'')}"`);
  if(v.or){const t=split(v.or).map(q);p.push(t.length>1?'('+t.join(' OR ')+')':t[0])}
  if(v.site)p.push('site:'+v.site);
  if(v.ft)p.push('filetype:'+v.ft);
  if(v.title)p.push('intitle:'+q(v.title));
  if(v.url)p.push('inurl:'+q(v.url));
  if(v.text)p.push('intext:'+q(v.text));
  split(v.not).forEach(t=>p.push('-'+q(t)));
  const s=p.join(' ');
  $('#dk_out').textContent=s||'Comece a preencher…';
  const E=s?[['Google','https://www.google.com/search?q='],['Bing','https://www.bing.com/search?q='],['DuckDuckGo','https://duckduckgo.com/?q='],['Yandex','https://yandex.com/search/?text='],['Brave','https://search.brave.com/search?q=']]:[];
  $('#dk_eng').innerHTML=E.map(([n,u])=>`<a href="${u+encodeURIComponent(n==='Bing'?s.replace(/\bintext:/g,'inbody:'):s)}">Abrir no ${n} ↗</a>`).join('');
  window.__dork=s;
}
$('#dk_clear').onclick=()=>{ids.forEach(k=>$('#dk_'+k).value='');build()};
$('#dk_copy').onclick=async()=>{try{await navigator.clipboard.writeText(window.__dork||'');}catch(e){} const t=$('#toast');t.textContent='Copiado!';t.style.display='block';setTimeout(()=>t.style.display='none',1200)};
const T=[
 ['PDFs de órgão público',{exact:'relatório de gestão',site:'gov.br',ft:'pdf'}],
 ['E-mails de profissionais no LinkedIn',{or:'advogado, advogada',text:'@gmail.com',site:'linkedin.com/in'}],
 ['Planilhas expostas do seu domínio',{site:'exemplo.com.br',ft:'xlsx'}],
 ['Diretórios abertos',{title:'index of',text:'backup'}],
 ['Menções em pastes',{site:'pastebin.com',exact:'exemplo.com.br'}],
 ['Transparência municipal',{url:'transparencia',exact:'diárias',site:'gov.br',not:'concurso'}]
];
$('#dk_tpl').innerHTML=T.map((t,i)=>`<a href="#${P}lab-dork" data-t="${i}">${t[0]}</a>`).join('');
$('#dk_tpl').addEventListener('click',e=>{const a=e.target.closest('[data-t]');if(!a)return;e.preventDefault();const o=T[+a.dataset.t][1];ids.forEach(k=>$('#dk_'+k).value=o[k]||'');build()});
build();
};
