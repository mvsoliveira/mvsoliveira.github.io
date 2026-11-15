/* Music page: the chord sheet. Twelve roots x four triads, shown on a two-octave keyboard and played with Web Audio. */
(function(){
var host=document.getElementById('chordsheet');if(!host)return;
var LET=['C','D','E','F','G','A','B'],NAT=[0,2,4,5,7,9,11],ACC={'-2':'♭♭','-1':'♭','0':'','1':'♯','2':'×'};
/* root: [letter index, pitch class] */
var ROOTS=[[0,0],[0,1],[1,2],[2,3],[2,4],[3,5],[3,6],[4,7],[5,8],[5,9],[6,10],[6,11]];
var KINDS=[
 {k:'maj',s:'',iv:[0,4,7],l:{en:'Major',pt:'Maior',fr:'Majeur'}},
 {k:'min',s:'m',iv:[0,3,7],l:{en:'Minor',pt:'Menor',fr:'Mineur'}},
 {k:'dim',s:'°',iv:[0,3,6],l:{en:'Diminished',pt:'Diminuto',fr:'Diminué'}},
 {k:'aug',s:'+',iv:[0,4,8],l:{en:'Augmented',pt:'Aumentado',fr:'Augmenté'}}];
function spell(li,pc){var d=((pc-NAT[li%7])%12+12)%12;if(d>6)d-=12;return LET[li%7]+ACC[d]}
function chord(r,q){var li=ROOTS[r][0],pc=ROOTS[r][1],iv=KINDS[q].iv;
  return {name:spell(li,pc)+KINDS[q].s,keys:iv.map(function(i){return pc+i}),notes:[spell(li,pc),spell(li+2,pc+iv[1]),spell(li+4,pc+iv[2])]}}
function tri(l){return ['en','pt','fr'].map(function(x){return '<span data-l="'+x+'">'+l[x]+'</span>'}).join('')}

/* keyboard: 24 keys from C */
var WW=30,WH=112,BW=18,BH=70,svg='<svg class="kb" viewBox="0 0 '+(14*WW)+' '+WH+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">',blk='';
for(var n=0,w=0;n<24;n++){var pc=n%12;
  if(NAT.indexOf(pc)>=0){svg+='<rect class="wk" data-n="'+n+'" x="'+(w*WW+.5)+'" y=".5" width="'+(WW-1)+'" height="'+(WH-1)+'" rx="3"/>';w++}
  else blk+='<rect class="bk" data-n="'+n+'" x="'+(w*WW-BW/2)+'" y=".5" width="'+BW+'" height="'+BH+'" rx="2"/>'}
svg+=blk+'</svg>';

var grid='<div class="cgridwrap"><div class="cgrid" role="group">';
KINDS.forEach(function(K,q){grid+='<b>'+tri(K.l)+'</b>';
  ROOTS.forEach(function(_,r){grid+='<button type="button" data-r="'+r+'" data-q="'+q+'" aria-pressed="false">'+chord(r,q).name+'</button>'})});
grid+='</div></div>';
host.innerHTML='<div class="cstage">'+svg+'<p class="readout" aria-live="polite"><b></b><span></span></p></div>'+grid;

var keys=[].slice.call(host.querySelectorAll('[data-n]')),btns=[].slice.call(host.querySelectorAll('button')),
    rb=host.querySelector('.readout b'),rs=host.querySelector('.readout span'),ctx=null;
function tone(n,when,g){
  var f=261.63*Math.pow(2,n/12),o=ctx.createOscillator(),o2=ctx.createOscillator(),a=ctx.createGain(),a2=ctx.createGain();
  o.type='triangle';o.frequency.value=f;o2.type='sine';o2.frequency.value=f*2;a2.gain.value=.25;
  a.gain.setValueAtTime(.0001,when);a.gain.exponentialRampToValueAtTime(g,when+.012);a.gain.exponentialRampToValueAtTime(.0001,when+1.7);
  o.connect(a);o2.connect(a2);a2.connect(a);a.connect(ctx.destination);o.start(when);o2.start(when);o.stop(when+1.8);o2.stop(when+1.8)}
function play(ns){
  try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();
    var t=ctx.currentTime+.02;ns.forEach(function(n,i){tone(n,t+i*.035,.16)})}catch(e){}}
function show(r,q,sound){
  var c=chord(r,q);
  keys.forEach(function(k){k.classList.toggle('on',c.keys.indexOf(+k.dataset.n)>=0)});
  btns.forEach(function(b){b.setAttribute('aria-pressed',String(+b.dataset.r===r&&+b.dataset.q===q))});
  rb.textContent=c.name;rs.textContent=c.notes.join(' – ');
  if(sound)play(c.keys)}
btns.forEach(function(b){b.addEventListener('click',function(){show(+b.dataset.r,+b.dataset.q,true)})});
keys.forEach(function(k){k.addEventListener('click',function(){play([+k.dataset.n])})});
show(0,0,false);
})();
