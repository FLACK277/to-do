/**
 * ParallaxCamera — Slowly follows mouse position for a dreamy parallax effect
 */
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export default function ParallaxCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse globally
  if (typeof window !== 'undefined' && !window.__parallaxListenerAdded) {
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.__parallaxListenerAdded = true;
  }

  useFrame(() => {
    // Smooth lerp toward mouse offset
    const targetX = mouse.current.x * 1.5;
    const targetY = 3 - mouse.current.y * 0.8;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}