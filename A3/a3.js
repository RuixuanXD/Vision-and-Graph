import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);

  const slop = (y2-y1)/(x2-x1);
  let rgb = [r1,g1,b1];
  let colorStart = [r1,g1,b1];
  let colorEnd = [r2,g2,b2];

  if(Math.abs(slop) <= 1){

    let y = y1;
    let lineLen = Math.max(x1,x2) - Math.min(x1,x2);

    if(x1 < x2){
      colorStart = [r1,g1,b1];
      colorEnd = [r2,g2,b2];
    }
    else{
      y = y1
      colorStart = [r2,g2,b2];
      colorEnd = [r1,g1,b1];
    }
    rgb = colorStart;
    for(let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++){
      rgb = [rgb[0]+(colorEnd[0]-colorStart[0])/lineLen,rgb[1]+(colorEnd[1]-colorStart[1])/lineLen,rgb[2]+(colorEnd[2]-colorStart[2])/lineLen];
      this.setPixel(x,Math.floor(y),rgb);
      y += slop;
    }
  }
  else{

    let x = x1;
    let lineLen = Math.max(y1,y2) - Math.min(y1,y2);

    if(y1 < y2){
      colorStart = [r1,g1,b1];
      colorEnd = [r2,g2,b2];
    }
    else{
      x = x1
      colorStart = [r2,g2,b2];
      colorEnd = [r1,g1,b1];
    }
    rgb = colorStart;
    for(let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++){
      //rgb = x/lineLen*colorStart;
      rgb = [rgb[0]+(colorEnd[0]-colorStart[0])/lineLen,rgb[1]+(colorEnd[1]-colorStart[1])/lineLen,rgb[2]+(colorEnd[2]-colorStart[2])/lineLen];
      this.setPixel(Math.floor(x),y,rgb);
      x += 1/slop;
    }
  }
}



// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
  this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);

  let xMin = Math.ceil(Math.min(x1,x2,x3));
  let yMin = Math.ceil(Math.min(y1,y2,y3));
  let xMax = Math.ceil(Math.max(x1,x2,x3));
  let yMax = Math.ceil(Math.max(y1,y2,y3));
  let rgb = [r1,g1,b1];
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      let p = [Math.floor(x), Math.floor(y)];
      if (pointIsInsideTriangle(v1,v2,v3,p)){
        let coords = barycentricCoordinates(v1,v2,v3,p);
        rgb = interpolateColors(v1,v2,v3,coords);
        this.setPixel(x,y,rgb);
      }
    }
  }
}

//left = true, right = false
function leftOrRight(a, b, p) {
  const [x1,y1,rgb1] = a;
  const [x2,y2,rgb2] = b;
  const [px,py,prgb] = p;

  let result = px*(y2-y1)+py*(x1-x2)+(x2*y1-x1*y2);
  if(result >= 0){
    return true;
  }
  else{
    return false;
  }
}

function pointIsInsideTriangle(v1, v2, v3, p) {
  let r1 = leftOrRight(v1,v2,p);
  let r2 = leftOrRight(v2,v3,p);
  let r3 = leftOrRight(v3,v1,p);

  if(r1 == r2 == r3){
    return true;
  }
  else{
    return false;
  }
}

function areaOfTriangle(a,b,c){
  const [x1,y1,rgb1] = a;
  const [x2,y2,rgb2] = b;
  const [px,py,prgb] = c;
  let result = px*(y2-y1)+py*(x1-x2)+(x2*y1-x1*y2);
  return result;
}

function barycentricCoordinates(v1,v2,v3,p){
  let abc = areaOfTriangle(v1,v2,v3);
  let pbc = areaOfTriangle(p,v2,v3);
  let pca = areaOfTriangle(p,v3,v1);
  let u = pbc / abc;
  let v = pca / abc;
  let w = 1-u-v;
  
  return [u,v,w];
}

function interpolateColors(v1, v2, v3, p) {
  const [x1,y1,[r1,g1,b1]] = v1;
  const [x2,y2,[r2,g2,b2]] = v2;
  const [x3,y3,[r3,g3,b3]] = v3;
  const [u,v,w] = p;

  const r = r1*u+r2*v+r3*w;
  const g = g1*u+g2*v+g3*w;
  const b = b1*u+b2*v+b3*w;

  return [r,g,b];
}

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  // "v,10,10,1.0,0.0,0.0;",
  // "v,52,52,0.0,1.0,0.0;",
  // "v,52,10,0.0,0.0,1.0;",
  // "v,10,52,1.0,1.0,1.0;",
  // "t,0,1,2;",
  // "t,0,3,1;",
  // "v,10,10,1.0,1.0,1.0;",
  // "v,10,52,0.0,0.0,0.0;",
  // "v,52,52,1.0,1.0,1.0;",
  // "v,52,10,0.0,0.0,0.0;",
  // "l,4,5;",
  // "l,5,6;",
  // "l,6,7;",
  // "l,7,4;"

  //bonus: 
  "v,5,5,1.0,0.0,0.0;",
  "v,26,26,0.0,1.0,0.0;",
  "v,26,5,0.0,0.0,1.0;",
  "v,5,26,1.0,1.0,1.0;",
  "t,0,1,2;",
  "t,0,3,4;",
  "v,5,5,1.0,1.0,1.0;",
  "v,5,26,0.0,0.0,0.0;",
  "v,26,26,1.0,1.0,1.0;",
  "v,26,5,0.0,0.0,0.0;",
  "l,3,8;",
  "l,6,9;",
  "l,7,10;",
  "l,8,12;",
  //"l,1,2"
  "v,26,26,1.0,0.0,0.0;",
  "v,52,52,0.0,1.0,0.0;",
  "v,52,26,0.0,0.0,1.0;",
  "v,26,52,1.0,1.0,1.0;",
  "t,1,3,2;",
  "t,2,3,1;",
  "v,26,26,1.0,1.0,1.0;",
  "v,26,52,0.0,0.0,0.0;",
  "v,52,52,1.0,1.0,1.0;",
  "v,52,26,0.0,0.0,0.0;",
  "l,8,9;",
  "l,7,10;",
  "l,3,11;",
  "l,8,12;",
  
  
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
