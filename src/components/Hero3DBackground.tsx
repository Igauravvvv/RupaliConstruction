import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. Twisted Helix Skyscraper
function TwistedTower({ position, scale }: { position: [number, number, number], scale: number }) {
  const numFloors = 20;
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Central Core */}
      <mesh position={[0, numFloors * 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, numFloors, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, numFloors * 0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.85, numFloors + 0.1, 8]} />
        <meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.2} />
      </mesh>
      {/* Twisting Floors */}
      {[...Array(numFloors)].map((_, i) => {
        const rotationY = (i / numFloors) * Math.PI * 1.5;
        const s = 2.5 * (1 - (i / numFloors) * 0.3);
        const yPos = i + 0.5;
        return (
          <group key={`floor-${i}`} position={[0, yPos, 0]} rotation={[0, rotationY, 0]}>
            <mesh>
              <boxGeometry args={[s, 0.8, s]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
            </mesh>
            <mesh>
              <boxGeometry args={[s + 0.05, 0.85, s + 0.05]} />
              <meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 2. Blocky Geometric Skyscraper
function BlockTower({ position, scale }: { position: [number, number, number], scale: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {[
        { y: 3, h: 6, w: 4 },
        { y: 8, h: 4, w: 3 },
        { y: 11.5, h: 3, w: 2 },
        { y: 14, h: 2, w: 1 },
      ].map((block, i) => (
        <group key={`block-${i}`} position={[0, block.y, 0]}>
          <mesh>
            <boxGeometry args={[block.w, block.h, block.w]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          <mesh>
            <boxGeometry args={[block.w + 0.1, block.h + 0.1, block.w + 0.1]} />
            <meshBasicMaterial color="#ff6b1a" wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 4, 8]} />
        <meshStandardMaterial color="#ff6b1a" />
      </mesh>
    </group>
  );
}

// 3. Tall Sleek Spire Tower
function SpireTower({ position, scale }: { position: [number, number, number], scale: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 7, 0]}>
        <cylinderGeometry args={[1.5, 2.5, 14, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 7, 0]}>
        <cylinderGeometry args={[1.55, 2.55, 14.1, 16]} />
        <meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[0.1, 1.5, 4, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 20, 0]}>
        <cylinderGeometry args={[0, 0.1, 4, 8]} />
        <meshStandardMaterial color="#ff6b1a" />
      </mesh>
    </group>
  );
}

function CitySkyline() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      // Positioned at extreme left and bottom, slightly larger scale
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 - 9;
      groupRef.current.position.x = -6;
      groupRef.current.position.z = 4;
    }
  });

  return (
    <group ref={groupRef} scale={[0.45, 0.45, 0.45]}>
      <TwistedTower position={[0, 0, 0]} scale={1} />
      <BlockTower position={[-5, 0, -3]} scale={0.8} />
      <SpireTower position={[4, 0, -4]} scale={0.9} />
      <BlockTower position={[2, 0, 4]} scale={0.6} />

      {/* Floating Blueprint Data Rings wrapping the entire city */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`ring-${i}`} position={[0, (i + 1) * 6, 0]} rotation={[(i+1) * 0.3, 0, 0]}>
           <torusGeometry args={[8 + i * 2, 0.05, 16, 64]} />
           <meshBasicMaterial color="#ff6b1a" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function DataParticles() {
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 15;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#0b2e59" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
    </Points>
  );
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 bg-[var(--rc-white)] overflow-hidden pointer-events-none">
      {/* 3D Canvas moved to the left */}
      <div className="absolute inset-0 w-full h-full lg:w-3/5 lg:right-auto lg:left-0">
        <Canvas camera={{ position: [8, 5, 8], fov: 45 }} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#0b2e59" />
          <directionalLight position={[-10, 10, -5]} intensity={1.2} color="#ff6b1a" />
          
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, -0.5, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <CitySkyline />
            </Float>
          </PresentationControls>
          
          <DataParticles />
          
          <fog attach="fog" args={['#F8F7F5', 8, 25]} />
        </Canvas>
      </div>
      
      {/* Gradient overlay to smoothly blend the right side into the 3D canvas on desktop */}
      <div className="absolute inset-0 bg-gradient-to-l from-[var(--rc-white)] via-[var(--rc-white)] to-transparent w-full lg:w-1/2 hidden lg:block pointer-events-none lg:left-auto lg:right-0"></div>
    </div>
  );
}
