 
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TEAL = "#3F8F8D";
const ORANGE = "#E08A2E";

// Each track is drawn in a 0..24 coordinate box, monochrome, so it reads as a
// subtle professional watermark rather than a cartoon sticker.
const ellipse = (ctx, cx, cy, rx, ry, rot = 0) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Cloven hoof (two crescents with a gap) — shared by cow / buffalo / goat.
const drawCloven = (ctx, rx, ry, sep, tilt) => {
  ellipse(ctx, 12 - sep / 2, 12, rx, ry, -tilt);
  ellipse(ctx, 12 + sep / 2, 12, rx, ry, tilt);
};

// Cat / dog paw — pad + four toe beans.
const drawPaw = (ctx) => {
  ellipse(ctx, 6.5, 9, 2, 2.4, -0.2);
  ellipse(ctx, 10, 6.5, 2, 2.6, -0.07);
  ellipse(ctx, 14, 6.5, 2, 2.6, 0.07);
  ellipse(ctx, 17.5, 9, 2, 2.4, 0.2);
  ellipse(ctx, 12, 16, 5, 4.5);
};

// Hen / chicken — three forward toes and one back.
const drawBird = (ctx) => {
  ctx.lineWidth = 1.7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(12, 14);
  ctx.lineTo(6, 5);
  ctx.moveTo(12, 14);
  ctx.lineTo(12, 3);
  ctx.moveTo(12, 14);
  ctx.lineTo(18, 5);
  ctx.moveTo(12, 14);
  ctx.lineTo(12, 21);
  ctx.stroke();
};

// Duck — webbed foot (three toes joined by webbing).
const drawDuck = (ctx) => {
  ctx.beginPath();
  ctx.moveTo(12, 18);
  ctx.lineTo(5.5, 6);
  ctx.lineTo(9, 9);
  ctx.lineTo(12, 3.5);
  ctx.lineTo(15, 9);
  ctx.lineTo(18.5, 6);
  ctx.closePath();
  ctx.fill();
};

// Horse — a horseshoe arc (open at the bottom).
const drawHorse = (ctx) => {
  ctx.lineWidth = 3.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(12, 13, 7, 0.85 * Math.PI, 2.15 * Math.PI);
  ctx.stroke();
};

const drawCow = (ctx) => drawCloven(ctx, 2.6, 6.2, 6, 0.16);
const drawBuffalo = (ctx) => drawCloven(ctx, 3.3, 6.8, 7, 0.12);
const drawGoat = (ctx) => drawCloven(ctx, 1.7, 5, 5, 0.24);

// Monkey — a little handprint.
const drawMonkey = (ctx) => {
  ellipse(ctx, 12, 16, 5, 4.6);
  ellipse(ctx, 8.5, 9, 1.4, 3.2, -0.15);
  ellipse(ctx, 11, 8, 1.4, 3.7, -0.05);
  ellipse(ctx, 13.5, 8, 1.4, 3.7, 0.05);
  ellipse(ctx, 16, 9, 1.4, 3.2, 0.15);
  ellipse(ctx, 18.6, 14, 3, 1.6, 0.5);
};

// Hamster — a tiny paw/hand.
const drawHamster = (ctx) => {
  ellipse(ctx, 12, 15, 3.4, 3.2);
  ellipse(ctx, 9, 10, 1, 2.6, -0.2);
  ellipse(ctx, 11, 9, 1, 2.9, -0.07);
  ellipse(ctx, 13, 9, 1, 2.9, 0.07);
  ellipse(ctx, 15, 10, 1, 2.6, 0.2);
  ellipse(ctx, 16.6, 13, 1.8, 1, 0.5);
};

// Rabbit — a long hind foot with small toes.
const drawRabbit = (ctx) => {
  ellipse(ctx, 12, 15, 2.6, 7);
  ellipse(ctx, 9, 6, 1, 1.4, -0.2);
  ellipse(ctx, 11, 5, 1, 1.5);
  ellipse(ctx, 13, 5, 1, 1.5);
  ellipse(ctx, 15, 6, 1, 1.4, 0.2);
};

const TRACKS = {
  paw: drawPaw,
  bird: drawBird,
  duck: drawDuck,
  horse: drawHorse,
  cow: drawCow,
  buffalo: drawBuffalo,
  goat: drawGoat,
  monkey: drawMonkey,
  hamster: drawHamster,
  rabbit: drawRabbit,
};

// Spread-out tracks at varied depth (z) for real parallax.
const ITEMS = [
  { type: "paw", color: TEAL, position: [-4.7, 2.4, 0.4], scale: 0.78, speed: 0.7, phase: 0, tilt: -0.3 },
  { type: "bird", color: ORANGE, position: [4.7, 1.8, -0.6], scale: 0.7, speed: 0.6, phase: 1.1, tilt: 0.2 },
  { type: "horse", color: TEAL, position: [-5.0, -2.0, 0.6], scale: 0.82, speed: 0.8, phase: 2.2, tilt: 0.1 },
  { type: "cow", color: TEAL, position: [4.9, -2.0, 0.2], scale: 0.72, speed: 0.65, phase: 3.3, tilt: -0.2 },
  { type: "monkey", color: ORANGE, position: [-3.0, 3.1, -1.0], scale: 0.6, speed: 0.9, phase: 4.4, tilt: 0.2 },
  { type: "duck", color: TEAL, position: [3.3, 3.0, -1.2], scale: 0.62, speed: 0.75, phase: 5.5, tilt: -0.15 },
  { type: "buffalo", color: TEAL, position: [-1.9, -3.2, 0.5], scale: 0.7, speed: 0.85, phase: 6.6, tilt: 0.3 },
  { type: "goat", color: ORANGE, position: [2.1, 3.2, 0.3], scale: 0.6, speed: 1.0, phase: 7.7, tilt: -0.3 },
  { type: "rabbit", color: TEAL, position: [-3.6, 0.0, -1.6], scale: 0.58, speed: 0.55, phase: 8.8, tilt: 0.1 },
  { type: "hamster", color: TEAL, position: [3.9, 0.1, -0.9], scale: 0.55, speed: 0.6, phase: 9.9, tilt: -0.3 },
  { type: "paw", color: TEAL, position: [5.2, 3.0, -0.5], scale: 0.62, speed: 0.7, phase: 11, tilt: 0.25 },
  { type: "duck", color: ORANGE, position: [-2.4, -2.5, -0.7], scale: 0.6, speed: 0.8, phase: 12, tilt: -0.2 },
  { type: "cow", color: TEAL, position: [0.3, 3.4, -1.3], scale: 0.6, speed: 0.7, phase: 13, tilt: 0.15 },
  { type: "goat", color: TEAL, position: [-5.3, 0.7, 0.2], scale: 0.6, speed: 0.65, phase: 14, tilt: -0.2 },
];

const makeTrackTexture = (type, color) => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  TRACKS[type](ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
};

const Track = ({ item, reduceMotion }) => {
  const ref = useRef();
  const texture = useMemo(() => makeTrackTexture(item.type, item.color), [item.type, item.color]);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    if (!ref.current) return;
    if (reduceMotion) {
      ref.current.material.rotation = item.tilt;
      return;
    }
    const t = state.clock.elapsedTime;
    ref.current.position.y = item.position[1] + Math.sin(t * item.speed + item.phase) * 0.3;
    ref.current.material.rotation = item.tilt + Math.sin(t * item.speed * 0.5 + item.phase) * 0.12;
  });

  return (
    <sprite ref={ref} position={item.position} scale={[item.scale, item.scale, item.scale]}>
      <spriteMaterial map={texture} transparent depthWrite={false} opacity={0.42} />
    </sprite>
  );
};

const Field = ({ reduceMotion }) => {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const tx = reduceMotion ? 0 : target.current.x * 0.3;
    const ty = reduceMotion ? 0 : -target.current.y * 0.2;
    group.current.rotation.y += (tx - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (ty - group.current.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      {ITEMS.map((item, index) => (
        <Track key={index} item={item} reduceMotion={reduceMotion} />
      ))}
    </group>
  );
};

const PetField = ({ reduceMotion = false }) => (
  <Canvas
    camera={{ position: [0, 0, 8], fov: 50 }}
    dpr={[1, 2]}
    gl={{ alpha: true, antialias: true }}
    style={{ width: "100%", height: "100%" }}
  >
    <Field reduceMotion={reduceMotion} />
  </Canvas>
);

export default PetField;
