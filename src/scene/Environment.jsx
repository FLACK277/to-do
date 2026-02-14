import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Floating Island ─── */
export function FloatingIsland() {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.position.y = -2.5 + Math.sin(s.clock.elapsedTime * 0.3) * 0.15;
  });
  const rocks = [[5, 1.2, 3, 0.4], [-4, 1.2, 4, 0.3], [6, 1.1, -2, 0.35], [-5, 1.1, -3, 0.25], [3, 1.3, -5, 0.3]];
  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[8, 6, 2.5, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.3, 0]} receiveShadow>
        <cylinderGeometry args={[8.2, 8, 0.4, 32]} />
        <meshStandardMaterial color="#7CB342" roughness={0.85} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <coneGeometry args={[5, 3, 16]} />
        <meshStandardMaterial color="#6D4C41" roughness={1} />
      </mesh>
      {rocks.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[i * 0.5, i * 0.7, 0]}>
          <dodecahedronGeometry args={[s, 0]} />
          <meshStandardMaterial color="#9E9E9E" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Grass ─── */
export function GrassPatches() {
  const positions = useMemo(() => {
    const p = [];
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 6;
      p.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, s: 0.3 + Math.random() * 0.4, rot: Math.random() * Math.PI });
    }
    return p;
  }, []);
  return (
    <group position={[0, -1, 0]}>
      {positions.map((g, i) => <GrassTuft key={i} pos={[g.x, 0, g.z]} scale={g.s} rot={g.rot} />)}
    </group>
  );
}

function GrassTuft({ pos, scale, rot }) {
  const ref = useRef();
  useFrame((s) => { if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.5 + pos[0] * 3) * 0.05; });
  return (
    <group ref={ref} position={pos} scale={[scale, scale, scale]}>
      {[0, 0.3, -0.3].map((offset, i) => (
        <mesh key={i} position={[offset * 0.5, 0.3, 0]} rotation={[0, rot + i * 0.5, offset * 0.3]}>
          <coneGeometry args={[0.08, 0.6, 4]} />
          <meshStandardMaterial color={i === 1 ? '#66BB6A' : '#43A047'} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Clouds ─── */
export function AnimatedClouds() {
  const clouds = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 40, y: 6 + Math.random() * 6,
      z: -10 - Math.random() * 15, scale: 1.5 + Math.random() * 2, speed: 0.1 + Math.random() * 0.15,
    })), []);
  return <>{clouds.map((c, i) => <CloudPuff key={i} {...c} />)}</>;
}

function CloudPuff({ x, y, z, scale, speed }) {
  const ref = useRef();
  const darkMode = useStore((s) => s.darkMode);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) { ref.current.position.x = x + Math.sin(t * speed) * 3; ref.current.position.y = y + Math.sin(t * speed * 0.5) * 0.3; }
  });
  const puffs = [[0, 0, 0, 1], [0.8, 0.2, 0.3, 0.7], [-0.6, 0.1, -0.2, 0.8], [0.3, 0.4, 0.1, 0.6], [-0.4, 0.3, 0.4, 0.5]];
  return (
    <group ref={ref} position={[x, y, z]}>
      {puffs.map(([ox, oy, oz, s2], i) => (
        <mesh key={i} position={[ox * scale, oy * scale, oz * scale]}>
          <sphereGeometry args={[s2 * scale * 0.5, 12, 12]} />
          <meshStandardMaterial color={darkMode ? "#334155" : "#FFFFFF"} transparent opacity={darkMode ? 0.6 : 0.85} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Particles ─── */
export function MagicParticles() {
  return (
    <>
      <Sparkles count={60} size={2} scale={[20, 10, 20]} position={[0, 3, 0]} speed={0.3} color="#FFD54F" opacity={0.5} />
      <FloatingLeaves />
    </>
  );
}

function FloatingLeaves() {
  const leaves = useMemo(() =>
    Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 16, y: Math.random() * 8, z: (Math.random() - 0.5) * 16,
      speed: 0.2 + Math.random() * 0.3, rotSpeed: 0.5 + Math.random(), phase: Math.random() * Math.PI * 2,
    })), []);
  return <>{leaves.map((l, i) => <LeafMote key={i} {...l} />)}</>;
}

function LeafMote({ x, y, z, speed, rotSpeed, phase }) {
  const ref = useRef();
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.set(x + Math.sin(t * speed + phase) * 2, y + Math.sin(t * speed * 0.7 + phase) * 1.5, z + Math.cos(t * speed * 0.5 + phase) * 1.5);
      ref.current.rotation.x = t * rotSpeed; ref.current.rotation.y = t * rotSpeed * 0.7;
    }
  });
  return (
    <mesh ref={ref}>
      <planeGeometry args={[0.15, 0.1]} />
      <meshStandardMaterial color="#66BB6A" side={THREE.DoubleSide} transparent opacity={0.7} />
    </mesh>
  );
}

/* ─── Lighting ─── */
export function SceneLighting() {
  const darkMode = useStore((s) => s.darkMode);

  return (
    <>
      <ambientLight intensity={darkMode ? 0.2 : 0.6} color={darkMode ? "#1a237e" : "#FFF8E1"} />
      <directionalLight
        position={[8, 12, 5]} intensity={darkMode ? 0.4 : 1.2} color={darkMode ? "#5c6bc0" : "#FFE0B2"}
        castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-far={50} shadow-camera-left={-15} shadow-camera-right={15}
        shadow-camera-top={15} shadow-camera-bottom={-15}
      />
      <pointLight position={[-5, 6, -3]} intensity={darkMode ? 0.6 : 0.4} color={darkMode ? "#818cf8" : "#BBDEFB"} />
      <pointLight position={[4, 2, 6]} intensity={darkMode ? 0.2 : 0.3} color="#FFE082" />
      <hemisphereLight args={[darkMode ? '#1e1b4b' : '#87CEEB', darkMode ? '#0f172a' : '#8D6E63', darkMode ? 0.1 : 0.3]} />
    </>
  );
}

/* ─── Sky ─── */
export function PastelSky() {
  const darkMode = useStore((s) => s.darkMode);

  return (
    <>
      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide} color={darkMode ? "#020617" : "#87CEEB"} toneMapped={false} />
      </mesh>
      <mesh position={[0, 15, -30]}>
        <planeGeometry args={[120, 60]} />
        <meshBasicMaterial color={darkMode ? "#1e1b4b" : "#FFE4C4"} transparent opacity={darkMode ? 0.8 : 0.4} toneMapped={false} />
      </mesh>
      {darkMode && <Stars />}
      {darkMode && <Moon />}
    </>
  );
}

function Stars() {
  return (
    <Sparkles count={200} size={1} scale={[100, 60, 20]} position={[0, 20, -50]} speed={0.05} color="#ffffff" opacity={1} />
  );
}

function Moon() {
  return (
    <mesh position={[10, 20, -40]}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshBasicMaterial color="#fef3c7" toneMapped={false} />
      <pointLight intensity={2} distance={100} color="#fefce8" />
    </mesh>
  );
}