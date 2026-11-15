/* Sailing page: a small regatta game. Wind blows from the top. Steer round a windward-leeward course;
   the panel names the point of sail, the tack and each manoeuvre in the page language. */
(function(){
var root=document.getElementById('sailgame');if(!root)return;
var T={
en:{pos:['In irons (no-go zone)','Close-hauled','Close reach','Beam reach','Broad reach','Running (downwind)'],
 tackS:'Starboard tack',tackP:'Port tack',evT:'Tack!',evG:'Gybe!',evF:'Finish!',luff:'Luffing up',bear:'Bearing away',none:'Holding course',
 windward:'WINDWARD',leeward:'LEEWARD',wind:'WIND',start:'Start',finish:'Finish',wm:'Windward mark',lm:'Leeward mark',
 steps:['Press Start, then cross the start line heading upwind','Beat up to the windward mark: pass it on your right, then round it to the left','Bear away to the leeward mark: pass it on your left, then round it to the right','Beat back up and cross the finish line','Finished! Press Restart to race again'],
 hPos:'Point of sail',hTack:'Tack',hMan:'Manoeuvre',hNext:'Next',hTime:'Time',hBest:'Best',hCnt:'Tacks / gybes',
 go:'Start',again:'Restart',demo:'Watch a lap',stop:'Stop',port:'◀ To port',stb:'To starboard ▶',
 hint:'Steer with the arrow keys or the two buttons. The sail trims itself. A boat cannot sail straight into the wind: zig-zag upwind, one tack after the other. To watch first, press “Watch a lap” and the boat sails the course by itself.',
 aria:'Regatta game: a sailing boat seen from above on a course with two marks'},
pt:{pos:['Aproado ao vento (zona morta)','Contravento','Orça folgada','Través','Alheta','Popa'],
 tackS:'Amuras a boreste',tackP:'Amuras a bombordo',evT:'Virada por d’avante!',evG:'Jaibe!',evF:'Chegada!',luff:'Orçando',bear:'Arribando',none:'Mantendo o rumo',
 windward:'BARLAVENTO',leeward:'SOTAVENTO',wind:'VENTO',start:'Largada',finish:'Chegada',wm:'Boia de barlavento',lm:'Boia de sotavento',
 steps:['Aperte Largar e cruze a linha de largada subindo contra o vento','Suba até a boia de barlavento: passe à direita dela e contorne para a esquerda','Arribe até a boia de sotavento: passe à esquerda dela e contorne para a direita','Volte no contravento e cruze a linha de chegada','Chegou! Aperte Recomeçar para correr de novo'],
 hPos:'Mareação',hTack:'Amuras',hMan:'Manobra',hNext:'Próximo passo',hTime:'Tempo',hBest:'Melhor',hCnt:'Viradas / jaibes',
 go:'Largar',again:'Recomeçar',demo:'Ver uma volta',stop:'Parar',port:'◀ A bombordo',stb:'A boreste ▶',
 hint:'Use as setas do teclado ou os dois botões para timonear. A vela se ajusta sozinha. Nenhum barco veleja direto contra o vento: suba em zigue-zague, um bordo depois do outro. Para assistir primeiro, aperte “Ver uma volta” e o barco faz o percurso sozinho.',
 aria:'Jogo de regata: um veleiro visto de cima num percurso com duas boias'},
fr:{pos:['Vent debout (zone morte)','Près','Bon plein','Travers','Largue','Vent arrière'],
 tackS:'Tribord amures',tackP:'Bâbord amures',evT:'Virement de bord !',evG:'Empannage !',evF:'Arrivée !',luff:'On lofe',bear:'On abat',none:'Cap tenu',
 windward:'AU VENT',leeward:'SOUS LE VENT',wind:'VENT',start:'Départ',finish:'Arrivée',wm:'Bouée au vent',lm:'Bouée sous le vent',
 steps:['Appuyez sur Départ, puis franchissez la ligne en remontant au vent','Remontez à la bouée au vent : passez à sa droite, puis contournez vers la gauche','Abattez vers la bouée sous le vent : passez à sa gauche, puis contournez vers la droite','Remontez au près et franchissez la ligne d’arrivée','Arrivée ! Appuyez sur Recommencer pour une nouvelle manche'],
 hPos:'Allure',hTack:'Amure',hMan:'Manœuvre',hNext:'Étape suivante',hTime:'Temps',hBest:'Record',hCnt:'Virements / empannages',
 go:'Départ',again:'Recommencer',demo:'Voir un tour',stop:'Arrêter',port:'◀ À bâbord',stb:'À tribord ▶',
 hint:'Barrez avec les flèches du clavier ou les deux boutons. La voile se règle toute seule. Aucun bateau ne remonte droit face au vent : tirez des bords, l’un après l’autre. Pour regarder d’abord, appuyez sur « Voir un tour » et le bateau fait le parcours tout seul.',
 aria:'Jeu de régate : un voilier vu de dessus sur un parcours à deux bouées'}};
function S(){return T[document.documentElement.dataset.lang]||T.en}

var W=800,H=560,RAD=Math.PI/180;
var WM={x:400,y:92},LM={x:400,y:352},SL={y:452,x0:300,x1:500},FL={y:92,x0:400,x1:545};
var LIM=[38,52,75,105,160];                       /* point-of-sail boundaries, degrees off the wind */
var POLAR=[[0,0],[36,0],[45,.62],[60,.8],[90,1],[120,1],[150,.9],[180,.6]],VMAX=58;
function polar(a){for(var i=1;i<POLAR.length;i++){if(a<=POLAR[i][0]){var p=POLAR[i-1],q=POLAR[i];return p[1]+(q[1]-p[1])*(a-p[0])/(q[0]-p[0])}}return .6}
function sector(a){for(var i=0;i<LIM.length;i++)if(a<LIM[i])return i;return 5}

root.innerHTML='<div class="sg-main"><canvas class="sg-sea" tabindex="0"></canvas>'+
 '<div class="sg-side"><canvas class="sg-dial" aria-hidden="true"></canvas><dl class="sg-hud">'+
 '<div class="big"><dt data-s="hPos"></dt><dd data-v="pos"></dd></div><div class="big"><dt data-s="hTack"></dt><dd data-v="tack"></dd></div>'+
 '<div><dt data-s="hMan"></dt><dd data-v="man"></dd></div><div class="row"><div><dt data-s="hTime"></dt><dd data-v="time"></dd></div><div><dt data-s="hBest"></dt><dd data-v="best"></dd></div></div>'+
 '<div><dt data-s="hCnt"></dt><dd data-v="cnt"></dd></div></dl></div></div>'+
 '<p class="sg-next" aria-live="polite"><b data-s="hNext"></b><span data-v="next"></span></p>'+
 '<div class="sg-ctl"><button type="button" class="sg-turn" data-turn="-1" data-s="port"></button><button type="button" class="sg-go"></button><button type="button" class="sg-demo"></button><button type="button" class="sg-turn" data-turn="1" data-s="stb"></button></div>'+
 '<p class="sg-hint" data-s="hint"></p>';
var sea=root.querySelector('.sg-sea'),dial=root.querySelector('.sg-dial'),cx=sea.getContext('2d'),dx=dial.getContext('2d'),
    go=root.querySelector('.sg-go'),dgo=root.querySelector('.sg-demo'),V={},statics=[].slice.call(root.querySelectorAll('[data-s]'));
[].forEach.call(root.querySelectorAll('[data-v]'),function(n){V[n.dataset.v]=n});
function put(k,s){if(V[k].textContent!==s)V[k].textContent=s}

var st,b,leg,t0,tEnd,tacks,gybes,ev,call,q,told,pend,demo,turn=0,keys={},best=null,lastLang=null,scale=1,streak=[];
try{var v=parseFloat(localStorage.getItem('sg_best'));if(v>0)best=v}catch(e){}
for(var i=0;i<26;i++)streak.push({x:Math.random()*W,y:Math.random()*H,l:14+Math.random()*18});
function reset(run){demo=null;b={x:400,y:512,h:-45,v:0,trail:[]};leg=0;t0=null;tEnd=null;tacks=0;gybes=0;ev=null;call=null;q=[];told=null;pend=null;st=run?'run':'idle'}
reset(false);

function size(){
  var dpr=Math.min(window.devicePixelRatio||1,2),w=sea.clientWidth||W;scale=w/W;
  sea.width=Math.round(w*dpr);sea.height=Math.round(w*H/W*dpr);cx.setTransform(sea.width/W,0,0,sea.height/H,0,0);
  var d=dial.clientWidth||200;dial.width=dial.height=Math.round(d*dpr);dx.setTransform(dial.width/200,0,0,dial.height/200,0,0)}
window.addEventListener('resize',size);

/* the demonstration lap: steer for the next mark, and beat when the mark lies upwind */
var WPS={0:[[400,430]],1:[[455,62],[380,58]],2:[[310,230],[330,330],[460,420]],3:[[470,80]]};
function pilot(){
  if(demo.leg!==leg){demo.leg=leg;demo.i=0}
  var list=WPS[leg]||WPS[3],w=list[Math.min(demo.i,list.length-1)],dx=w[0]-b.x,dy=w[1]-b.y;
  if(dx*dx+dy*dy<18*18&&demo.i<list.length-1){demo.i++;return 0}
  var brg=Math.atan2(dx,-dy)/RAD,des=brg,cl=LIM[0]+9;
  if(Math.abs(brg)<cl){if(brg>30)demo.t=1;else if(brg<-30)demo.t=-1;des=cl*demo.t}
  var d=norm(des-b.h);return d>4?1:d<-4?-1:0;
}
function step(dt){
  var S_=S(),input=demo?pilot():(turn||((keys.r?1:0)-(keys.l?1:0))),ph=b.h,px=b.x,py=b.y;
  if(st==='run'){
    var twa0=Math.abs(norm(b.h));
    b.h=norm(b.h+input*78*dt*(.5+.5*Math.min(1,b.v/(VMAX*.5))));
    var twa=Math.abs(norm(b.h)),target=polar(twa)*VMAX;
    b.v+=(target-b.v)*dt/(target<b.v?1.5:1.3);
    b.x+=Math.sin(b.h*RAD)*b.v*dt;b.y-=Math.cos(b.h*RAD)*b.v*dt;
    if(b.x<16||b.x>W-16||b.y<30||b.y>H-16){b.x=Math.max(16,Math.min(W-16,b.x));b.y=Math.max(30,Math.min(H-16,b.y));b.v*=.9}
    if((ph>=0)!==(b.h>=0)){
      /* the bow crossed the wind (both headings near 0) or the stern did (both near 180) */
      if(Math.abs(ph)<90&&Math.abs(b.h)<90){tacks++;ev={k:'evT',t:1.8}}
      else if(Math.abs(ph)>90&&Math.abs(b.h)>90){gybes++;ev={k:'evG',t:1.8}}
      if(ev){call={k:ev.k,t:1.3,d:1.3};q=[];told=null;pend=null}}
    if(ev&&(ev.t-=dt)<=0)ev=null;
    /* course call: the new point of sail and tack, once it has held for a moment */
    var sc=sector(twa),key=sc===0?'0':sc+(b.h>=0?'p':'s');
    if(key!==told){if(!pend||pend.key!==key)pend={key:key,t:0};pend.t+=dt;
      if(pend.t>.4){told=key;pend=null;var c={sec:sc,side:b.h>=0?1:-1,t:2,d:2};if(call&&call.k)q=[c];else call=c}}
    else pend=null;
    if(call&&(call.t-=dt)<=0)call=q.shift()||null;
    b.turning=input?(twa<twa0?'luff':twa>twa0?'bear':b.turning):null;
    b.trail.push([b.x,b.y]);if(b.trail.length>90)b.trail.shift();
    if(leg===0&&py>SL.y&&b.y<=SL.y&&b.x>SL.x0&&b.x<SL.x1){leg=1;t0=performance.now()}
    else if(leg===1&&b.y<WM.y&&b.y>WM.y-170&&px>WM.x&&b.x<=WM.x)leg=2;
    else if(leg===2&&b.y>LM.y&&b.y<LM.y+170&&px<LM.x&&b.x>=LM.x)leg=3;
    else if(leg===3&&py>FL.y&&b.y<=FL.y&&b.x>FL.x0&&b.x<FL.x1){leg=4;st='done';tEnd=(performance.now()-t0)/1000;
      if(best==null||tEnd<best){best=tEnd;try{localStorage.setItem('sg_best',String(best))}catch(e){}}
      demo=null;ev=null;call={k:'evF',t:1e9,d:1e9+1};q=[]}
  }
  for(var i=0;i<streak.length;i++){var k=streak[i];k.y+=70*dt;if(k.y>H+20){k.y=-20;k.x=Math.random()*W}}
}
function norm(a){a=((a+180)%360+360)%360-180;return a}

function boat(c,h,k,irons){
  c.save();c.rotate(h*RAD);c.scale(k,k);
  c.beginPath();c.moveTo(0,-19);c.quadraticCurveTo(9,-4,7,15);c.lineTo(-7,15);c.quadraticCurveTo(-9,-4,0,-19);c.closePath();
  c.fillStyle='#15201B';c.fill();c.strokeStyle='#F1F3EE';c.lineWidth=1.2;c.stroke();
  var twa=Math.abs(h),side=h>=0?1:-1,a=irons?Math.sin(performance.now()/90)*7:side*Math.max(10,Math.min(88,twa*.5)),
      ex=Math.sin(a*RAD)*23,ey=-5+Math.cos(a*RAD)*23,bulge=irons?0:side*7;
  c.beginPath();c.moveTo(0,-5);c.quadraticCurveTo(ex/2+bulge*Math.cos(a*RAD),(-5+ey)/2-bulge*Math.sin(a*RAD)*side*side,ex,ey);
  c.strokeStyle='#fff';c.lineWidth=3.2;c.lineCap='round';c.stroke();c.strokeStyle='#B4772A';c.lineWidth=1;c.stroke();
  c.restore()}
function label(c,s,x,y,al,col,fs){c.font='600 '+(fs||13)+'px Archivo,Arial,sans-serif';c.textAlign=al||'center';c.fillStyle=col||'#15201B';c.fillText(s,x,y)}
function mark(x,y,on){cx.beginPath();cx.arc(x,y,on?9:7,0,7);cx.fillStyle=on?'#E0A552':'#B4772A';cx.fill();cx.strokeStyle='#15201B';cx.lineWidth=1.5;cx.stroke();
  if(on){cx.beginPath();cx.arc(x,y,16+Math.sin(performance.now()/260)*3,0,7);cx.strokeStyle='rgba(180,119,42,.55)';cx.lineWidth=2;cx.stroke()}}
function line(x0,x1,y,on,txt){cx.setLineDash([7,6]);cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.strokeStyle=on?'#0D4636':'rgba(13,70,54,.3)';cx.lineWidth=on?2.5:1.5;cx.stroke();cx.setLineDash([]);
  if(txt)label(cx,txt,x1+14,y+5,'left',on?'#0D4636':'rgba(13,70,54,.55)',fsz())}
function fsz(){return Math.max(13,Math.min(26,11.5/scale))}

function draw(){
  var S_=S(),f=fsz();
  cx.fillStyle='#DCE8EA';cx.fillRect(0,0,W,H);
  cx.strokeStyle='rgba(13,70,54,.16)';cx.lineWidth=1.5;cx.beginPath();
  streak.forEach(function(k){cx.moveTo(k.x,k.y);cx.lineTo(k.x,k.y+k.l)});cx.stroke();
  label(cx,'↓ '+S_.wind+' ↓',W/2,f+6,'center','#0D4636',f);label(cx,S_.windward,14,f+6,'left','#55635C',f*.85);label(cx,S_.leeward,14,H-12,'left','#55635C',f*.85);
  line(SL.x0,SL.x1,SL.y,leg===0,S_.start);
  cx.fillStyle='#55635C';cx.fillRect(SL.x1-6,SL.y-6,12,12);cx.beginPath();cx.arc(SL.x0,SL.y,5,0,7);cx.fill();
  line(FL.x0,FL.x1,FL.y,leg===3,leg>=3?S_.finish:'');cx.fillStyle='#55635C';cx.fillRect(FL.x1-6,FL.y-6,12,12);
  mark(WM.x,WM.y,leg===1);mark(LM.x,LM.y,leg===2);
  label(cx,S_.wm,WM.x-18,WM.y+5,'right','#15201B',f);label(cx,S_.lm,LM.x+18,LM.y+5,'left','#15201B',f);
  /* rounding hints: leave both marks to port */
  cx.strokeStyle='rgba(180,119,42,.8)';cx.lineWidth=2;
  if(leg===1){cx.beginPath();cx.arc(WM.x,WM.y,30,20*RAD,-200*RAD,true);cx.stroke();arcArrow(WM.x,WM.y,30,20);arcArrow(WM.x,WM.y,30,-90)}
  if(leg===2){cx.beginPath();cx.arc(LM.x,LM.y,30,200*RAD,-20*RAD,true);cx.stroke();arcArrow(LM.x,LM.y,30,200);arcArrow(LM.x,LM.y,30,90)}
  if(b.trail.length>1){cx.beginPath();cx.moveTo(b.trail[0][0],b.trail[0][1]);b.trail.forEach(function(p){cx.lineTo(p[0],p[1])});cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=2;cx.stroke()}
  var twa=Math.abs(b.h),irons=twa<LIM[0];
  cx.save();cx.translate(b.x,b.y);boat(cx,b.h,Math.max(1,Math.min(1.9,.82/scale)),irons);cx.restore();
  balloon();

  /* dial: points of sail around the wind */
  var C=100,R=84,sec=sector(twa),side=b.h>=0?1:-1,ed=[0].concat(LIM,[180]);
  dx.clearRect(0,0,200,200);
  for(var i=0;i<6;i++)for(var s=-1;s<=1;s+=2){
    var a0=(s>0?ed[i]:-ed[i+1])-90,a1=(s>0?ed[i+1]:-ed[i])-90;
    dx.beginPath();dx.moveTo(C,C+6);dx.arc(C,C+6,R,a0*RAD,a1*RAD);dx.closePath();
    dx.fillStyle=(i===sec&&s===side)?'#E0A552':i===0?'#1E2C26':i%2?'#14573F':'#0F4A38';dx.fill();dx.strokeStyle='#082E24';dx.lineWidth=1.5;dx.stroke()}
  dx.beginPath();dx.arc(C,C+6,30,0,7);dx.fillStyle='#082E24';dx.fill();
  dx.save();dx.translate(C,C+6);boat(dx,b.h,1.25,irons);
  dx.rotate(b.h*RAD);dx.fillStyle='#E0564F';dx.beginPath();dx.arc(-12,2,3.2,0,7);dx.fill();dx.fillStyle='#4FC08D';dx.beginPath();dx.arc(12,2,3.2,0,7);dx.fill();dx.restore();
  label(dx,'↓ '+S_.wind,C,13,'center','#9FB7AA',11.5);

  put('pos',S_.pos[sec]);put('tack',irons?'—':side>0?S_.tackP:S_.tackS);
  put('man',ev?S_[ev.k]:b.turning?S_[b.turning]:S_.none);V.man.classList.toggle('ev',!!ev);
  var t=tEnd!=null?tEnd:t0?(performance.now()-t0)/1000:0;
  put('time',t.toFixed(1)+' s');put('best',best!=null?best.toFixed(1)+' s':'—');put('cnt',tacks+' / '+gybes);
  put('next',S_.steps[leg]);
  if(S_!==lastLang){lastLang=S_;statics.forEach(function(n){n.textContent=S_[n.dataset.s]});sea.setAttribute('aria-label',S_.aria)}
  var g=st==='idle'?S_.go:S_.again;if(go.textContent!==g)go.textContent=g;
  var dl=demo?S_.stop:S_.demo;if(dgo.textContent!==dl)dgo.textContent=dl;dgo.setAttribute('aria-pressed',String(!!demo));
}
function balloon(){
  if(!call||st==='idle')return;
  var S_=S(),f=fsz(),man=!!call.k,l1=man?S_[call.k]:S_.pos[call.sec],
      l2=call.k==='evF'?(tEnd||0).toFixed(1)+' s':man||call.sec===0?'':(call.side>0?S_.tackP:S_.tackS),
      k=Math.max(1,Math.min(1.9,.82/scale)),a=Math.min(1,call.t/.3,(call.d-call.t)/.12);
  cx.save();cx.globalAlpha=Math.max(0,a);
  cx.font='800 '+(f*1.08)+'px Archivo,Arial,sans-serif';var w=cx.measureText(l1).width;
  if(l2){cx.font='600 '+(f*.86)+'px Archivo,Arial,sans-serif';w=Math.max(w,cx.measureText(l2).width)}
  var pad=f*.7,bw=w+pad*2,bh=(l2?f*2.45:f*1.5)+pad,gap=28*k,up=b.y-gap-bh>f*2.2,
      bx=Math.max(8,Math.min(W-bw-8,b.x-bw/2)),by=up?b.y-gap-bh:b.y+gap,r=Math.min(12,bh/3),
      tx=Math.max(bx+r+8,Math.min(bx+bw-r-8,b.x)),ty=up?by+bh:by,tip=up?b.y-gap*.45:b.y+gap*.45;
  cx.beginPath();cx.moveTo(bx+r,by);cx.arcTo(bx+bw,by,bx+bw,by+bh,r);cx.arcTo(bx+bw,by+bh,bx,by+bh,r);cx.arcTo(bx,by+bh,bx,by,r);cx.arcTo(bx,by,bx+bw,by,r);cx.closePath();
  cx.moveTo(tx-8,ty);cx.lineTo(b.x,tip);cx.lineTo(tx+8,ty);cx.closePath();
  cx.fillStyle=man?'#E0A552':'#0D4636';cx.shadowColor='rgba(0,0,0,.25)';cx.shadowBlur=8;cx.shadowOffsetY=2;cx.fill();cx.shadowColor='transparent';
  cx.textAlign='center';cx.fillStyle=man?'#1b1407':'#fff';
  cx.font='800 '+(f*1.08)+'px Archivo,Arial,sans-serif';cx.fillText(l1,bx+bw/2,by+pad*.55+f*1.02);
  if(l2){cx.fillStyle=man?'#5c4410':'#E0A552';cx.font='700 '+(f*.86)+'px Archivo,Arial,sans-serif';cx.fillText(l2,bx+bw/2,by+pad*.55+f*2.12)}
  cx.restore()}
/* arrowhead sitting on the rounding arc at angle th, pointing the way the boat travels.
   The arc is swept with decreasing theta, so the tangent there is (sin t, -cos t),
   which in arrow()'s convention (0 = up, clockwise positive) is simply th. */
function arcArrow(ox,oy,r,th){var t=th*RAD;arrow(ox+r*Math.cos(t),oy+r*Math.sin(t),th)}
function arrow(x,y,deg){cx.save();cx.translate(x,y);cx.rotate(deg*RAD);cx.beginPath();cx.moveTo(0,-7);cx.lineTo(5,3);cx.lineTo(-5,3);cx.closePath();cx.fillStyle='rgba(180,119,42,.9)';cx.fill();cx.restore()}

var last=0,seen=true;
function frame(now){var dt=Math.min(.05,(now-last)/1000||0);last=now;if(seen){step(dt);draw()}requestAnimationFrame(frame)}
if(window.IntersectionObserver)new IntersectionObserver(function(e){seen=e[0].isIntersecting}).observe(root);

go.addEventListener('click',function(){reset(true);sea.focus({preventScroll:true})});
dgo.addEventListener('click',function(){if(demo){demo=null;return}reset(true);demo={i:0,leg:0,t:-1}});
function key(e,down){
  var k=e.key==='ArrowLeft'||e.key==='a'||e.key==='A'?'l':e.key==='ArrowRight'||e.key==='d'||e.key==='D'?'r':null;if(!k)return;
  if(st!=='run'||!(document.activeElement===sea||root.contains(document.activeElement))){keys[k]=false;return}
  if(down)demo=null;
  keys[k]=down;e.preventDefault()}
window.addEventListener('keydown',function(e){key(e,true)});window.addEventListener('keyup',function(e){key(e,false)});
window.addEventListener('blur',function(){keys={};turn=0});
[].forEach.call(root.querySelectorAll('.sg-turn'),function(bn){
  var d=+bn.dataset.turn,off=function(){if(turn===d)turn=0};
  bn.addEventListener('pointerdown',function(e){e.preventDefault();demo=null;if(st==='idle')reset(true);turn=d});
  ['pointerup','pointerleave','pointercancel'].forEach(function(n){bn.addEventListener(n,off)});
  bn.addEventListener('contextmenu',function(e){e.preventDefault()})});
size();requestAnimationFrame(frame);
window.SAILGAME={state:function(){return {st:st,leg:leg,x:b.x,y:b.y,h:b.h,v:b.v,tacks:tacks,gybes:gybes,time:tEnd,demo:!!demo,call:call&&(call.k||('pos'+call.sec+(call.side>0?'P':'S')))}}};
})();
