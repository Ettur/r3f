precision mediump float;

uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform sampler2D uTexture;

attribute vec3 aCoords;
attribute float aDirection;
attribute float aOffset;

varying vec2 vUv;
varying vec2 vPUv;
varying vec3 vCoords;
varying vec3 vPosition;

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

float random(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main(){

  vUv = uv;
  vCoords = aCoords;
  vec2 puv = position.xy / vec2(512.,512.);
	vPUv = puv;
  vPosition = position;

  vec3 pos = position;

  pos.xyz += vec3(aOffset);


  float dist = distance(pos.xy, uMouse);
  float area = 1. - smoothstep(0., 100., dist);
  float rndz = (random(pos.x) + cnoise(vec2(pos.x * 0.1, uTime * 0.1)));
  float t = texture2D(uTexture, uv).r;

  // pos.xy += vec2(random(aDirection) -0.5, random(aOffset)) * area * uHover;

  pos.z += t * 20.0 * rndz * area * uHover;
	pos.x += cos(aDirection) * t * 20.0 * rndz * area * uHover;
	pos.y += sin(aDirection) * t * 20.0 * rndz * area * uHover;

  // pos.z += 150.*sin(uTime)  * aDirection * area * uHover;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;


  gl_PointSize = (1500. * cnoise(vec2(uTime * 0.1, aOffset * 20.)) + 750.) * (1. / -viewPosition.z);
  gl_Position = projectedPosition;

}