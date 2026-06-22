import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { MathUtils, Color } from "three";

/**
 * Tracks the pointer position across the whole window (normalized to -1..1),
 * so the scene stays interactive even though the canvas sits behind the form.
 */
const useWindowPointer = () => {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
};

const REPEL_RADIUS = 3;
const REPEL_STRENGTH = 2.6;

const Blob = ({
  basePosition,
  loginColor,
  signupColor,
  scale,
  floatSpeed,
  distortSpeed,
  pointer,
  mode,
}) => {
  const meshRef = useRef();
  const matRef = useRef();
  const [bx, by, bz] = basePosition;

  // mode-change pulse + smooth color targets
  const pulse = useRef(0);
  const lastMode = useRef(mode);
  const target = useRef(new Color(loginColor));
  const colors = useRef({
    login: new Color(loginColor),
    signup: new Color(signupColor),
  });

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // detect a mode switch → fire a quick pulse
    if (mode !== lastMode.current) {
      pulse.current = 1;
      lastMode.current = mode;
    }
    pulse.current = Math.max(0, pulse.current - delta * 1.6);

    // ---- repel from cursor ----
    const cx = pointer.current.x * 4.5;
    const cy = -pointer.current.y * 3.2;
    const dx = bx - cx;
    const dy = by - cy;
    const dist = Math.hypot(dx, dy) || 0.0001;

    let targetX = bx;
    let targetY = by;
    if (dist < REPEL_RADIUS) {
      const factor = (REPEL_RADIUS - dist) / REPEL_RADIUS;
      targetX = bx + (dx / dist) * factor * REPEL_STRENGTH;
      targetY = by + (dy / dist) * factor * REPEL_STRENGTH;
    }
    mesh.position.x = MathUtils.lerp(mesh.position.x, targetX, 0.1);
    mesh.position.y = MathUtils.lerp(mesh.position.y, targetY, 0.1);
    mesh.position.z = bz;

    // ---- pulse on switch: brief scale + spin kick ----
    const s = scale * (1 + pulse.current * 0.18);
    mesh.scale.setScalar(MathUtils.lerp(mesh.scale.x, s, 0.2));
    mesh.rotation.z += delta * pulse.current * 1.2;

    // ---- color shift between login/signup palettes ----
    target.current.copy(
      mode === "login" ? colors.current.login : colors.current.signup
    );
    if (matRef.current) {
      matRef.current.color.lerp(target.current, 0.04);
      matRef.current.distort = MathUtils.lerp(
        matRef.current.distort,
        0.45 + pulse.current * 0.35,
        0.1
      );
    }
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={1.2} floatIntensity={2}>
      <mesh ref={meshRef} position={basePosition} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          ref={matRef}
          color={loginColor}
          distort={0.45}
          speed={distortSpeed}
          roughness={0.12}
          metalness={0.15}
        />
      </mesh>
    </Float>
  );
};

const AuthBackground = ({ mode = "login" }) => {
  const pointer = useWindowPointer();
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, -3, 2]} intensity={0.6} color="#7ADBE0" />
      <Suspense fallback={null}>
        <Blob
          basePosition={[-2.6, 1.6, -1]}
          loginColor="#45BBBD"
          signupColor="#F8C54B"
          scale={1.7}
          floatSpeed={1.5}
          distortSpeed={1.8}
          pointer={pointer}
          mode={mode}
        />
        <Blob
          basePosition={[2.9, -1.3, -2]}
          loginColor="#F8D152"
          signupColor="#F2882F"
          scale={2}
          floatSpeed={1.2}
          distortSpeed={1.4}
          pointer={pointer}
          mode={mode}
        />
        <Blob
          basePosition={[1.6, 2.1, -3]}
          loginColor="#7ADBE0"
          signupColor="#F8D152"
          scale={1.1}
          floatSpeed={2}
          distortSpeed={2.2}
          pointer={pointer}
          mode={mode}
        />
        <Blob
          basePosition={[-2.1, -2.1, -2]}
          loginColor="#FAECAF"
          signupColor="#7ADBE0"
          scale={1.35}
          floatSpeed={1.8}
          distortSpeed={1.6}
          pointer={pointer}
          mode={mode}
        />

        {/* glittering floating dust */}
        <Sparkles
          count={70}
          scale={[11, 9, 4]}
          size={3.2}
          speed={0.5}
          opacity={0.7}
          color={mode === "login" ? "#7ADBE0" : "#F8D152"}
        />
        <Sparkles
          count={30}
          scale={[10, 8, 3]}
          size={5}
          speed={0.3}
          opacity={0.5}
          color="#ffffff"
        />
      </Suspense>
    </Canvas>
  );
};

export default AuthBackground;
