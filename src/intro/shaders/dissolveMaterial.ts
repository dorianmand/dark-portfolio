import * as THREE from 'three';
import { INTRO_CONFIG } from '../config';

/**
 * Vertical dissolve material for the LAYER OFF wordmark.
 *
 * The artwork is the warm mark: charcoal LAYER glyphs stacked above cream
 * OFF glyphs, on a transparent ground.
 *
 * A dissolve threshold descends through it from above. Anything past the
 * front is gone; a narrow band at the front reads as edge-lit structure
 * before it goes. The front stops at `offBoundary`, the UV height where OFF
 * begins, so OFF is never eroded.
 *
 * The two wordmarks are separated by saturation as well as height, because
 * the feet of L and R dip below OFF's top edge — a horizontal cut alone
 * would leave charcoal stubs standing behind the cream letters.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uDissolve;      // 0 = intact, 1 = LAYER fully removed
  uniform float uOffReveal;     // 0 = OFF buried, 1 = OFF resolved
  uniform float uOpacity;       // master fade
  uniform float uOffBoundary;
  uniform float uBand;
  uniform float uNoiseAmount;
  uniform float uNoiseScale;
  uniform vec2  uLayerSaturation;
  uniform vec2  uTexelSize;
  uniform vec3  uEdgeColor;

  varying vec2 vUv;

  // Cheap hash-based value noise. Only used to soften the dissolve front,
  // so quality matters far less than cost here.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // texture2D() in a raw ShaderMaterial returns the stored sRGB values as-is;
  // three only linearises automatically inside its own built-in materials.
  // Without this the colorspace_fragment include below would encode a second
  // time and wash the artwork out.
  vec3 srgbToLinear(vec3 c) {
    return mix(
      c / 12.92,
      pow((c + 0.055) / 1.055, vec3(2.4)),
      step(vec3(0.04045), c)
    );
  }

  void main() {
    vec4 texel = texture2D(uMap, vUv);

    // The mark has a real alpha channel, so transparency comes straight from
    // the asset — no luminance keying, and no halo around the glyph edges.
    if (texel.a <= 0.004) discard;

    // Charcoal LAYER is near-neutral; cream OFF is warm. Saturation holds
    // steady across a letter's lit and shaded faces alike, where luminance
    // swings wildly between them.
    //
    // Classify on a locally averaged sample, not a single texel. The
    // material is visibly grainy, and the two distributions overlap at
    // their tails (charcoal p95 0.077, cream p05 0.098) — so per-pixel the
    // grain straddles any threshold and erodes the glyph into dither.
    // Averaging a small neighbourhood first collapses that overlap.
    vec2 texel_step = uTexelSize * 3.0;
    vec3 avg = texel.rgb;
    avg += texture2D(uMap, vUv + vec2( texel_step.x, 0.0)).rgb;
    avg += texture2D(uMap, vUv + vec2(-texel_step.x, 0.0)).rgb;
    avg += texture2D(uMap, vUv + vec2(0.0,  texel_step.y)).rgb;
    avg += texture2D(uMap, vUv + vec2(0.0, -texel_step.y)).rgb;
    avg /= 5.0;

    float mx = max(avg.r, max(avg.g, avg.b));
    float mn = min(avg.r, min(avg.g, avg.b));
    float saturation = mx <= 0.001 ? 0.0 : (mx - mn) / mx;
    float isLayer = 1.0 - smoothstep(uLayerSaturation.x, uLayerSaturation.y, saturation);

    vec3 color = srgbToLinear(texel.rgb);
    float alpha = texel.a;

    if (vUv.y < uOffBoundary) {
      // OFF resolves by losing interference, not by fading in.
      alpha *= mix(0.34, 1.0, uOffReveal);
    } else {
      // LAYER region: the dissolve front descends from above.
      //
      // The noise softens the front while it is travelling, but it is faded
      // out as the front lands. Left on, it wobbles the final threshold by
      // ±uNoiseAmount around offBoundary and strands a ragged fringe of
      // charcoal just above OFF.
      float settleNoise = 1.0 - smoothstep(0.85, 1.0, uDissolve);
      float n = (valueNoise(vUv * uNoiseScale) - 0.5) * 2.0 * uNoiseAmount * settleNoise;
      float threshold = mix(1.05, uOffBoundary, uDissolve) + n;

      // The soft band trails the front while it travels, but must collapse
      // as it lands. At full width it spans 0.13 of UV, so everything from
      // the boundary up to v+0.13 would stay partially lit — leaving the
      // feet of L and R hanging above OFF instead of clearing.
      float band = max(0.012, uBand * settleNoise);
      float t = (vUv.y - threshold) / band;

      if (t > 1.0) discard;

      if (t > 0.0) {
        // Transitional band: material thins out and reads as edge structure
        // rather than fading uniformly.
        float fade = 1.0 - smoothstep(0.0, 1.0, t);
        alpha *= fade;
        color = mix(color, uEdgeColor, smoothstep(0.0, 0.85, t));

        // A thin brighter line right at the front — the "section cut" read.
        float front = 1.0 - smoothstep(0.0, 0.14, abs(t - 0.06));
        color = mix(color, uEdgeColor * 1.35, front * 0.7);
        alpha = max(alpha, front * 0.5 * texel.a);
      }
    }

    // Tail-end cleanup, confined to the contested band.
    //
    // Measured on the asset: charcoal reaches down to v 0.26, cream begins
    // at v 0.30. Only that 0.04-tall strip contains both, so the removal is
    // gated to it. Everywhere below is OFF's body and is never touched,
    // which means the saturation threshold inside the strip can be set well
    // clear of charcoal's tail without eroding the letters.
    float cleanupZone = smoothstep(0.235, 0.275, vUv.y);
    alpha *= 1.0 - isLayer * cleanupZone * smoothstep(0.72, 1.0, uDissolve);

    gl_FragColor = vec4(color, alpha * uOpacity);

    #include <colorspace_fragment>
  }
`;

export interface DissolveUniforms {
  uMap: { value: THREE.Texture | null };
  uDissolve: { value: number };
  uOffReveal: { value: number };
  uOpacity: { value: number };
  uOffBoundary: { value: number };
  uBand: { value: number };
  uNoiseAmount: { value: number };
  uNoiseScale: { value: number };
  uLayerSaturation: { value: THREE.Vector2 };
  uTexelSize: { value: THREE.Vector2 };
  uEdgeColor: { value: THREE.Color };
}

export function createDissolveMaterial(texture: THREE.Texture) {
  const { logo, color } = INTRO_CONFIG;

  const uniforms: DissolveUniforms = {
    uMap: { value: texture },
    uDissolve: { value: 0 },
    uOffReveal: { value: 0 },
    uOpacity: { value: 1 },
    uOffBoundary: { value: logo.offBoundary },
    uBand: { value: logo.dissolveBand },
    uNoiseAmount: { value: logo.noiseAmount },
    uNoiseScale: { value: logo.noiseScale },
    uLayerSaturation: {
      value: new THREE.Vector2(logo.layerSaturation[0], logo.layerSaturation[1]),
    },
    uTexelSize: {
      value: (() => {
        const image = texture.image as { width?: number; height?: number } | undefined;
        return new THREE.Vector2(1 / (image?.width || 1000), 1 / (image?.height || 1000));
      })(),
    },
    uEdgeColor: { value: new THREE.Color(color.node) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });

  return { material, uniforms };
}
