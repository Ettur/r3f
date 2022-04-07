import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import { ShaderMaterial } from 'three'

export class TestMaterial extends ShaderMaterial {
  constructor() {
    super({
      wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: {
          value: 0
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

uniform float uNumber;
uniform float uProgress;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;

varying vec3 vPosition;
varying vec3 vCoords;
varying vec2 vUv;

void main() {
	gl_FragColor = vec4(vec3(0.0), 1.0);
}
`
extend({ TestMaterial })


