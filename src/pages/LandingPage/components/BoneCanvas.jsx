/* eslint-disable react/no-unknown-property -- React Three Fiber uses Three.js props, not DOM attributes */
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

const BONE_COLOR = "#F3E9D6";

/**
 * A procedurally-built dog bone (a shaft + four rounded knobs) — no external
 * model file required. Wrapped in <Float> for a gentle idle bob.
 */
const Bone = () => {
  const material = (
    <meshStandardMaterial color={BONE_COLOR} roughness={0.45} metalness={0.08} />
  );

  // [y, x] positions for the four end knobs.
  const knobs = [
    [1.15, 0.5],
    [1.15, -0.5],
    [-1.15, 0.5],
    [-1.15, -0.5],
  ];

  return (
    <group rotation={[Math.PI / 2.6, 0, Math.PI / 4]} scale={1.1}>
      <mesh castShadow>
        <cylinderGeometry args={[0.34, 0.34, 2.3, 48]} />
        {material}
      </mesh>
      {knobs.map(([y, x], index) => (
        <mesh key={index} position={[x, y, 0]} castShadow>
          <sphereGeometry args={[0.56, 48, 48]} />
          {material}
        </mesh>
      ))}
    </group>
  );
};

const BoneCanvas = () => (
  <Canvas
    camera={{ position: [0, 0, 6], fov: 45 }}
    dpr={[1, 2]}
    style={{ width: "100%", height: "100%" }}
  >
    <ambientLight intensity={0.7} />
    <directionalLight position={[5, 6, 5]} intensity={1.3} castShadow />
    <pointLight position={[-5, -4, 2]} intensity={0.6} color="#45BBBD" />
    <Float speed={2.2} rotationIntensity={0.7} floatIntensity={1.4}>
      <Bone />
    </Float>
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate
      autoRotateSpeed={1.4}
    />
  </Canvas>
);

export default BoneCanvas;
