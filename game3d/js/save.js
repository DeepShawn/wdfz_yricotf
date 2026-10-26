/* 里世界 3D · 存档 */
'use strict';

function saveGame(){
  try{
    var d={
      v:1, mode:S.mode, room:S.room, x:S.x, y:S.y, ang:S.ang, pitch:S.pitch,
      tsec:S.tsec, day:S.day, diff:S.diff, san:S.san, viol:S.viol, stam:S.stam, tt:S.tt,
      bag:S.bag, hot:S.hot, talent:S.talent, spots:S.spots, clues:S.clues,
      seated:S.seated, ttTier:S.ttTier, hiddenAsked:S.hiddenAsked,
      hiddenLatch:S.hiddenLatch,
      rt:RT, use:USE, anRained:AN.rained, anCool:AN.cool,
      openDoors:OPENDOORS,
      anId:AN.id, anT:AN.t, anAcc:AN.acc,
      anData:(function(){ try{ return JSON.parse(JSON.stringify(AN.data||{})); }catch(e){ return {}; } })(),
      anNext:AN.next, anLastBig:AN.lastBig,
      fn:S.fn
    };
    localStorage.setItem('wdfz3d',JSON.stringify(d));
    return true;
  }catch(e){ return false; }
}
function loadGame(){
  try{
    var raw=localStorage.getItem('wdfz3d');
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}
