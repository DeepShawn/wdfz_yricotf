/* 里世界 3D · 移动端外壳 */
'use strict';

var IS_TOUCH=(function(){
  try{
    if(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches) return true;
    if('ontouchstart' in window) return true;
    if(navigator&&navigator.maxTouchPoints>0) return true;
  }catch(e){}
  return false;
})();
function isStandalone(){
  try{
    if(window.navigator&&window.navigator.standalone) return true;
    if(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches) return true;
  }catch(e){}
  return false;
}
function goFullscreen(){
  try{
    if(document.fullscreenElement||document.webkitFullscreenElement) return;
    var el=document.documentElement;
    if(el.requestFullscreen){
      var pr=el.requestFullscreen({navigationUI:'hide'});
      if(pr&&pr.catch) pr.catch(function(){});
    }else if(el.webkitRequestFullscreen){ el.webkitRequestFullscreen(); }
  }catch(e){}
}
function initMobileShell(){
  document.addEventListener('dblclick',function(e){ if(e.cancelable) e.preventDefault(); },{passive:false});
  var gs=['gesturestart','gesturechange','gestureend'], gi;
  for(gi=0;gi<gs.length;gi++){
    document.addEventListener(gs[gi],function(e){ if(e.cancelable) e.preventDefault(); },{passive:false});
  }
  document.addEventListener('touchmove',function(e){
    if(e.touches&&e.touches.length>1&&e.cancelable) e.preventDefault();
  },{passive:false});
  if(IS_TOUCH){
    var tapped=false;
    var firstTap=function(){ if(tapped) return; tapped=true; goFullscreen(); };
    document.addEventListener('pointerdown',firstTap,{passive:true});
    document.addEventListener('touchstart',firstTap,{passive:true});
  }
  try{
    var hint=document.getElementById('mios');
    if(hint&&IS_TOUCH&&!isStandalone()) hint.style.display='block';
  }catch(e){}
}
function updateTouchUI(){
  var el=document.getElementById('touch');
  if(!el) return;
  /* 以前这里还带着 !DLG.open —— 只要有一句字幕（异象一开始必有一句）摇杆就整个消失，
     暴雨里根本跑不掉。字幕本身不挡触摸，不该收控件。 */
  var on=IS_TOUCH&&S.screen==='play'&&!S.dead&&!PAUSE.on&&!UI.anyOpen()&&!(PRO&&PRO.on);
  var want=on?'block':'none';
  if(el.style.display!==want){
    el.style.display=want;
    if(!on){ TOUCH.active=false; TOUCH.dx=TOUCH.dy=0; TOUCH.run=false;
      var kn=document.getElementById('knob'); if(kn) kn.style.transform='';
      var trb=document.getElementById('tRun'); if(trb) trb.classList.remove('held'); }
  }
}
