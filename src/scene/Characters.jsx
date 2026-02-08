import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import useStore from '../store/useStore';

/* ═══ Kodama — Forest spirit with glowing antenna ═══ */
export function KodamaSpirit({ position = [-4, -0.8, 2] }) {
  const groupRef = useRef();
  const headRef = useRef();
  const reaction = useStore((s) => s.characterReaction);
  const [reacting, setReacting] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current && !reacting) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
    if (headRef.current) headRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
  });

  useEffect(() => {
    if (!reaction || !groupRef.current) return;
    setReacting(true);
    if (reaction.type === 'happy') {
      gsap.to(groupRef.current.position, { y: position[1]+1, duration: 0.3, ease: 'back.out(3)', yoyo: true, repeat: 3, onComplete: () => setReacting(false) });
      gsap.to(groupRef.current.scale, { x: 1.2, y: 0.85, z: 1.2, duration: 0.15, yoyo: true, repeat: 5, ease: 'power2.inOut' });
    } else {
      gsap.to(groupRef.current.rotation, { y: Math.PI*2, duration: 0.8, ease: 'power2.out', onComplete: () => { if(groupRef.current) groupRef.current.rotation.y=0; setReacting(false); } });
    }
  }, [reaction]);

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.25,0.4,8,16]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.3} emissive="#FFF8E1" emissiveIntensity={0.3} />
      </mesh>
      <group ref={headRef} position={[0,0.55,0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.3,16,16]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.3} emissive="#FFF8E1" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-0.08,0.05,0.27]}><sphereGeometry args={[0.035,8,8]} /><meshBasicMaterial color="#4E342E" /></mesh>
        <mesh position={[0.08,0.05,0.27]}><sphereGeometry args={[0.035,8,8]} /><meshBasicMaterial color="#4E342E" /></mesh>
        <mesh position={[0,-0.05,0.28]}><torusGeometry args={[0.04,0.008,8,12,Math.PI]} /><meshBasicMaterial color="#795548" /></mesh>
        <mesh position={[0,0.2,0]}><cylinderGeometry args={[0.015,0.015,0.2,6]} /><meshStandardMaterial color="#A5D6A7" /></mesh>
        <mesh position={[0,0.32,0]}><sphereGeometry args={[0.06,8,8]} /><meshStandardMaterial color="#C5E1A5" emissive="#C5E1A5" emissiveIntensity={0.8} /></mesh>
        <pointLight position={[0,0.32,0]} color="#C5E1A5" intensity={0.5} distance={2} />
      </group>
    </group>
  );
}

/* ═══ SoraCat — Flying cat with translucent wings ═══ */
export function SoraCat({ position = [5, 1, -1] }) {
  const groupRef = useRef();
  const tailRef = useRef();
  const wingLRef = useRef();
  const wingRRef = useRef();
  const reaction = useStore((s) => s.characterReaction);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t*0.8)*0.4;
      groupRef.current.position.x = position[0] + Math.sin(t*0.3)*0.5;
      groupRef.current.rotation.z = Math.sin(t*0.8)*0.05;
    }
    if (tailRef.current) tailRef.current.rotation.z = Math.sin(t*2)*0.3;
    if (wingLRef.current) wingLRef.current.rotation.z = 0.3+Math.sin(t*4)*0.25;
    if (wingRRef.current) wingRRef.current.rotation.z = -0.3-Math.sin(t*4)*0.25;
  });

  useEffect(() => {
    if (!reaction || !groupRef.current) return;
    if (reaction.type === 'happy') {
      gsap.to(groupRef.current.position, { y: position[1]+2, duration: 0.5, ease: 'back.out(2)', yoyo: true, repeat: 1 });
      gsap.to(groupRef.current.rotation, { z: Math.PI*2, duration: 1, ease: 'power2.out', onComplete: () => { if(groupRef.current) groupRef.current.rotation.z=0; } });
    }
  }, [reaction]);

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.2,0.35,8,16]} />
        <meshStandardMaterial color="#B0BEC5" roughness={0.6} />
      </mesh>
      <group position={[0,0.45,0.05]}>
        <mesh castShadow><sphereGeometry args={[0.22,16,16]} /><meshStandardMaterial color="#CFD8DC" roughness={0.5} /></mesh>
        <mesh position={[-0.12,0.2,0]} rotation={[0,0,-0.3]}><coneGeometry args={[0.07,0.15,4]} /><meshStandardMaterial color="#CFD8DC" /></mesh>
        <mesh position={[0.12,0.2,0]} rotation={[0,0,0.3]}><coneGeometry args={[0.07,0.15,4]} /><meshStandardMaterial color="#CFD8DC" /></mesh>
        <mesh position={[-0.12,0.18,0.02]} rotation={[0,0,-0.3]}><coneGeometry args={[0.04,0.1,4]} /><meshStandardMaterial color="#F8BBD0" /></mesh>
        <mesh position={[0.12,0.18,0.02]} rotation={[0,0,0.3]}><coneGeometry args={[0.04,0.1,4]} /><meshStandardMaterial color="#F8BBD0" /></mesh>
        <mesh position={[-0.07,0.03,0.2]}><sphereGeometry args={[0.04,8,8]} /><meshBasicMaterial color="#263238" /></mesh>
        <mesh position={[0.07,0.03,0.2]}><sphereGeometry args={[0.04,8,8]} /><meshBasicMaterial color="#263238" /></mesh>
        <mesh position={[-0.06,0.045,0.23]}><sphereGeometry args={[0.015,6,6]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0.08,0.045,0.23]}><sphereGeometry args={[0.015,6,6]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0,-0.03,0.22]}><sphereGeometry args={[0.02,6,6]} /><meshStandardMaterial color="#F48FB1" /></mesh>
      </group>
      <group ref={wingLRef} position={[-0.25,0.15,0]}>
        <mesh rotation={[0.2,0,0.3]}><planeGeometry args={[0.3,0.2]} /><meshStandardMaterial color="#E3F2FD" side={THREE.DoubleSide} transparent opacity={0.7} /></mesh>
      </group>
      <group ref={wingRRef} position={[0.25,0.15,0]}>
        <mesh rotation={[0.2,0,-0.3]}><planeGeometry args={[0.3,0.2]} /><meshStandardMaterial color="#E3F2FD" side={THREE.DoubleSide} transparent opacity={0.7} /></mesh>
      </group>
      <group ref={tailRef} position={[0,-0.1,-0.25]}>
        <mesh rotation={[0.5,0,0]}><capsuleGeometry args={[0.03,0.3,4,8]} /><meshStandardMaterial color="#B0BEC5" roughness={0.6} /></mesh>
      </group>
    </group>
  );
}

/* ═══ TinkRobot — Tiny robot with glowing visor ═══ */
export function TinkRobot({ position = [0, -0.5, 4] }) {
  const groupRef = useRef();
  const antennaRef = useRef();
  const reaction = useStore((s) => s.characterReaction);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1]+Math.sin(t*1.5)*0.08;
      groupRef.current.rotation.y = Math.sin(t*0.4)*0.2+Math.PI*0.1;
    }
    if (antennaRef.current) antennaRef.current.rotation.z = Math.sin(t*3)*0.15;
  });

  useEffect(() => {
    if (!reaction || !groupRef.current) return;
    if (reaction.type === 'happy') {
      gsap.to(groupRef.current.position, { y: position[1]+0.6, duration: 0.25, ease: 'back.out(3)', yoyo: true, repeat: 5 });
    } else {
      gsap.to(groupRef.current.rotation, { y: groupRef.current.rotation.y+Math.PI*4, duration: 1.2, ease: 'power2.out' });
    }
  }, [reaction]);

  return (
    <group ref={groupRef} position={position}>
      {[-0.1,0.1].map((x,i) => (
        <React.Fragment key={i}>
          <mesh position={[x,-0.35,0]}><cylinderGeometry args={[0.04,0.05,0.2,8]} /><meshStandardMaterial color="#78909C" metalness={0.3} roughness={0.4} /></mesh>
          <mesh position={[x,-0.48,0.02]}><boxGeometry args={[0.08,0.04,0.1]} /><meshStandardMaterial color="#546E7A" metalness={0.4} roughness={0.3} /></mesh>
        </React.Fragment>
      ))}
      <mesh castShadow><sphereGeometry args={[0.25,16,16]} /><meshStandardMaterial color="#ECEFF1" metalness={0.2} roughness={0.3} /></mesh>
      <mesh position={[0,-0.05,0.22]}><circleGeometry args={[0.1,16]} /><meshStandardMaterial color="#FFE082" metalness={0.3} roughness={0.2} /></mesh>
      <mesh position={[0,0.08,0.2]}><boxGeometry args={[0.25,0.08,0.06]} /><meshStandardMaterial color="#42A5F5" emissive="#42A5F5" emissiveIntensity={0.6} metalness={0.5} roughness={0.1} /></mesh>
      <mesh position={[-0.06,0.08,0.24]}><sphereGeometry args={[0.02,8,8]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
      <mesh position={[0.06,0.08,0.24]}><sphereGeometry args={[0.02,8,8]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
      {[-1,1].map((side,i) => (
        <mesh key={i} position={[side*0.28,0,0]} rotation={[0,0,side*0.5]}>
          <capsuleGeometry args={[0.03,0.15,4,8]} /><meshStandardMaterial color="#90A4AE" metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
      <group ref={antennaRef} position={[0,0.25,0]}>
        <mesh><cylinderGeometry args={[0.012,0.012,0.15,6]} /><meshStandardMaterial color="#90A4AE" metalness={0.4} /></mesh>
        <mesh position={[0,0.1,0]}><sphereGeometry args={[0.04,8,8]} /><meshStandardMaterial color="#FF7043" emissive="#FF7043" emissiveIntensity={0.8} /></mesh>
        <pointLight position={[0,0.1,0]} color="#FF7043" intensity={0.3} distance={1.5} />
      </group>
    </group>
  );
}