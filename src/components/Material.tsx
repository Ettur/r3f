import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import { ShaderMaterial } from 'three'

export class TestMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: {
          value: 0
        },
        uTextureOne: {
          value: THREE.Texture
        },
        uTextureTwo: {
          value: THREE.Texture
        },
        uNumber: {
          value: 0
        },
        uMouse: {
          value: new THREE.Vector2(0, 0)
        },
        uProgress: {
          value: 0
        },
        uRes: {
          value: new THREE.Vector2(0, 0)
        }
      }
    },)
  }
}

export const vertex =`
precision mediump float;

uniform float uTime;

attribute vec3 aCoords;

varying vec3 vPosition;
varying vec3 vCoords;
varying vec2 vUv;

void main(){

  vPosition = position;
  vCoords = aCoords;
  vUv = uv;
  vec3 pos = position;


  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

}
`
export const fragment = `
#define PI 3.1415926538
precision mediump float;

uniform sampler2D uTextureOne;
uniform sampler2D uTextureTwo;
uniform float uNumber;
uniform float uProgress;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;

varying vec3 vPosition;
varying vec3 vCoords;
varying vec2 vUv;

mat2 rotate(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat2(c, -s, s, c);
}

//	Simplex 3D Noise
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {

  float dist = distance(vPosition.xy, uMouse);
  float mouseIntersectionArea = 1.-smoothstep(0., 65., dist);

  // float noiseFreq = 3.5;
  // float noiseAmp = 0.01;
  // vec3 noisePos = vec3(vPosition.x * noiseFreq + uTime, vPosition.y, vPosition.z);
  // float vWave = vPosition.z + snoise(noisePos) * noiseAmp;

  vec2 uvDivided = fract(vUv* vec2(25., 1.));
  vec2 uvDisplacedOne = vUv + rotate(-PI / 4.) * uvDivided * uProgress * 0.05;
  vec2 uvDisplacedTwo = vUv + rotate(-PI / 4.) * uvDivided * (1. - uProgress) * 0.05;

  vec4 img1 = texture2D(uTextureOne, uvDisplacedOne);
  vec4 img2 = texture2D(uTextureTwo, uvDisplacedTwo);
  vec4 finalImg = mix(img1, img2, uProgress);

  finalImg = mix(img1, img2, uProgress);
  vec3 grayscale = vec3(.5);
  vec4 gray =  vec4(vec3(dot(finalImg.rgb, grayscale)), finalImg.a);
	gl_FragColor = gray;
}
`
extend({ TestMaterial })


