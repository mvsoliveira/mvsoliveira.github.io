/* Cruise maps. Each <div class="sailmap" data-cruise="2017"> becomes a Leaflet map drawn from
   window.TRACKS (js/sailing-tracks.js, built from sailing/tracks.json by mktracks.py).
   Solid line: the chart plotter's track. Dashed line: the order of places in my photos.
   Dots: nights and visits ashore; hover or tap for the place and date. */
(function(){
if(!window.L||!window.TRACKS)return;
var LOCALE={en:'en-GB',pt:'pt-BR',fr:'fr-FR'};
var WORD={en:{night:'Night',shore:'Ashore',base:'Start and end',track:'Recorded track',route:'Order of places, from photo positions',nightsail:'Night passage'},
          pt:{night:'Pernoite',shore:'Em terra',base:'Início e fim',track:'Trajeto gravado',route:'Ordem dos lugares, pela posição das fotos',nightsail:'Travessia noturna'},
          fr:{night:'Nuit',shore:'À terre',base:'Départ et arrivée',track:'Trace enregistrée',route:'Ordre des lieux, d\'après la position des photos',nightsail:'Traversée de nuit'}};
function lang(){var l=document.documentElement.dataset.lang;return WORD[l]?l:'en'}
function fmt(d){return new Date(d+'T12:00:00').toLocaleDateString(LOCALE[lang()],{day:'numeric',month:'long'})}
function label(s){
  var w=WORD[lang()],when='';
  if(s.d)when=s.d.length>1?fmt(s.d[0])+(s.x?' · ':' – ')+fmt(s.d[1]):fmt(s.d[0]);
  return '<b>'+s.n+'</b><br><span>'+w[s.k]+(when?' · '+when:'')+'</span>';
}
var COPPER='#B4772A',GREEN='#0D4636',INK='#15201B';
[].forEach.call(document.querySelectorAll('.sailmap[data-cruise]'),function(el){
  var C=window.TRACKS[el.dataset.cruise];if(!C)return;
  var map=L.map(el,{scrollWheelZoom:false,zoomSnap:0.25});
  el.addEventListener('click',function(){map.scrollWheelZoom.enable()});
  el.addEventListener('mouseleave',function(){map.scrollWheelZoom.disable()});
  /* Esri ocean basemap: no API key needed (CARTO's raster tiles now require one) */
  var ESRI='https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/';
  L.tileLayer(ESRI+'World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',{maxNativeZoom:13,maxZoom:16,
    attribution:'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'}).addTo(map);
  L.tileLayer(ESRI+'World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',{maxNativeZoom:13,maxZoom:16}).addTo(map);
  var all=[];
  C.track.forEach(function(seg){L.polyline(seg,{color:COPPER,weight:3,opacity:.95}).addTo(map);all=all.concat(seg)});
  if(C.route){L.polyline(C.route,{color:GREEN,weight:2.5,dashArray:'6 7',opacity:.9}).addTo(map);all=all.concat(C.route)}
  if(C.night){L.polyline(C.night,{color:INK,weight:4,opacity:.85}).addTo(map)}
  C.stops.forEach(function(s){
    var base=s.k==='base',shore=s.k==='shore';
    var m=L.circleMarker([s.lat,s.lon],{radius:base?8:shore?5:7,color:base?INK:GREEN,weight:2,
      fillColor:shore?'#fff':base?COPPER:GREEN,fillOpacity:1}).addTo(map);
    m.bindTooltip(function(){return label(s)},{direction:'top',offset:[0,-6],className:'sailtip'});
    all.push([s.lat,s.lon]);
  });
  map.fitBounds(L.latLngBounds(all),{padding:[28,28]});
  /* legend, in the page language */
  var lg=L.control({position:'bottomleft'});
  lg.onAdd=function(){var d=L.DomUtil.create('div','maplegend');lg._d=d;return d};
  lg.addTo(map);
  function legend(){var w=WORD[lang()],h='';
    if(C.track.length)h+='<span><i class="ln" style="border-color:'+COPPER+'"></i>'+w.track+'</span>';
    if(C.route)h+='<span><i class="ln dash" style="border-color:'+GREEN+'"></i>'+w.route+'</span>';
    if(C.night)h+='<span><i class="ln" style="border-color:'+INK+';border-top-width:4px"></i>'+w.nightsail+'</span>';
    h+='<span><i class="dot" style="background:'+GREEN+'"></i>'+w.night+'</span><span><i class="dot" style="background:#fff;border-color:'+GREEN+'"></i>'+w.shore+'</span>';
    lg._d.innerHTML=h}
  legend();
  new MutationObserver(legend).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
});
})();
