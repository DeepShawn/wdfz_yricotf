/* 里世界 3D · 建模工具 */
'use strict';

var UVTILE=2.4;                     /* 1 张贴图覆盖 1.5 米 */
function BoxBuilder(){ this.p=[]; this.n=[]; this.c=[]; this.u=[]; this.i=[]; this.v=0; }
BoxBuilder.prototype.box=function(x,y,z,sx,sy,sz,col,shade){
  shade=shade===undefined?1:shade;
  var r=((col>>16)&255)/255*shade, g=((col>>8)&255)/255*shade, b=(col&255)/255*shade;
  var hx=sx/2,hy=sy/2,hz=sz/2;
  var P=this.p,N=this.n,C=this.c,U=this.u,I=this.i,v=this.v;
  function face(ax,ay,az,bx,by,bz,cx,cy,cz,dx,dy,dz,nx,ny,nz,plane){
    P.push(x+ax,y+ay,z+az, x+bx,y+by,z+bz, x+cx,y+cy,z+cz, x+dx,y+dy,z+dz);
    var pts=[[ax,ay,az],[bx,by,bz],[cx,cy,cz],[dx,dy,dz]];
    for(var k=0;k<4;k++){
      N.push(nx,ny,nz); C.push(r,g,b);
      var px=x+pts[k][0], py=y+pts[k][1], pz=z+pts[k][2], uu, vv;
      if(plane===0){ uu=px; vv=py; }        /* ±Z 面 */
      else if(plane===1){ uu=pz; vv=py; }   /* ±X 面 */
      else { uu=px; vv=pz; }                /* ±Y 面 */
      U.push(uu/UVTILE, vv/UVTILE);
    }
    I.push(v,v+1,v+2, v,v+2,v+3);
    v+=4;
  }
  face(-hx,-hy, hz,  hx,-hy, hz,  hx, hy, hz, -hx, hy, hz,  0,0,1,0);
  face( hx,-hy,-hz, -hx,-hy,-hz, -hx, hy,-hz,  hx, hy,-hz,  0,0,-1,0);
  face( hx,-hy, hz,  hx,-hy,-hz,  hx, hy,-hz,  hx, hy, hz,  1,0,0,1);
  face(-hx,-hy,-hz, -hx,-hy, hz, -hx, hy, hz, -hx, hy,-hz, -1,0,0,1);
  face(-hx, hy, hz,  hx, hy, hz,  hx, hy,-hz, -hx, hy,-hz,  0,1,0,2);
  face(-hx,-hy,-hz,  hx,-hy,-hz,  hx,-hy, hz, -hx,-hy, hz,  0,-1,0,2);
  this.v=v;
};
BoxBuilder.prototype.quad=function(ax,az,bx,bz,cx,cz,dx,dz,y,col){
  /* 地面四边形必须朝上：顶点顺序反了就会被背面剔除。
     以前操场、球场、花园的四边形全是反的 —— 从上面看根本不存在，只剩几根白线。 */
  if((bz-az)*(cx-ax)-(bx-ax)*(cz-az)<0){ var tx=bx,tz=bz; bx=dx; bz=dz; dx=tx; dz=tz; }
  var r=((col>>16)&255)/255,g=((col>>8)&255)/255,b=(col&255)/255;
  this.p.push(ax,y,az, bx,y,bz, cx,y,cz, dx,y,dz);
  var xs=[ax,bx,cx,dx], zs=[az,bz,cz,dz];
  for(var k=0;k<4;k++){ this.n.push(0,1,0); this.c.push(r,g,b); this.u.push(xs[k]/UVTILE, zs[k]/UVTILE); }
  this.i.push(this.v,this.v+1,this.v+2, this.v,this.v+2,this.v+3);
  this.v+=4;
};
BoxBuilder.prototype.quadN=function(A,B,C,Dd,nx,ny,nz,col){
  var r=((col>>16)&255)/255,g=((col>>8)&255)/255,b=(col&255)/255;
  this.p.push(A[0],A[1],A[2], B[0],B[1],B[2], C[0],C[1],C[2], Dd[0],Dd[1],Dd[2]);
  var pts=[A,B,C,Dd];
  for(var k=0;k<4;k++){
    this.n.push(nx,ny,nz); this.c.push(r,g,b);
    this.u.push(pts[k][0]/UVTILE, (Math.abs(ny)>0.5?pts[k][2]:pts[k][1])/UVTILE);
  }
  this.i.push(this.v,this.v+1,this.v+2, this.v,this.v+2,this.v+3);
  this.v+=4;
};

BoxBuilder.prototype.aoPatch=function(x,z,sx,sz,strength){
  var s=strength===undefined?1:strength;
  this.quad(x-sx*0.575,z-sz*0.575, x+sx*0.575,z-sz*0.575, x+sx*0.575,z+sz*0.575, x-sx*0.575,z+sz*0.575, 0.0035, 0x3b3a37);
  this.quad(x-sx*0.50,z-sz*0.50, x+sx*0.50,z-sz*0.50, x+sx*0.50,z+sz*0.50, x-sx*0.50,z+sz*0.50, 0.0045, s>0.8?0x2a2926:0x35332f);
};
BoxBuilder.prototype.rimTop=function(x,y,z,sx,sy,sz,col,shade,b){
  b=b||0.018;
  var hx=sx/2,hy=sy/2,hz=sz/2, ty=y+hy, by=ty-b;
  var c=(col===undefined)?0xffffff:col;
  var s=shade===undefined?1.18:shade;
  this.quadN([x-hx,ty,z+hz],[x+hx,ty,z+hz],[x+hx,by,z+hz-b*0.2],[x-hx,by,z+hz-b*0.2], 0,0.35,0.94, c);
  this.quadN([x+hx,ty,z-hz],[x-hx,ty,z-hz],[x-hx,by,z-hz+b*0.2],[x+hx,by,z-hz+b*0.2], 0,0.35,-0.94, c);
  this.quadN([x+hx,ty,z+hz],[x+hx,ty,z-hz],[x+hx,by,z-hz],[x+hx,by,z+hz], 0.94,0.35,0, c);
  this.quadN([x-hx,ty,z-hz],[x-hx,ty,z+hz],[x-hx,by,z+hz],[x-hx,by,z-hz], -0.94,0.35,0, c);
};
BoxBuilder.prototype.build=function(){
  var g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(this.u,2));
  g.setIndex(this.i);
  g.computeBoundingSphere();
  return g;
};

function makeTex(kind){
  var SZ=512, cv=document.createElement('canvas');
  cv.width=SZ; cv.height=SZ;
  var c=cv.getContext('2d');
  if(!c) return null;
  var i;
  function grain(center,amp,alpha,count){
    c.globalAlpha=alpha;
    for(i=0;i<count;i++){
      var v=Math.round(center+(Math.random()-0.5)*amp);
      v=v<0?0:(v>255?255:v);
      c.fillStyle='rgb('+v+','+v+','+v+')';
      c.fillRect(Math.random()*SZ,Math.random()*SZ,3+Math.random()*5,3+Math.random()*5);
    }
    c.globalAlpha=1;
  }
  c.fillStyle='#e4e4e4'; c.fillRect(0,0,SZ,SZ);
  if(kind==='wall'){
    var sk2;
    for(sk2=0;sk2<7;sk2++){
      var sx2=Math.random()*SZ, sw2=6+Math.random()*22, sh2=90+Math.random()*260;
      var gr=c.createLinearGradient(0,0,0,sh2);
      gr.addColorStop(0,'rgba(120,116,110,0.14)');
      gr.addColorStop(1,'rgba(120,116,110,0)');
      c.fillStyle=gr; c.fillRect(sx2,0,sw2,sh2);
    }
    for(i=0;i<22;i++){
      c.globalAlpha=0.05+Math.random()*0.05;
      c.fillStyle=Math.random()>0.5?'#ffffff':'#c2c2c2';
      c.fillRect(0,Math.random()*SZ,SZ,1+Math.random()*4);
    }
    c.globalAlpha=1;
    grain(230,16,0.10,4800);
  }else if(kind==='floor'){
    c.fillStyle='#dcdcdc'; c.fillRect(0,0,SZ,SZ);
    c.strokeStyle='#b4b4b4'; c.lineWidth=2;
    for(i=0;i<=2;i++){
      c.beginPath(); c.moveTo(i*SZ/2,0); c.lineTo(i*SZ/2,SZ); c.stroke();
      c.beginPath(); c.moveTo(0,i*SZ/2); c.lineTo(SZ,i*SZ/2); c.stroke();
    }
    grain(228,14,0.09,3600);
  }else if(kind==='wood'){
    for(i=0;i<120;i++){
      c.globalAlpha=0.05+Math.random()*0.07;
      c.fillStyle=Math.random()>0.5?'#ffffff':'#c6c6c6';
      c.fillRect(Math.random()*SZ,0,1+Math.random()*2.6,SZ);
    }
    c.globalAlpha=1;
    grain(230,12,0.07,3200);
  }else{
    c.fillStyle='#cfcfcf'; c.fillRect(0,0,SZ,SZ);
    for(i=0;i<7;i++){
      c.globalAlpha=0.09+Math.random()*0.10;
      c.strokeStyle='#f2f2f2'; c.lineWidth=1+Math.random()*3;
      var sx=Math.random()*SZ, sy=Math.random()*SZ;
      c.beginPath(); c.moveTo(sx,sy);
      c.bezierCurveTo(sx+40,sy+10,sx+80,sy-16,sx+120+Math.random()*60,sy+6);
      c.stroke();
    }
    c.globalAlpha=1;
    grain(212,14,0.07,2800);
  }
  var t=new THREE.CanvasTexture(cv);
  t.wrapS=THREE.RepeatWrapping; t.wrapT=THREE.RepeatWrapping;
  try{
    var maxAniso=GLR.renderer&&GLR.renderer.capabilities&&GLR.renderer.capabilities.getMaxAnisotropy
      ? GLR.renderer.capabilities.getMaxAnisotropy() : 8;
    t.anisotropy=maxAniso;
  }catch(e){ t.anisotropy=8; }
  t.generateMipmaps=true;
  t.minFilter=THREE.LinearMipmapLinearFilter;
  t.magFilter=THREE.LinearFilter;
  t.colorSpace=THREE.SRGBColorSpace;
  return t;
}
function texFor(kind){
  if(!GLR.tex) GLR.tex={};
  if(!GLR.tex[kind]) GLR.tex[kind]=makeTex(kind);
  return GLR.tex[kind];
}
function matFor(kind,tint){
  var m={vertexColors:true,shininess:0,specular:0x000000,flatShading:false};
  if(!NOTEX){
    var t=texFor(kind);
    if(t) m.map=t;
  }
  return new THREE.MeshPhongMaterial(m);
}

function hash2(a,b){ var h=(a*374761393+b*668265263)^0x5bf03635; h=(h^(h>>13))*1274126177; return ((h^(h>>16))>>>0)/4294967295; }
function shadeHex(col,s){
  var r=Math.min(255,Math.max(0,((col>>16)&255)*s))|0;
  var g=Math.min(255,Math.max(0,((col>>8)&255)*s))|0;
  var b=Math.min(255,Math.max(0,(col&255)*s))|0;
  return (r<<16)|(g<<8)|b;
}
function furnH(ch){
  switch(ch){
    case '#': return WALLH;
    case '=': return WALLH;
    case 'T': return 1.05;
    case 'd': return 0.74;
    case 'P': return 0.46;
    case 'b': return 0.55;
    case 't': return 0.75;
    case 'k': return 0.95;
    case 'f': return 1.9;
    case 'R': return 1.85;
    case 'l': return 0.92;
    case 'w': return 0.85;
    case 'v': return 1.7;
    case 'c': return 1.35;
    case 'D': return 1.1;
    case 'X': return 1.15;
    case 'B': case 'G': return 1.3;
    case 'S': return 0.16;
    case 'O': return 0.02;
    case 'K': return 1.05;
    case 'C': return 0.72;
    case 'N': return 1.20;
    case 'Z': return 1.00;
    case 'Y': return 1.20;
    default: return 0;
  }
}
function furnInset(ch){
  switch(ch){
    case 'd': return 0.28; case 'P': return 0.34; case 't': return 0.20;
    case 'k': return 0.18; case 'c': return 0.10; case 'R': case 'v': return 0.30;
    default: return 0;
  }
}

function stairInfo(R,x,y){
  var gw=1,gd=1,gx2,gy2;
  for(gx2=x+1; gx2<R.cols && R.grid[y][gx2]==='S'; gx2++) gw++;
  for(gy2=y+1; gy2<R.rows && R.grid[gy2][x]==='S'; gy2++) gd++;
  var longX=(gw>=gd);
  function tf(cc,rr){
    if(cc<0||rr<0||cc>=R.cols||rr>=R.rows) return -2;      /* 越界 = 楼外 */
    var t=R.grid[rr][cc];
    return (t==='#'||t==='='||t==='O')?-1:1;
  }
  var dirs=longX?[[0,1],[0,-1]]:[[1,0],[-1,0]];
  var best=dirs[0], bestScore=1e9, bestBlock=-2, di;
  for(di=0;di<2;di++){
    var dd=dirs[di], sc=0, blk=-2;
    for(var k2=1;k2<=3;k2++){
      var fr=tf(x+dd[0]*k2, y+dd[1]*k2);
      if(fr<0){ blk=fr; break; }
      sc++;
    }
    if(sc<bestScore){ bestScore=sc; best=dd; bestBlock=blk; }
  }
  return {gw:gw,gd:gd,longX:longX,dx:best[0],dy:best[1],free:bestScore,block:bestBlock};
}
