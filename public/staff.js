'use strict';
/* ============================================================
   ÁREA DOS FUNCIONÁRIOS — Frame (demonstração, 100% no navegador)
   Carregue este arquivo por ÚLTIMO (depois do script principal e de loja.js).

   ATENÇÃO: os códigos de acesso abaixo ficam visíveis no código-fonte,
   então isto NÃO é segurança de verdade. Em produção, o login, as
   permissões e os pedidos precisam de um servidor.
   ============================================================ */
(function(){
/* código de acesso → função (troque por códigos seus) */
const CODES={'frame-cozinha':'cozinha','frame-entrega':'entregador','frame-gerente':'gerente'};
const K_X='frame_dishes_extra', K_O='frame_dish_ov', K_S='frame_staff';

const ALLG=[['todos','Todos'],['aguardando','Aguardando preparo'],['preparo','Em preparação'],['pronto','Prontos'],['entrega','Em entrega'],['concluido','Concluídos'],['cancelado','Cancelados']];
const ROLES={
  cozinha:{label:'Cozinha',tabs:['pedidos','estoque'],groups:['todos','aguardando','preparo','pronto']},
  entregador:{label:'Entregador',tabs:['pedidos'],groups:['todos','pronto','entrega']},
  gerente:{label:'Gerente',tabs:['pedidos','pratos','estoque','horarios','resumo'],groups:ALLG.map(g=>g[0])}
};
const TABS={pedidos:'Pedidos',pratos:'Pratos',estoque:'Estoque',horarios:'Horários',resumo:'Resumo'};

const BASE=D.slice();                          /* pratos originais do site */
BASE.forEach(d=>{d.p0=d.p});
const DIETS=['vegetariano','vegano','sem lactose','sem glúten'];
const ALERG=['glúten','leite','ovo','soja','gergelim','castanhas','amendoim','frutos do mar'];
const DEF_ART={salgado:['loaf','#E8B26A'],doce:['cake','#FF7DB0'],bebida:['cup','#3C8DFF']};
const E=esc;
const clean=s=>String(s).replace(/[<>"`]/g,'').replace(/\s+/g,' ').trim();
const noDot=s=>s.replace(/[.\s]+$/,'');
const go=h=>location.hash===h?route():(location.hash=h);

/* ---------- SESSÃO E PERMISSÕES ---------- */
const sess=()=>{try{const s=JSON.parse(sessionStorage.getItem(K_S));return s&&ROLES[s.role]?s:null}catch{return null}};
const isIn=()=>!!sess();
const role=()=>sess().role;
const can=(...r)=>isIn()&&r.includes(role());

/* ---------- DADOS: pratos cadastrados pela equipe + ajustes ---------- */
let extras=[], ov={};
function applyAll(){
  extras=load(K_X,[]);ov=load(K_O,{});
  extras.forEach(x=>{x.p0=x.p;ARTMAP[x.id]=ARTMAP[x.id]||DEF_ART[x.k]||DEF_ART.salgado});
  window.DALL=[...BASE,...extras];               /* todos, inclusive pausados */
  DALL.forEach(d=>{const o=ov[d.id];d.p=o&&o.p!=null?o.p:d.p0});
  D.length=0;D.push(...DALL.filter(d=>!(ov[d.id]&&ov[d.id].off)));   /* só os ativos aparecem ao cliente */
}
applyAll();

/* ---------- SITUAÇÃO DOS PEDIDOS ---------- */
const grp=s=>s==='Em preparação'?'preparo':(s==='Pronto para entrega'||s==='Pronto para retirada')?'pronto':s==='Saiu para entrega'?'entrega':s==='Concluído'?'concluido':s==='Cancelado'?'cancelado':'aguardando';
const IC={aguardando:'○',preparo:'◔',pronto:'◑',entrega:'➜',concluido:'✔',cancelado:'✕'};
const flow=o=>o.mode==='entrega'
  ?['Pedido confirmado','Em preparação','Pronto para entrega','Saiu para entrega','Concluído']
  :['Pedido confirmado','Em preparação','Pronto para retirada','Concluído'];
/* cada passo: [texto do botão, quem pode fazer] */
const MOVES=o=>[
  ['Iniciar preparo',['cozinha','gerente']],
  ['Marcar como pronto',['cozinha','gerente']],
  o.mode==='entrega'?['Marcar: saiu para entrega',['entregador','gerente']]:['Marcar: entregue ao cliente',['cozinha','gerente']],
  ['Confirmar entrega ao cliente',['entregador','gerente']]
];
function nextOf(o){
  const f=flow(o),k=f.indexOf(o.status);
  if(k<0||k>=f.length-1)return null;
  const m=MOVES(o)[k];
  return {to:f[k+1],label:m[0],ok:m[1].includes(role())};
}
function canSee(o){
  const g=grp(o.status),r=role();
  if(r==='gerente')return true;
  if(r==='cozinha')return ['aguardando','preparo','pronto'].includes(g);
  return o.mode==='entrega'&&['pronto','entrega'].includes(g);
}
let F='todos';

/* ---------- TELAS ---------- */
function loginHTML(){return `<div class="st-wrap"><div class="eyebrow">Área restrita</div><h1>Área dos funcionários</h1>
 <form class="panel" id="stLogin" novalidate>
 <div class="field"><label for="stn">Seu nome <span class="req">(obrigatório)</span></label><input id="stn" autocomplete="name" required aria-required="true" aria-describedby="stn-err"><div class="err" id="stn-err"></div></div>
 <div class="field"><label for="stc">Código de acesso <span class="req">(obrigatório)</span></label><input id="stc" type="password" autocomplete="off" required aria-required="true" aria-describedby="stc-err"><div class="err" id="stc-err"></div></div>
 <button class="btn" type="submit">Entrar</button>
 <p class="notice">Cada função (cozinha, entregador, gerente) tem um código e enxerga só o que precisa. Demonstração: o acesso é verificado só neste navegador e não protege dados de verdade.</p></form></div>`}

function ordersTab(){return `<div class="st-top-actions"><div class="field"><label for="stq">Buscar pedido pelo número</label><input id="stq" type="search" autocomplete="off" placeholder="Ex.: DEMO-1234"></div>
 ${can('gerente')?'<button type="button" class="btn alt small" id="stDemo">Gerar pedido de teste</button>':''}</div>
 <div class="st-chips" role="group" aria-label="Filtrar pedidos por situação" id="stChips"></div>
 <p class="meta" id="stCount" role="status" aria-live="polite"></p><div id="stList"></div>
 <p class="notice">Demonstração: os pedidos aparecem aqui quando feitos neste mesmo navegador. Um sistema real precisa de um servidor para reunir os pedidos de todos os clientes.</p>`}

function formHTML(r){r=r||{};const has=(a,v)=>(a||[]).includes(v),edit=!!r.id;
 const opt=(list,sel)=>list.map(c=>`<option${c===sel?' selected':''}>${E(c)}</option>`).join('');
 return `<form class="panel st-form" id="stForm" novalidate aria-label="${edit?'Editar prato':'Adicionar prato'}"><h2>${edit?'Editar prato':'Adicionar prato'}</h2>
 <input type="hidden" id="sfid" value="${E(r.id||'')}">
 <div class="st-grid">
  <div class="field"><label for="sfn">Nome do prato <span class="req">(obrigatório)</span></label><input id="sfn" required aria-required="true" value="${E(r.n||'')}"></div>
  <div class="field"><label for="sfu">Inspiração <span class="req">(obrigatório)</span></label><input id="sfu" required aria-required="true" placeholder="Ex.: Inspirado em um gato guloso" value="${E(r.u||'')}"></div>
  <div class="field"><label for="sfc">Categoria</label><select id="sfc">${opt(CATS,r.cat)}</select></div>
  <div class="field"><label for="sfk">Tipo</label><select id="sfk"><option value="salgado"${r.k==='salgado'?' selected':''}>Salgado</option><option value="doce"${r.k==='doce'?' selected':''}>Doce</option><option value="bebida"${r.k==='bebida'?' selected':''}>Bebida</option></select></div>
  <div class="field"><label for="sfp">Preço em R$ <span class="req">(obrigatório)</span></label><input id="sfp" type="number" min="1" step="0.5" inputmode="decimal" required aria-required="true" value="${r.p!=null?r.p:''}"></div>
  <div class="field"><label for="sft">Tempo de preparo (min)</label><input id="sft" type="number" min="1" max="180" inputmode="numeric" value="${r.t||10}"></div>
 </div>
 <fieldset class="opts field"><legend><strong>Restrições atendidas</strong></legend><div class="st-checks">${DIETS.map(x=>`<label><input type="checkbox" name="sfd" value="${x}"${has(r.diet,x)?' checked':''}> ${x}</label>`).join('')}</div></fieldset>
 <fieldset class="opts field"><legend><strong>Alergênicos presentes</strong></legend><div class="st-checks">${ALERG.map(x=>`<label><input type="checkbox" name="sfa" value="${x}"${has(r.al,x)?' checked':''}> ${x}</label>`).join('')}</div></fieldset>
 <div class="field"><label for="sfi">Ingredientes <span class="req">(obrigatório)</span></label><textarea id="sfi" rows="3" required aria-required="true">${E(r.ing||'')}</textarea></div>
 <div class="field"><label for="sfr">Curiosidade (opcional)</label><textarea id="sfr" rows="2">${E(r.cur||'')}</textarea></div>
 <div class="field"><label for="sfm">Link da foto (opcional)</label><input id="sfm" type="url" inputmode="url" placeholder="https://..." value="${E(r.img||'')}"><p class="meta" style="margin:6px 0 0">Sem foto, o site mostra uma ilustração.</p></div>
 <div class="err" id="st-derr" role="alert"></div>
 <div class="act"><button class="btn" type="submit">${edit?'Salvar alterações':'Adicionar ao cardápio'}</button>${edit?'<button type="button" class="btn alt" id="sfcancel">Cancelar edição</button>':''}</div></form>`}

function listHTML(){
 return `<h2 style="margin-top:36px;font-size:2rem">Pratos do cardápio (${DALL.length})</h2><p class="meta">Pratos pausados não aparecem para os clientes.</p>`
 +DALL.map(d=>{const off=ov[d.id]&&ov[d.id].off,custom=extras.some(x=>x.id===d.id);
  return `<div class="row-line st-dish"><div><strong>${d.n}</strong><br><small>${d.cat} · ${d.k}${custom?' · cadastrado pela equipe':''}</small></div>
  <span class="badge ${off?'b-cancelado':'b-concluido'}"><span aria-hidden="true">${off?'✕':'✔'}</span> ${off?'Pausado':'Ativo'}</span>
  <div class="st-price"><label class="sr" for="pr-${d.id}">Preço de ${d.n}</label><input id="pr-${d.id}" type="number" min="1" step="0.5" inputmode="decimal" value="${d.p}"><button type="button" class="btn small alt" data-st-price="${d.id}" aria-label="Salvar preço de ${d.n}">Salvar preço</button></div>
  <div class="act">${custom?`<button type="button" class="btn small alt" data-st-edit="${d.id}" aria-label="Editar ${d.n}">Editar</button>`:''}<button type="button" class="btn small alt" data-st-tog="${d.id}" aria-label="${off?'Reativar':'Pausar'} ${d.n}">${off?'Reativar':'Pausar'}</button>${custom?`<button type="button" class="btn small alt" data-st-del="${d.id}" aria-label="Excluir ${d.n}">Excluir</button>`:''}</div></div>`}).join('');
}
const dishesTab=()=>`<div id="stFormWrap">${formHTML(null)}</div><div id="stDishList">${listHTML()}</div>`;

/* ---------- ESTOQUE ---------- */
function stockList(){
 const q=($('#ssq')?$('#ssq').value:'').trim().toLowerCase(),st=Loja.stock();
 const rows=DALL.filter(d=>d.n.toLowerCase().includes(q));
 return rows.length?rows.map(d=>{
  const n=st[d.id],b=n==null?['aguardando','Sem controle','○']:n<=0?['cancelado','Esgotado','✕']:n<=5?['preparo','Estoque baixo','◔']:['concluido','Em estoque','✔'];
  return `<div class="row-line st-dish"><div><strong>${d.n}</strong><br><small>${d.cat}</small></div>
  <span class="badge b-${b[0]}"><span aria-hidden="true">${b[2]}</span> ${b[1]}${n!=null?` (${n})`:''}</span>
  <div class="st-price"><label class="sr" for="sk-${d.id}">Quantidade em estoque de ${d.n}</label><input id="sk-${d.id}" type="number" min="0" step="1" inputmode="numeric" value="${n==null?'':n}" placeholder="—"><button type="button" class="btn small alt" data-st-ks="${d.id}" aria-label="Salvar estoque de ${d.n}">Salvar</button></div>
  <button type="button" class="btn small alt" data-st-k0="${d.id}" aria-label="Marcar ${d.n} como esgotado">Esgotar</button></div>`}).join(''):'<p class="meta">Nenhum prato encontrado.</p>';
}
const stockTab=()=>`<p class="notice">Deixe a quantidade em branco para não controlar o estoque de um prato. Com quantidade 0, o prato aparece como "Esgotado" para os clientes. Quando um cliente finaliza um pedido, a quantidade diminui sozinha; se o pedido for cancelado, ela volta.</p>
 <div class="field" style="max-width:420px"><label for="ssq">Buscar prato</label><input id="ssq" type="search" autocomplete="off"></div>
 <p class="meta" id="stStockMsg" role="status" aria-live="polite"></p><div id="stStockList">${stockList()}</div>`;

function saveStock(id,v){
 Loja.setStock(id,v);
 $('#stStockList').innerHTML=stockList();
 const i=$('#sk-'+id);if(i)i.focus();
 $('#stStockMsg').textContent=v==null?'Estoque deixou de ser controlado.':v===0?'Marcado como esgotado.':`Estoque atualizado: ${v}.`}

/* ---------- HORÁRIOS ---------- */
function hoursTab(){
 const h=Loja.hours();
 return `<form class="panel st-form" id="stHours" novalidate><h2>Horário de funcionamento</h2>
 <p class="meta">Fora desses horários, o cliente não consegue finalizar pedidos. Vale o relógio do aparelho de quem acessa.</p>
 ${Loja.DAYS.map((n,i)=>{const c=h.days[i];return `<div class="row-line"><label class="st-day" for="hd${i}"><input type="checkbox" id="hd${i}"${c.on?' checked':''}> ${n}</label>
  <span class="st-price"><label class="sr" for="hf${i}">Abre às, ${n}</label><input type="time" id="hf${i}" value="${c.from}"><span aria-hidden="true">até</span><label class="sr" for="ht${i}">Fecha às, ${n}</label><input type="time" id="ht${i}" value="${c.to}"></span></div>`}).join('')}
 <fieldset class="opts field" style="margin-top:18px"><label><input type="checkbox" id="hpause"${h.paused?' checked':''}> Pausar pedidos agora (fechar a loja manualmente)</label></fieldset>
 <div class="field"><label for="hmsg">Aviso para os clientes (opcional)</label><input id="hmsg" value="${E(h.msg||'')}" placeholder="Ex.: Feriado: fechamos mais cedo"></div>
 <div class="err" id="st-herr" role="alert"></div><button class="btn" type="submit">Salvar horários</button></form>`}

/* ---------- RESUMO ---------- */
function summaryTab(){
 const act=orders.filter(o=>o.status!=='Cancelado'),sum=l=>l.reduce((a,o)=>a+otot(o),0),c=k=>orders.filter(o=>grp(o.status)===k).length;
 const qty={};act.forEach(o=>o.items.forEach(i=>qty[i.id]=(qty[i.id]||0)+i.q));
 const top=Object.entries(qty).sort((a,b)=>b[1]-a[1]).slice(0,5);
 const st=Loja.stock(),vals=Object.values(st),out=vals.filter(n=>n<=0).length,low=vals.filter(n=>n>0&&n<=5).length;
 const k=(n,t)=>`<div class="kpi"><strong>${n}</strong><span>${t}</span></div>`;
 return `<div class="st-kpis">${k(Loja.status().open?'Aberta':'Fechada','Loja agora')}${k(orders.length,'Pedidos no total')}${k(c('aguardando'),'Aguardando preparo')}${k(c('preparo'),'Em preparação')}${k(c('pronto')+c('entrega'),'Prontos / em entrega')}${k(c('concluido'),'Concluídos')}${k(c('cancelado'),'Cancelados')}
 ${k(money(sum(act)),'Valor dos pedidos (sem cancelados)')}${k(act.length?money(sum(act)/act.length):'—','Ticket médio')}${k(out,'Pratos esgotados')}${k(low,'Pratos com estoque baixo')}${k(DALL.length-D.length,'Pratos pausados')}</div>
 <h2 style="font-size:2rem">Pratos mais pedidos</h2>
 ${top.length?`<ol>${top.map(([id,q])=>`<li>${(dish(id)||{n:id}).n}: ${q} ${q===1?'unidade':'unidades'}</li>`).join('')}</ol>`:'<p class="meta">Ainda não há pedidos para mostrar.</p>'}`}

pages.staff=function(sub){
 const s=sess();if(!s)return loginHTML();
 const R=ROLES[s.role],t=R.tabs.includes(sub)?sub:R.tabs[0];
 const body={pedidos:ordersTab,pratos:dishesTab,estoque:stockTab,horarios:hoursTab,resumo:summaryTab}[t]();
 return `<div class="st-wrap"><div class="st-bar"><div><div class="eyebrow">Área restrita (demonstração)</div><h1>Painel da equipe</h1><p class="meta" style="margin:0">Olá, ${E(s.name)} · ${R.label}</p></div><button type="button" class="btn alt small" id="stOut">Sair</button></div>
 <div class="st-tabs" role="navigation" aria-label="Seções do painel">${R.tabs.map(k=>`<a href="#/staff/${k}"${k===t?' aria-current="page"':''}>${TABS[k]}</a>`).join('')}</div>
 <div id="stBody">${body}</div></div>`;
};
TITLES.staff='Área dos funcionários';

/* prato pausado não abre pela URL direta */
const _dish=pages.dish;pages.dish=id=>D.some(x=>x.id===id)?_dish(id):pages.nf();

/* ---------- PEDIDOS ---------- */
function orderHTML(o){
 const g=grp(o.status),nx=nextOf(o),fin=g==='concluido'||g==='cancelado',last=(o.hist||[]).slice(-1)[0];
 return `<article class="panel st-order" style="max-width:none" aria-label="Pedido ${E(o.num)}">
 <div class="st-order-head"><div><div class="uni">${E(o.num)}</div><div class="meta">${E(o.at)} · ${o.mode==='entrega'?'Entrega':'Retirada'} · ${E(o.pay)}</div></div>
 <span class="badge b-${g}"><span aria-hidden="true">${IC[g]}</span> ${E(o.status)}</span></div>
 ${o.items.map(it=>`<div class="row-line"><span>${it.q}× ${E((dish(it.id)||{n:it.id}).n)} <small>(${E(it.size)}${it.extras.length?', '+E(it.extras.join(', ')):''})</small></span><span>${money(it.unit*it.q)}</span></div>`).join('')}
 ${o.cupom?`<div class="row-line"><span>Cupom FRAME10</span><span>10% de desconto</span></div>`:''}
 <div class="row-line"><strong>Total</strong><strong class="price">${money(otot(o))}</strong></div>
 ${o.mode==='entrega'?`<p class="meta">Endereço: ${E(o.ad||'não informado')}</p>`:''}
 ${last?`<p class="meta">Última atualização: ${E(last.at)} por ${E(last.by)} (${E(last.role)})</p>`:''}
 <div class="act">${nx&&nx.ok?`<button type="button" class="btn small" data-st-adv="${E(o.num)}">${nx.label}</button>`:''}${nx&&!nx.ok?`<span class="meta">Próxima etapa: ${nx.label.toLowerCase()} (outra função)</span>`:''}${!fin&&can('gerente')?`<button type="button" class="btn small alt" data-st-cancel="${E(o.num)}">Cancelar pedido</button>`:''}</div></article>`}

function renderOrders(){
 const l=$('#stList');if(!l)return;
 const R=ROLES[role()];if(!R.groups.includes(F))F='todos';
 const vis=orders.filter(canSee),q=($('#stq')?$('#stq').value:'').trim().toLowerCase(),cnt={};
 ALLG.forEach(([k])=>cnt[k]=0);vis.forEach(o=>{cnt.todos++;cnt[grp(o.status)]++});
 $('#stChips').innerHTML=ALLG.filter(([k])=>R.groups.includes(k)).map(([k,t])=>`<button type="button" class="chip" data-st-f="${k}" aria-pressed="${F===k}">${t} (${cnt[k]})</button>`).join('');
 const list=vis.filter(o=>(F==='todos'||grp(o.status)===F)&&(!q||String(o.num).toLowerCase().includes(q)));
 $('#stCount').textContent=list.length?`${list.length} ${list.length===1?'pedido':'pedidos'}.`:'Nenhum pedido encontrado.';
 l.innerHTML=list.length?list.map(orderHTML).join(''):`<div class="empty"><p>Nenhum pedido nesta situação.</p></div>`}

function setStatus(num,s){
 orders=load('frame_orders',[]);
 const o=orders.find(x=>x.num===num);if(!o)return;
 o.status=s;(o.hist=o.hist||[]).push({s,at:new Date().toLocaleString('pt-BR'),by:sess().name,role:ROLES[role()].label});
 if(s==='Cancelado')Loja.restore(o);
 save('frame_orders',orders);
 Loja.notify(o,s);
 toast(`Pedido ${o.num}: ${s}. O cliente foi avisado.`);renderOrders()}

function demoOrder(){
 const n=1+Math.floor(Math.random()*3),items=[],mode=Math.random()<.5?'entrega':'retirada';
 for(let k=0;k<n;k++){const d=D[Math.floor(Math.random()*D.length)];items.push({key:d.id+'M',id:d.id,size:'M',extras:[],unit:d.p,q:1+Math.floor(Math.random()*2)})}
 orders=load('frame_orders',[]);
 orders.unshift({num:'DEMO-'+Math.floor(1000+Math.random()*9000),mode,ad:mode==='entrega'?'Rua das Flores, 100, Centro':'',pay:['Pix','Cartão','Dinheiro na retirada'][Math.floor(Math.random()*3)],cupom:false,status:'Pedido confirmado',items,at:new Date().toLocaleString('pt-BR')});
 save('frame_orders',orders);renderOrders();toast('Pedido de teste criado.')}

/* ---------- PRATOS ---------- */
function uniqueId(name){
 const slug=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'prato';
 let id=slug,n=2;while(DALL.some(d=>d.id===id))id=slug+'-'+n++;return id}

function saveDish(){
 const v=id=>$('#'+id).value.trim(),checked=n=>[...document.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
 ['sfn','sfu','sfi','sfp','sfm'].forEach(i=>$('#'+i).removeAttribute('aria-invalid'));
 const name=clean(v('sfn')),u=noDot(clean(v('sfu'))),ing=noDot(clean(v('sfi'))),p=parseFloat(v('sfp').replace(',','.')),img=v('sfm').replace(/["<>\s]/g,'');
 const fail=(id,msg)=>{$('#'+id).setAttribute('aria-invalid','true');$('#st-derr').textContent=msg;$('#'+id).focus()};
 if(!name)return fail('sfn','Informe o nome do prato.');
 if(!u)return fail('sfu','Informe a inspiração do prato.');
 if(!(p>0))return fail('sfp','Informe um preço maior que zero.');
 if(!ing)return fail('sfi','Informe os ingredientes.');
 if(img&&!/^https?:\/\//i.test(img))return fail('sfm','O link da foto deve começar com http:// ou https://');
 const id=$('#sfid').value||uniqueId(name),list=load(K_X,[]),k=list.findIndex(x=>x.id===id),old=k>=0?list[k]:{};
 const rec={e:'🍽️',r:4.5,pop:60,...old,id,n:name,cat:$('#sfc').value,u,k:$('#sfk').value,p:Math.round(p*100)/100,t:Math.max(1,parseInt(v('sft'),10)||10),diet:checked('sfd'),al:checked('sfa'),ing,cur:clean(v('sfr'))||'Novidade da casa.'};
 if(img)rec.img=img;else delete rec.img;
 delete rec.p0;
 k>=0?list[k]=rec:list.push(rec);
 save(K_X,list);
 const o=load(K_O,{});if(o[id]){delete o[id].p;save(K_O,o)}
 applyAll();
 $('#stFormWrap').innerHTML=formHTML(null);$('#stDishList').innerHTML=listHTML();
 toast(k>=0?`${name} atualizado.`:`${name} adicionado ao cardápio.`);
 $('#sfn').focus()}

function setOv(id,patch){const o=load(K_O,{});o[id]={...o[id],...patch};save(K_O,o);applyAll();$('#stDishList').innerHTML=listHTML()}

/* ---------- EVENTOS ---------- */
document.addEventListener('submit',e=>{const f=e.target;
 if(f.id==='stLogin'){e.preventDefault();
  const name=clean($('#stn').value),r=CODES[$('#stc').value.trim()];
  setErr('stn',name?'':'Informe seu nome.');setErr('stc',r?'':'Código incorreto.');
  if(!name){$('#stn').focus();return}if(!r){$('#stc').focus();return}
  try{sessionStorage.setItem(K_S,JSON.stringify({name,role:r}))}catch{}
  toast(`Bem-vindo(a), ${name}.`);go('#/staff/pedidos')}
 if(f.id==='stForm'){e.preventDefault();if(can('gerente'))saveDish()}
 if(f.id==='stHours'){e.preventDefault();if(!can('gerente'))return;
  const days=[];let bad=null;
  Loja.DAYS.forEach((n,i)=>{const on=$('#hd'+i).checked,from=$('#hf'+i).value,to=$('#ht'+i).value;
   if(on&&(!from||!to||from>=to)&&!bad)bad=[i,n];
   days.push({on,from:from||'11:00',to:to||'22:00'})});
  if(bad){$('#st-herr').textContent=`${bad[1]}: o horário de abertura precisa ser antes do fechamento.`;$('#hf'+bad[0]).focus();return}
  Loja.setHours({days,paused:$('#hpause').checked,msg:clean($('#hmsg').value)});
  $('#st-herr').textContent='';toast('Horários salvos.')}});

document.addEventListener('click',e=>{
 const t=e.target.closest('[data-st-f],[data-st-adv],[data-st-cancel],[data-st-price],[data-st-tog],[data-st-edit],[data-st-del],[data-st-ks],[data-st-k0],#stOut,#stDemo,#sfcancel');
 if(!t||!isIn())return;const d=t.dataset;
 if(d.stF){F=d.stF;renderOrders();const b=$(`[data-st-f="${F}"]`);if(b)b.focus();return}
 if(d.stAdv){orders=load('frame_orders',[]);const o=orders.find(x=>x.num===d.stAdv),nx=o&&nextOf(o);if(nx&&nx.ok)setStatus(o.num,nx.to);return}
 if(d.stCancel){if(!can('gerente'))return;const o=orders.find(x=>x.num===d.stCancel);if(o&&confirm(`Cancelar o pedido ${o.num}? O cliente será avisado.`))setStatus(o.num,'Cancelado');return}
 if(d.stKs||d.stK0){if(!can('cozinha','gerente'))return;
  const id=d.stKs||d.stK0;
  if(d.stK0){saveStock(id,0);return}
  const raw=$('#sk-'+id).value.trim();
  if(raw===''){saveStock(id,null);return}
  const n=parseInt(raw,10);
  if(!(n>=0)){toast('Informe uma quantidade válida (0 ou mais).');$('#sk-'+id).focus();return}
  saveStock(id,n);return}
 if(d.stPrice||d.stTog||d.stEdit||d.stDel){if(!can('gerente'))return}
 if(d.stPrice){const inp=$('#pr-'+d.stPrice),p=parseFloat(inp.value.replace(',','.'));
  if(!(p>0)){inp.setAttribute('aria-invalid','true');toast('Informe um preço maior que zero.');inp.focus();return}
  setOv(d.stPrice,{p:Math.round(p*100)/100});toast('Preço atualizado.');return}
 if(d.stTog){const off=!(ov[d.stTog]&&ov[d.stTog].off);setOv(d.stTog,{off});toast(off?'Prato pausado: não aparece para os clientes.':'Prato reativado.');return}
 if(d.stEdit){const r=extras.find(x=>x.id===d.stEdit);if(!r)return;$('#stFormWrap').innerHTML=formHTML(r);$('#sfn').focus();$('#stForm').scrollIntoView({block:'start'});return}
 if(d.stDel){const r=extras.find(x=>x.id===d.stDel);if(r&&confirm(`Excluir "${r.n}" do cardápio? Isso não pode ser desfeito.`)){
  save(K_X,load(K_X,[]).filter(x=>x.id!==r.id));const o=load(K_O,{});delete o[r.id];save(K_O,o);Loja.setStock(r.id,null);applyAll();$('#stDishList').innerHTML=listHTML();toast('Prato excluído.')}return}
 if(t.id==='sfcancel'){$('#stFormWrap').innerHTML=formHTML(null);return}
 if(t.id==='stDemo'){if(can('gerente'))demoOrder();return}
 if(t.id==='stOut'){try{sessionStorage.removeItem(K_S)}catch{}toast('Você saiu da área da equipe.');go('#/staff')}});

document.addEventListener('input',e=>{
 if(e.target.id==='stq')renderOrders();
 if(e.target.id==='ssq')$('#stStockList').innerHTML=stockList()});

/* mantém várias abas sincronizadas (ex.: cliente pede em uma aba, equipe vê na outra) */
addEventListener('storage',e=>{
 if(e.key==='frame_orders'){orders=load('frame_orders',[]);renderOrders();if(location.hash==='#/orders')route(true)}
 if(e.key===K_X||e.key===K_O)applyAll()});

/* depois de cada rota, preenche a lista de pedidos */
const _route=window.route;
window.route=function(keep){_route(keep);if(location.hash.startsWith('#/staff')&&isIn())renderOrders()};

/* redesenha a página atual já com os pratos da equipe (sem roubar o foco) */
firstRoute=true;route();
})();