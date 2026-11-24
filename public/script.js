'use strict';
/* DADOS DE DEMONSTRAÇÃO — todos os preços, notas e tempos são fictícios.
   Para cadastrar novos pratos, basta adicionar um objeto a este array (ou trocar por uma API).
   Campo "img": link direto da foto. Sem "img" (ou se o link falhar) aparece a ilustração SVG. */
const CATS = ['Desenhos animados','Filmes e séries','Videogames','Animes','Doces e sobremesas','Bebidas temáticas','Combos especiais','Edições limitadas'];
const D = [
 {id:'lasanha',img:'https://static.itdg.com.br/images/640-400/a9785927200dab579e1144c4afa6f6c8/lasanha.png',n:'Lasanha do Garfield',cat:'Desenhos animados',u:'Inspirada em um gato guloso dos quadrinhos',e:'🍝',p:42,r:4.9,t:30,diet:[],al:['glúten','leite','ovo'],k:'salgado',pop:98,ing:'Massa fresca, molho de tomate, carne moída, queijo e muito amor',cur:'Dizem que nenhum gato preguiçoso resiste a uma lasanha na segunda-feira. A nossa tem camadas generosas e queijo bem gratinado.'},
 {id:'burger',img:'https://www.bimboqsrbrasil.com.br/wp-content/uploads/2021/05/4a7a21e17cd365dea1697199ac432e69.jpg',n:'Hambúrguer de Siri',cat:'Desenhos animados',u:'Inspirado em uma lanchonete submarina',e:'🍔',p:34,r:4.7,t:20,diet:[],al:['glúten','leite','gergelim'],k:'salgado',pop:90,ing:'Pão, carne, queijo, alface, tomate e molho especial',cur:'A receita secreta é tão disputada que ganhamos nossa própria versão do molho.'},
 {id:'ramen',n:'Ramen do Ninja',cat:'Animes',u:'Inspirado em um ninja apaixonado por lámen',e:'🍜',p:38,r:4.8,t:25,diet:['sem lactose'],al:['glúten','soja','ovo'],k:'salgado',pop:88,ing:'Caldo à escolha, macarrão, ovo, cebolinha e narutomaki',cur:'Para todo herói, uma tigela quente no fim da missão.'},
 {id:'lembas',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwkrZdcJ3DgnPolmKpi4TyWEgduB1f_JKOFg6q6xAHC9-hn37KfKf-pRK9&s=10',n:'Pão Élfico de Viagem',cat:'Filmes e séries',u:'Inspirado em uma saga de fantasia épica',e:'🥖',p:19,r:4.5,t:15,diet:['vegetariano'],al:['glúten','leite'],k:'salgado',pop:60,ing:'Massa folhada, mel, castanhas e ervas',cur:'Pequeno, leve e dizem que sustenta uma jornada inteira.'},
 {id:'mana',img:'https://i.etsystatic.com/18026541/r/il/5de31b/1729587793/il_fullxfull.1729587793_rafo.jpg',n:'Poção de Mana',cat:'Bebidas temáticas',u:'Inspirada em jogos de RPG',e:'🧪',p:16,r:4.6,t:5,diet:['vegano','sem lactose','sem glúten'],al:[],k:'bebida',pop:75,ing:'Limonada azul, hortelã, gelo e frutas vermelhas',cur:'Restaura 100% da sua sede.'},
 {id:'bolo',img:'https://i.ytimg.com/vi/33PHMyJH9kw/maxresdefault.jpg',n:'Bolo Quadrado',cat:'Videogames',u:'Inspirado em um jogo de blocos',e:'🍰',p:24,r:4.7,t:10,diet:['vegetariano'],al:['glúten','leite','ovo'],k:'doce',pop:82,ing:'Bolo de chocolate, cobertura de brigadeiro e cubos de chocolate',cur:'Decoração geométrica, sabor nada quadrado.'},
 {id:'sand',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUE_j7Km5GF6HklOR0JfD8swX65-PuQUkwOhEC0De8bQ&s=10',n:'Sanduíche Mistério S/A',cat:'Desenhos animados',u:'Inspirado em um cão medroso e faminto',e:'🥪',p:29,r:4.4,t:15,diet:[],al:['glúten','leite'],k:'salgado',pop:70,ing:'Pão italiano, peito de peru, queijo, presunto, salada e maionese',cur:'Tão grande que dá para dividir com a turma.'},
 {id:'donut',n:'Donuts do Homer',cat:'Doces e sobremesas',u:'Inspirados em uma família de desenho animado',e:'🍩',p:21,r:4.8,t:5,diet:['vegetariano'],al:['glúten','leite','ovo'],k:'doce',pop:92,ing:'Donuts com cobertura rosa, confeitos coloridos',cur:'Hmmm... donuts.'},
 {id:'mario',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9Cn2Ko1lMwtmOyU9U6ZAyRtsoGtnc3g93nJGr6Ysbg&s=10',n:'Banquete do Encanador',cat:'Combos especiais',u:'Inspirado em um clássico dos videogames',e:'🍄',p:49,r:4.9,t:25,diet:[],al:['glúten','leite'],k:'salgado',pop:95,ing:'Hambúrguer, fritas e refrigerante',cur:'Um combo que vale uma vida extra.'},
 {id:'shake',img:'https://static.wikia.nocookie.net/ptstarwars/images/3/34/Blue_Milk.jpg/revision/latest?cb=20210717022010',n:'Leite Azul Espacial',cat:'Bebidas temáticas',u:'Inspirado na bebida favorita de um jovem monge espacial',e:'🥤',p:22,r:4.8,t:7,diet:['vegetariano'],al:['leite'],k:'bebida',pop:85,ing:'Sorvete, leite, sabores e coberturas à escolha',cur:'Nossa assinatura: um quadro de cada sabor.'},
 {id:'pix',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPuVoGaarHpkj3yGZmQ7ACZwlelPv6E3TyVR_LtEnjRZry572jmJI1tbzT&s=10',n:'Pizza Cowabunga',cat:'Videogames',u:'Inspirada em tartarugas atléticas',e:'🍕',p:39,r:4.3,t:25,diet:['vegetariano'],al:['glúten','leite'],k:'salgado',pop:55,ing:'Massa quadrada, molho, mussarela e legumes em cubos',cur:'Cortada em pixels para você montar do seu jeito.'},
 {id:'clap',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWDE2AJSTXOe4UH-_ZYbjX4vdTDvqtSrTSWLIHHkJ7rL9I3t_HeQYjKk&s=10',n:'Onigiri do Ryu',cat:'Edições limitadas',u:'Inspirada em um lutador de rua que busca a paz interior',e:'🍿',p:18,r:4.6,t:8,diet:['vegetariano','sem glúten'],al:['leite'],k:'doce',pop:65,ing:'Arroz enrolado com algas secas',cur:'Disponível por tempo limitado, como todo bom lançamento.'}
];
const EXTRA = {Cheddar:4,Bacon:5,'Porção de batatas':9}, SIZE = {P:.8,M:1,G:1.35};
const $ = (s,r=document)=>r.querySelector(s), app = $('#app');
const money = v=>'R$ '+v.toFixed(2).replace('.',',');
const dec = v=>String(v).replace('.',',');
const load = (k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save = (k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cart = load('frame_cart',[]), favs = load('frame_favs',[]), user = load('frame_user',null), orders = load('frame_orders',[]);
const SAMPLE=[{num:'DEMO-0001',at:'10/10/2026 19:42',mode:'retirada',pay:'Pix',status:'Concluído',items:[{id:'lasanha',size:'M',extras:[],unit:42,q:1},{id:'shake',size:'M',extras:[],unit:22,q:2}]}];
const otot=o=>o.items.reduce((a,i)=>a+i.unit*i.q,0)*(o.cupom?.9:1);
const dish = id=>D.find(x=>x.id===id);

/* ---------- ACESSIBILIDADE: avisos, erros, preferências ---------- */
let toastT;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),4500);
  const l=$('#live');l.textContent='';setTimeout(()=>l.textContent=m,60)}           /* anunciado por leitores de tela */
function setErr(id,msg){const el=$('#'+id),er=$('#'+id+'-err');if(er)er.textContent=msg||'';if(!el)return;
  msg?el.setAttribute('aria-invalid','true'):el.removeAttribute('aria-invalid')}
const tl=(steps,n)=>`<ol class="tl">${steps.map((s,i)=>`<li class="${i<n?'done':''}"${i===n-1?' aria-current="step"':''}>${s}<span class="sr">${i<n?' (concluída)':' (pendente)'}</span></li>`).join('')}</ol>`;
const SDEF={fs:1,hc:0,rf:0,ul:0,rm:0};
let A={...SDEF,...load('frame_a11y',{})};
if(localStorage.getItem('frame_a11y')===null&&matchMedia('(prefers-contrast: more)').matches)A.hc=1;
function applyA11y(){const r=document.documentElement;r.style.setProperty('--fs',A.fs);
  ['hc','rf','ul','rm'].forEach(k=>{r.classList.toggle(k,!!A[k]);const b=$(`[data-a11y="${k}"]`);if(b)b.setAttribute('aria-pressed',!!A[k])});
  $('#fsv').textContent=Math.round(A.fs*100)+'%';save('frame_a11y',A)}
function setTts(){const b=$('#tts');if(b){b.setAttribute('aria-pressed',ttsOn);b.textContent=ttsOn?'Parar leitura':'Ouvir esta página'}}
let ttsOn=false;
function stopSpeak(){try{window.speechSynthesis&&speechSynthesis.cancel()}catch{}ttsOn=false;setTts()}
function speak(){if(!('speechSynthesis' in window)){toast('Seu navegador não oferece leitura em voz alta.');return}
  if(ttsOn){stopSpeak();return}
  const sent=(document.title+'. '+app.innerText).replace(/\s+/g,' ').match(/[^.!?]+[.!?]?/g)||[],ch=[];let cur='';
  sent.forEach(s=>{if((cur+s).length>200){if(cur)ch.push(cur);cur=s}else cur+=s});if(cur)ch.push(cur);
  ttsOn=true;setTts();
  ch.forEach((c,i)=>{const u=new SpeechSynthesisUtterance(c);u.lang='pt-BR';u.rate=.95;if(i===ch.length-1)u.onend=()=>{ttsOn=false;setTts()};speechSynthesis.speak(u)})}
function closePanel(focus){const p=$('#a11y'),b=$('#a11yBtn');if(p.hidden)return;p.hidden=true;b.setAttribute('aria-expanded','false');if(focus)b.focus()}
function closeNav(){$('#nav').classList.remove('open');const b=$('#burger');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Abrir menu')}

function sync(){const u=$('#userLink');if(u){u.textContent=user?user.name.split(' ')[0]:'Entrar';u.setAttribute('href',user?'#/profile':'#/login')}
  const n=cart.reduce((a,i)=>a+i.q,0);
  $('#cartCount').textContent=n;$('#cartLink').setAttribute('aria-label',`Carrinho: ${n} ${n===1?'item':'itens'}`);
  $('#favCount').textContent=favs.length;$('#favLink').setAttribute('aria-label',`Favoritos: ${favs.length}`);
  save('frame_cart',cart);save('frame_favs',favs)}
function toggleFav(id){const on=!favs.includes(id);favs=on?[...favs,id]:favs.filter(f=>f!==id);sync();
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b=>{b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  toast(`${dish(id).n} ${on?'adicionado aos':'removido dos'} favoritos`);
  const ff=$('#ff');if(ff&&ff.checked&&window.menuGo){menuGo();ff.focus()}}
function add(id,o={}){const d=dish(id),s=o.size||'M',ex=o.extras||[];
  const unit=d.p*SIZE[s]+ex.reduce((a,x)=>a+EXTRA[x],0), key=id+s+ex.join();
  const f=cart.find(i=>i.key===key);f?f.q+=o.q||1:cart.push({key,id,size:s,extras:ex,unit,q:o.q||1});sync();toast(d.n+' adicionado ao carrinho')}

/* ---------- ILUSTRAÇÕES E CARDS ---------- */
const ART={
burger:c=>`<ellipse cx="100" cy="128" rx="62" ry="6" fill="#0006"/><path d="M42 78a58 40 0 0 1 116 0z" fill="#E8A04C"/><g fill="#FFF3DC"><ellipse cx="75" cy="56" rx="4" ry="2"/><ellipse cx="100" cy="46" rx="4" ry="2"/><ellipse cx="124" cy="56" rx="4" ry="2"/><ellipse cx="90" cy="65" rx="4" ry="2"/><ellipse cx="114" cy="66" rx="4" ry="2"/></g><path d="M40 80q10 10 20 0t20 0 20 0 20 0 20 0 20 0v6H40z" fill="#6BBE45"/><path d="M42 86h116l-8 12-12-6-12 8-12-8-12 8-12-8-12 8-12-8z" fill="${c}"/><rect x="40" y="92" width="120" height="14" rx="7" fill="#5A2E1B"/><path d="M42 108q58 8 116 0v6a10 10 0 0 1-10 8H52a10 10 0 0 1-10-8z" fill="#E8A04C"/>`,
pizza:c=>`<circle cx="100" cy="76" r="60" fill="#D9944A"/><circle cx="100" cy="76" r="51" fill="#F6C453"/><g fill="${c}"><circle cx="78" cy="58" r="9"/><circle cx="120" cy="62" r="9"/><circle cx="100" cy="90" r="9"/><circle cx="70" cy="92" r="7"/><circle cx="130" cy="94" r="7"/></g>`,
donut:c=>`<circle cx="100" cy="76" r="58" fill="#D9944A"/><circle cx="100" cy="74" r="52" fill="${c}"/><circle cx="100" cy="74" r="16" fill="#241911"/><g stroke-width="4" stroke-linecap="round"><path d="M70 50l6 3" stroke="#fff"/><path d="M122 46l-5 5" stroke="#3C8DFF"/><path d="M140 80l-6-2" stroke="#F6C453"/><path d="M128 104l-5-4" stroke="#fff"/><path d="M80 104l6-3" stroke="#6BBE45"/><path d="M60 80l6 2" stroke="#F6C453"/><path d="M100 36v7" stroke="#3C8DFF"/></g>`,
bowl:c=>`<path d="M28 72h144a72 56 0 0 1-144 0z" fill="#F4EBDD"/><ellipse cx="100" cy="72" rx="72" ry="13" fill="${c}"/><circle cx="82" cy="70" r="9" fill="#FFF3DC"/><circle cx="82" cy="70" r="4" fill="#F6B53C"/><path d="M100 30q-8 10 0 18M122 26q-8 10 0 18M78 28q-8 10 0 18" stroke="#fff6" stroke-width="3" fill="none" stroke-linecap="round"/>`,
cup:c=>`<path d="M64 42h72l-9 88H73z" fill="${c}"/><rect x="58" y="34" width="84" height="12" rx="6" fill="#FFF3DC"/><rect x="104" y="6" width="8" height="40" rx="3" fill="#FFF3DC" transform="rotate(10 108 26)"/><path d="M76 60l4 56" stroke="#fff5" stroke-width="5" stroke-linecap="round"/>`,
cake:c=>`<ellipse cx="100" cy="130" rx="66" ry="6" fill="#0006"/><rect x="42" y="78" width="116" height="50" rx="8" fill="#5A2E1B"/><rect x="42" y="78" width="116" height="16" rx="8" fill="${c}"/><g fill="#8B5A36"><rect x="62" y="56" width="22" height="22"/><rect x="92" y="48" width="22" height="30"/><rect x="122" y="58" width="22" height="20"/></g>`,
layers:c=>`<ellipse cx="100" cy="130" rx="74" ry="7" fill="#0006"/><rect x="34" y="104" width="132" height="22" rx="6" fill="#E8A04C"/><rect x="34" y="82" width="132" height="22" fill="#B3321C"/><rect x="34" y="62" width="132" height="20" fill="#F2D27A"/><rect x="34" y="42" width="132" height="20" fill="#B3321C"/><path d="M34 42a10 10 0 0 1 10-10h112a10 10 0 0 1 10 10q-10 14-22 4t-22 8-22-6-22 6-22-8-22 8z" fill="${c}"/>`,
loaf:c=>`<ellipse cx="100" cy="128" rx="68" ry="6" fill="#0006"/><rect x="32" y="56" width="136" height="68" rx="34" fill="#D9944A"/><rect x="32" y="56" width="136" height="68" rx="34" fill="${c}" opacity=".45"/><path d="M66 70l12 28M98 66l12 32M130 70l12 28" stroke="#F2C48A" stroke-width="7" stroke-linecap="round"/>`
};
const ARTMAP={lasanha:['layers','#F6C453'],burger:['burger','#F6C453'],ramen:['bowl','#C9822E'],lembas:['loaf','#E8B26A'],mana:['cup','#3C8DFF'],bolo:['cake','#6B3A22'],sand:['loaf','#9BD05A'],donut:['donut','#FF7DB0'],mario:['burger','#E83A2A'],shake:['cup','#FF9EC4'],pix:['pizza','#E5412D'],clap:['bowl','#F6C453']};
const svgPic=d=>`<svg viewBox="0 0 200 150" role="img" aria-label="Ilustração do prato ${d.n}">${ART[ARTMAP[d.id][0]](ARTMAP[d.id][1])}</svg>`;
const pic=d=>d.img?`<img src="${d.img}" alt="Foto do prato ${d.n}" loading="lazy" referrerpolicy="no-referrer" data-fb="${d.id}">`:svgPic(d);
document.addEventListener('error',e=>{const i=e.target;if(i&&i.tagName==='IMG'&&i.dataset.fb){const d=dish(i.dataset.fb);if(d)i.outerHTML=svgPic(d)}},true);

function card(d){return `<article class="card" aria-label="${d.n}"><a class="pic" href="#/dish/${d.id}" tabindex="-1" aria-hidden="true">${pic(d)}</a>
 <div class="uni">${d.cat}</div>
 <div class="head"><h3><a href="#/dish/${d.id}">${d.n}</a></h3><span class="price"><span class="sr">Preço: </span>${money(d.p)}</span></div>
 <p class="desc">${d.u}. ${d.ing}.</p>
 <div class="meta"><span aria-hidden="true">★ ${dec(d.r)} (demo) · ${d.t} min</span><span class="sr">Nota demonstrativa ${dec(d.r)} de 5. Preparo em ${d.t} minutos.</span></div>
 <div class="tags">${d.diet.map(x=>`<span>${x}</span>`).join('')}${d.al.length?`<span class="al">contém: ${d.al.join(', ')}</span>`:''}</div>
 <div class="act"><button class="btn small" data-add="${d.id}" aria-label="Adicionar ${d.n} ao carrinho">Adicionar ao carrinho</button>
 <button class="fav ${favs.includes(d.id)?'on':''}" data-fav="${d.id}" aria-pressed="${favs.includes(d.id)}" aria-label="Favoritar ${d.n}"><span aria-hidden="true">♥</span></button></div></article>`}
const row = (e,t,list,l='#/menu')=>`<section aria-label="${t}"><div class="sh"><div><div class="eyebrow">${e}</div><h2>${t}</h2></div><a class="more" href="${l}" aria-label="Ver todo o cardápio: ${t}">Ver tudo →</a></div><div class="grid">${list.map(card).join('')}</div></section>`;

/* SUGESTÕES DE PRATOS */
const suggList=s=>s.length?`<h2 style="margin-top:40px">Suas sugestões</h2>`+s.map(x=>`<article class="panel" style="max-width:none;margin-bottom:14px"><div class="uni">${esc(x.u)}</div><h3>${esc(x.n)}</h3><p>${esc(x.d)}</p><div class="meta">${esc(x.k)}${x.r?' · '+esc(x.r):''} · ${x.at}</div></article>`).join(''):'';

/* PÁGINAS */
const pages = {
home(){const top=[...D].sort((a,b)=>b.pop-a.pop);
 return `<div class="hero"><div><div class="eyebrow">Sua ficção favorita, servida no prato</div><h1>Onde a <em>fantasia</em> vira sabor</h1>
 <p>Descubra sabores inspirados nos universos que você ama. De clássicos da animação a aventuras dos videogames, sua próxima refeição pode sair diretamente da ficção.</p>
 <div class="row"><a class="btn" href="#/menu">Explorar cardápio</a><a class="btn alt" href="#/quiz">Descobrir meu próximo prato</a></div></div>
 <a class="pic" href="#/dish/lasanha" aria-label="Ver Lasanha do Garfield">${pic(dish('lasanha'))}</a></div>`
 +row('Destaques','Os mais pedidos',top.slice(0,3))+row('Novidades','Novidades da semana',D.slice(-3))
 +row('Comunidade','Favoritos da comunidade',[...D].sort((a,b)=>b.r-a.r).slice(0,3))
 +row('Desenhos','Pratos inspirados em desenhos',D.filter(d=>d.cat==='Desenhos animados'))
 +row('Cinema','Sabores do cinema',D.filter(d=>d.cat==='Filmes e séries'||d.cat==='Edições limitadas'))
 +row('Gamer','Comidas do universo gamer',D.filter(d=>d.cat==='Videogames'||d.cat==='Combos especiais'))
 +`<section><div class="eyebrow">Nossa história</div><h2>A história da Frame</h2><p style="max-width:60ch;color:var(--mu)">A Frame transforma comidas famosas da ficção em experiências gastronômicas reais. Nossa história completa será publicada em breve.</p></section>
 <div class="cta"><h2>Faça parte da Frame</h2><p>Quer colaborar como voluntário em nossas iniciativas?</p><a class="btn" href="#/volunteer">Conhecer o voluntariado</a></div>`},
menu(q){const sel=(id,o)=>`<div><label for="${id}">${o[0]}</label><select id="${id}">${o[1]}</select></div>`;
 return `<h1>Cardápio</h1><form class="filters" role="search" aria-label="Filtrar pratos" onsubmit="return false">
 <div><label for="fq">Buscar prato ou universo</label><input id="fq" type="search" placeholder="Ex.: Garfield, jogos…" autocomplete="off"></div>
 ${sel('fc',['Categoria','<option value="">Todas</option>'+CATS.map(c=>`<option>${c}</option>`).join('')])}
 ${sel('fk',['Tipo','<option value="">Todos</option><option value="salgado">Salgados</option><option value="doce">Doces</option><option value="bebida">Bebidas</option>'])}
 ${sel('fd',['Restrição','<option value="">Nenhuma</option><option>vegetariano</option><option>vegano</option><option>sem lactose</option><option>sem glúten</option>'])}
 ${sel('fp',['Preço máximo','<option value="999">Qualquer</option><option value="20">Até R$ 20</option><option value="35">Até R$ 35</option><option value="45">Até R$ 45</option>'])}
 ${sel('fo',['Ordenar','<option value="pop">Popularidade</option><option value="r">Avaliação</option><option value="pa">Menor preço</option>'])}</form>
 <p><label style="display:inline-flex;gap:12px;align-items:center;text-transform:none;letter-spacing:0;font:400 1rem var(--sans)"><input type="checkbox" id="ff"> Mostrar só favoritos</label></p>
 <p class="meta" id="count" role="status" aria-live="polite"></p>
 <div class="grid" id="list"></div>`},
dish(id){const d=dish(id);if(!d)return pages.nf();
 return `<p><a href="#/menu">← Voltar ao cardápio</a></p><div class="split"><div class="big"><div class="pic">${pic(d)}</div></div><div>
 <h1>${d.n}</h1><p>${d.u}</p><p><strong>Curiosidade:</strong> ${d.cur}</p><p><strong>Ingredientes:</strong> ${d.ing}.</p>
 <div class="tags">${d.diet.map(x=>`<span>${x}</span>`).join('')}<span class="al">Alergênicos: ${d.al.join(', ')||'nenhum declarado'}</span></div>
 <p class="notice">Não garantimos ausência de contaminação cruzada. Confirme com o estabelecimento em caso de alergia grave.</p>
 <div class="field"><label for="sz">Tamanho</label><select id="sz"><option value="P">Pequeno</option><option value="M" selected>Médio</option><option value="G">Grande</option></select></div>
 <fieldset class="opts field"><legend><strong>Personalizar</strong></legend>${Object.entries(EXTRA).map(([k,v])=>`<label><input type="checkbox" value="${k}" class="ex"> ${k} (+${money(v)})</label>`).join('')}</fieldset>
 <div class="field"><label for="qt">Quantidade</label><input id="qt" type="number" min="1" max="20" value="1" inputmode="numeric"></div>
 <p>Total: <span class="price" id="tot" aria-live="polite"></span></p><button class="btn" id="addbtn">Adicionar ao carrinho</button>
 <h2 style="font-size:1.8rem;margin-top:28px">Avaliações</h2><p class="notice">Avaliações reais só aparecem após compras confirmadas e moderação. Nota demonstrativa: ★ ${dec(d.r)} de 5.</p>
 <h2 style="font-size:1.8rem">Combina com</h2><div class="grid">${D.filter(x=>x.k!==d.k&&x.id!==id).slice(0,2).map(card).join('')}</div></div></div>`},
quiz(){return `<h1>Qual universo combina com sua fome?</h1><form class="panel" id="qz" novalidate>
 <div class="field"><label for="q1">Entretenimento favorito</label><select id="q1"><option value="">Tanto faz</option>${CATS.slice(0,4).map(c=>`<option>${c}</option>`).join('')}</select></div>
 <div class="field"><label for="q2">Prefere</label><select id="q2"><option value="">Qualquer coisa</option><option value="doce">Doces</option><option value="salgado">Salgados</option><option value="bebida">Bebidas</option></select></div>
 <div class="field"><label for="q3">Faixa de preço</label><select id="q3"><option value="999">Qualquer</option><option value="25">Até R$ 25</option><option value="40">Até R$ 40</option></select></div>
 <div class="field"><label for="q4">Restrição alimentar</label><select id="q4"><option value="">Nenhuma</option><option>vegetariano</option><option>vegano</option><option>sem lactose</option><option>sem glúten</option></select></div>
 <div class="field"><label for="q5">Clássicos ou novidades?</label><select id="q5"><option value="pop">Clássicos nostálgicos</option><option value="new">Novidades</option></select></div>
 <div class="act"><button class="btn" type="submit">Ver recomendações</button> <button class="btn alt" type="button" id="surp">Surpreenda-me</button></div></form><div id="res" tabindex="-1"></div>`},
suggest(){return `<div class="eyebrow">Participe do cardápio</div><h1>Sugira um prato</h1>
 <p style="max-width:60ch;color:var(--mu)">Tem um prato da ficção que gostaria de ver no cardápio? Conte para a gente!</p>
 <form class="panel" id="sf" novalidate>
 <div class="field"><label for="sn">Nome do prato <span class="req">(obrigatório)</span></label><input id="sn" required aria-required="true"></div>
 <div class="field"><label for="su">Universo de inspiração <span class="req">(obrigatório)</span></label><input id="su" placeholder="Ex.: desenho, filme, jogo…" required aria-required="true"></div>
 <div class="field"><label for="sk">Tipo</label><select id="sk"><option value="salgado">Salgado</option><option value="doce">Doce</option><option value="bebida">Bebida</option></select></div>
 <div class="field"><label for="sd">Descrição e ingredientes <span class="req">(obrigatório)</span></label><textarea id="sd" rows="4" required aria-required="true"></textarea></div>
 <div class="field"><label for="sr">Restrição alimentar (opcional)</label><select id="sr"><option value="">Nenhuma</option><option>vegetariano</option><option>vegano</option><option>sem lactose</option><option>sem glúten</option></select></div>
 <div class="err" id="serr" role="alert"></div>
 <button class="btn" type="submit">Enviar sugestão</button>
 <p class="notice">Demonstração: a sugestão fica salva só neste navegador e nada é enviado à empresa.</p></form>
 <div id="slist">${suggList(load('frame_sugg',[]))}</div>`},
orders(){if(!user)return `<div class="empty"><div class="e" aria-hidden="true">🎟️</div><h1>Meus pedidos</h1><p>Entre ou cadastre-se para ver seus pedidos e pedir novamente.</p><a class="btn" href="#/login">Entrar ou cadastrar-se</a></div>`;
 const all=[...orders,...SAMPLE];
 return `<div class="sh"><div><div class="eyebrow">Histórico (demonstração)</div><h1>Meus pedidos</h1></div></div>`+all.map((o,x)=>{const done=o.status==='Concluído';return `<article class="panel" style="max-width:none;margin-bottom:20px" aria-label="Pedido ${o.num}"><div class="head" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><div><div class="uni">${o.num}</div><div class="meta">${o.at} · ${o.mode==='entrega'?'Entrega':'Retirada'} · ${o.pay}</div></div><strong>${done?'<span aria-hidden="true">✔ </span>':''}${o.status}</strong></div>
 ${o.items.map(i=>`<div class="row-line"><span>${i.q}× ${dish(i.id).n} <small>(${i.size}${i.extras.length?', '+i.extras.join(', '):''})</small></span><span>${money(i.unit*i.q)}</span></div>`).join('')}
 <div class="row-line"><strong>Total</strong><strong class="price">${money(otot(o))}</strong></div>
 ${done?'':tl(['Pedido recebido','Pedido confirmado','Em preparação','Pronto / enviado','Concluído'],2)}
 <div class="act"><button class="btn small" data-again="${x}">Pedir novamente</button><button class="btn small alt" data-rate="1">Avaliar pratos</button></div></article>`}).join('')},
login(){return `<h1>Entrar ou cadastrar</h1><form class="panel" id="lg" novalidate><div class="field"><label for="ln">Nome</label><input id="ln" autocomplete="name"></div>
 <div class="field"><label for="le">E-mail <span class="req">(obrigatório)</span></label><input id="le" type="email" autocomplete="email" required aria-required="true" aria-describedby="le-err"><div class="err" id="le-err"></div></div>
 <div class="field"><label for="ls">Senha, mínimo 8 caracteres <span class="req">(obrigatório)</span></label><input id="ls" type="password" autocomplete="new-password" required aria-required="true" aria-describedby="ls-err"><div class="err" id="ls-err"></div></div>
 <div class="act"><button class="btn" type="submit">Continuar</button> <button class="btn alt" type="button" id="forgot">Esqueci a senha</button></div>
 <p class="notice">Demonstração: a conta fica salva só neste navegador e a senha não é armazenada. Visitantes podem comprar sem conta.</p></form>`},
profile(){if(!user)return pages.login();return `<div class="eyebrow">Conta de demonstração</div><h1>Olá, ${esc(user.name.split(' ')[0])}</h1><form class="panel" id="pf" novalidate>
 <div class="field"><label for="pn">Nome</label><input id="pn" value="${esc(user.name)}" autocomplete="name"></div>
 <div class="field"><label for="pe">E-mail</label><input id="pe" type="email" value="${esc(user.email)}" autocomplete="email"></div>
 <div class="field"><label for="pa">Endereço salvo</label><input id="pa" value="${esc(user.addr||'')}" placeholder="Rua, número, bairro, cidade" autocomplete="street-address"></div>
 <div class="field"><label for="pd">Preferência alimentar</label><select id="pd">${['Nenhuma','vegetariano','vegano','sem lactose','sem glúten'].map(x=>`<option ${user.diet===x?'selected':''}>${x}</option>`).join('')}</select></div>
 <div class="field"><label for="pt">Entretenimento favorito</label><select id="pt">${['Desenhos animados','Filmes e séries','Videogames','Animes'].map(x=>`<option ${user.ent===x?'selected':''}>${x}</option>`).join('')}</select></div>
 <p><a href="#/menu?fav=1"><span aria-hidden="true">♥ </span>${favs.length} favoritos</a> · <a href="#/orders">Ver meus pedidos</a></p>
 <div class="act"><button class="btn" type="submit">Salvar dados</button> <button class="btn alt" type="button" id="logout">Sair</button></div></form>`},
volunteer(){return `<h1>Faça parte da Frame</h1><p style="max-width:60ch">Voluntariado é participação sem remuneração e não configura emprego. Vagas profissionais, se existirem, ficarão em área separada.</p>
 <section aria-label="Como funciona"><h2>Como funciona</h2><p style="max-width:60ch;color:var(--mu)">Missão, iniciativas sociais apoiadas, requisitos e etapas de seleção: <em>a preencher pela empresa.</em></p></section>
 <form class="panel" id="vf" novalidate aria-label="Inscrição de voluntariado">
 <div class="field"><label for="vn">Nome completo <span class="req">(obrigatório)</span></label><input id="vn" required aria-required="true" autocomplete="name"></div>
 <div class="field"><label for="ve">E-mail <span class="req">(obrigatório)</span></label><input id="ve" type="email" required aria-required="true" autocomplete="email"></div>
 <div class="field"><label for="va">Idade <span class="req">(obrigatório)</span></label><select id="va" required aria-required="true"><option value="">Selecione</option><option>Tenho 18 anos ou mais</option><option>Tenho menos de 18 anos</option></select></div>
 <div class="field"><label for="vc">Cidade e estado <span class="req">(obrigatório)</span></label><input id="vc" required aria-required="true" autocomplete="address-level2"></div>
 <div class="field"><label for="vs">Habilidades e experiências</label><textarea id="vs" rows="3"></textarea></div>
 <div class="field"><label for="vd">Disponibilidade (dias e horários) <span class="req">(obrigatório)</span></label><input id="vd" required aria-required="true"></div>
 <div class="field"><label for="vm">Motivação <span class="req">(obrigatório)</span></label><textarea id="vm" rows="3" required aria-required="true"></textarea></div>
 <div class="field"><label for="vx">Informações adicionais (opcional)</label><textarea id="vx" rows="2"></textarea></div>
 <label style="font:400 1rem var(--sans);text-transform:none;letter-spacing:0;display:flex;gap:12px;align-items:flex-start"><input type="checkbox" id="vk" required aria-required="true"> <span>Autorizo o tratamento dos meus dados para esta candidatura (LGPD). <span class="req">(obrigatório)</span></span></label>
 <div class="err" id="verr" role="alert"></div><button class="btn" type="submit">Enviar inscrição</button></form>`},
cart(){if(!cart.length)return `<div class="empty"><div class="e" aria-hidden="true">🛒</div><h1>Carrinho vazio</h1><p>Escolha um prato para começar.</p><a class="btn" href="#/menu">Ver cardápio</a></div>`;
 const sub=cart.reduce((a,i)=>a+i.unit*i.q,0);
 return `<h1>Carrinho</h1><div class="split"><div>${cart.map((i,x)=>{const n=dish(i.id).n;return `<div class="row-line"><div><strong>${n}</strong><br><small>Tamanho ${i.size}${i.extras.length?' · '+i.extras.join(', '):''}</small></div>
 <div class="qty" role="group" aria-label="Quantidade de ${n}"><button data-q="${x}" data-d="-1" aria-label="Diminuir quantidade de ${n}"><span aria-hidden="true">−</span></button> <span aria-label="${i.q} unidades">${i.q}</span> <button data-q="${x}" data-d="1" aria-label="Aumentar quantidade de ${n}"><span aria-hidden="true">+</span></button></div><span>${money(i.unit*i.q)}</span><button class="fav" data-rm="${x}" aria-label="Remover ${n} do carrinho"><span aria-hidden="true">✕</span></button></div>`}).join('')}</div>
 <form class="panel" id="co" novalidate aria-label="Finalizar pedido"><h2>Finalizar</h2><div class="field"><label for="cm">Receber</label><select id="cm"><option value="entrega">Entrega</option><option value="retirada">Retirada</option></select></div>
 <div class="field" id="adf"><label for="ad">Endereço de entrega <span class="req">(obrigatório para entrega)</span></label><input id="ad" autocomplete="street-address" aria-describedby="ad-err"><div class="err" id="ad-err"></div></div>
 <div class="field"><label for="cp">Cupom (opcional)</label><input id="cp" placeholder="Demo: FRAME10" autocomplete="off" aria-describedby="cp-err"><div class="err" id="cp-err"></div></div>
 <div class="field"><label for="pg">Pagamento</label><select id="pg"><option>Pix</option><option>Cartão</option><option>Dinheiro na retirada</option></select></div>
 <p>Subtotal: ${money(sub)}<br>Taxa de entrega: a definir<br><strong>Total estimado: ${money(sub)}</strong></p>
 <p class="notice">Demonstração: ao finalizar, nada é enviado nem cobrado.</p><button class="btn" type="submit">Finalizar pedido (demo)</button></form></div>`},
info(k){const t={faq:'Perguntas frequentes',privacidade:'Política de privacidade',termos:'Termos de uso',entrega:'Entrega e cancelamento'}[k]||'Informações';return `<h1>${t}</h1><p class="notice">Texto a ser fornecido e revisado pela empresa (inclusive aspectos da LGPD).</p>`},
nf(){return `<div class="empty"><div class="e" aria-hidden="true">🎬</div><h1>Cena não encontrada</h1><p>Essa página não existe.</p><a class="btn" href="#/">Voltar ao início</a></div>`}
};

function confirmation(o){const sub=o.items.reduce((a,i)=>a+i.unit*i.q,0),last=o.mode==='entrega'?'Enviado para entrega':'Pronto para retirada';
 return `<section aria-label="Pedido confirmado"><div class="eyebrow">Pedido de demonstração</div><h1>Pedido confirmado!</h1>
 <p class="notice">Esta é só uma demonstração de como ficaria a tela. Nenhum pedido foi enviado e nenhum pagamento foi cobrado.</p>
 <div class="split"><div class="panel"><h2 style="font-size:1.8rem">Resumo</h2><p class="meta">Nº ${o.num} · ${o.at}</p>
 ${o.items.map(i=>`<div class="row-line"><span>${i.q}× ${dish(i.id).n} <small>(${i.size}${i.extras.length?', '+i.extras.join(', '):''})</small></span><span>${money(i.unit*i.q)}</span></div>`).join('')}
 ${o.cupom?`<div class="row-line"><span>Cupom FRAME10</span><span>− ${money(sub*.1)}</span></div>`:''}
 <div class="row-line"><strong>Total</strong><strong class="price">${money(otot(o))}</strong></div>
 <p>${o.mode==='entrega'?'Entrega em: '+esc(o.ad):'Retirada no local'}<br>Pagamento: ${o.pay}</p></div>
 <div class="panel"><h2 style="font-size:1.8rem">Acompanhe seu pedido</h2>${tl(['Pedido recebido','Pedido confirmado','Em preparação',last,'Pedido concluído'],2)}
 <p class="meta">Linha do tempo ilustrativa.</p></div></div>
 <div class="act" style="margin-top:24px"><a class="btn" href="#/orders">Ver meus pedidos</a><a class="btn alt" href="#/menu">Voltar ao cardápio</a></div></section>`}

/* ---------- ROTEADOR (com foco, título e preservação de posição) ---------- */
const TITLES={home:'Início',menu:'Cardápio',quiz:'Recomendações',suggest:'Sugerir prato',orders:'Meus pedidos',volunteer:'Trabalho voluntário',cart:'Carrinho',login:'Entrar',profile:'Minha conta',info:'Informações'};
let firstRoute=true;
function sig(el){const d=(el&&el.dataset)||{};if(d.fav!=null)return `[data-fav="${d.fav}"]`;if(d.rm!=null)return `[data-rm="${d.rm}"]`;if(d.q!=null)return `[data-q="${d.q}"][data-d="${d.d}"]`;return ''}
function route(keep){
 stopSpeak();closeNav();
 const [path,qs]=location.hash.slice(2).split('?'),[p,a]=path.split('/'),q=new URLSearchParams(qs||'');
 let vals,sel,sy;
 if(keep===true){vals={};app.querySelectorAll('input[id],select[id],textarea[id]').forEach(e=>vals[e.id]=e.type==='checkbox'?e.checked:e.value);sel=sig(document.activeElement);sy=scrollY}
 const fn=pages[p||'home']||pages.nf;app.innerHTML=fn(a||q);
 document.querySelectorAll('nav[aria-label="Principal"] a').forEach(l=>{const on=l.getAttribute('href')==='#/'+(p||'');on?l.setAttribute('aria-current','page'):l.removeAttribute('aria-current')});
 document.title=((p==='dish'&&dish(a)?dish(a).n:TITLES[p||'home']||'Página não encontrada'))+' | Frame';
 if(p==='menu')initMenu(q);if(p==='dish')initDish(a);if(p==='quiz')initQuiz();if(p==='suggest')initSuggest();if(p==='volunteer')initVol();if(p==='login')initLogin();if(p==='cart')initCart();if(p==='profile')initProfile();sync();
 const h=app.querySelector('h1');
 if(keep===true){
  Object.entries(vals).forEach(([id,v])=>{const e=document.getElementById(id);if(!e)return;e.type==='checkbox'?e.checked=v:e.value=v});
  const cm=$('#cm');if(cm)cm.dispatchEvent(new Event('change'));
  scrollTo(0,sy);const el=sel&&$(sel);(el||h||app).focus({preventScroll:true})
 }else{
  scrollTo(0,0);
  if(!firstRoute&&h){h.tabIndex=-1;h.focus({preventScroll:true})}
 }
 firstRoute=false}
function initMenu(q){const g=id=>$('#'+id);if(q.get('fav'))g('ff').checked=true;if(q.get('focus'))g('fq').focus();
 const go=window.menuGo=()=>{const s=g('fq').value.toLowerCase();let l=D.filter(d=>(d.n+d.u+d.cat).toLowerCase().includes(s)&&(!g('fc').value||d.cat===g('fc').value)&&(!g('fk').value||d.k===g('fk').value)&&(!g('fd').value||d.diet.includes(g('fd').value))&&d.p<=+g('fp').value&&(!g('ff').checked||favs.includes(d.id)));
  const o=g('fo').value;l.sort((a,b)=>o==='pa'?a.p-b.p:b[o]-a[o]);
  g('list').innerHTML=l.length?l.map(card).join(''):`<div class="empty" style="grid-column:1/-1"><div class="e" aria-hidden="true">🔎</div><p>Nenhum prato encontrado. Tente remover um filtro.</p></div>`;
  g('count').textContent=l.length?`${l.length} ${l.length===1?'prato encontrado':'pratos encontrados'}.`:'Nenhum prato encontrado.'};
 app.querySelectorAll('.filters input,.filters select,#ff').forEach(e=>e.addEventListener('input',go));go()}
function initDish(id){const d=dish(id);if(!d)return;const calc=()=>{const ex=[...app.querySelectorAll('.ex:checked')].map(x=>x.value);
  $('#tot').textContent=money((d.p*SIZE[$('#sz').value]+ex.reduce((a,x)=>a+EXTRA[x],0))*Math.max(1,+$('#qt').value||1));return ex};
 app.querySelectorAll('#sz,#qt,.ex').forEach(e=>e.addEventListener('input',calc));calc();
 $('#addbtn').onclick=()=>add(id,{size:$('#sz').value,extras:calc(),q:Math.max(1,+$('#qt').value||1)})}
function recommend(all){const v=n=>$('#'+n).value,e=v('q4');
 let l=D.filter(d=>d.p<=+v('q3')&&(!e||d.diet.includes(e)));
 l=l.map(d=>({d,s:(v('q1')&&d.cat===v('q1')?3:0)+(v('q2')&&d.k===v('q2')?3:0)+(v('q5')==='pop'?d.pop/50:(D.indexOf(d)>7?2:0)),why:[v('q1')&&d.cat===v('q1')?'combina com seu universo favorito':'',v('q2')&&d.k===v('q2')?'é do tipo que você prefere':'',e?'atende à restrição: '+e:'','cabe no seu orçamento'].filter(Boolean).join(', ')}));
 return l.sort((a,b)=>b.s-a.s)}
function initQuiz(){const show=l=>{$('#res').innerHTML=l.length?`<h2 style="margin-top:32px">Para você</h2><div class="grid">${l.map(x=>card(x.d)+`<p class="uni" style="margin-top:-12px">Por quê: ${x.why}.</p>`).join('')}</div>`:`<div class="empty"><p>Nada no cardápio atende a todos os critérios. Tente ampliar a faixa de preço.</p></div>`;
  $('#res').focus({preventScroll:false})};
 $('#qz').onsubmit=e=>{e.preventDefault();show(recommend().slice(0,3))};
 $('#surp').onclick=()=>{const l=recommend();show(l.length?[l[Math.floor(Math.random()*l.length)]]:[])}}
function initSuggest(){$('#sf').onsubmit=e=>{e.preventDefault();const v=id=>$('#'+id).value.trim();
 const miss=['sn','su','sd'].find(i=>!v(i));
 if(miss){$('#serr').textContent='Preencha nome, universo e descrição.';$('#'+miss).focus();return}
 const s=load('frame_sugg',[]);s.unshift({n:v('sn'),u:v('su'),k:v('sk'),d:v('sd'),r:v('sr'),at:new Date().toLocaleString('pt-BR')});
 save('frame_sugg',s);$('#sf').reset();$('#serr').textContent='';$('#slist').innerHTML=suggList(s);toast('Sugestão registrada (demonstração). Obrigado!')}}
function initVol(){$('#vf').onsubmit=e=>{e.preventDefault();const miss=[...$('#vf').querySelectorAll('[required]')].filter(x=>x.type==='checkbox'?!x.checked:!x.value.trim());
 miss.forEach(x=>x.setAttribute('aria-invalid','true'));[...$('#vf').querySelectorAll('[required]')].filter(x=>!miss.includes(x)).forEach(x=>x.removeAttribute('aria-invalid'));
 if(miss.length){$('#verr').textContent='Preencha os campos obrigatórios e aceite o consentimento.';miss[0].focus();return}
 if($('#va').value.includes('menos')){$('#verr').textContent='Esta iniciativa exige maioridade, salvo definição diferente pela empresa.';$('#va').setAttribute('aria-invalid','true');$('#va').focus();return}
 $('#vf').outerHTML=`<div class="panel" id="vdone" tabindex="-1"><div class="eyebrow">Demonstração</div><h2>Inscrição enviada!</h2><p>Obrigado, ${esc($('#vn').value.split(' ')[0])}! Recebemos sua inscrição de voluntariado.</p>
 <h3>Próximos passos</h3>${tl(['Inscrição recebida','Análise do perfil','Contato por e-mail','Conversa de alinhamento'],1)}<p class="notice">Tela ilustrativa: nenhum dado foi enviado ou salvo.</p><a class="btn" href="#/">Voltar ao início</a></div>`;
 const dn=$('#vdone');dn.focus();dn.scrollIntoView()}}
function initLogin(){$('#lg').onsubmit=e=>{e.preventDefault();const em=/^\S+@\S+\.\S+$/.test($('#le').value),pw=$('#ls').value.length>=8;
 setErr('le',em?'':'Informe um e-mail válido, por exemplo nome@email.com.');setErr('ls',pw?'':'A senha precisa ter ao menos 8 caracteres.');
 if(!em){$('#le').focus();return}if(!pw){$('#ls').focus();return}
 const email=$('#le').value.trim();user={name:$('#ln').value.trim()||email.split('@')[0],email};save('frame_user',user);toast('Bem-vindo(a)! Conta de demonstração criada.');sync();location.hash='#/profile'};
 $('#forgot').onclick=()=>toast('Demonstração: e-mail de recuperação enviado.')}
function initProfile(){if(!$('#pf'))return;$('#pf').onsubmit=e=>{e.preventDefault();user={...user,name:$('#pn').value||user.name,email:$('#pe').value||user.email,addr:$('#pa').value,diet:$('#pd').value,ent:$('#pt').value};save('frame_user',user);sync();toast('Dados salvos (demonstração).')};
 $('#logout').onclick=()=>{user=null;save('frame_user',null);sync();toast('Você saiu.');location.hash='#/'}}
function initCart(){const c=$('#co');if(!c)return;const ad=()=>$('#adf').style.display=$('#cm').value==='entrega'?'':'none';$('#cm').onchange=ad;ad();
 c.onsubmit=e=>{e.preventDefault();const cp=$('#cp').value.trim().toUpperCase();
 const mode=$('#cm').value,addr=$('#ad').value.trim();
 const badCp=cp&&cp!=='FRAME10',badAd=mode==='entrega'&&!addr;
 setErr('cp',badCp?'Cupom inválido. Na demonstração, use FRAME10 (10% de desconto).':'');setErr('ad',badAd?'Informe o endereço de entrega.':'');
 if(badAd){$('#ad').focus();return}if(badCp){$('#cp').focus();return}
 const o={num:'DEMO-'+Math.floor(1000+Math.random()*9000),mode,ad:addr,pay:$('#pg').value,cupom:cp==='FRAME10',status:'Pedido confirmado',items:cart.map(i=>({...i})),at:new Date().toLocaleString('pt-BR')};
 orders.unshift(o);save('frame_orders',orders);cart=[];sync();app.innerHTML=confirmation(o);document.title='Pedido confirmado | Frame';scrollTo(0,0);const h=app.querySelector('h1');h.tabIndex=-1;h.focus();toast('Pedido de demonstração confirmado.')}}

/* ---------- EVENTOS GLOBAIS ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-add],[data-fav],[data-q],[data-rm]');
 if(t){
  if(t.dataset.add)add(t.dataset.add);
  if(t.dataset.fav)toggleFav(t.dataset.fav);
  if(t.dataset.q){const i=cart[t.dataset.q];i.q+=+t.dataset.d;const n=dish(i.id).n,q=i.q;if(i.q<1)cart.splice(t.dataset.q,1);sync();route(true);toast(q<1?`${n} removido do carrinho`:`${n}: ${q} ${q===1?'unidade':'unidades'}`)}
  if(t.dataset.rm){const n=dish(cart[t.dataset.rm].id).n;cart.splice(t.dataset.rm,1);sync();route(true);toast(n+' removido do carrinho')}
  return}
 const a=e.target.closest('[data-again],[data-rate]');
 if(a){if(a.dataset.rate)return toast('Demonstração: avaliação registrada. Obrigado!');const o=[...orders,...SAMPLE][+a.dataset.again];o.items.forEach(i=>{const f=cart.find(c=>c.key===i.key||(c.id===i.id&&c.size===i.size&&c.extras.join()===i.extras.join()));f?f.q+=i.q:cart.push({key:i.id+i.size+i.extras.join(),id:i.id,size:i.size,extras:i.extras,unit:i.unit,q:i.q})});sync();toast('Itens adicionados ao carrinho');location.hash='#/cart';return}
 const b=e.target.closest('[data-a11y]');
 if(b){const k=b.dataset.a11y;
  if(k==='fs+')A.fs=Math.min(1.75,+(A.fs+.15).toFixed(2));
  else if(k==='fs-')A.fs=Math.max(.9,+(A.fs-.15).toFixed(2));
  else if(k==='fs0')A.fs=1;
  else if(k==='tts'){speak();return}
  else if(k==='reset'){A={...SDEF};stopSpeak();toast('Configurações de acessibilidade restauradas.')}
  else A[k]=A[k]?0:1;
  applyA11y()}});
$('#a11yBtn').onclick=()=>{const p=$('#a11y'),open=p.hidden;p.hidden=!open;$('#a11yBtn').setAttribute('aria-expanded',open);if(open)p.querySelector('button').focus()};
$('#burger').onclick=()=>{const o=$('#nav').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o);$('#burger').setAttribute('aria-label',o?'Fechar menu':'Abrir menu')};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePanel(true);closeNav();stopSpeak()}});
applyA11y();
addEventListener('hashchange',()=>route());route();