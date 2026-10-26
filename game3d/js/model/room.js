/* 里世界 3D · 室内建模 */
'use strict';

function buildRoomGeometry(R){
  S.__pianoPlaced=0;
  R.stats={desk:0, cubicle:0, chair:0, seat:0};
  R.stairExtra=[];                 /* 以前每进一次房间都往里追加一遍，越积越多 */
  R.propExtra=[];                  /* 大件家具的真实占地（米，房间中心为原点） */
  function solidM(cx,cz,sx,sz){ R.propExtra.push({x0:cx-sx/2,x1:cx+sx/2,z0:cz-sz/2,z1:cz+sz/2}); }
  var STAIR_CUT={};
  (function(){
    var cx2,cy2;
    for(cy2=0;cy2<R.rows;cy2++){
      for(cx2=0;cx2<R.cols;cx2++){
        if(R.grid[cy2][cx2]!=='S') continue;
        if((cx2>0&&R.grid[cy2][cx2-1]==='S')||(cy2>0&&R.grid[cy2-1][cx2]==='S')) continue;
        var si=stairInfo(R,cx2,cy2);
        if(si.block!==-1) continue;
        var ii, mx2, my2;
        for(ii=0;ii<(si.longX?si.gw:si.gd);ii++){
          mx2=cx2+si.dx+(si.longX?ii:0); my2=cy2+si.dy+(si.longX?0:ii);
          if(mx2>=0&&my2>=0&&mx2<R.cols&&my2<R.rows&&R.grid[my2][mx2]==='#') STAIR_CUT[mx2+','+my2]=1;
        }
      }
    }
  })();
  var B=new BoxBuilder();      /* 墙 + 家具 */
  var BF=new BoxBuilder();     /* 地面（地砖贴图） */      /* 受光实体 */
  var G=new BoxBuilder();      /* 自发光（窗、灯管）：不吃光照，始终亮 */
  var W=R.cols,H=R.rows,tw=TTILE*U2M,th=TTILE*U2M;
  var halfW=W*tw*0.5, halfH=H*th*0.5;
  var i,x,y,ch;
  var isRoof=(R.host==='teach'&&R.floor===6);
  for(var fy=0;fy<H;fy++){
    for(var fx=0;fx<W;fx++){
      var qx0=-halfW+fx*tw, qx1=qx0+tw;
      var qz0=-halfH+fy*th, qz1=qz0+th;
      var chk=((fx+fy)&1)?1.0:0.90;
      var shf=chk*(0.96+0.06*hash2(fx+7,fy+13));
      BF.quad(qx0,qz1, qx1,qz1, qx1,qz0, qx0,qz0, 0, shadeHex(PALETTE.floor,shf));
    }
  }
  if(!isRoof){
    B.quadN([-halfW,WALLH,-halfH],[halfW,WALLH,-halfH],[halfW,WALLH,halfH],[-halfW,WALLH,halfH],0,-1,0,0x252c32);
  }
  function CX(c){ return (c+0.5)*tw-halfW; }
  function CZ(r){ return (r+0.5)*th-halfH; }

  for(y=0;y<H;y++){
    for(x=0;x<W;x++){
      ch=R.grid[y][x]; if(ch===undefined) continue;
      var cx=CX(x), cz=CZ(y);
      if(ch==='.') continue;
      if(ch==='O'){
        /* 外墙上的出口：门框 + 两扇玻璃门 + 门上的安全出口灯（以前这一格什么都不画，墙上就是个洞） */
        var onB=(y===0||y===H-1||x===0||x===W-1);
        if(!onB) continue;
        var vert=(x===0||x===W-1), sgn=(x===0||y===0)?-1:1;
        var ox=vert?cx+sgn*tw*0.30:cx, oz=vert?cz:cz+sgn*th*0.30;
        function DP(u,yy,v,su,sy,sv,col,sh){ if(vert) B.box(ox+v,yy,oz+u,sv,sy,su,col,sh); else B.box(ox+u,yy,oz+v,su,sy,sv,col,sh); }
        B.box(cx,(2.30+WALLH)/2,cz,tw,WALLH-2.30,th,PALETTE.wall,0.94);       /* 门头 */
        DP(-tw/2+0.04,1.15,0,0.08,2.30,0.16,0x39424a,1.05);
        DP( tw/2-0.04,1.15,0,0.08,2.30,0.16,0x39424a,1.05);
        DP(0,2.26,0,tw,0.08,0.16,0x39424a,1.05);
        DP(-tw*0.24,1.12,0,tw*0.44,2.18,0.04,0x2a3a44,1.0);                  /* 玻璃（暗） */
        DP( tw*0.24,1.12,0,tw*0.44,2.18,0.04,0x2a3a44,1.0);
        DP(0,1.12,0,0.05,2.18,0.06,0x39424a,1.0);
        DP(-0.07,1.05,-sgn*0.05,0.03,0.40,0.03,0xb8c0c2,1.2);               /* 推杆 */
        DP( 0.07,1.05,-sgn*0.05,0.03,0.40,0.03,0xb8c0c2,1.2);
        G.box(vert?cx-sgn*0.12:cx, 2.48, vert?cz:cz-sgn*0.12, vert?0.04:0.42, 0.16, vert?0.42:0.04, 0x37c47a, 1.0);   /* 安全出口 */
        continue;
      }
      if(ch==='U'){                     /* 钟楼的铜钟：吊在横梁上 */
        B.box(cx,2.82,cz,tw*2.6,0.18,0.22,0x3a2a1c,1.0);
        B.box(cx,2.60,cz,0.10,0.30,0.10,0x2a2018,1.0);
        var bl0;
        for(bl0=0;bl0<6;bl0++){
          var bw0=0.62+bl0*0.13, by0=2.36-bl0*0.17;
          B.box(cx,by0,cz,bw0,0.18,bw0,bl0%2?0x6e5228:0x7c5c2c,1.0+bl0*0.03);
        }
        B.box(cx,1.38,cz,1.40,0.08,1.40,0x5a4220,0.95);                    /* 钟口 */
        B.box(cx,1.32,cz,0.16,0.20,0.16,0x2a2018,1.0);                     /* 钟舌 */
        B.box(cx+0.9,1.9,cz,1.1,0.12,0.12,0x5a4632,1.0);                    /* 撞木 */
        BF.aoPatch(cx,cz,1.5,1.5,0.8);
        solidM(cx,cz,1.3,1.3);
        continue;
      }
      if(ch==='A'){                     /* 供桌：香炉、白蜡烛、一碗插着筷子的饭 */
        BF.aoPatch(cx,cz,1.3,0.8,0.9);
        B.box(cx,0.80,cz,1.30,0.06,0.70,0x5a2a20,1.05);
        B.box(cx,0.40,cz,1.20,0.78,0.60,0x4a2018,0.95);
        B.box(cx,0.40,cz+0.31,1.10,0.70,0.02,0x8a2a22,1.0);
        B.box(cx,0.90,cz-0.10,0.24,0.14,0.24,0x6a5a3a,1.1);                 /* 香炉 */
        B.box(cx-0.03,1.05,cz-0.10,0.01,0.22,0.01,0x9a7a4a,1.0);
        B.box(cx+0.03,1.04,cz-0.10,0.01,0.20,0.01,0x9a7a4a,1.0);
        B.box(cx-0.45,0.98,cz,0.05,0.30,0.05,0xf0e8d8,1.1);                 /* 蜡烛 */
        B.box(cx+0.45,0.98,cz,0.05,0.30,0.05,0xf0e8d8,1.1);
        G.box(cx-0.45,1.16,cz,0.03,0.05,0.03,0xffc860,1.0);
        G.box(cx+0.45,1.16,cz,0.03,0.05,0.03,0xffc860,1.0);
        B.box(cx+0.2,0.88,cz+0.12,0.16,0.08,0.16,0xe8e2d4,1.1);             /* 饭碗 */
        B.box(cx+0.2,0.98,cz+0.12,0.012,0.18,0.012,0x3a2a1a,1.0);           /* 筷子竖着 */
        B.box(cx+0.22,0.98,cz+0.12,0.012,0.18,0.012,0x3a2a1a,1.0);
        B.box(cx-0.18,0.85,cz+0.15,0.14,0.02,0.20,0xd8d4c6,1.0);            /* 一张照片 */
        solidM(cx,cz,1.3,0.7);
        continue;
      }
      if(ch==='#'){
        if(STAIR_CUT[x+','+y]) continue;          /* 这一格让给楼梯井 */
        B.box(cx,WALLH/2,cz,tw,WALLH,th,PALETTE.wall,0.94);
        if(!isRoof){
          B.box(cx,0.075,cz,tw+0.03,0.15,th+0.03,0x242c32,1.05);
          B.box(cx,0.36,cz,tw+0.012,0.42,th+0.012,0x8b867e,0.97);
        }
        continue;
      }
      if(ch==='='){
        var isOpen=(typeof OPENDOORS!=='undefined')?!!OPENDOORS[S.room+':'+x+':'+y]:false;
        var DTOP=2.10;
        B.box(cx,(DTOP+WALLH)/2,cz,tw,WALLH-DTOP,th,PALETTE.wall,0.94);   /* 过梁 2.10→3.00 */
        var fw=0.09;
        B.box(cx-tw/2+fw/2,DTOP/2,cz+th*0.30,fw,DTOP,th*0.72,0x3d474e,1.06);
        B.box(cx+tw/2-fw/2,DTOP/2,cz+th*0.30,fw,DTOP,th*0.72,0x3d474e,1.06);
        B.box(cx,DTOP+fw/2,cz+th*0.30,tw,fw,th*0.72,0x3d474e,1.06);
        if(!isOpen){
        B.box(cx,DTOP/2-0.01,cz+th*0.16,tw*0.90-0.16,DTOP-0.06,0.055,0x222a30,1.0);
        B.box(cx,DTOP/2-0.01,cz+th*0.22,tw*0.90-0.26,DTOP-0.24,0.012,0x161d23,1.0);
        B.box(cx+tw*0.30,1.02,cz+th*0.30,0.10,0.055,0.055,0x8d9aa2,1.25);   /* 把手 */
        B.box(cx+tw*0.30,1.02,cz+th*0.36,0.035,0.035,0.10,0x8d9aa2,1.25);
        B.box(cx,0.015,cz+th*0.20,tw*0.94,0.03,th*0.60,0x2a3339,1.08);
        }
        continue;
      }
      if(ch==='S'){
        if((x>0&&R.grid[y][x-1]==='S')||(y>0&&R.grid[y-1][x]==='S')) continue;  /* 一组只建一次 */
        var sInfo=stairInfo(R,x,y);
        var gw=sInfo.gw, gd=sInfo.gd, longX=sInfo.longX;
        cx=cx+(gw-1)*tw*0.5; cz=cz+(gd-1)*th*0.5;
        var ax=longX?'z':'x';                     /* 梯段沿另一条轴往上走 */
        var dxs=sInfo.dx, dys=sInfo.dy, bestBlock=sInfo.block;
        var maxRun=(bestBlock===-2)?2.60:1.30;
        var tread=0.26, rise=0.158;
        var nR=Math.max(4,Math.min(10,Math.round(maxRun/tread)));
        var totalRun=nR*tread, totalRise=nR*rise;
        var baseOff=-0.5;
        var wid=(longX?gw:gd)*tw;                       /* 梯段宽：整组格子 */
        var halfW2=wid*0.5-0.05;
        var st2, runOff, hgt, stepZ, stepX, szX, szZ;
        var sx2=ax==='z'?wid:tread, sz2=ax==='z'?tread:wid;
        for(st2=0; st2<nR; st2++){
          runOff=baseOff+st2*tread+tread*0.5;
          hgt=(st2+1)*rise;
          stepZ=cz+(ax==='z'?dys*runOff:0);
          stepX=cx+(ax==='x'?dxs*runOff:0);
          B.box(stepX, hgt*0.5, stepZ, sx2, hgt, sz2, PALETTE.stair, 1.04-st2*0.008);
          var noseZ=stepZ-(ax==='z'?dys*tread*0.42:0);
          var noseX=stepX-(ax==='x'?dxs*tread*0.42:0);
          B.box(noseX, hgt-0.012, noseZ, ax==='z'?wid:0.06, 0.024, ax==='z'?0.06:wid, 0xc9c5bb, 1.16);
          B.box(stepX-(ax==='x'?dxs*tread*0.5:0), hgt*0.5-0.01, stepZ-(ax==='z'?dys*tread*0.5:0),
                ax==='z'?wid:0.014, Math.max(0.02,hgt-0.02), ax==='z'?0.014:wid, 0x5a5e60, 0.82);
        }
        for(st2=0; st2<nR; st2++){
          runOff=baseOff+st2*tread+tread*0.5; hgt=(st2+1)*rise+0.92;
          var rz=cz+(ax==='z'?dys*runOff:0), rx=cx+(ax==='x'?dxs*runOff:0);
          B.box(rx-halfW2, hgt, rz, 0.055, 0.055, ax==='z'?tread*1.18:0.055, 0x8b3a2e, 1.06);
          B.box(rx+halfW2, hgt, rz, 0.055, 0.055, ax==='z'?tread*1.18:0.055, 0x8b3a2e, 1.06);
          if(st2%2===0){
            B.box(rx-halfW2, hgt-0.46, rz, 0.04, 0.92, 0.04, 0x6d7376, 1.0);
            B.box(rx+halfW2, hgt-0.46, rz, 0.04, 0.92, 0.04, 0x6d7376, 1.0);
          }
        }
        var shaftD=totalRun, farOff=baseOff+shaftD;
        var bz=cz+(ax==='z'?dys*(farOff+0.06):0), bx=cx+(ax==='x'?dxs*(farOff+0.06):0);
        B.box(bx, WALLH*0.5, bz,
              ax==='z'?wid+0.12:0.12, WALLH, ax==='z'?0.12:wid+0.12, 0x0d1114, 0.75);
        var midOff=baseOff+shaftD*0.5;
        var sz4=cz+(ax==='z'?dys*midOff:0), sx4=cx+(ax==='x'?dxs*midOff:0);
        B.box(sx4-halfW2-0.05, WALLH*0.5, sz4,
              ax==='z'?0.12:shaftD, WALLH, ax==='z'?shaftD:0.12, PALETTE.wall, 0.88);
        B.box(sx4+halfW2+0.05, WALLH*0.5, sz4,
              ax==='z'?0.12:shaftD, WALLH, ax==='z'?shaftD:0.12, PALETTE.wall, 0.82);
        B.box(sx4, 2.30-0.07, sz4,
              ax==='z'?wid+0.14:shaftD, 0.14, ax==='z'?shaftD:wid+0.14, 0x2c3034, 0.72);
        var lz=cz+(ax==='z'?dys*(baseOff-0.06):0), lx=cx+(ax==='x'?dxs*(baseOff-0.06):0);
        B.box(lx, (2.30+WALLH)*0.5, lz,
              ax==='z'?wid+0.10:0.10, WALLH-2.30, ax==='z'?0.10:wid+0.10, PALETTE.wall, 0.90);
        var c0=Math.min(baseOff, farOff), c1=Math.max(baseOff, farOff);
        var ex0,ex1,ez0,ez1;
        if(ax==='z'){ ex0=cx-halfW2-0.18; ex1=cx+halfW2+0.18;
          ez0=cz+Math.min(dys*c0,dys*c1); ez1=cz+Math.max(dys*c0,dys*c1); }
        else { ez0=cz-halfW2-0.18; ez1=cz+halfW2+0.18;
          ex0=cx+Math.min(dxs*c0,dxs*c1); ex1=cx+Math.max(dxs*c0,dxs*c1); }
        if(!R.stairExtra) R.stairExtra=[];
        R.stairExtra.push({x0:ex0,x1:ex1,z0:ez0,z1:ez1});
        continue;
      }
      if(ch==='d'){
        if(R.host==='admin'){
          B.box(cx,0.73,cz+th*0.30,tw*0.98,1.45,0.07,0x9aa4a8,1.02);
          B.box(cx,1.46,cz+th*0.30,tw*1.00,0.05,0.10,0xb8c0c2,1.08);
          B.box(cx,1.02,cz-th*0.12,tw*0.46,0.32,0.05,0x1d262b,1.0);
          B.box(cx,1.02,cz-th*0.09,tw*0.42,0.26,0.02,0x7fb0c8,1.25);
          B.box(cx,0.88,cz-th*0.12,tw*0.10,0.14,0.10,0x39434a,1.0);
          B.box(cx,0.77,cz+th*0.06,tw*0.34,0.02,0.12,0x2a3238,1.0);
          B.box(cx+tw*0.30,0.82,cz-th*0.04,tw*0.20,0.10,th*0.24,0xd8d4c6,1.05);
          B.box(cx,0.46,cz-th*0.42,tw*0.42,0.08,th*0.36,0x2e3438,1.0);
          B.box(cx,0.80,cz-th*0.58,tw*0.40,0.52,0.07,0x2e3438,1.02);
          B.box(cx,0.22,cz-th*0.42,0.06,0.40,0.06,0x1d2226,1.0);
          B.box(cx+tw*0.46,0.90,cz,0.34,1.80,th*0.86,0x6e7a80,1.02);
          B.box(cx+tw*0.46,1.82,cz,0.38,0.05,th*0.88,0x9aa4a8,1.08);
          B.box(cx+tw*0.46,1.20,cz-th*0.44,0.36,0.03,0.02,0xb8c0c2,1.0);
          B.box(cx+tw*0.46,0.60,cz-th*0.44,0.36,0.03,0.02,0xb8c0c2,1.0);
          var adw=tw*0.86, add=th*0.64, adh=0.74, adz=cz-0.06;
          B.box(cx,adh,adz,adw,0.05,add,PALETTE.desk,1.06);                 /* 桌面 */
          B.box(cx,adh-0.05,adz,adw*0.98,0.06,add*0.98,0x4a3a28,0.90);      /* 桌沿暗部 */
          B.box(cx,adh-0.24,adz+add*0.42,adw*0.92,0.34,0.03,0x6a4c30,0.92); /* 挡板（朝过道） */
          B.box(cx-adw*0.30,adh-0.20,adz-add*0.24,0.30,0.40,0.28,0x8b867e,0.95); /* 抽屉柜 */
          B.box(cx-adw*0.30,adh-0.10,adz-add*0.24,0.26,0.02,0.30,0x9aa4a8,1.05);
          B.rimTop(cx,adh,adz,adw,0.05,add,0xd8c7a4,1.0,0.014);
          BF.aoPatch(cx,cz,tw*0.98,th*0.90,0.9);
          R.stats.cubicle++;
          continue;
        }
        R.stats.desk++;
        var dw=tw*0.78, dd=th*0.52, dh=0.74;
        var dz=cz-0.10;
        B.box(cx,dh,dz,dw,0.05,dd,PALETTE.desk,1.06);                 /* 桌面 */
        B.box(cx,dh-0.05,dz,dw*0.96,0.05,dd*0.96,0x2e2a24,0.92);      /* 桌斗暗部 */
        B.box(cx-dw/2+0.035,dh/2-0.04,dz,0.04,dh-0.09,dd*0.86,PALETTE.desk,0.80);
        B.box(cx+dw/2-0.035,dh/2-0.04,dz,0.04,dh-0.09,dd*0.86,PALETTE.desk,0.80);
        B.box(cx,dh-0.20,dz-dd/2+0.03,dw*0.9,0.28,0.03,PALETTE.desk,0.88);
        var hh=hash2(i*3+7, (x||0)*5+11);
        if(hh>0.42){
          B.box(cx+(hh-0.7)*0.18, dh+0.028, dz-0.03, 0.26, 0.012, 0.19, 0xb9c0b8, 1.0);
          B.box(cx+(hh-0.7)*0.18, dh+0.036, dz-0.03, 0.25, 0.006, 0.18, 0xe6ece6, 1.0);
        }
        var chz=cz+0.30;
        R.stats.chair++;
        B.box(cx,0.44,chz,tw*0.44,0.045,0.38,PALETTE.seat,1.12);
        B.box(cx,0.70,chz+0.21,tw*0.44,0.48,0.045,PALETTE.seat,1.0);
        B.box(cx,0.21,chz,tw*0.40,0.42,0.05,PALETTE.seat,0.70);
        BF.aoPatch(cx,cz,tw*0.96,th*0.70,1.0);
        B.rimTop(cx,0.74,cz,tw*0.90,0.05,th*0.60,0xd8c7a4,1.0,0.016);
        B.box(cx,0.738,cz,tw*0.92+0.018,0.014,th*0.62+0.018,0x4e3722,0.80);
        continue;
      }
      if(ch==='P'){
        if(R.stats) R.stats.seat++;
        B.box(cx,0.46,cz,tw*0.56,0.05,th*0.52,PALETTE.seat,1.1);
        B.box(cx,0.72,cz+th*0.24,tw*0.56,0.52,0.05,PALETTE.seat,1.0);
        B.box(cx,0.23,cz,tw*0.07,0.46,th*0.07,PALETTE.seat,0.75);
        continue;
      }
      if(ch==='T'){
        B.rimTop(cx,1.0,cz,tw*0.92,0.06,th*0.86,0xe0d6bc,1.0,0.018);
        BF.aoPatch(cx,cz,tw*0.9,th*0.8,0.9);
        B.box(cx,0.46,cz,tw*0.72,0.92,th*0.66,PALETTE.podium,1.0);
        B.box(cx,0.96,cz,tw*0.80,0.07,th*0.74,PALETTE.podium,1.12);
        continue;
      }
      if(ch==='V'){                     /* 车位上的车（尺寸按真实车长放大约 2.6 倍） */
        BF.aoPatch(cx,cz,tw*3.9,th*2.4,1.0);
        solidM(cx,cz,tw*3.70,th*1.85);   /* 以前碰撞只有一格的 0.82，人能直接走进车身里 */
        B.box(cx,0.80,cz,tw*3.70,1.35,th*1.85,0x39424a,1.02);
        B.box(cx,1.55,cz-th*0.08,tw*2.10,1.00,th*1.50,0x424c55,1.05);
        B.box(cx,1.58,cz+th*0.52,tw*1.95,0.72,0.12,0x18222c,1.20);
        B.box(cx,1.58,cz-th*0.60,tw*1.95,0.64,0.12,0x18222c,1.10);
        var wl, wxs=[-1,1], wzs=[-1,1];
        for(wl=0;wl<4;wl++){
          B.box(cx+wxs[wl&1]*tw*0.88,0.38,cz+wzs[(wl>>1)&1]*th*0.50,
                0.50,1.10,0.90,0x0e1216,1.0);
        }
        continue;
      }
      if(ch==='b'){
        var bdir;
        if(R.grid[y-1]&&R.grid[y-1][x]==='#') bdir=1;
        else if(R.grid[y+1]&&R.grid[y+1][x]==='#') bdir=-1;
        else bdir=(cz<0)?1:-1;
        var bw = tw*0.92, bl = th*1.62, bcz = cz + bdir*(bl-th)*0.5;
        BF.aoPatch(cx,bcz,bw*0.98,bl*0.98,0.9);
        solidM(cx,bcz,bw*0.94,bl);
        B.box(cx,0.18,bcz,bw*0.94,0.36,bl,0x5a4632,1.0);          /* 床架 */
        B.box(cx,0.42,bcz,bw*0.90,0.14,bl*0.96,0xd8d4c8,1.05);    /* 床垫 */
        B.box(cx,0.53,bcz-bdir*bl*0.34,bw*0.66,0.12,bl*0.20,0xe8e4d8,1.1); /* 枕头 */
        B.box(cx,0.51,bcz+bdir*bl*0.10,bw*0.88,0.12,bl*0.52,0x7a8a96,1.02);/* 被子 */
        B.box(cx-bw*0.48,0.55,cz-bdir*bl*0.42,0.07,1.10,0.07,0x4a3a2a,1.0); /* 床头柱 */
        B.box(cx+bw*0.48,0.55,cz-bdir*bl*0.42,0.07,1.10,0.07,0x4a3a2a,1.0);
        continue; }
      if(ch==='q'){                     /* 实验台：台面 + 柜体 + 试剂架 */
        B.box(cx,0.90,cz,tw*0.92,0.06,th*0.78,0x4c5a60,1.25);
        B.box(cx,0.44,cz,tw*0.86,0.88,th*0.70,0x7d878c,1.05);
        B.box(cx,1.22,cz-th*0.28,tw*0.86,0.06,0.10,0x55605f,1.0);
        continue;
      }
      if(ch==='n'){                     /* 学生机：桌 + 显示器 + 座椅 */
        B.box(cx,0.74,cz,tw*0.88,0.05,th*0.62,PALETTE.desk,1.05);
        B.box(cx-0.22,0.37,cz,0.05,0.74,th*0.55,PALETTE.desk,0.82);
        B.box(cx+0.22,0.37,cz,0.05,0.74,th*0.55,PALETTE.desk,0.82);
        B.box(cx,1.08,cz-0.12,tw*0.46,0.34,0.05,0x1d262b,1.0);
        B.box(cx,1.08,cz-0.09,tw*0.42,0.28,0.02,0x7fb0c8,1.25);
        B.box(cx,0.82,cz-0.12,tw*0.10,0.14,0.10,0x39434a,1.0);
        B.box(cx+0.18,0.76,cz+0.06,0.16,0.02,0.10,0x2a3036,1.0);           /* 键盘旁的鼠标 */
        B.box(cx,0.45,cz+0.42,0.40,0.05,0.38,0x2e3438,1.0);                 /* 椅子 */
        B.box(cx,0.72,cz+0.60,0.40,0.46,0.05,0x2e3438,1.0);
        B.box(cx,0.22,cz+0.42,0.05,0.44,0.05,0x1d2226,1.0);
        continue;
      }
      if(ch==='x'){                     /* 地图/挂图架 */
        B.box(cx,1.20,cz,tw*0.86,1.30,0.06,0xb9bcae,1.0);
        B.box(cx,1.20,cz-0.04,tw*0.80,1.20,0.02,0x8e9a8c,1.0);
        B.box(cx,0.30,cz,0.08,0.60,0.08,0x4a5450,1.0);
        continue;
      }
      if(ch==='p'){
        if(S.__pianoPlaced){
          B.box(cx,0.22,cz,tw*0.40,0.44,th*0.40,0x5a4a36,0.95);
          B.box(cx,0.46,cz,tw*0.42,0.05,th*0.42,0x6a5842,1.05);
          continue;
        }
        S.__pianoPlaced=1;
        var pAx='z', pn=-1;                    /* pn = 墙在哪一侧 */
        if(R.grid[y-1]&&R.grid[y-1][x]==='#'){ pAx='z'; pn=-1; }
        else if(R.grid[y+1]&&R.grid[y+1][x]==='#'){ pAx='z'; pn=1; }
        else if(R.grid[y]&&R.grid[y][x-1]==='#'){ pAx='x'; pn=-1; }
        else if(R.grid[y]&&R.grid[y][x+1]==='#'){ pAx='x'; pn=1; }
        function PB(a,b,y,sx,sy,sz,col,sh){
          if(pAx==='z') B.box(cx+a,y,cz+pn*b,sx,sy,sz,col,sh);
          else B.box(cx+pn*b,y,cz+a,sz,sy,sx,col,sh);
        }
        var pD=0.62;                           /* 琴体进深 */
        BF.aoPatch(cx,cz,1.5,1.0,0.85);
        if(pAx==='z') solidM(cx,cz+pn*(0.5-pD*0.5),1.48,pD+0.04); else solidM(cx+pn*(0.5-pD*0.5),cz,pD+0.04,1.48);
        var bBack=0.5-pD*0.5;                  /* 琴体中心（贴墙） */
        var bFront=-0.12;                      /* 琴体前沿 */
        PB(0, bBack, 0.60, 1.44, 1.20, pD, 0x23282b, 1.0);             /* 琴体 */
        PB(0, bBack, 1.22, 1.46, 0.05, pD+0.02, 0x2e3539, 1.06);       /* 顶盖 */
        PB(0, bFront-0.11, 0.72, 1.34, 0.08, 0.22, 0x14181a, 1.0);     /* 键盘托 */
        PB(0, bFront-0.09, 0.765, 1.26, 0.025, 0.13, 0xe8e4d8, 1.12);  /* 白键 */
        var bk;
        for(bk=0;bk<6;bk++){                                            /* 黑键 */
          var kbx=(bk<2)?(-0.30+bk*0.13):(-0.02+(bk-2)*0.13);
          PB(kbx, bFront-0.055, 0.783, 0.06, 0.02, 0.075, 0x101314, 0.9);
        }
        PB(0, bFront-0.03, 1.20, 0.92, 0.34, 0.035, 0x1a1f22, 1.02);   /* 谱架 */
        PB(-0.12, bFront-0.06, 0.13, 0.07, 0.05, 0.11, 0xa8913f, 1.25);/* 踏板 */
        PB(0.12, bFront-0.06, 0.13, 0.07, 0.05, 0.11, 0xa8913f, 1.25);
        PB(0, bFront-0.56, 0.46, 0.86, 0.06, 0.30, 0x5a4a36, 1.0);     /* 琴凳 */
        PB(0, bFront-0.56, 0.22, 0.80, 0.44, 0.28, 0x4a3c2c, 0.85);
        continue;
      }
      if(ch==='K'){
        if(R.host==='admin'){
          var adw=tw*1.15, add=th*0.86;
          BF.aoPatch(cx,cz,adw*1.02,add*1.02,0.9);
          solidM(cx,cz,adw,add);
          B.box(cx,0.72,cz,adw,0.06,add,0x7a5a38,1.08);                /* 桌面 */
          B.box(cx,0.375,cz,adw*0.96,0.69,add*0.92,0x6a4c30,0.93);     /* 桌身 */
          B.box(cx,0.40,cz-add*0.30,adw*0.92,0.55,0.03,0x53401f,0.86); /* 挡板 */
          B.box(cx-adw*0.34,0.40,cz+add*0.30,0.36,0.56,0.03,0x8b867e,0.95); /* 抽屉 */
          B.box(cx-adw*0.34,0.48,cz+add*0.32,0.20,0.02,0.02,0xb8a060,1.1);
          B.box(cx-adw*0.34,0.30,cz+add*0.32,0.20,0.02,0.02,0xb8a060,1.1);
          B.box(cx+adw*0.16,0.755,cz-add*0.10,0.30,0.035,0.22,0xd8d4c6,1.05);
          B.box(cx+adw*0.16,0.775,cz-add*0.10,0.28,0.008,0.20,0xeceee8,1.0);
          B.box(cx+adw*0.02,0.80,cz-add*0.24,0.09,0.14,0.09,0x3a3025,1.05);
          B.box(cx-adw*0.06,1.10,cz-add*0.18,tw*0.44,0.30,0.05,0x1d262b,1.0);
          B.box(cx-adw*0.06,1.10,cz-add*0.15,tw*0.40,0.25,0.02,0x8fb8c8,1.2);
          B.box(cx-adw*0.06,0.94,cz-add*0.18,0.09,0.14,0.09,0x39434a,1.0);
          B.box(cx,0.47,cz+add*0.70,0.46,0.09,0.40,0x2e3438,1.0);
          B.box(cx,0.78,cz+add*0.88,0.44,0.56,0.07,0x2e3438,1.02);
          B.box(cx,0.24,cz+add*0.70,0.06,0.42,0.06,0x1d2226,1.0);
        }else{
          var lw=tw*1.30, ld=th*0.82;
          BF.aoPatch(cx,cz,lw*1.02,ld*1.02,0.9);
          solidM(cx,cz,lw,ld);
          B.box(cx,0.90,cz,lw,0.07,ld,0x333d3b,1.16);                  /* 台面 */
          B.box(cx,0.44,cz,lw*0.94,0.87,ld*0.90,0x7d878c,1.0);         /* 柜体 */
          B.box(cx,0.44,cz+ld*0.46,lw*0.90,0.80,0.03,0x6b757a,1.0);    /* 柜门朝走廊，不是朝墙 */
          B.box(cx-lw*0.20,0.44,cz+ld*0.49,lw*0.30,0.02,0.02,0x9aa4a8,1.1);
          B.box(cx+lw*0.20,0.44,cz+ld*0.49,lw*0.30,0.02,0.02,0x9aa4a8,1.1);
          B.box(cx,1.34,cz-ld*0.34,lw*0.90,0.06,0.12,0x55605f,1.0);    /* 试剂架 */
          B.box(cx-lw*0.24,1.44,cz-ld*0.34,0.09,0.18,0.09,0x8ab8a0,1.15);
          B.box(cx-lw*0.06,1.42,cz-ld*0.34,0.08,0.14,0.08,0xc8a24a,1.15);
          B.box(cx+lw*0.12,1.45,cz-ld*0.34,0.08,0.20,0.08,0x9fb0c8,1.15);
          B.box(cx+lw*0.28,1.43,cz-ld*0.34,0.07,0.16,0.07,0xbc8a8a,1.15);
          B.box(cx+lw*0.24,0.90,cz+ld*0.10,tw*0.30,0.02,th*0.24,0x2a3230,1.0);
          B.box(cx+lw*0.24,0.90,cz+ld*0.10,tw*0.24,0.015,th*0.18,0x161d1c,0.9);
          B.box(cx+lw*0.24,1.06,cz-0.06,0.035,0.32,0.035,0xb8bdb8,1.2);
          B.box(cx+lw*0.24,1.22,cz+0.04,0.035,0.035,0.16,0xb8bdb8,1.2);
          B.box(cx-lw*0.22,0.95,cz+ld*0.08,0.14,0.10,0.14,0x9aa4a8,1.05); /* 烧杯 */
          B.box(cx-lw*0.22,0.985,cz+ld*0.08,0.10,0.04,0.10,0x9fd0b8,1.25);
        }
        continue;
      }
      if(ch==='C'){                     /* 离心机 */
        BF.aoPatch(cx,cz,tw*0.92,th*0.92,0.9);
        B.box(cx,0.30,cz,tw*0.78,0.60,th*0.78,0x8a9298,1.02);
        B.box(cx,0.63,cz,tw*0.82,0.07,th*0.82,0xb4bcc0,1.10);
        B.box(cx,0.68,cz,tw*0.44,0.05,th*0.44,0x2b3237,1.0);            /* 盖子 */
        B.box(cx,0.70,cz,tw*0.12,0.02,th*0.12,0x7fd0a8,1.8);            /* 指示灯 */
        B.box(cx,0.40,cz-th*0.40,tw*0.36,0.22,0.03,0x1b2226,1.0);       /* 控制面板 */
        B.box(cx-tw*0.09,0.43,cz-th*0.41,0.05,0.05,0.02,0xc85a4a,1.3);
        continue;
      }
      if(ch==='N'){                     /* 显微镜 */
        BF.aoPatch(cx,cz,tw*0.8,th*0.8,0.85);
        B.box(cx,0.38,cz,tw*0.66,0.76,th*0.62,0x6e7a80,1.0);            /* 台体 */
        B.box(cx,0.78,cz,tw*0.70,0.04,th*0.66,0x9aa4a8,1.12);           /* 台面 */
        B.box(cx,0.94,cz-th*0.10,0.10,0.28,0.10,0x2b3237,1.05);         /* 立柱 */
        B.box(cx,1.10,cz-th*0.02,0.22,0.05,0.16,0x33383c,1.1);          /* 镜臂 */
        B.box(cx,1.16,cz+th*0.04,0.07,0.14,0.07,0x1f262a,1.1);          /* 目镜 */
        B.box(cx,1.11,cz-th*0.02,0.05,0.09,0.05,0x1f262a,1.1);
        B.box(cx,1.01,cz+th*0.06,0.18,0.02,0.14,0x3a4247,1.15);         /* 载物台 */
        B.box(cx,1.03,cz+th*0.06,0.06,0.01,0.05,0xb8c8c0,1.3);          /* 玻片 */
        B.box(cx,0.93,cz+th*0.06,0.05,0.05,0.05,0xffe9b0,1.9);          /* 反光镜/光源 */
        continue;
      }
      if(ch==='Z'){                     /* 物理装置：杠杆 + 支架 */
        BF.aoPatch(cx,cz,tw*0.95,th*0.95,0.9);
        B.box(cx,0.06,cz,tw*0.80,0.12,th*0.72,0x4a5450,1.0);            /* 底座 */
        B.box(cx,0.52,cz-th*0.06,0.07,0.92,0.07,0x8a9298,1.05);         /* 立柱 */
        B.box(cx,0.98,cz-th*0.06,tw*0.86,0.05,0.09,0xb8c0c2,1.15);      /* 横梁 */
        B.box(cx-tw*0.40,0.86,cz-th*0.06,0.02,0.22,0.02,0x8a9298,1.0);  /* 吊盘线 */
        B.box(cx+tw*0.40,0.86,cz-th*0.06,0.02,0.22,0.02,0x8a9298,1.0);
        B.box(cx-tw*0.40,0.74,cz-th*0.06,0.20,0.03,0.20,0xa8b0a8,1.1);  /* 盘 */
        B.box(cx+tw*0.40,0.74,cz-th*0.06,0.20,0.03,0.20,0xa8b0a8,1.1);
        B.box(cx+tw*0.40,0.79,cz-th*0.06,0.10,0.08,0.10,0x8a7a52,1.15); /* 砝码 */
        continue;
      }
      if(ch==='Y'){                     /* 地球仪 */
        BF.aoPatch(cx,cz,tw*0.8,th*0.8,0.85);
        B.box(cx,0.04,cz,tw*0.40,0.08,th*0.40,0x4a3c2c,1.0);            /* 底座 */
        B.box(cx,0.46,cz,0.05,0.84,0.05,0x8a7a52,1.05);                 /* 立杆 */
        B.box(cx,0.92,cz,0.46,0.46,0.46,0x2f5f7a,1.05);                 /* 球体（低多边形方块近似） */
        B.box(cx,0.92,cz,0.48,0.16,0.48,0x3d7a63,1.05);                 /* 赤道/陆地色带 */
        B.box(cx+0.12,1.02,cz+0.12,0.12,0.10,0.12,0x6b8f4a,1.15);
        B.box(cx-0.10,0.84,cz-0.08,0.14,0.08,0.12,0x6b8f4a,1.1);
        B.box(cx,1.16,cz,0.10,0.04,0.10,0xa8913f,1.2);                  /* 轴帽 */
        continue;
      }
      if(ch==='t'||ch==='k'){ B.box(cx,0.74,cz,tw*0.86,0.06,th*0.8,PALETTE.table,1.06); B.box(cx,0.36,cz,tw*0.8,0.7,th*0.74,PALETTE.table,0.86); continue; }
      if(ch==='f'){
        B.aoPatch(cx,cz,tw*0.9,th*0.8,0.85);
        B.box(cx,1.05,cz,tw*0.74,2.10,th*0.78,0x2b2f33,1.02);   /* 机柜本身是深灰，暗红来自灯 */
        B.box(cx,2.15,cz,tw*0.78,0.06,th*0.82,0x1a1d20,1.0);
        B.box(cx,0.10,cz,tw*0.78,0.20,th*0.82,0x1a1d20,0.95);
        for(var qy=0;qy<5;qy++){
          var qyy=0.34+qy*0.36;
          B.box(cx,qyy,cz+th*0.40,tw*0.60,0.09,0.03,0x2e1210,1.0);
          B.box(cx-tw*0.20,qyy,cz+th*0.42,0.045,0.045,0.02,(qy%2?0xd8543a:0x4fd08a),1.7);
          B.box(cx-tw*0.13,qyy,cz+th*0.42,0.045,0.045,0.02,0xe0b040,1.5);
        }
        continue;
      }
      if(ch==='Q'){
        B.aoPatch(cx,cz,tw*0.9,th*0.8,0.85);
        B.box(cx,0.62,cz,tw*0.80,1.24,th*0.70,0x521c1a,1.02);
        B.box(cx,1.30,cz,tw*0.86,0.10,th*0.76,0x2a0f0e,1.0);
        B.box(cx,1.62,cz-0.02,tw*0.62,0.42,0.05,0x1a2024,1.0);
        B.box(cx,1.62,cz+0.01,tw*0.56,0.34,0.02,0x5ad0a0,1.35);
        continue;
      }
      if(ch==='R'){ B.box(cx,0.92,cz,tw*0.85,1.84,th*0.7,PALETTE.shelf,1.0); continue; }
      if(ch==='l'){
        BF.aoPatch(cx,cz,tw*0.96,th*0.92,0.9);
        B.box(cx,0.88,cz,tw*0.92,0.07,th*0.70,0x5b6a72,1.28);      /* 台面 */
        B.box(cx,0.44,cz,tw*0.86,0.80,th*0.60,0x8b9498,1.02);      /* 柜体 */
        B.box(cx-tw*0.41,0.44,cz,0.05,0.80,th*0.60,0x6a7478,1.0);  /* 侧板 */
        B.box(cx+tw*0.41,0.44,cz,0.05,0.80,th*0.60,0x6a7478,1.0);
        B.box(cx-tw*0.26,0.90,cz,tw*0.30,0.04,th*0.32,0x39434a,0.95);   /* 水槽 */
        B.box(cx-tw*0.26,0.86,cz,tw*0.26,0.03,th*0.28,0x5a666c,1.15);
        B.box(cx-tw*0.26,0.99,cz-th*0.15,0.03,0.16,0.03,0xa8b2b6,1.35); /* 水龙头 */
        B.box(cx-tw*0.26,1.06,cz-th*0.22,0.10,0.03,0.03,0xa8b2b6,1.35);
        B.box(cx-tw*0.38,1.07,cz-th*0.32,0.04,0.38,0.04,0x59636a,1.0);  /* 试剂架立柱 */
        B.box(cx+tw*0.38,1.07,cz-th*0.32,0.04,0.38,0.04,0x59636a,1.0);
        B.box(cx,1.26,cz-th*0.32,tw*0.88,0.05,0.13,0x59636a,1.05);      /* 试剂架 */
        B.box(cx-tw*0.28,1.38,cz-th*0.32,0.07,0.22,0.07,0x86b4c8,1.45); /* 蓝瓶 */
        B.box(cx+tw*0.03,1.37,cz-th*0.32,0.06,0.20,0.06,0xc6ae66,1.45); /* 黄瓶 */
        B.box(cx+tw*0.28,1.36,cz-th*0.32,0.05,0.18,0.05,0xd8d2c4,1.30); /* 白瓶 */
        B.box(cx+tw*0.02,0.45,cz+th*0.46,0.26,0.05,0.26,0x6a5a44,1.02); /* 凳面 */
        B.box(cx+tw*0.02,0.22,cz+th*0.46,0.05,0.44,0.05,0x4a4034,1.0);  /* 凳腿 */
        continue;
      }
      if(ch==='w'){ B.box(cx,0.42,cz,tw*0.8,0.84,th*0.7,PALETTE.basin,1.0); continue; }
      if(ch==='v'){ B.box(cx,0.85,cz,tw*0.7,1.7,th*0.55,PALETTE.rack,1.0); continue; }
      if(ch==='c'){
        BF.aoPatch(cx,cz,tw*0.5,th*0.5,0.7); B.box(cx,0.66,cz,tw*0.92,1.32,th*0.86,PALETTE.car,1.0); continue; }
      if(ch==='D'){ B.box(cx,0.78,cz,tw*0.7,1.1,th*0.6,PALETTE.data,1.05); continue; }
      if(ch==='X'){                     /* 带轮子的大垃圾桶（以前是一块灰方砖） */
        BF.aoPatch(cx,cz,tw*0.9,th*0.9,0.9);
        B.box(cx,0.62,cz,tw*0.80,1.06,th*0.78,0x2f5a3a,1.0);
        B.box(cx,1.18,cz-0.02,tw*0.86,0.07,th*0.84,0x24482e,1.05);           /* 盖子，没盖严 */
        B.box(cx,1.24,cz-th*0.40,tw*0.70,0.05,0.05,0x1a2a1e,1.0);
        B.box(cx-0.30,0.07,cz+0.30,0.12,0.14,0.06,0x111418,1.0);
        B.box(cx+0.30,0.07,cz+0.30,0.12,0.14,0.06,0x111418,1.0);
        B.box(cx,0.85,cz+th*0.40,0.30,0.30,0.01,0xd8d4c6,1.0);              /* 白色编号：3 */
        continue;
      }
      if(ch==='B'||ch==='G'){           /* 厕所隔间：两侧隔板 + 一扇关着的门，上下都留空 */
        B.box(cx-tw*0.47,1.05,cz,0.04,1.80,th*0.92,PALETTE.wall2,1.0);
        B.box(cx+tw*0.47,1.05,cz,0.04,1.80,th*0.92,PALETTE.wall2,1.0);
        B.box(cx,1.05,cz+th*0.44,tw*0.86,1.70,0.04,0x8a948e,1.0);
        B.box(cx+tw*0.30,1.05,cz+th*0.47,0.05,0.10,0.03,0xb8c0c2,1.2);
        B.box(cx+tw*0.36,1.05,cz+th*0.47,0.07,0.05,0.02,0xc04a3a,1.3);     /* 红色"有人" */
        continue;
      }
      var colName=PALETTE_NAME[ch];
      if(colName){ B.box(cx,0.4,cz,tw*0.85,0.8,th*0.85,PALETTE[colName]||PALETTE.wall,1.0); }
    }
  }

  if(R.host==='lab'&&R.floor<=5&&R.id!=='lab3'){
    var lz2=-halfH+1.0;
    B.box(0,2.86,lz2+0.55,W*0.96,0.10,0.10,0x8a9298,1.05);
    B.box(0,2.74,lz2+1.15,W*0.96,0.07,0.07,0xb46a3a,1.05);
    if(R.floor===2){
      /* 通风橱：靠在第一间、最后一间的南墙上（以前摆在隔墙正中，一半插在墙里） */
      var fh, hoodC=[3.5,43.5];
      for(fh=0;fh<2;fh++){
        var fx=-halfW+hoodC[fh]*tw, fz=-halfH+15*th-0.46;
        B.box(fx,1.10,fz,tw*1.9,2.20,0.86,0x6f7a80,1.05);              /* 柜体 */
        B.box(fx,1.35,fz-0.44,tw*1.5,0.90,0.04,0x25303a,1.0);          /* 玻璃门 */
        B.box(fx,1.35,fz-0.47,tw*1.4,0.80,0.02,0x9fc4d8,1.25);
        B.box(fx,2.26,fz,tw*1.94,0.12,0.90,0x4a545a,1.0);              /* 顶罩 */
        B.box(fx,0.90,fz-0.30,tw*1.7,0.06,0.30,0x39434a,1.0);          /* 操作台 */
        solidM(fx,fz,tw*1.9,0.9);
      }
    }
    B.box(-halfW+1.0,0.55,-halfH+1.2,0.10,1.10,0.10,0x5aa07a,1.1);
    B.box(-halfW+1.0,1.10,-halfH+1.5,0.34,0.06,0.24,0x5aa07a,1.1);
  }

  if(R.host==='c1'||R.host==='c2'){
    var cy2, wz2;
    for(cy2=1;cy2<R.rows-1;cy2++){
      wz2=-halfH+(cy2+0.5)*th;
      B.box(-halfW+0.07,1.55,wz2,0.13,1.30,th*0.94,0x9fb0ba,1.15);   /* 西窗带 */
      B.box( halfW-0.07,1.55,wz2,0.13,1.30,th*0.94,0x9fb0ba,1.15);   /* 东窗带 */
      B.box(-halfW+0.16,0.90,wz2,0.05,0.06,th*0.94,0x6a747c,1.0);     /* 窗台压边 */
      B.box( halfW-0.16,0.90,wz2,0.05,0.06,th*0.94,0x6a747c,1.0);
    }
    B.box(0,0.012,0,0.30,0.024,(R.rows-2)*th*0.96,0x59636b,1.0);     /* 地面导视条 */
  }

  if(R.host==='teach'&&R.floor>=1&&R.floor<=5){
    var zWallS=-halfH+15*th;            /* 教室南墙（走廊那侧） */
    var zWallN=-halfH+21*th;            /* 走廊北墙 */
    for(var sx=1;sx<W-1;sx+=2){
      B.quad(-halfW+sx*tw, zWallN*0.0 + (-halfH+18.55*th), -halfW+(sx+1)*tw, (-halfH+18.55*th),
             -halfW+(sx+1)*tw, (-halfH+18.45*th), -halfW+sx*tw, (-halfH+18.45*th), 0.006, 0x59636b);
    }
    for(var lx=3;lx<W-3;lx+=4){
      if(lx>=56&&lx<=61) continue;
      var lz=zWallS+th+0.24;
      B.box(-halfW+(lx+0.5)*tw, 0.86, lz, tw*0.86, 1.72, 0.42, 0x39424a, 0.98);
      B.box(-halfW+(lx+0.5)*tw, 1.28, lz+0.22, tw*0.80, 0.03, 0.02, 0x59636b, 1.0);   /* 柜门缝朝走廊 */
      solidM(-halfW+(lx+0.5)*tw, lz, tw*0.86, 0.42);
    }
    for(var bx2=6;bx2<W-6;bx2+=13){
      var bb0=Math.floor(bx2+1.3), bbOK=true;
      for(var bi=-1;bi<=1;bi++){
        var brow=R.grid.length-1;
        if(!R.grid[brow]||R.grid[brow][bb0+bi]!=='#'){ bbOK=false; break; }
      }
      if(!bbOK) continue;
      B.box(-halfW+(bx2+0.5)*tw, 1.85, zWallN-0.10, tw*2.6, 0.98, 0.06, 0x1a2126, 1.0);
      B.box(-halfW+(bx2+0.5)*tw, 1.85, zWallN-0.13, tw*2.5, 0.90, 0.02, 0x8e9a94, 1.0);
      B.box(-halfW+(bx2+7.5)*tw, 0.95, zWallN-0.12, tw*0.7, 0.9, 0.16, 0x7a3a33, 1.0);
    }
  }
  if(R.id==='gear1'){
    var gx2, gz2;
    for(gz2=0;gz2<H;gz2++){
      for(gx2=0;gx2<W;gx2++){
        if(R.grid[gz2][gx2]!=='#') continue;
        B.box(CX(gx2),WALLH/2,CZ(gz2),tw*1.02,WALLH,th*1.02,0x27502f,0.95);
      }
    }
    /* 一张乒乓球台，竖着放在货架对面（以前两张，第二张有一半在墙外） */
    var ttx=1.9, ttz=0.1;
    B.box(ttx,0.76,ttz,1.52,0.05,2.74,0x1f3f6e,1.15);
    B.box(ttx,0.785,ttz,0.02,0.005,2.70,0xe8e8e8,1.0);
    B.box(ttx-0.6,0.38,ttz-1.1,0.06,0.76,0.06,0x3a3f42,1.0); B.box(ttx+0.6,0.38,ttz-1.1,0.06,0.76,0.06,0x3a3f42,1.0);
    B.box(ttx-0.6,0.38,ttz+1.1,0.06,0.76,0.06,0x3a3f42,1.0); B.box(ttx+0.6,0.38,ttz+1.1,0.06,0.76,0.06,0x3a3f42,1.0);
    B.box(ttx,0.86,ttz,1.60,0.15,0.02,0xd8d8d2,0.95);                  /* 球网 */
    solidM(ttx,ttz,1.52,2.74);
    /* 角落里一筐篮球、一卷跳绳 */
    B.box(-2.4,0.30,1.4,0.8,0.6,0.6,0x5a5f62,1.0);
    var bb3;
    for(bb3=0;bb3<4;bb3++) B.box(-2.6+(bb3%2)*0.4,0.66,1.25+((bb3>>1)*0.3),0.24,0.24,0.24,0xc0602a,1.0);
    solidM(-2.4,1.4,0.8,0.6);
  }
  if(R.host==='teach'&&R.floor>=1&&R.floor<=5){
    var spans=[[5,11],[13,19],[21,27],[29,35],[37,43],[45,51]];
    var zSInner=-halfH+15*th;                 /* 教室南墙内表面（后墙） */
    for(i=0;i<spans.length;i++){
      var c0=spans[i][0], c1b=spans[i][1];
      var bcx=(CX(c0)+CX(c1b))/2;
      var bwid=(c1b-c0+1)*tw*0.72;
      var wz=-halfH+tw;                       /* 北墙内表面 */
      B.box(bcx,1.70,wz+0.13,bwid,1.05,0.08,0x161d22,1.0);
      B.box(bcx,1.15,wz+0.17,bwid+0.12,0.06,0.16,0x4a3f33,1.0);
      B.box(bcx,2.26,wz+0.12,bwid+0.14,0.05,0.10,0x3a3229,1.0);
      var hwid=(c1b-c0+1)*tw*0.82;
      G.quadN([bcx-hwid/2,2.86,wz+0.07],[bcx+hwid/2,2.86,wz+0.07],
              [bcx+hwid/2,2.40,wz+0.07],[bcx-hwid/2,2.40,wz+0.07],0,1,0,0x9dbdd0);
      B.box(bcx,2.93,wz+0.05,hwid+0.16,0.07,0.10,0x39434a,1.0);
      B.box(bcx,2.33,wz+0.05,hwid+0.16,0.07,0.10,0x39434a,1.0);
      for(var mu=1;mu<5;mu++){
        var mx2=bcx-hwid/2+ (hwid/5)*mu;
        B.box(mx2,2.60,wz+0.07,0.045,0.50,0.05,0x39434a,1.05);
      }
      B.box(bcx,2.58,zSInner-0.06,0.58,0.58,0.09,0x1b1f22,1.0);
      B.box(bcx,2.58,zSInner-0.11,0.46,0.46,0.02,0xc6cfcb,1.0);
      B.box(bcx,2.64,zSInner-0.13,0.03,0.20,0.01,0x22282a,1.0);
      B.box(bcx+0.06,2.58,zSInner-0.13,0.14,0.03,0.01,0x22282a,1.0);
    }
  }

  if(!isRoof&&R.host==='teach'&&R.floor>=1&&R.floor<=5){
    var bmz=(18.5)*th-halfH;
    for(var bmx=0;bmx<W;bmx+=7){
      B.box(CX(bmx),2.86,bmz,0.20,0.24,th*4.6,0xb4afa6,0.96);
    }
  }

  if(!isRoof&&R.host!=='bell'){     /* 钟楼里只有蜡烛，不挂日光灯管 */
    var rows=[];
    if(R.host==='teach'&&R.floor>=1&&R.floor<=5){ rows.push(18); }
    else { rows.push(Math.floor(H*0.5)); }
    for(i=0;i<rows.length;i++){
      for(x=3;x<W-3;x+=9){
        var lx=CX(x), lz=CZ(rows[i]);
        G.quadN([lx-0.9,WALLH-0.04,lz-0.12],[lx+0.9,WALLH-0.04,lz-0.12],[lx+0.9,WALLH-0.04,lz+0.12],[lx-0.9,WALLH-0.04,lz+0.12],0,-1,0,0xdcecf4);
      }
      if(R.host==='teach'&&R.floor>=1&&R.floor<=5){
        var cs=[[5,11],[13,19],[21,27],[29,35],[37,43],[45,51]];
        for(var ci=0;ci<cs.length;ci++){
          var mx=(CX(cs[ci][0])+CX(cs[ci][1]))/2;
          for(var rr2=4;rr2<=10;rr2+=6){
            var lz2=CZ(rr2);
            G.quadN([mx-1.1,WALLH-0.05,lz2-0.16],[mx+1.1,WALLH-0.05,lz2-0.16],[mx+1.1,WALLH-0.05,lz2+0.16],[mx-1.1,WALLH-0.05,lz2+0.16],0,-1,0,0xe6f2f8);
          }
        }
      }
    }
  }
  var meshS=new THREE.Mesh(B.build(),matFor('wall'));
  meshS.castShadow=true; meshS.receiveShadow=true;
  var meshF=new THREE.Mesh(BF.build(),new THREE.MeshPhongMaterial({vertexColors:true,shininess:0,specular:0x000000,flatShading:false}));

  var meshG=new THREE.Mesh(G.build(),new THREE.MeshBasicMaterial({vertexColors:true,fog:true}));
  meshG.frustumCulled=false;
  var grp=new THREE.Group();
  grp.add(meshS); grp.add(meshF); grp.add(meshG);
  return grp;
}
