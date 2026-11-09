// Ashima / Stefan Gustavson 3D simplex noise
export const simplex3D = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

export const morphVertex = /* glsl */ `
attribute vec3 p0;
attribute vec3 p1;
attribute vec3 p2;
attribute vec3 p3;
attribute vec3 p4;
attribute vec3 p5;
attribute vec3 p6;
attribute vec3 p7;
attribute vec3 p8;
attribute vec3 p9;
attribute float aRand;

uniform float uShape;
uniform float uTime;
uniform float uIntro;
uniform float uPixelRatio;
uniform float uSize;
uniform vec3 uMouse;
uniform float uMouseStrength;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAccent;

varying vec3 vColor;
varying float vAlpha;
${simplex3D}

vec3 shapeAt(int i){
  if (i == 0) return p0;
  if (i == 1) return p1;
  if (i == 2) return p2;
  if (i == 3) return p3;
  if (i == 4) return p4;
  if (i == 5) return p5;
  if (i == 6) return p6;
  if (i == 7) return p7;
  if (i == 8) return p8;
  return p9;
}

void main(){
  float s = clamp(uShape, 0.0, 9.0);
  float fi = floor(s);
  int i0 = int(fi);
  int i1 = min(i0 + 1, 9);
  // each particle starts its journey at a slightly different time → organic, staggered morph
  float t = clamp((s - fi - aRand * 0.4) / 0.6, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 a = shapeAt(i0);
  vec3 b = shapeAt(i1);
  vec3 pos = mix(a, b, t);

  // mid-flight swirl: particles drift through a noise field while travelling
  float mid = sin(t * 3.14159);
  pos += vec3(
    snoise(a * 0.7 + uTime * 0.15),
    snoise(b * 0.7 - uTime * 0.15),
    snoise(a.zxy * 0.7 + 3.1)
  ) * mid * 0.6;

  // idle breathing
  pos += vec3(
    snoise(pos * 0.8 + vec3(uTime * 0.22, 0.0, 0.0)),
    snoise(pos * 0.8 + vec3(0.0, uTime * 0.22, 4.0)),
    snoise(pos * 0.8 + vec3(9.0, 0.0, uTime * 0.22))
  ) * 0.045;

  // intro: particles fly in from a wide scattered cloud
  vec3 scatter = (vec3(fract(aRand * 91.7), fract(aRand * 47.3), fract(aRand * 13.1)) - 0.5) * vec3(22.0, 14.0, 10.0);
  float k = clamp((uIntro - aRand * 0.45) / 0.55, 0.0, 1.0);
  pos = mix(scatter, pos, k * k * (3.0 - 2.0 * k));

  // cursor repulsion
  vec3 d = pos - uMouse;
  float dist = length(d);
  pos += normalize(d + 1e-4) * (1.0 - smoothstep(0.0, 1.3, dist)) * 0.55 * uMouseStrength;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float twinkle = 0.75 + 0.25 * sin(uTime * (1.5 + aRand * 3.0) + aRand * 40.0);
  gl_PointSize = uSize * uPixelRatio * (0.6 + aRand * 0.8) * twinkle * (9.0 / -mv.z);

  vColor = mix(uColorA, uColorB, fract(aRand * 7.31));
  if (aRand > 0.955) vColor = uAccent;
  // particles near the cursor pick up the accent
  vColor = mix(vColor, uAccent, (1.0 - smoothstep(0.0, 1.1, dist)) * 0.8 * uMouseStrength);
  // far side of the shape recedes
  vAlpha = 0.35 + 0.65 * smoothstep(-10.5, -6.0, mv.z);
}
`

export const morphFragment = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
void main(){
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  // crisp printed dot, not a glow
  float a = (1.0 - smoothstep(0.32, 0.5, r)) * vAlpha * uOpacity;
  gl_FragColor = vec4(vColor, a);
  #include <colorspace_fragment>
}
`
