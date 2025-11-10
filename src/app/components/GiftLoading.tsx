'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface GiftLoadingProps {
  onComplete: () => void;
}

// Generate particle positions outside component to avoid linting issues
const generateParticles = () => {
  const count = 200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = 0.5 + Math.random() * 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return positions;
};

function GiftBox({ onClick }: { onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lidRef = useRef<THREE.Group>(null!);
  const ribbonHRef = useRef<THREE.Mesh>(null!);
  const ribbonVRef = useRef<THREE.Mesh>(null!);
  const bowRef = useRef<THREE.Group>(null!);
  const heartsRef = useRef<THREE.Group>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  const [isAnimating, setIsAnimating] = useState(false);

  // Create particles positions using the generator function
  const particles = useMemo(() => generateParticles(), []);

  useFrame((state) => {
    if (!isAnimating && groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Animate particles when visible
    if (isAnimating && particlesRef.current) {
      particlesRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onClick, 500);
      }
    });

    // Bow disappears
    if (bowRef.current) {
      tl.to(bowRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.3,
        ease: "back.in"
      });
    }

    // Ribbons fade
    if (ribbonHRef.current && ribbonVRef.current) {
      const ribbonHMat = ribbonHRef.current.material as THREE.MeshStandardMaterial;
      const ribbonVMat = ribbonVRef.current.material as THREE.MeshStandardMaterial;
      tl.to([ribbonHMat, ribbonVMat], {
        opacity: 0,
        duration: 0.2
      }, "-=0.1");
    }

    // Lid opens
    if (lidRef.current) {
      tl.to(lidRef.current.position, {
        y: 4,
        duration: 0.6,
        ease: "back.out(1.2)"
      });
      tl.to(lidRef.current.rotation, {
        x: -0.4,
        duration: 0.6,
        ease: "back.out(1.2)"
      }, "-=0.6");
    }

    // Particles burst
    if (particlesRef.current) {
      tl.set(particlesRef.current, { visible: true }, "-=0.3");
      const particleMat = particlesRef.current.material as THREE.PointsMaterial;
      tl.to(particleMat, {
        opacity: 1,
        duration: 0.2
      }, "-=0.3");
      tl.to(particlesRef.current.position, {
        y: 3,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.3");
      tl.to(particleMat, {
        opacity: 0,
        duration: 0.6
      }, "-=0.4");
    }

    // Hearts fly out
    if (heartsRef.current) {
      tl.to(heartsRef.current.position, {
        y: 5,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.8");
      tl.to(heartsRef.current.scale, {
        x: 2, y: 2, z: 2,
        duration: 0.8
      }, "-=0.8");
    }

    // Improved ending animation - fade and rotate instead of scale
    tl.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: 0.6,
      ease: "power2.in"
    }, "-=0.3");
    
    tl.to(groupRef.current.position, {
      y: -5,
      duration: 0.6,
      ease: "power2.in"
    }, "-=0.6");

    const boxMesh = groupRef.current.children[0] as THREE.Mesh;
    if (boxMesh && boxMesh.material) {
      tl.to((boxMesh.material as THREE.MeshStandardMaterial), {
        opacity: 0,
        transparent: true,
        duration: 0.4
      }, "-=0.4");
    }
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Box Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#ec4899" 
          metalness={0.3} 
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Lid */}
      <group ref={lidRef} position={[0, 1.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.3, 2.2]} />
          <meshStandardMaterial 
            color="#db2777" 
            metalness={0.3} 
            roughness={0.2}
            envMapIntensity={1}
          />
        </mesh>
      </group>

      {/* Horizontal Ribbon */}
      <mesh ref={ribbonHRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.3, 2.1]} />
        <meshStandardMaterial 
          color="#fbcfe8" 
          transparent 
          opacity={1} 
          metalness={0.5} 
          roughness={0.1}
        />
      </mesh>

      {/* Vertical Ribbon */}
      <mesh ref={ribbonVRef} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 2.4, 0.3]} />
        <meshStandardMaterial 
          color="#fbcfe8" 
          transparent 
          opacity={1} 
          metalness={0.5} 
          roughness={0.1}
        />
      </mesh>

      {/* Bow */}
      <group ref={bowRef} position={[0, 1.4, 0]}>
        {/* Left loop */}
        <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
          <torusGeometry args={[0.25, 0.1, 16, 32]} />
          <meshStandardMaterial 
            color="#f9a8d4" 
            metalness={0.4} 
            roughness={0.2}
          />
        </mesh>
        {/* Right loop */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
          <torusGeometry args={[0.25, 0.1, 16, 32]} />
          <meshStandardMaterial 
            color="#f9a8d4" 
            metalness={0.4} 
            roughness={0.2}
          />
        </mesh>
        {/* Center knot */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial 
            color="#f472b6" 
            metalness={0.4} 
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Hearts */}
      <group ref={heartsRef} position={[0, 0.5, 0]} scale={0}>
        <mesh position={[-0.5, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#ff0066" emissive="#ff0066" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.5, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#ffb6c1" emissive="#ffb6c1" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Particles */}
      <Points ref={particlesRef} positions={particles} visible={false}>
        <PointMaterial
          transparent
          opacity={0}
          size={0.15}
          sizeAttenuation
          color="#ff69b4"
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function GiftLoading({ onComplete }: GiftLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="w-full h-4/5">
        <Canvas
          camera={{ position: [5, 3, 5], fov: 50 }}
          shadows
          gl={{ 
            antialias: true,
            alpha: true,
            outputColorSpace: THREE.SRGBColorSpace 
          }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#fda4af" />
          <pointLight position={[5, -3, -5]} intensity={0.5} color="#fbcfe8" />
          
          <GiftBox onClick={onComplete} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
      
      <div className="text-center pb-12">
        <p className="text-pink-600 font-bold text-2xl animate-bounce">
          🎁 Click the gift to open! 🎁
        </p>
      </div>
    </div>
  );
}
