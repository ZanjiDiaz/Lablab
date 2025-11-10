'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { useLoader } from '@react-three/fiber';

export default function RosePinkScene() {
  return (
    <div className="w-screen h-screen">
      <Canvas 
        camera={{ 
          position: [90, 0, 250], 
          fov: 33 
        }}
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0xffc0cb, 0);
        }}
      >

        <ambientLight intensity={1} />
        <directionalLight 
          position={[2, 2, 3]} 
          intensity={0.8} 
          castShadow
        />
        <Suspense fallback={null}>
          <RoseModel />
        </Suspense>
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={.75}
          enableDamping
          enableZoom={true}
          minDistance={150}
          maxDistance={500}
          reverseOrbit={true}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

function RoseModel() {
  // Use basePath for GitHub Pages deployment
  const basePath = typeof window !== 'undefined' && window.location.hostname.includes('github.io') 
    ? '/Lablab' 
    : '';
  const obj = useLoader(OBJLoader, `${basePath}/3d/red_rose3.obj`);
  const groupRef = useRef<THREE.Group>(null!);
  
  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.MeshStandardMaterial({
            metalness: 0.1,
            roughness: 0.5,
            side: THREE.DoubleSide
          });

          if (child.name === "rose") {
            material.color.set("#FF1A56");
          } else if (child.name === "calyx") {
            material.color.set("#1a3a2e");
          } else if (child.name === "leaf1" || child.name === "leaf2") {
            material.color.set("#2d5a47");
          }

          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      obj.rotation.set(0, Math.PI / 1.7, 0);
    }
  }, [obj]);

  return (
    <group ref={groupRef}>
      <pointLight 
        position={[-100, 150, 200]}
        intensity={1.2}
        castShadow
      />
      <pointLight 
        position={[100, 150, -100]}
        intensity={0.8}
        color="#d4a5a5"
      />
      <primitive object={obj} />
    </group>
  );
}
