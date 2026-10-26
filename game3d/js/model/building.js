/* 里世界 3D · 建筑外立面 */
'use strict';

var OBLD_H={ guard:3.6, shed:3.4, gear:4.4, trash:3.8, canteen:8.6,
  dormN:18.0, dormS:18.0, bell:19.0, garage:0, garw:0 };
function addEntrance(B, px, pz, sw, sd, face, colonnade){
  face=face||'s';
  var horz=(face==='e'||face==='w');
  var along=horz?sd:sw;                       /* 门洞所在立面的宽度 */
  var dw=Math.min(4.2, along*0.26), dh=colonnade?2.40:2.6, dep=1.1;
  var nx=0,nz=0,bx=px,bz=pz;
  if(face==='s'){ nz=1;  bz=pz+sd/2; }
  else if(face==='n'){ nz=-1; bz=pz-sd/2; }
  else if(face==='e'){ nx=1;  bx=px+sw/2; }
  else { nx=-1; bx=px-sw/2; }
  function P(u,v){ return { x:bx+(horz?nx*v:u), z:bz+(horz?u:nz*v) }; }
  function put(u,y,v,w,h,d,col,l){
    var q=P(u,v);
    B.box(q.x,y,q.z, horz?d:w, h, horz?w:d, col, l);
  }
  put(0,dh/2,dep*0.5,dw+0.5,dh,dep,0x0e1316,1.0);                 /* 门洞暗腔 */
  put(-dw*0.25,dh/2-0.05,dep*0.95,dw*0.48,dh-0.1,0.10,0x2a3136,1.02);  /* 双开门 */
  put( dw*0.25,dh/2-0.05,dep*0.95,dw*0.48,dh-0.1,0.10,0x2a3136,1.02);
  put(-dw*0.56,dh/2,dep*0.95,dw*0.12,dh+0.2,0.22,0xd8d4cc,1.05);  /* 门框 */
  put( dw*0.56,dh/2,dep*0.95,dw*0.12,dh+0.2,0.22,0xd8d4cc,1.05);
  put(0,dh+0.10,dep*0.95,dw+0.5,0.18,0.22,0xd8d4cc,1.05);
  if(!colonnade){                                                   /* 有柱廊的楼，柱廊就是雨棚 */
    put(0,dh+0.55,dep*0.75,dw+1.9,0.22,dep*1.7,0xc9c4bb,1.05);     /* 雨棚 */
    put(0,dh+0.36,dep*0.75,dw+1.7,0.14,dep*1.6,0x8a5a52,1.0);
  }
  if(colonnade){                                                   /* 门牌挂在柱廊檐口上 */
    put(0,3.34,2.92,dw+1.2,0.46,0.06,0xe8e4de,1.10);
    put(0,3.34,2.96,dw+0.9,0.32,0.03,0x8b3a2e,1.0);
  }else{
    put(0,dh+1.35,dep*0.20,dw+1.2,0.62,0.14,0xe8e4de,1.10);        /* 门楣牌 */
    put(0,dh+1.35,dep*0.29,dw+0.9,0.44,0.03,0x8b3a2e,1.0);
  }
  put(dw*0.30,dh-0.20,dep*1.02,0.30,0.14,0.04,0x2fae6a,1.8);       /* 安全出口灯 */
  put(0,0.09,dep*1.5,dw+2.6,0.18,1.0,0xb8b2a8,1.0);                /* 台阶 */
  put(0,0.24,dep*1.1,dw+2.2,0.16,0.7,0xb8b2a8,1.0);
}
function addSmallDoor(B, px, pz, sw, sd, face){
  face=face||'s';
  var horz=(face==='e'||face==='w');
  var along=horz?sd:sw;
  var dw=Math.min(1.6, along*0.5), dh=2.15, dep=0.5;
  var nx=0,nz=0,bx=px,bz=pz;
  if(face==='s'){ nz=1;  bz=pz+sd/2; }
  else if(face==='n'){ nz=-1; bz=pz-sd/2; }
  else if(face==='e'){ nx=1;  bx=px+sw/2; }
  else { nx=-1; bx=px-sw/2; }
  function P(u,v){ return { x:bx+(horz?nx*v:u), z:bz+(horz?u:nz*v) }; }
  function put(u,y,v,w,h,d,col,l){ var q=P(u,v); B.box(q.x,y,q.z, horz?d:w,h,horz?w:d,col,l); }
  put(0,dh/2,dep*0.4,dw+0.30,dh,dep,0x0e1316,1.0);              /* 暗腔 */
  put(0,dh/2-0.05,dep*0.95,dw,dh-0.1,0.09,0x39424a,1.02);       /* 铁门 */
  put(-dw*0.60,dh/2,dep*0.95,0.12,dh+0.16,0.18,0xd8d4cc,1.05);  /* 门框 */
  put( dw*0.60,dh/2,dep*0.95,0.12,dh+0.16,0.18,0xd8d4cc,1.05);
  put(0,dh+0.06,dep*0.95,dw+0.36,0.14,0.18,0xd8d4cc,1.05);
  put(dw*0.30,dh*0.50,dep*1.03,0.07,0.07,0.05,0xc8a24a,1.3);    /* 门把手 */
  put(0,0.07,dep*1.35,dw+0.9,0.14,0.7,0xb8b2a8,1.0);            /* 台阶 */
}
function addGardenSign(grp){
  try{
    var cv=document.createElement('canvas'); cv.width=1024; cv.height=176;
    var c=cv.getContext('2d'); if(!c) return;
    c.fillStyle='#ddd8ce'; c.fillRect(0,0,1024,176);
    var i;
    for(i=0;i<900;i++){
      c.globalAlpha=0.04+Math.random()*0.05;
      c.fillStyle=Math.random()>0.5?'#ffffff':'#a8a298';
      c.fillRect(Math.random()*1024,Math.random()*176,2+Math.random()*6,2+Math.random()*6);
    }
    c.globalAlpha=1;
    c.fillStyle='#7a3226';
    c.font='600 104px "Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif';
    c.textAlign='center'; c.textBaseline='middle';
    c.fillText('十年树木  百年树人',512,92);
    var t=new THREE.CanvasTexture(cv);
    if(THREE.SRGBColorSpace!==undefined) t.colorSpace=THREE.SRGBColorSpace;
    t.anisotropy=8;
    var mat=new THREE.MeshPhongMaterial({map:t,shininess:0,specular:0x000000});
    var gx=535*SC*U2M, gz=1040*SC*U2M;
    var body=new THREE.Mesh(new THREE.BoxGeometry(11.0,1.9,0.34),
      new THREE.MeshPhongMaterial({color:0xcfc9be,shininess:0,specular:0x000000}));
    body.position.set(gx,1.35,gz+1.6);
    grp.add(body);
    var face=new THREE.Mesh(new THREE.PlaneGeometry(10.4,1.6),mat);
    face.position.set(gx,1.35,gz+1.6+0.176);
    grp.add(face);
    var face2=new THREE.Mesh(new THREE.PlaneGeometry(10.4,1.6),mat);
    face2.rotation.y=Math.PI;
    face2.position.set(gx,1.35,gz+1.6-0.176);
    grp.add(face2);
    var base=new THREE.Mesh(new THREE.BoxGeometry(11.6,0.34,0.9),
      new THREE.MeshPhongMaterial({color:0xa8a298,shininess:0,specular:0x000000}));
    base.position.set(gx,0.17,gz+1.6);
    grp.add(base);
    var bar=new THREE.Mesh(new THREE.BoxGeometry(11.4,0.10,0.16),
      new THREE.MeshPhongMaterial({color:0x9aa0a4,shininess:0,specular:0x000000}));
    bar.position.set(gx,0.42,gz+1.6);
    grp.add(bar);
  }catch(e){}
}
function buildOutdoorGeometry(){
  var B=new BoxBuilder(), BF=new BoxBuilder(), i;
  var x0=BOUND.x0*SC*U2M, y0=BOUND.y0*SC*U2M;
  var x1=BOUND.x1*SC*U2M, y1=BOUND.y1*SC*U2M;
  var cx=(x0+x1)/2, cz=(y0+y1)/2, w=x1-x0, d=y1-y0;
  OUTX={L:new BoxBuilder(), W:new BoxBuilder(), G:new BoxBuilder(), J:new BoxBuilder()};
  OUT_SOLID=[]; OUT_LAMPS=[];
  addOutdoorProps(B, BF, x0, y0, x1, y1);

  for(i=0;i<OBJ.length;i++){
    var o=OBJ[i], ow=objWorld(o);
    var px=(ow.x+ow.w/2)*U2M, pz=(ow.y+ow.h/2)*U2M;
    var sw=ow.w*U2M, sd=ow.h*U2M;
    var base=PALETTE[o.k]||PALETTE.roof;

    if(o.k==='field'){
      var trackW=Math.min(sw,sd)*0.17;
      var ix0=px-sw/2+trackW, ix1=px+sw/2-trackW;
      var iz0=pz-sd/2+trackW, iz1=pz+sd/2-trackW;
      BF.quad(px-sw/2,pz-sd/2, px+sw/2,pz-sd/2, px+sw/2,pz+sd/2, px-sw/2,pz+sd/2, 0.060, 0xa0443a);
      var ln;
      for(ln=1;ln<=4;ln++){
        var off=trackW*ln/5;
        BF.quad(px-sw/2+off,pz-sd/2+off, px+sw/2-off,pz-sd/2+off,
                px+sw/2-off,pz-sd/2+off+0.12, px-sw/2+off,pz-sd/2+off+0.12, 0.064, 0xe8e6e0);
        BF.quad(px-sw/2+off,pz+sd/2-off-0.12, px+sw/2-off,pz+sd/2-off-0.12,
                px+sw/2-off,pz+sd/2-off, px-sw/2+off,pz+sd/2-off, 0.064, 0xe8e6e0);
        BF.quad(px-sw/2+off,pz-sd/2+off, px-sw/2+off+0.12,pz-sd/2+off,
                px-sw/2+off+0.12,pz+sd/2-off, px-sw/2+off,pz+sd/2-off, 0.064, 0xe8e6e0);
        BF.quad(px+sw/2-off-0.12,pz-sd/2+off, px+sw/2-off,pz-sd/2+off,
                px+sw/2-off,pz+sd/2-off, px+sw/2-off-0.12,pz+sd/2-off, 0.064, 0xe8e6e0);
      }
      BF.quad(ix0,iz0, ix1,iz0, ix1,iz1, ix0,iz1, 0.062, 0x3f6b3f);
      B.box(px,0.085,pz-sd/2+trackW,sw-trackW*2,0.03,0.16,0xe4e2dc,1.0);
      B.box(px,0.055,pz+sd/2-trackW,sw-trackW*2,0.03,0.16,0xe4e2dc,1.0);
      B.box(px-sw/2+trackW,0.055,pz,0.16,0.03,sd-trackW*2,0xe4e2dc,1.0);
      B.box(px+sw/2-trackW,0.055,pz,0.16,0.03,sd-trackW*2,0xe4e2dc,1.0);
      BF.quad(ix1-6,iz0+4, ix1-2,iz0+4, ix1-2,iz0+8, ix1-6,iz0+8, 0.070, 0xc8b98a);
      /* 两头的球门 */
      var gl2;
      for(gl2=0;gl2<2;gl2++){
        var gzz=gl2?iz1-0.6:iz0+0.6, gsg=gl2?1:-1;
        B.box(px-1.6,1.0,gzz,0.10,2.0,0.10,0xe8e8e2,1.1);
        B.box(px+1.6,1.0,gzz,0.10,2.0,0.10,0xe8e8e2,1.1);
        B.box(px,2.0,gzz,3.3,0.10,0.10,0xe8e8e2,1.1);
        B.box(px,1.0,gzz+gsg*0.9,3.2,1.9,0.02,0xc8ccc8,0.85);   /* 网 */
        B.box(px-1.6,1.0,gzz+gsg*0.45,0.03,1.9,0.9,0xc8ccc8,0.85);
        B.box(px+1.6,1.0,gzz+gsg*0.45,0.03,1.9,0.9,0xc8ccc8,0.85);
      }
      continue;
    } else if(o.k==='court'||o.k==='track'||o.k==='garden'){
      BF.quad(px-sw/2,pz-sd/2, px+sw/2,pz-sd/2, px+sw/2,pz+sd/2, px-sw/2,pz+sd/2, 0.012, base);
      if(o.k!=='garden') B.box(px,0.045,pz,sw,0.09,sd,base,1.0);
      if(o.k==='court'||o.k==='track'){
        B.box(px,0.10,pz-sd/2,sw,0.02,0.14,0xd8d8d0,1.0);
        B.box(px,0.10,pz+sd/2,sw,0.02,0.14,0xd8d8d0,1.0);
        B.box(px-sw/2,0.10,pz,0.14,0.02,sd,0xd8d8d0,1.0);
        B.box(px+sw/2,0.10,pz,0.14,0.02,sd,0xd8d8d0,1.0);
      }
      if(o.k==='court') courtGear(B,o,px,pz,sw,sd);
      continue;
    }

    if(o.k==='link'&&DEV_HIDE.link) continue;
    if(o.k==='link'){
      var lv, flr=3.2;
      for(lv=0;lv<5;lv++){
        var ly=flr*(lv+1);
        B.box(px,ly-0.16,pz,sw,0.32,sd,BRICK,1.02);
        B.box(px,ly-0.34,pz,sw*0.99,0.06,sd*0.99,WHITEBAND,1.0);
        if(lv<4){
          var rn=Math.max(3,Math.round(sd/1.15)), rk;
          for(rk=0;rk<=rn;rk++){
            var rz2=pz-sd/2+(sd/rn)*rk;
            B.box(px-sw/2+0.10, ly+0.55, rz2, 0.09, 1.10, 0.09, 0x8b3a2e, 1.06);
            B.box(px+sw/2-0.10, ly+0.55, rz2, 0.09, 1.10, 0.09, 0x8b3a2e, 1.06);
          }
          B.box(px-sw/2+0.10, ly+1.08, pz, 0.12, 0.10, sd, 0x7a3226, 1.0);
          B.box(px+sw/2-0.10, ly+1.08, pz, 0.12, 0.10, sd, 0x7a3226, 1.0);
          B.box(px, ly+0.28, pz-sd/2, sw, 0.06, 0.10, 0x7a3226, 1.0);
          B.box(px, ly+0.28, pz+sd/2, sw, 0.06, 0.10, 0x7a3226, 1.0);
        }
      }
      var cn=(o.id==='c1'?3:3), ck2;
      for(ck2=0;ck2<=cn;ck2++){
        var czx=px-sw/2+(sw/cn)*ck2;
        B.box(czx,8.0,pz-sd/2+0.4,0.42,16.0,0.42,BRICK,0.94);
        B.box(czx,8.0,pz+sd/2-0.4,0.42,16.0,0.42,BRICK,0.94);
      }
      B.box(px,16.20,pz,sw*1.02,0.30,sd*1.02,0x8b3a2e,1.0);
      continue;
    }

    if(o.open1f){
      var total=16.0, g0=3.2;
      B.box(px,total/2,pz,sw,total,sd,BRICK,0.97);
      B.box(px,total+0.18,pz,sw*0.997,0.42,sd*0.997,WHITEBAND,1.0);
      B.box(px,total+0.78,pz,sw*1.005,0.80,sd*1.005,BRICK,0.99);
      B.box(px,total+1.22,pz,sw*1.02,0.10,sd*1.02,0xd8d4cb,1.05);
      var bl3;
      for(bl3=1;bl3<=4;bl3++){
        var by3=3.6+(bl3-0.5)*(total-3.6)/4.6;
        B.box(px,by3-0.72,pz,sw*1.002,0.06,sd*1.002,0xd8d4cb,1.03);
      }
      B.box(px,0.75,pz,sw*1.005,1.5,sd*1.005,BASE_GREY,0.92);
      var dep=2.6, colN=Math.max(4,Math.round(sw/4.2)), cn2;
      for(cn2=0;cn2<=colN;cn2++){
        var pcx=px-sw/2+(sw/colN)*cn2;
        if(Math.abs(pcx-px)<3.2) continue;          /* 以前正中那根柱子刚好立在大门口 */
        B.box(pcx,g0/2,pz+sd/2+dep/2,0.46,g0,0.46,BRICK,1.02);
        B.box(pcx,0.16,pz+sd/2+dep/2,0.62,0.32,0.62,BASE_GREY,0.95);
      }
      if(!DEV_HIDE.canopy){ B.box(px,g0+0.14,pz+sd/2+dep/2,sw+0.4,0.30,dep+0.5,WHITEBAND,1.02); }
      B.box(px,g0-0.30,pz+sd/2+dep/2,sw+0.2,0.26,dep+0.3,BRICK_D,0.96);
      litWindows(o,px,pz,sw,sd,4,3.6,total);
      var fl, nfl2=4;
      for(fl=1;fl<=nfl2;fl++){
        var fy2=3.6+ (fl-0.5)*(total-3.6)/(nfl2+0.6);
        B.box(px,fy2,pz-sd/2-0.05,sw*0.94,1.02,0.10,WIN_DARK,1.0);
        B.box(px,fy2,pz+sd/2+0.05,sw*0.94,1.02,0.10,WIN_DARK,1.0);
        B.box(px-sw/2-0.05,fy2,pz,0.10,1.02,sd*0.94,WIN_DARK,1.0);
        B.box(px+sw/2+0.05,fy2,pz,0.10,1.02,sd*0.94,WIN_DARK,1.0);
        var by=fy2-0.52;
        B.box(px,by,pz+sd/2+0.07,sw*0.97,0.26,0.12,WHITEBAND,1.0);
        B.box(px,by,pz-sd/2-0.07,sw*0.97,0.26,0.12,WHITEBAND,1.0);
        var acn=Math.max(2,Math.floor(sw/2.6)), ac;
        for(ac=0;ac<acn;ac++){
          var acx=px-sw*0.42+ac*(sw*0.84/(acn-1||1));
          B.box(acx,fy2-0.55,pz+sd/2+0.30,0.62,0.48,0.34,0xdad6cf,1.0);
          B.box(acx,fy2-0.55,pz+sd/2+0.50,0.50,0.36,0.03,0x9aa0a2,1.0);
        }
        B.box(px,fy2-0.56,pz+sd/2+0.13,sw*0.94,0.07,0.16,0xd8d4cb,1.06);
        B.box(px,fy2-0.56,pz-sd/2-0.13,sw*0.94,0.07,0.16,0xd8d4cb,1.06);
        B.box(px,fy2+0.56,pz+sd/2+0.11,sw*0.94,0.06,0.12,0xc8c3ba,1.02);
        var wn=Math.max(4,Math.round(sw/3.2)), wi;
        for(wi=0;wi<=wn;wi++){
          var wxp=px-sw*0.47+(sw*0.94/wn)*wi;
          B.box(wxp,fy2,pz+sd/2+0.09,0.10,1.02,0.10,0xb8b3aa,1.04);
        }
        var rpn=Math.max(4,Math.round(sw/1.3)), rp;
        for(rp=0;rp<=rpn;rp++){
          B.box(px-sw*0.48+(sw*0.96/rpn)*rp,fy2+0.34,pz+sd/2+0.62,0.07,0.60,0.07,0x8b3a2e,1.0);
        }
        B.box(px,fy2+0.62,pz+sd/2+0.62,sw*0.96,0.08,0.08,0x8b3a2e,1.05);
      }
      continue;
    }

    if(o.id==='garage'){ garageRamp(B,px,pz,sw,sd); continue; }
    if(o.id==='garw'){ garagePed(B,px,pz,sw,sd); continue; }
    if(o.id==='bell'){
      var bh=19.0, bTop=15.2;
      B.box(px,bTop/2,pz,sw,bTop,sd,BRICK,0.98);
      var fs2;
      for(fs2=0;fs2<2;fs2++){
        var off=(fs2?0.28:-0.28)*sw;
        B.box(px+off,bTop*0.62,pz-sd/2-0.05,sw*0.26,bTop*0.62,0.10,WIN_DARK,1.0);
        B.box(px+off,bTop*0.62,pz+sd/2+0.05,sw*0.26,bTop*0.62,0.10,WIN_DARK,1.0);
        B.box(px-sw/2-0.05,bTop*0.62,pz+off,0.10,bTop*0.62,sd*0.26,WIN_DARK,1.0);
        B.box(px+sw/2+0.05,bTop*0.62,pz+off,0.10,bTop*0.62,sd*0.26,WIN_DARK,1.0);
      }
      B.box(px,bTop*0.80,pz+sd/2+0.10,sw*0.30,0.55,0.06,0xc8a24a,1.15);
      var pv2;
      for(pv2=0;pv2<4;pv2++){
        var ax2=px+((pv2&1)?1:-1)*(sw/2-0.5), az2=pz+((pv2&2)?1:-1)*(sd/2-0.5);
        B.box(ax2,(bTop+bh)/2,az2,0.7,bh-bTop,0.7,BRICK,1.0);
      }
      B.box(px,bTop+1.1,pz,sw*0.98,0.22,sd*0.98,0xc9c4bb,1.05);   /* 亭台栏板 */
      B.box(px,bh+0.20,pz,sw*1.10,0.40,sd*1.10,0x8a5a52,1.0);     /* 顶盖 */
      B.box(px,bh+0.55,pz,sw*0.70,0.30,sd*0.70,0x7a4c46,1.0);
      continue;
    }
    if(o.id==='dormN'||o.id==='dormS'){
      /* 阳台开在门的对面；贴着食堂的那一段不画（以前阳台直接插进食堂的墙里） */
      var dh=OBLD_H[o.id]!==undefined?OBLD_H[o.id]:18.0;
      var bs=(o.door==='n')?1:-1;
      var spans=faceFreeSpans(o, bs>0?'s':'n'), sp2, dfl, dn=Math.round(dh/3.0);
      for(sp2=0;sp2<spans.length;sp2++){
        var sa=spans[sp2][0]*SC*U2M, sb=spans[sp2][1]*SC*U2M, sw3=sb-sa-0.3, sx3=(sa+sb)/2;
        if(sw3<2) continue;
        var fz3=pz+bs*sd/2;
        for(dfl=1;dfl<=dn;dfl++){
          var dy=dfl*(dh/(dn+0.5));
          B.box(sx3,dy,fz3+bs*0.55,sw3,0.16,1.1,0xd2cdc5,1.0);           /* 阳台板 */
          B.box(sx3,dy+0.52,fz3+bs*1.05,sw3*0.98,0.07,0.07,0x3a444a,1.05);
          B.box(sx3,dy+0.20,fz3+bs*1.05,sw3*0.98,0.05,0.05,0x3a444a,1.0);
          var dp, dpn=Math.max(6,Math.round(sw3/0.7));
          for(dp=0;dp<=dpn;dp++) B.box(sx3-sw3*0.49+(sw3*0.98/dpn)*dp,dy+0.34,fz3+bs*1.05,0.035,0.60,0.035,0x3a444a,1.0);
          B.box(sx3,dy+1.55,fz3+bs*0.72,sw3*0.85,0.04,0.04,0xb8b2a8,1.0);
          var cl, cn3=Math.max(2,Math.round(sw3/5));
          for(cl=0;cl<cn3;cl++){
            if(hash2(dfl*7+cl,o.x)<0.35) continue;
            var ccx=sx3-sw3*0.40+cl*(sw3*0.80/Math.max(1,cn3-1));
            B.box(ccx,dy+1.18,fz3+bs*0.72,0.5,0.72,0.06,[0x5a6c7a,0x7a6a5a,0x6a7a64,0x8a7a80,0x6a6a7a][(cl+dfl)%5],1.0);
          }
        }
      }
      litWindows(o,px,pz,sw,sd,dn,3.0,dh);
    }

    var NO_ENT={bell:1,garage:1,garw:1,guard:1,shed:1,gear:1,trash:1};
    if(o.id==='bell'||o.id==='canteen'||o.id==='dormN'||o.id==='dormS'||(!NO_ENT[o.id]&&sw>=16&&sd>=12)){
      addEntrance(B, px, pz, sw, sd, o.door||'s', !!o.open1f);
    } else if(o.id!=='shed'){
      addSmallDoor(B, px, pz, sw, sd, o.door||'s');   /* 小房子也要有门；车棚是敞开的，不要门 */
    }

    var hgt=OBLD_H[o.id]!==undefined?OBLD_H[o.id]:(o.id==='bell'?19:11.5);
    if(o.id==='shed'){
      B.box(px,hgt-0.14,pz,sw,0.28,sd,0x2a3238,1.0);
      var sc, sn=Math.max(5,Math.round(sd/4));
      for(sc=0;sc<=sn;sc++){
        var szz=pz-sd*0.46+sc*(sd*0.92/sn);
        B.box(px-sw*0.42,hgt/2,szz,0.20,hgt,0.20,0x2b343b,1.06);
        B.box(px+sw*0.42,hgt/2,szz,0.20,hgt,0.20,0x2b343b,1.06);
      }
      /* 车棚里一排停着的电动车 */
      var bk2, bkn=Math.floor(sd/1.1);
      for(bk2=0;bk2<bkn;bk2++){
        if(hash2(bk2,57)<0.28) continue;
        var bz5=pz-sd/2+0.8+bk2*1.1, bcol=[0x3a4a5a,0x6a2a2a,0xd8d4cc,0x2a2e33,0x4a6a4a][bk2%5];
        B.box(px-sw*0.10,0.55,bz5,1.55,0.42,0.30,bcol,1.0);
        B.box(px-sw*0.10-0.62,0.32,bz5,0.12,0.56,0.08,0x111418,1.0);
        B.box(px-sw*0.10+0.62,0.32,bz5,0.12,0.56,0.08,0x111418,1.0);
        B.box(px-sw*0.10-0.55,1.02,bz5,0.06,0.04,0.62,0x2a2e33,1.0);
      }
      continue;
    }
    B.box(px,hgt/2,pz,sw,hgt,sd,BRICK,0.97);
    B.box(px,hgt+0.16,pz,sw*0.995,0.32,sd*0.995,WHITEBAND,1.0);
    B.box(px,hgt*0.14,pz,sw*1.01,hgt*0.28,sd*1.01,BASE_GREY,1.0);
    var fl2, nfl=Math.max(1,Math.min(6,Math.round(hgt/3.6)));
    for(fl2=1;fl2<=nfl;fl2++){
      var fy3=hgt*(fl2/(nfl+1));
      B.box(px,fy3+0.68,pz-sd/2-0.06,sw*0.97,0.24,0.10,WHITEBAND,1.0);
      B.box(px,fy3+0.68,pz+sd/2+0.06,sw*0.97,0.24,0.10,WHITEBAND,1.0);
      B.box(px,fy3,pz-sd/2-0.04,sw*0.94,0.92,0.10,WIN_DARK,1.0);
      B.box(px,fy3,pz+sd/2+0.04,sw*0.94,0.92,0.10,WIN_DARK,1.0);
      B.box(px-sw/2-0.04,fy3,pz,0.10,1.05,sd*0.94,WIN_DARK,1.0);
      B.box(px+sw/2+0.04,fy3,pz,0.10,1.05,sd*0.94,WIN_DARK,1.0);
    }
    B.box(px,1.15,pz+sd/2+0.06,Math.min(3.2,sw*0.28),2.3,0.14,0x11171c,1.0);
    B.box(px,2.45,pz+sd/2+0.30,Math.min(4.4,sw*0.40),0.16,0.7,0x394450,1.0);
  }

  /* 围墙：在三个校门处留出口子（以前墙是整圈的，门画在墙里面 5–10 米处） */
  function fenceRun(fx,fz,len,horiz){
    if(len<0.3) return;
    var baseH=1.5, railH=1.5, t=0.62;
    if(horiz){
      B.box(fx,baseH/2,fz,len,baseH,t,STONE,1.0);
      B.box(fx,baseH+0.06,fz,len,0.12,0.24,0x8f938f,1.0);
      B.box(fx,baseH+railH,fz,len,0.10,0.16,0x2f6b3f,1.0);
      var n=Math.max(2,Math.round(len/0.55)), k;
      for(k=0;k<=n;k++) B.box(fx-len/2+ (len/n)*k, baseH+railH/2, fz, 0.05, railH, 0.05, 0x2f6b3f, 1.0);
      var m2=Math.max(1,Math.round(len/4));
      for(k=0;k<=m2;k++) B.box(fx-len/2+(len/m2)*k, baseH+railH/2, fz, 0.14, railH, 0.14, 0x24512f, 1.0);
    }else{
      B.box(fx,baseH/2,fz,t,baseH,len,STONE,1.0);
      B.box(fx,baseH+0.06,fz,0.24,0.12,len,0x8f938f,1.0);
      B.box(fx,baseH+railH,fz,0.16,0.10,len,0x2f6b3f,1.0);
      var n2=Math.max(2,Math.round(len/0.55)), k2;
      for(k2=0;k2<=n2;k2++) B.box(fx, baseH+railH/2, fz-len/2+ (len/n2)*k2, 0.05, railH, 0.05, 0x2f6b3f, 1.0);
      var m3=Math.max(1,Math.round(len/4));
      for(k2=0;k2<=m3;k2++) B.box(fx, baseH+railH/2, fz-len/2+(len/m3)*k2, 0.14, railH, 0.14, 0x24512f, 1.0);
    }
  }
  function fenceSide(horiz, fixed, a0, a1, gaps){
    gaps=gaps.slice().sort(function(p,q){ return p[0]-q[0]; });
    var cur=a0, gi;
    for(gi=0;gi<gaps.length;gi++){
      var g0=gaps[gi][0]-gaps[gi][1], g1=gaps[gi][0]+gaps[gi][1];
      if(g0>cur){ if(horiz) fenceRun((cur+g0)/2,fixed,g0-cur,true); else fenceRun(fixed,(cur+g0)/2,g0-cur,false); }
      cur=Math.max(cur,g1);
    }
    if(a1>cur){ if(horiz) fenceRun((cur+a1)/2,fixed,a1-cur,true); else fenceRun(fixed,(cur+a1)/2,a1-cur,false); }
  }
  /* 校门：vert=true 时门开在东西两侧的墙上，沿 z 方向展开 */
  function gateModel(wx,wy,wide,tallSign,vert){
    var gx=wx*SC*U2M, gz=wy*SC*U2M;
    function put(u,y,v,w,h,dd,col,l){ if(vert) B.box(gx+v,y,gz+u,dd,h,w,col,l); else B.box(gx+u,y,gz+v,w,h,dd,col,l); }
    var pw=0.62, ph=tallSign?4.6:3.0;
    put(-wide/2,ph/2,0,pw,ph,pw,0xc9c2b4,1.05);                  /* 门柱 */
    put( wide/2,ph/2,0,pw,ph,pw,0xc9c2b4,1.05);
    put(-wide/2,ph+0.10,0,pw*1.3,0.20,pw*1.3,0xa8a296,1.05);
    put( wide/2,ph+0.10,0,pw*1.3,0.20,pw*1.3,0xa8a296,1.05);
    var doorW=wide*0.60, d0=-wide/2+pw*0.5;                       /* 电动伸缩门 / 铁栅门，关着 */
    put(d0+doorW/2,1.30,0,doorW,0.10,0.12,0x3d474f,1.0);
    put(d0+doorW/2,2.40,0,doorW,0.10,0.12,0x3d474f,1.0);
    put(d0+doorW/2,0.20,0,doorW,0.14,0.14,0x3d474f,1.0);
    var bars=Math.max(6,Math.round(doorW/0.30)), bi;
    for(bi=0;bi<=bars;bi++) put(d0+(doorW/bars)*bi,1.30,0,0.045,2.30,0.045,0x2b333a,1.0);
    if(tallSign){
      var tx0=d0+doorW+0.9, n=3, ti;                              /* 闸机：三道 */
      for(ti=0;ti<n;ti++){
        var tu=tx0+ti*1.05;
        put(tu,0.52,0,0.28,1.04,0.95,0x8a9298,1.08);
        put(tu,1.05,-0.30,0.24,0.06,0.10,0x2b3b44,1.0);
        put(tu,0.99,-0.30,0.12,0.05,0.06,0x39c08a,1.6);           /* 闸机上的小灯，常亮红/绿 */
        put(tu+0.50,0.82,0,0.04,0.04,0.80,0x9aa0a4,1.1);         /* 拦杆 */
      }
      put(0,ph+0.95,0,wide*0.92,0.80,0.18,0xe8e4de,1.10);         /* 门头 */
      put(0,ph+0.95,0.10,wide*0.80,0.58,0.03,0x8b3a2e,1.0);
      put(0,ph+0.95,-0.10,wide*0.80,0.58,0.03,0x8b3a2e,1.0);
    }else{
      put(0,ph+0.25,0,wide+0.3,0.22,0.5,0xa8a296,1.05);            /* 小门的门楣 */
      put(wide*0.25,1.15,0.09,0.10,0.10,0.06,0xc8a24a,1.3);        /* 挂锁 */
    }
    put(0,0.05,0,wide*1.05,0.10,1.6,0x8a8a86,1.0);                 /* 门槛石 */
  }
  if(!DEV_HIDE.fence){
    var gN=GATE_N.x*SC*U2M, gWz=GATE_W.y*SC*U2M, gS=GATE_S.x*SC*U2M;
    var NW=12.0, WW=5.0, SW2=5.4;
    gateModel(GATE_N.x,GATE_N.y,NW,true,false);
    gateModel(GATE_W.x,GATE_W.y,WW,false,true);
    gateModel(GATE_S.x,GATE_S.y,SW2,false,false);
    fenceSide(true,  y0, x0, x1, [[gN,NW/2+0.3]]);
    fenceSide(true,  y1, x0, x1, [[gS,SW2/2+0.3]]);
    fenceSide(false, x0, y0, y1, [[gWz,WW/2+0.3]]);
    fenceSide(false, x1, y0, y1, []);
  }

  var grp=new THREE.Group();
  var mB=new THREE.Mesh(B.build(),matFor('wall'));

  var mF=new THREE.Mesh(BF.build(),new THREE.MeshPhongMaterial({vertexColors:true,shininess:0,specular:0x000000,flatShading:false}));

  grp.add(mB); grp.add(mF);
  /* 草地 → 砖缝 → 地砖：三层几乎共面，用多边形偏移定先后（以前远处砖缝会闪出草色） */
  function flatMesh(bb,f,u){
    var mm=new THREE.MeshPhongMaterial({vertexColors:true,shininess:0,specular:0x000000,polygonOffset:true,polygonOffsetFactor:f,polygonOffsetUnits:u});
    var me=new THREE.Mesh(bb.build(),mm); me.renderOrder=-1; return me;
  }
  if(OUTX.G.v) grp.add(flatMesh(OUTX.G,4,8));
  if(OUTX.J.v) grp.add(flatMesh(OUTX.J,2,4));
  /* 灯头 / 亮着的窗：MeshBasic，颜色由 lampTick() 按昼夜调 */
  if(!GLR.lampHeadMat) GLR.lampHeadMat=new THREE.MeshBasicMaterial({vertexColors:true,fog:true});
  if(!GLR.winLitMat) GLR.winLitMat=new THREE.MeshBasicMaterial({vertexColors:true,fog:true});
  if(OUTX.L.v){ var mL=new THREE.Mesh(OUTX.L.build(),GLR.lampHeadMat); grp.add(mL); }
  if(OUTX.W.v){ var mW=new THREE.Mesh(OUTX.W.build(),GLR.winLitMat); grp.add(mW); }
  try{ addGrass(grp); }catch(e){}
  try{ if(!DEV_HIDE.sign) addGardenSign(grp); }catch(e){}
  return grp;
}
