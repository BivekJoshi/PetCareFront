 
 
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "@mui/material/styles";

/**
 * Animated fluid-waves backdrop for the dashboard shell.
 * A single full-screen plane driven by a domain-warped fbm shader that makes
 * flowing teal waves ripple over time. The color stops are fed in from the
 * active MUI theme (theme.palette.appCanvas), so the backdrop tracks light /
 * dark mode instead of staying a fixed near-white. Decorative only: fixed
 * behind all content and ignores pointer events.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uAspect;
  uniform vec3 uBase;   // near-background tone
  uniform vec3 uMid;    // mid wave tone
  uniform vec3 uPeak;   // crest / accent tone
  uniform vec3 uCrest;  // glossy highlight tint
  varying vec2 vUv;

  // --- value noise + fractal brownian motion ---
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // keep the flow roughly uniform across wide screens
    vec2 uv = vUv * uAspect;
    float t = uTime * 0.12;

    // domain warp → fluid, marbled motion
    vec2 q = vec2(fbm(uv * 2.5 + t), fbm(uv * 2.5 + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(uv * 2.5 + q * 2.0 + vec2(1.7, 9.2) + 0.15 * uTime),
      fbm(uv * 2.5 + q * 2.0 + vec2(8.3, 2.8) - 0.12 * uTime)
    );
    float n = fbm(uv * 2.5 + r * 2.5);

    // flowing wave bands layered on top of the warped field
    float waves = sin(uv.y * 3.5 + n * 4.0 + uTime * 0.5) * 0.5 + 0.5;
    float mixv = clamp(n * 0.85 + waves * 0.45, 0.0, 1.0);

    // palette stops come from the active theme (light: near-white → aqua →
    // teal; dark: deep navy → slate → teal glow)
    vec3 col = mix(uBase, uMid, smoothstep(0.0, 0.6, mixv));
    col = mix(col, uPeak, smoothstep(0.55, 1.0, mixv));

    // faint glossy crests — kept subtle so it stays airy
    col += uCrest * pow(waves, 4.0);

    // soft vignette: barely darken the edges
    vec2 c = vUv - 0.5;
    float vig = smoothstep(0.95, 0.25, dot(c, c) * 2.2);
    col *= mix(0.96, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const Waves = ({ colors }) => {
  const { viewport } = useThree();
  const matRef = useRef();
  // Created once; color values are mutated in place on theme change below.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: [1, 1] },
      uBase: { value: [...colors.base] },
      uMid: { value: [...colors.mid] },
      uPeak: { value: [...colors.peak] },
      uCrest: { value: [...colors.crest] },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Push new palette stops into the live uniforms whenever the mode flips.
  useEffect(() => {
    uniforms.uBase.value = [...colors.base];
    uniforms.uMid.value = [...colors.mid];
    uniforms.uPeak.value = [...colors.peak];
    uniforms.uCrest.value = [...colors.crest];
  }, [colors, uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const a = viewport.width / viewport.height;
    uniforms.uAspect.value = [a, 1];
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

const DashboardBackground = () => {
  // Read the palette in the normal React tree — R3F does not bridge MUI's
  // context into the <Canvas>, so the colors are resolved here and passed in.
  const theme = useTheme();
  const colors = theme.palette.appCanvas;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Waves colors={colors} />
    </Canvas>
  );
};

export default DashboardBackground;
