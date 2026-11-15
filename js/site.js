(function(){
/* a new page always opens at its top, or at the section named in the address */
try{history.scrollRestoration='manual'}catch(e){}
function place(){var h=location.hash.slice(1),t=h&&document.getElementById(h);if(t){t.scrollIntoView()}else{window.scrollTo(0,0)}}
place();window.addEventListener('load',place);window.addEventListener('pageshow',place);
var CFG=window.SITE||{};
var T=window.COMMON_T,PT=window.PT||{};
['en','pt','fr'].forEach(function(l){T[l]=T[l]||{};var p=PT[l]||{};for(var k in p)T[l][k]=p[k]});
var Q=function(s){return [].slice.call(document.querySelectorAll(s))};
var nodes=Q('[data-k]'),imgs=Q('[data-alt]'),tags=Q('[data-t]'),phs=Q('[data-ph]');
nodes.forEach(function(n){if(T.en[n.dataset.k]==null)T.en[n.dataset.k]=n.innerHTML});
imgs.forEach(function(n){T.en[n.dataset.alt]=n.alt});
var lang='en';
function tr(k){return T[lang][k]!=null?T[lang][k]:T.en[k]}

function years(){Q('[data-year]').forEach(function(n){n.textContent=new Date().getFullYear()});Q('[data-since]').forEach(function(n){n.textContent=Math.floor((Date.now()-new Date(+n.dataset.since,0,1))/31557600000)})}
function nums(){Q('[data-num]').forEach(function(n){n.textContent=(+n.dataset.num).toLocaleString(lang==='pt'?'pt-BR':lang==='fr'?'fr-FR':'en-US')})}

function draw(){
  var el=document.getElementById('scope');if(!el)return;
  var W=1100,H=214,x0=92,x1=1084,ya=2006,yb=Math.max(2029,new Date().getFullYear()+2);
  var X=function(y){return x0+(y-ya)/(yb-ya)*(x1-x0)};
  var now=new Date(),ny=Math.min(now.getFullYear()+now.getMonth()/12,yb-.4);
  var s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  var lab=function(y,k){return '<text x="12" y="'+y+'" fill="#9FB7AA" font-size="13" font-weight="600">'+tr(k)+'</text>'};
  var d='M'+x0+' 44';
  for(var y=ya;y<yb;y++){d+='V22H'+X(y+.5)+'V44H'+X(y+1);
    s+='<line x1="'+X(y)+'" y1="50" x2="'+X(y)+'" y2="'+(H-8)+'" stroke="#1E5444" stroke-width="1" stroke-dasharray="2 5"/>';
    if(y%2===0&&(yb-ya<26||y%4===2))s+='<text x="'+(X(y)+3)+'" y="14" fill="#9FB7AA" font-size="12" font-weight="500">'+y+'</text>';}
  s+='<path d="'+d+'" fill="none" stroke="#6FA48E" stroke-width="1.6"/>'+lab(38,'lane_year');
  var bus=function(yt,segs,fill,stroke,ink){
    var ym=yt+18,yB=yt+36,o='',prev=ya;
    segs.forEach(function(g){
      var a=X(g[0]),open=g[1]>=yb,b=X(open?yb:g[1]),k=7;
      if(g[0]>prev)o+='<line x1="'+X(prev)+'" y1="'+ym+'" x2="'+a+'" y2="'+ym+'" stroke="'+stroke+'" stroke-width="1.6"/>';
      var pts=open?[[a,ym],[a+k,yt],[b,yt],[b,yB],[a+k,yB]]:[[a,ym],[a+k,yt],[b-k,yt],[b,ym],[b-k,yB],[a+k,yB]];
      o+='<polygon points="'+pts.map(function(p){return p.join(',')}).join(' ')+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.6" stroke-linejoin="round"/>';
      o+='<text x="'+((a+b)/2)+'" y="'+(ym+4.5)+'" text-anchor="middle" fill="'+ink+'" font-size="13" font-weight="650">'+tr(g[2])+'</text>';
      prev=g[1];
    });
    if(prev<yb)o+='<line x1="'+X(prev)+'" y1="'+ym+'" x2="'+x1+'" y2="'+ym+'" stroke="'+stroke+'" stroke-width="1.6"/>';
    return o;
  };
  s+=lab(98,'lane_study')+bus(76,[[2006,2012,'b_bsc'],[2012,2016,'b_msc'],[2016,2022,'b_phd']],'#3A2E17','#E0A552','#F6DDB4');
  s+=lab(162,'lane_work')+bus(140,[[2008,2011.5,'b_plc'],[2011.5,2020,'b_l1'],[2020,2023,'b_lar'],[2023,2026.5,'b_bnl'],[2026.5,yb,'b_net']],'#14573F','#7FD0AE','#E6F5EE');
  s+='<line x1="'+X(ny)+'" y1="18" x2="'+X(ny)+'" y2="'+(H-4)+'" stroke="#E0A552" stroke-width="2"/><circle cx="'+X(ny)+'" cy="18" r="4" fill="#E0A552"/>';
  el.innerHTML=s+'</svg>';el.setAttribute('aria-label',tr('scope_aria'));
}

/* family tree */
var branch='mm';
function tree(){
  var host=document.getElementById('tree');if(!host||!window.TREE)return;
  var TT=window.TREE_T[lang],bb=document.getElementById('branches');
  bb.innerHTML='';
  ['pf','pm','mf','mm'].forEach(function(k){var b=document.createElement('button');b.type='button';b.textContent=TT.br[k];b.setAttribute('aria-pressed',String(k===branch));b.onclick=function(){branch=k;tree()};bb.appendChild(b)});
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function node(n,depth,role,pit){
    var has=n.f||n.m,it=pit||/Dammiano|Fiorenzano|Schettino|Ruggiero|Mazzeo|Altieri|Faraco/.test(n.n)||/Italia/.test(n.bp||'');
    var meta=[];if(n.b||n.bp)meta.push('* '+[n.b,n.bp].filter(Boolean).join(', '));if(n.d||n.dp)meta.push('† '+[n.d,n.dp].filter(Boolean).join(', '));if(n.x&&n.x.length)meta.push('⚭ '+n.x.join(', '));if(n.t)meta.push(n.t);if(n.r)meta.push('\u21B1 '+TT.rep);
    var h='<div class="tnode'+(has&&depth>=3?' closed':'')+'"><button type="button" class="person'+(has?' has':'')+(it?' it':'')+(n.p?' pic':'')+'"'+(has?' aria-expanded="'+(depth<3)+'"':'')+'>'+(n.p?'<img src="../img/tree/'+n.p+'.jpg" alt="" width="56" height="56" loading="lazy">':'')+'<b>'+esc(n.n)+'</b><small>'+(role?esc(role)+(meta.length?' · ':''):'')+esc(meta.join(' · '))+'</small></button>';
    if(has){h+='<div class="parents">'+(n.f?node(n.f,depth+1,TT.father,it):'')+(n.m?node(n.m,depth+1,TT.mother,it):'')+'</div>'}
    return h+'</div>';
  }
  host.innerHTML=node(window.TREE[branch],0,'');
  Q('#tree .person.has').forEach(function(b){b.onclick=function(){var c=b.parentNode.classList.toggle('closed');b.setAttribute('aria-expanded',String(!c))}});
}

function setLang(l,save){
  if(!T[l])l='en';lang=l;
  nodes.forEach(function(n){var v=tr(n.dataset.k);if(v!=null)n.innerHTML=v});
  imgs.forEach(function(n){var v=tr(n.dataset.alt);if(v!=null)n.alt=v});
  tags.forEach(function(n){n.textContent=tr(n.dataset.t)});
  phs.forEach(function(n){n.placeholder=tr(n.dataset.ph)||''});
  document.documentElement.lang=l==='pt'?'pt-BR':l;document.documentElement.dataset.lang=l;
  Q('.lang button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.lang===l))});
  years();nums();draw();tree();
  if(save){try{localStorage.setItem('lang',l)}catch(e){}}
}
Q('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang,true)})});
Q('.depth button').forEach(function(b){b.addEventListener('click',function(){document.body.dataset.depth=b.dataset.depth;try{localStorage.setItem('depth',b.dataset.depth)}catch(e){}Q('.depth button').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.depth===b.dataset.depth))})})});
try{var dp=localStorage.getItem('depth');if(dp==='tech'){document.body.dataset.depth='tech';Q('.depth button').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.depth==='tech'))})}}catch(e){}

/* contact form: posts to the service configured in SITE.formEndpoint */
var form=document.getElementById('cform');
if(form){form.addEventListener('submit',function(ev){
  ev.preventDefault();var st=document.getElementById('fstatus'),btn=form.querySelector('button');
  if(form.elements.website.value)return;               /* honeypot */
  if(!CFG.formEndpoint){st.textContent=tr('f_off');return}
  var fd=new FormData(form);fd.delete('website');for(var k in (CFG.formExtra||{}))fd.append(k,CFG.formExtra[k]);
  btn.disabled=true;st.textContent=tr('f_sending');
  fetch(CFG.formEndpoint,{method:'POST',body:fd,headers:{Accept:'application/json'}})
    .then(function(r){if(!r.ok)throw 0;st.textContent=tr('f_ok');form.reset()})
    .catch(function(){st.textContent=tr('f_err')})
    .then(function(){btn.disabled=false});
})}

/* live paper count from INSPIRE; the number in the page is the fallback */
var np=document.getElementById('npapers');
if(np&&window.fetch){fetch('https://inspirehep.net/api/literature?q=authors.recid%3A1267586&size=1&fields=control_number')
  .then(function(r){return r.json()}).then(function(j){var n=j&&j.hits&&j.hits.total;if(n>700){np.dataset.num=n;nums()}}).catch(function(){})}

var start=null;
try{start=localStorage.getItem('lang')}catch(e){}
if(!start){var n=(navigator.language||'en').slice(0,2).toLowerCase();start=(n==='pt'||n==='fr')?n:'en'}
setLang(start,false);
})();
