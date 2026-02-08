import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * CameraController — Slow parallax following the mouse cursor.
 */
export default function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(() => {
    const tx = mouse.current.x * 2;
    const ty = 3 - mouse.current.y * 1;
    camera.position.x += (tx - camera.position.x) * 0.02;
    camera.position.y += (ty - camera.position.y) * 0.02;
    camera.position.z = 12;
    camera.lookAt(0, 0, 0);
  });

  return null;
}