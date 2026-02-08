import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import CameraController from './CameraController';
import { FloatingIsland, GrassPatches, AnimatedClouds, MagicParticles, SceneLighting, PastelSky } from './Environment';
import { KodamaSpirit, SoraCat, TinkRobot } from './Characters';

/**
 * SceneCanvas — The full 3D scene rendered behind the UI overlay.
 */
export default function SceneCanvas() {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{ position: [0, 3, 12], fov: 45 }}
        gl={{ antialias: true, toneMapping: 3 /* ACESFilmicToneMapping */ }}
        onCreated={({ gl }) => { gl.toneMappingExposure = 1.2; }}
      >
        <Suspense fallback={null}>
          <PastelSky />
          <SceneLighting />
          <FloatingIsland />
          <GrassPatches />
          <AnimatedClouds />
          <MagicParticles />

          {/* Characters */}
          <KodamaSpirit position={[-4, -0.8, 2]} />
          <SoraCat position={[5, 1, -1]} />
          <TinkRobot position={[0, -0.5, 4]} />

          {/* Post-processing */}
          <EffectComposer>
            <Bloom intensity={0.3} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
            <Vignette eskil={false} offset={0.1} darkness={0.3} />
          </EffectComposer>

          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}