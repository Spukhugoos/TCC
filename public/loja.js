'use strict';
/* ============================================================
   LOJA — Frame (demonstração, 100% no navegador)
   Avisos de pedido, controle de estoque, horário de funcionamento
   e etapas do pedido. Carregue DEPOIS do script principal e ANTES
   de staff.js.
   ============================================================ */
(function(){
const K_ST='frame_stock', K_H='frame_hours', K_N='frame_notifs';
const DAYS=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
const onStaff=()=>location.hash.startsWith('#/staff');

/* ---------- ETAPAS DO PEDIDO (linha do tempo do cliente) ---------- */
const FLOW=o=>o.mode==='entrega'
  ?['Pedido confirmado','Em preparação','Pronto para entrega','Saiu para entrega','Concluído']
  :['Pedido confirmado','Em preparação','Pronto para retirada','Concluído'];
window.stepsFor=o=>['Pedido recebido',...FLOW(o)];
window.stepOf=o=>{const i=FLOW(o).indexOf(o.status);return i<0?2:i+2};

/* ---------- HORÁRIO DE FUNCIONAMENTO ---------- */
const dflt=()=>({days:DAYS.map(()=>({on:true,from:'11:00',to:'22:00'})),paused:false,msg:''});
const hours=()=>{const h=load(K_H,null);return h&&Array.isArray(h.days)&&h.days.length===7?h:dflt()};
const tm=s=>{const [a,b]=String(s).split(':');return (+a||0)*60+(+b||0)};
function status(now=new Date()){
  const h=hours();
  if(h.paused)return {open:false,txt:'Pedidos pausados no momento'};
  const d=now.getDay(),m=now.getHours()*60+now.getMinutes(),cur=h.days[d];
  if(cur.on&&m>=tm(cur.from)&&m<tm(cur.to))return {open:true,txt:`Aberto agora, fecha às ${cur.to}`};
  for(let k=0;k<=7;k++){
    const dd=(d+k)%7,c=h.days[dd];
    if(!c.on)continue;
    if(k===0&&m>=tm(cur.from))continue;
    return {open:false,txt:`Fechado agora, abre ${k===0?'hoje':k===1?'amanhã':DAYS[dd].toLowerCase()} às ${c.from}`};
  }
  return {open:false,txt:'Fechado no momento'};
}
function updateBar(){
  let b=$('#storeBar');
  if(!b){b=document.createElement('div');b.id='storeBar';b.setAttribute('role','status');const m=$('#app');m.parentNode.insertBefore(b,m)}
  const s=status(),h=hours(),t=s.txt+(h.msg?' · '+h.msg:'');
  b.hidden=onStaff();
  if(b.dataset.t===t)return;
  b.dataset.t=t;b.className='store-bar '+(s.open?'is-open':'is-closed');
  b.innerHTML=`<span aria-hidden="true">${s.open?'●':'○'}</span> ${esc(t)}`;
}

/* ---------- ESTOQUE ---------- */
const stock=()=>load(K_ST,{});
const left=id=>{const s=stock();return s[id]==null?null:s[id]};
function setStock(id,v){const s=stock();if(v==null)delete s[id];else s[id]=v;save(K_ST,s)}
function commit(items){const s=stock();items.forEach(i=>{if(s[i.id]!=null)s[i.id]=Math.max(0,s[i.id]-i.q)});save(K_ST,s)}
function restore(o){
  if(!o.stockUsed||o.stockRestored)return;
  const s=stock();o.items.forEach(i=>{if(s[i.id]!=null)s[i.id]+=i.q});
  o.stockRestored=true;save(K_ST,s)}
window.commitStock=items=>{commit(items);return true};
const qtyInCart=id=>cart.filter(i=>i.id===id).reduce((a,i)=>a+i.q,0);

/* esgotado / poucas unidades nos cards e na página do prato */
const _card=window.card;
window.card=function(d){
  let h=_card(d);const n=left(d.id);
  if(n===0){
    h=h.replace(/<button class="btn small" data-add="[^"]*" aria-label="[^"]*">Adicionar ao carrinho<\/button>/,'<button type="button" class="btn small" disabled aria-disabled="true">Esgotado</button>');
    h=h.replace('<div class="tags">','<div class="tags"><span class="al">esgotado</span>');
  }else if(n!=null&&n<=5){
    h=h.replace('<div class="tags">',`<div class="tags"><span class="al">restam ${n}</span>`);
  }
  return h};
const _pdish=pages.dish;
pages.dish=function(id){
  let h=_pdish(id);const n=left(id);
  if(n===0)h=h.replace('<button class="btn" id="addbtn">Adicionar ao carrinho</button>','<button class="btn" id="addbtn" type="button" disabled aria-disabled="true">Esgotado</button>');
  else if(n!=null&&n<=5)h=h.replace('<button class="btn" id="addbtn">',`<p class="notice">Restam apenas ${n} ${n===1?'unidade':'unidades'}.</p><button class="btn" id="addbtn">`);
  return h};

/* impede adicionar mais do que existe */
const _add=window.add;
window.add=function(id,o={}){
  const n=left(id),q=o.q||1;
  if(n!=null){
    const nome=(dish(id)||{n:id}).n;
    if(n<=0){toast(`${nome} está esgotado.`);return}
    if(qtyInCart(id)+q>n){toast(`Só restam ${n} ${n===1?'unidade':'unidades'} de ${nome}.`);return}
  }
  _add(id,o)};

/* verificação final ao finalizar o pedido (horário + estoque) */
window.gate=function(){
  const st=status(),probs=[];
  if(!st.open)probs.push(`A loja não está recebendo pedidos agora. ${st.txt}.`);
  const seen=new Set();
  cart.forEach(i=>{
    if(seen.has(i.id))return;seen.add(i.id);
    const n=left(i.id),nome=(dish(i.id)||{n:i.id}).n;
    if(n==null)return;
    if(n<=0)probs.push(`${nome} esgotou. Remova do carrinho para continuar.`);
    else if(qtyInCart(i.id)>n)probs.push(`Só restam ${n} ${n===1?'unidade':'unidades'} de ${nome}.`);
  });
  let el=$('#gate-err');
  if(!el){const b=$('#co button[type=submit]');if(b){el=document.createElement('div');el.id='gate-err';el.className='err';el.setAttribute('role','alert');b.parentNode.insertBefore(el,b)}}
  if(el)el.textContent=probs.join(' ');
  if(probs.length){toast(probs[0]);return false}
  return true};

/* ---------- AVISOS PARA O CLIENTE ---------- */
const MSG={
 'Em preparação':n=>`Seu pedido ${n} começou a ser preparado.`,
 'Pronto para retirada':n=>`Seu pedido ${n} está pronto para retirada.`,
 'Pronto para entrega':n=>`Seu pedido ${n} está pronto e aguarda o entregador.`,
 'Saiu para entrega':n=>`Seu pedido ${n} saiu para entrega.`,
 'Concluído':n=>`Pedido ${n} concluído. Bom apetite!`,
 'Cancelado':n=>`Seu pedido ${n} foi cancelado. Em caso de dúvida, fale com a loja.`
};
let lastId=(load(K_N,[])[0]||{}).id;
function notify(o,s){
  const f=MSG[s];if(!f)return;
  const l=load(K_N,[]);
  l.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),num:o.num,msg:f(o.num),at:new Date().toLocaleString('pt-BR'),read:false});
  save(K_N,l.slice(0,50));lastId=l[0].id;renderBell()}

function mountBell(){
  const tools=document.querySelector('.tools'),hdr=document.querySelector('header.top');
  if(!tools||!hdr||$('#bellBtn'))return;
  const b=document.createElement('button');
  b.type='button';b.className='tool-btn';b.id='bellBtn';
  b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','bellPanel');
  b.innerHTML='Avisos (<span id="bellN" aria-hidden="true">0</span>)';
  tools.insertBefore(b,$('#cartLink'));
  const p=document.createElement('div');
  p.id='bellPanel';p.className='a11y-panel bell-panel';p.setAttribute('role','region');p.setAttribute('aria-labelledby','bellTitle');p.hidden=true;
  hdr.appendChild(p);
  b.onclick=()=>{const open=p.hidden;p.hidden=!open;b.setAttribute('aria-expanded',open);if(open){const t=$('#bellTitle');if(t){t.tabIndex=-1;t.focus()}}};
}
function closeBell(focus){const p=$('#bellPanel'),b=$('#bellBtn');if(!p||p.hidden)return;p.hidden=true;b.setAttribute('aria-expanded','false');if(focus)b.focus()}
function renderBell(){
  const b=$('#bellBtn'),p=$('#bellPanel');if(!b||!p)return;
  const l=load(K_N,[]),n=l.filter(x=>!x.read).length,canPerm='Notification' in window&&Notification.permission==='default';
  $('#bellN').textContent=n;
  b.setAttribute('aria-label',`Avisos: ${n} ${n===1?'novo':'novos'}`);
  p.innerHTML=`<h2 id="bellTitle">Avisos sobre seus pedidos</h2>
  ${l.length?`<ul class="bell-list">${l.slice(0,20).map(x=>`<li><span>${x.read?'':'<strong>Novo · </strong>'}${esc(x.msg)}</span><small>${esc(x.at)}</small></li>`).join('')}</ul>`:'<p class="meta" style="margin:0">Nenhum aviso por enquanto.</p>'}
  <div class="grp"><button type="button" class="chip" data-bell="read">Marcar como lidos</button><button type="button" class="chip" data-bell="clear">Limpar avisos</button>${canPerm?'<button type="button" class="chip" data-bell="perm">Ativar avisos no navegador</button>':''}</div>
  <p class="meta" style="margin:0">Demonstração: os avisos chegam neste navegador. Para avisar por e-mail, WhatsApp ou notificação no celular é preciso um servidor.</p>`;
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-bell]');if(!t)return;
  const a=t.dataset.bell;
  if(a==='read'){save(K_N,load(K_N,[]).map(x=>({...x,read:true})))}
  if(a==='clear'){save(K_N,[]);toast('Avisos apagados.')}
  if(a==='perm'){try{Notification.requestPermission().then(r=>{renderBell();toast(r==='granted'?'Avisos do navegador ativados.':'Avisos do navegador não ativados.')})}catch{}return}
  renderBell();const h=$('#bellTitle');if(h){h.tabIndex=-1;h.focus()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBell(true)});

/* outra aba (ex.: a equipe) mudou algo */
addEventListener('storage',e=>{
  if(e.key===K_N){
    const l=load(K_N,[]);renderBell();
    if(l[0]&&l[0].id!==lastId&&!l[0].read&&!onStaff()){
      lastId=l[0].id;toast(l[0].msg);
      try{if('Notification' in window&&Notification.permission==='granted')new Notification('Frame',{body:l[0].msg})}catch{}
    }
  }
  if(e.key===K_H)updateBar();
  if(e.key===K_ST&&location.hash==='#/menu')route(true);
});

/* ---------- LIGAÇÃO COM O ROTEADOR ---------- */
const _route=window.route;
window.route=function(keep){
  _route(keep);
  const b=$('#bellBtn');if(b){b.hidden=onStaff();if(onStaff())closeBell(false)}
  updateBar();
};

window.Loja={DAYS,hours,setHours:h=>{save(K_H,h);updateBar()},status,updateBar,stock,left,setStock,commit,restore,notify};

mountBell();renderBell();updateBar();
setInterval(updateBar,30000);
})();