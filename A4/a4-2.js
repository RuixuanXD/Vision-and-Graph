import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

const cube = {
  positions:[
    //front
    -1,-1,1, -1,1,1, 1,1,1,   -1,-1,1, 1,1,1, 1,-1,1,
    //left
    -1,-1,1, -1,1,-1, -1,-1,-1,   -1,1,-1, -1,-1,1, -1,1,1,
    //right
    1,-1,1, 1,1,1, 1,-1,-1,   1,-1,-1, 1,1,1, 1,1,-1,
    //top
    -1,1,1, 1,1,1, -1,1,-1,   1,1,-1, -1,1,-1, 1,1,1,
    //bottom
    -1,-1,1, 1,-1,1, -1,-1,-1,   1,-1,-1, -1,-1,-1, 1,-1,1,
    //back
    -1,-1,-1, 1,-1,-1, -1,1,-1,   1,1,-1, -1,1,-1, 1,-1,-1
  ],
  normals:[
    //front
    0,0,1, 0,0,1, 0,0,1,    0,0,1, 0,0,1, 0,0,1,
    //left
    -1,0,0, -1,0,0, -1,0,0,   -1,0,0, -1,0,0, -1,0,0,
    //right
    1,0,0, 1,0,0, 1,0,0,   1,0,0, 1,0,0, 1,0,0,
    //top
    0,1,0, 0,1,0, 0,1,0,   0,1,0, 0,1,0, 0,1,0,
    //bottom
    0,-1,0, 0,-1,0, 0,-1,0,   0,-1,0, 0,-1,0, 0,-1,0,
    //back
    0,0,-1, 0,0,-1, 0,0,-1,    0,0,-1, 0,0,-1, 0,0,-1,
  ],
  uvCoords:[
    //front
    0,2/3, 0,1, 1/2,1,   0,2/3, 1/2,1, 1/2,2/3,
    //left
    1/2,1/3, 1,2/3, 1/2,2/3,   1,2/3, 1/2,1/3, 1,1/3,
    //right
    0,1/3, 0,2/3, 1/2,1/3,   1/2,1/3, 0,2/3, 1/2,2/3,
    //top
    0,0, 1/2,0, 0,1/3,   1/2,1/3, 0,1/3, 1/2,0,
    //bottom
    1/2,2/3, 1,2/3, 1/2,1,   1,1, 1/2,1, 1,2/3,
    //back
    1/2,0, 1,0, 1/2,1/3,   1,1/3, 1/2,1/3, 1,0
  ],
  indices:[]
}

TriangleMesh.prototype.createCube = function() {
  // TODO: populate unit cube vertex positions, normals, and uv coordinates
  this.positions = cube.positions;
  this.normals = cube.normals;
  this.uvCoords = cube.uvCoords;
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  // TODO: populate unit sphere vertex positions, normals, uv coordinates, and indices
  // this.positions = quad.positions.slice(0, 9).map(p => p * 0.5);
  // this.normals = quad.normals.slice(0, 9);
  // this.uvCoords = quad.uvCoords.slice(0, 6);
  // this.indices = [0, 1, 2];
  let r = 1;
  let x,y,z,xy;
  let nx,ny,nz,lengthinv = 1.0/r;
  let u,v;
  let sectorStep = 2*(Math.PI) / numSectors;
  let stackStep = (Math.PI) / numStacks;
  let sectorAngle, stackAngle;

  for(let i = 0; i <= numStacks; i++){
    stackAngle = (Math.PI)/2 - i*stackStep;        
    xy = r * Math.cos(stackAngle);             
    z = r * Math.sin(stackAngle);              

    for(let j = 0; j <= numSectors; j++){
      sectorAngle = j * sectorStep;           

      x = xy * Math.cos(sectorAngle);             
      y = xy * Math.sin(sectorAngle);     
      this.positions.push(x);
      this.positions.push(y);
      this.positions.push(z);

      nx = x * lengthinv;
      ny = y * lengthinv;
      nz = z * lengthinv;
      this.normals.push(nx);
      this.normals.push(ny);
      this.normals.push(nz);

      u = j / numSectors;
      v = i / numStacks;
      this.uvCoords.push(1-u);
      this.uvCoords.push(v);
    }
  } 

  let k1, k2;
  for(let i = 0; i < numStacks; i++){
    k1 = i * (numSectors + 1);    
    k2 = k1 + numSectors + 1;      
    
    for(let j = 0; j < numSectors; j++, k1++, k2++){
      if(i != 0){
        this.indices.push(k1);
        this.indices.push(k2);
        this.indices.push(k1 + 1);
      }

      if(i != (numStacks-1)){
        this.indices.push(k1 + 1);
        this.indices.push(k2);
        this.indices.push(k2 + 1);
      }
    }
  }
}//code are modified from http://www.songho.ca/opengl/gl_sphere.html

Scene.prototype.computeTransformation = function(transformSequence) {
  // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix
  //console.log(transformSequence[0]);
  let tempMatrix = Mat4.create();
  for(const [type,x,y,z] of transformSequence){
    switch(type){
      case "T":
        //console.log(transformSequence[1]);
        tempMatrix = translation(x,y,z);
        Mat4.multiply(overallTransform,tempMatrix,overallTransform);
        break;
      case "S":
        //console.log(x,y,z);
        tempMatrix = scaling(x,y,z);
        Mat4.multiply(overallTransform,tempMatrix,overallTransform);
        break;
      case "Rx":
        //console.log(x);
        tempMatrix = rotationOnX(x);
        Mat4.multiply(overallTransform,tempMatrix,overallTransform);
        break;
      case "Ry":
        tempMatrix = rotationOnY(x);
        Mat4.multiply(overallTransform,tempMatrix,overallTransform);
        break;
      case "Rz":
        tempMatrix = rotationOnZ(x);
        Mat4.multiply(overallTransform,tempMatrix,overallTransform);
        break;
    }
  }
  console.log(overallTransform);
  return overallTransform;
}

function translation(x,y,z){
  let setMatrix = Mat4.create();
  return Mat4.transpose(setMatrix, Mat4.set(setMatrix,
    1,0,0,x,
    0,1,0,y,
    0,0,1,z,
    0,0,0,1
  ));
}

function scaling(x,y,z){
  let setMatrix = Mat4.create();
  return Mat4.set(setMatrix,
    x,0,0,0,
    0,y,0,0,
    0,0,z,0,
    0,0,0,1
  );
}

function rotationOnX(x){
  let setMatrix = Mat4.create();
  let angle = x * Math.PI / 180;
  return Mat4.transpose(setMatrix, Mat4.set(setMatrix,
    1,0,0,0,
    0,Math.cos(angle),-Math.sin(angle),0,
    0,Math.sin(angle),Math.cos(angle),0,
    0,0,0,1
  ));
}

function rotationOnY(x){
  let setMatrix = Mat4.create();
  let angle = x * Math.PI / 180;
  return Mat4.transpose(setMatrix, Mat4.set(setMatrix,
    Math.cos(angle),0,Math.sin(angle),0,
    0,1,0,0,
    -Math.sin(angle),0,Math.cos(angle),0,
    0,0,0,1
  ));
}

function rotationOnZ(x){
  let setMatrix = Mat4.create();
  let angle = x * Math.PI / 180;
  return Mat4.transpose(setMatrix, Mat4.set(setMatrix,
    Math.cos(angle),-Math.sin(angle),0,0,
    Math.sin(angle),Math.cos(angle),0,0,
    0,0,1,0,
    0,0,0,1
  ));
}

Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

// TODO: implement vertex shader logic below

varying vec3 temp;
varying vec3 fNormal;
varying vec3 fPosition;


varying vec3 L;
varying vec3 H;
varying float d;
varying vec3 v;

void main() {
  temp = vec3(position.x, normal.x, uvCoord.x);
  vTexCoord = uvCoord;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  fPosition = (viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;
  fNormal = normalize(normalMatrix * normal);
  L = normalize((viewMatrix * vec4(lightPosition,1.0)).xyz - fPosition);

  vec3 v = -normalize(fPosition);
  H = normalize(v + L);

  vec3 lightLenMat = (viewMatrix * vec4(lightPosition,1.0)).xyz - fPosition;
  d = length(lightLenMat);
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

// TODO: implement fragment shader logic below

varying vec3 temp;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec3 L;
varying vec3 v;
varying vec3 H;
varying float d;

void main() {
  /*Ambient
  vec3 ca = ka * lightIntensity;
  //Lambertian diffuse
  vec3 cd = (kd/pow(d,2.0)) * max(0.0,dot(fNormal,L)) * lightIntensity;
  //Specular
  vec3 cs = (ks/pow(d,2.0)) * pow(max(0.0,dot(H,fNormal)), shininess) * lightIntensity;
  //Phong
  vec3 finalColor = ca + cd + cs;

  //Texturing
  //gl_FragColor = vec4(temp, 1.0);
  */


  vec3 ca = ka * lightIntensity;

  vec3 cd = (kd/pow(d,2.0)) * max(0.0,dot(fNormal,L)) * lightIntensity;

  vec3 r = reflect(-L, fNormal);

  vec3 cs = (kd/pow(d,2.0)) * pow(max(0.0,dot(H,fNormal)),shininess) * lightIntensity;

  vec3 finalColor = ca + cd + cs;
  
  // gl_FragColor = vec4(finalColor, 1.0);


  vec4 textureColor = texture2D(uTexture, vTexCoord);
  if(hasTexture){  
    gl_FragColor = vec4(finalColor, 1.0) * textureColor;   
  }
  else{
    gl_FragColor = vec4(finalColor, 1.0);
  }
  //gl_FragColor = vec4(temp, 1.0);


}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,3,3,3;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "o,rd,unitCube,redDiceMat;",
  "o,gd,unitCube,grnDiceMat;",
  "o,bd,unitCube,bluDiceMat;",
  "o,gl,unitSphere,globeMat;",
  "o,gl2,unitSphere,globeMat;",
  "o,rd3,unitCube,redDiceMat;",
  "o,rd4,unitCube,redDiceMat;",
  "o,gd1,unitCube,grnDiceMat;",
  "o,bd1,unitCube,bluDiceMat;",
  
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.15,0.15,0.15;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.1,0.1,0.1;X,gd,T,2,0,2;",
  "X,bd,S,0.2,0.2,0.2;X,bd,Rx,135;X,bd,T,2,-0.3,-1;",
  "X,gl,S,1.5,1.5,1.5;  X,gl,Rx,100;  X,gl,Ry,-150;  X,gl,T,0,-2.5,0;",
  "X,gl2,S,2,2,2;   X,gl2,Rx,45;   X,gl2,Ry,100;   X,gl2,T,0,1.5,0;",

  "X,rd3,S,0.15,0.15,0.15;   X,rd3,Rx,90;   X,rd3,Rz,90;  X,rd3,T,2.5,-0.4,0;",
  "X,gd1,S,0.15,0.15,0.15;   X,gd1,Ry,90;   X,gd1,Rz,90;  X,gd1,T,-4,-3,1;",
  "X,rd4,S,0.1,0.1,0.1;   X,rd4,Rx,90;   X,rd4,T,-4,-5,0;",
  "X,bd1,S,0.1,0.1,0.1;   X,bd1,Rx,90;   X,bd1,T,1,-0.8,-1;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };
