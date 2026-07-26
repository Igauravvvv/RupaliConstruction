import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Points, PointMaterial, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// --- HERO BACKGROUND COMPONENTS (CITY SKYLINE) ---
function TwistedTower({ position, scale }: { position: [number, number, number], scale: number }) {
  const numFloors = 20;
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, numFloors * 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, numFloors, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, numFloors * 0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.85, numFloors + 0.1, 8]} />
        <meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.2} />
      </mesh>
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
  const { viewport } = useThree();
  
  const isMobile = viewport.width < 12;
  const scaleMultiplier = isMobile ? 0.65 : 1;
  const scaleBase = 0.45 * scaleMultiplier;
  const posX = isMobile ? -viewport.width / 2 + 1.5 : -14;
  const posY = isMobile ? -11 : -10.5;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + posY;
    }
  });

  return (
    <group ref={groupRef} scale={[scaleBase, scaleBase * 1.6, scaleBase]} position={[posX, posY, 0]}>
      <TwistedTower position={[0, 0, 0]} scale={1} />
      <BlockTower position={[-5, 0, -3]} scale={0.8} />
      <SpireTower position={[4, 0, -4]} scale={0.9} />
      <BlockTower position={[2, 0, 4]} scale={0.6} />
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
      const radius = Math.random() * 12 + 2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 20;
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

// --- VILLA COMPONENTS ---
function ApartmentBuilding() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, t > 1.0 ? 1 : 0, 0.1 * 2.5));
    }
  });

  return (
    <group ref={groupRef} scale={0} position={[12, 0, -8]}>
      <mesh position={[0, 4, 0]}><boxGeometry args={[8, 8, 8]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 4, 0]}><boxGeometry args={[8.05, 8.05, 8.05]} /><meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.15} /></mesh>
      <mesh position={[0, 14, 0]}><boxGeometry args={[6, 12, 6]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 14, 0]}><boxGeometry args={[6.05, 12.05, 6.05]} /><meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.2} /></mesh>
      {[...Array(6)].map((_, i) => (
        <group key={`balcony-${i}`} position={[0, 9 + i * 2, 3]}>
          <mesh position={[0, 0, 0.5]}><boxGeometry args={[5, 1, 1]} /><meshBasicMaterial color="#64748b" wireframe transparent opacity={0.5} /></mesh>
        </group>
      ))}
      <mesh position={[0, 20.5, 0]}><boxGeometry args={[4, 1, 4]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 20.5, 0]}><boxGeometry args={[4.05, 1.05, 4.05]} /><meshBasicMaterial color="#64748b" wireframe transparent opacity={0.5} /></mesh>
    </group>
  );
}

function ModernVilla() {
  const groupRef = useRef<THREE.Group>(null);
  const foundationRef: any = useRef<THREE.Group>(null);
  const poolRef = useRef<THREE.Group>(null);
  const garageRef = useRef<THREE.Group>(null);
  const groundFloorRef = useRef<THREE.Group>(null);
  const stairsRef = useRef<THREE.Group>(null);
  const cantileverRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const landscapeRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  const isMobile = viewport.width < 12;
  const scaleMultiplier = isMobile ? 0.65 : 1;
  const scaleBase = 0.55 * scaleMultiplier;
  const posX = isMobile ? viewport.width / 2 - 1.5 : 14;
  const posY = isMobile ? -10 : -7.5;
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const introProgress = Math.min(t / 3.5, 1);
      const easedIntro = 1 - Math.pow(1 - introProgress, 3);
      const targetRotX = -0.15 * easedIntro; 
      const targetRotY = 0.6 * easedIntro + (Math.sin(t * 0.2) * 0.05); 
      groupRef.current.rotation.x = targetRotX;
      groupRef.current.rotation.y = targetRotY;
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.2 + posY;
    }

    const animSpeed = 2.5;
    if (foundationRef.current) foundationRef.current.scale.setScalar(THREE.MathUtils.lerp(foundationRef.current.scale.x, t > 0.5 ? 1 : 0, 0.1 * animSpeed));
    if (poolRef.current) poolRef.current.scale.setScalar(THREE.MathUtils.lerp(poolRef.current.scale.x, t > 1.0 ? 1 : 0, 0.1 * animSpeed));
    if (garageRef.current) garageRef.current.scale.setScalar(THREE.MathUtils.lerp(garageRef.current.scale.x, t > 1.5 ? 1 : 0, 0.1 * animSpeed));
    if (stairsRef.current) stairsRef.current.scale.setScalar(THREE.MathUtils.lerp(stairsRef.current.scale.x, t > 1.8 ? 1 : 0, 0.1 * animSpeed));
    if (groundFloorRef.current) groundFloorRef.current.scale.setScalar(THREE.MathUtils.lerp(groundFloorRef.current.scale.x, t > 2.2 ? 1 : 0, 0.1 * animSpeed));
    if (cantileverRef.current) cantileverRef.current.scale.setScalar(THREE.MathUtils.lerp(cantileverRef.current.scale.x, t > 2.8 ? 1 : 0, 0.1 * animSpeed));
    if (roofRef.current) roofRef.current.scale.setScalar(THREE.MathUtils.lerp(roofRef.current.scale.x, t > 3.4 ? 1 : 0, 0.1 * animSpeed));
    if (landscapeRef.current) landscapeRef.current.scale.setScalar(THREE.MathUtils.lerp(landscapeRef.current.scale.x, t > 4.0 ? 1 : 0, 0.1 * animSpeed));
  });

  const baseColor = "#ffffff";
  const wireColor = "#0b2e59"; 
  const accentColor = "#64748b";

  return (
    <group ref={groupRef} scale={[scaleBase, scaleBase, scaleBase]} position={[posX, posY, 0]}>
      <ApartmentBuilding />
      <group ref={foundationRef} scale={0}>
        <mesh position={[0, -0.25, 0]}><boxGeometry args={[18, 0.5, 12]} /><meshStandardMaterial color={baseColor} /></mesh>
        <mesh position={[0, -0.25, 0]}><boxGeometry args={[18.05, 0.55, 12.05]} /><meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} /></mesh>
      </group>
      <group ref={poolRef} scale={0}>
        <group position={[3, 0.2, 4.5]}>
          <mesh position={[0, 0.1, 0]}><boxGeometry args={[8, 0.2, 3]} /><meshPhysicalMaterial color={baseColor} transmission={0.9} opacity={1} roughness={0.05} /></mesh>
          <mesh position={[0, 0.1, 1.5]}><boxGeometry args={[8, 0.25, 0.1]} /><meshBasicMaterial color={accentColor} wireframe transparent opacity={0.5} /></mesh>
        </group>
        {[...Array(2)].map((_, i) => (
          <group key={`sunbed-${i}`} position={[0 + i * 2, 0.2, 7]}>
            <mesh position={[0, 0.1, 0]}><boxGeometry args={[1, 0.1, 2]} /><meshStandardMaterial color={baseColor} /></mesh>
            <mesh position={[0, 0.3, -0.8]} rotation={[0.5, 0, 0]}><boxGeometry args={[1, 0.1, 0.8]} /><meshStandardMaterial color={baseColor} /></mesh>
          </group>
        ))}
      </group>
      <group ref={garageRef} scale={0}>
        <group position={[-6, 1.5, -2]}>
          <mesh><boxGeometry args={[5, 3, 6]} /><meshStandardMaterial color={baseColor} /></mesh>
          <mesh><boxGeometry args={[5.05, 3.05, 6.05]} /><meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} /></mesh>
          <mesh position={[0, -0.2, 3.01]}><boxGeometry args={[4, 2.6, 0.1]} /><meshBasicMaterial color={accentColor} wireframe transparent opacity={0.4} /></mesh>
        </group>
      </group>
      <group ref={stairsRef} scale={0}>
        {[...Array(6)].map((_, i) => (
          <mesh key={`stair-${i}`} position={[-2, -0.2 + i * 0.2, 7 + i * 0.4]}><boxGeometry args={[3, 0.1, 1]} /><meshStandardMaterial color={baseColor} /></mesh>
        ))}
      </group>
      <group ref={groundFloorRef} scale={0}>
        <group position={[1, 2.5, 0]}>
          <mesh><boxGeometry args={[8, 5, 8]} /><meshPhysicalMaterial color={baseColor} transmission={0.95} opacity={1} roughness={0.05} thickness={0.5} /></mesh>
          <mesh><boxGeometry args={[8.05, 5.05, 8.05]} /><meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} /></mesh>
        </group>
        <group position={[1, 2.5, -3]}>
          <mesh><boxGeometry args={[8, 5, 2]} /><meshStandardMaterial color={baseColor} /></mesh>
          <mesh><boxGeometry args={[8.05, 5.05, 2.05]} /><meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} /></mesh>
        </group>
      </group>
      <group ref={cantileverRef} scale={0}>
        <group position={[3, 5.5, 2]}>
          <mesh><boxGeometry args={[14, 1.5, 10]} /><meshStandardMaterial color={baseColor} /></mesh>
          <mesh><boxGeometry args={[14.05, 1.55, 10.05]} /><meshBasicMaterial color={wireColor} wireframe transparent opacity={0.2} /></mesh>
        </group>
        <group position={[8.5, 5.5, 4]}>
          <mesh><boxGeometry args={[3, 1.5, 6]} /><mesh castShadow receiveShadow /></mesh>
          <mesh><boxGeometry args={[3.05, 1.55, 6.05]} /><meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} /></mesh>
        </group>
      </group>
      <group ref={roofRef} scale={0}>
        {[...Array(12)].map((_, i) => (
          <mesh key={`pergola-${i}`} position={[-1 + i * 0.8, 6.5, 2]}><boxGeometry args={[0.2, 0.2, 8]} /><meshBasicMaterial color={accentColor} wireframe transparent opacity={0.5} /></mesh>
        ))}
      </group>
      <group ref={landscapeRef} scale={0}>
        {[...Array(5)].map((_, i) => (
          <group key={`land-${i}`} position={[-7 + i * 1.5, 1.5, 6]}>
            <mesh position={[0, -0.8, 0]}><cylinderGeometry args={[0.05, 0.05, 1.5]} /><meshStandardMaterial color={baseColor} /></mesh>
            <mesh><icosahedronGeometry args={[0.6, 1]} /><meshPhysicalMaterial color={baseColor} transmission={0.8} opacity={1} roughness={0.1} /></mesh>
            <mesh><icosahedronGeometry args={[0.65, 1]} /><meshBasicMaterial color={accentColor} wireframe transparent opacity={0.4} /></mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// --- UNIFIED SCENE COMPONENT ---
export default function CombinedHero3D() {
  return (
    <div className="absolute inset-0 bg-[var(--rc-white)] overflow-hidden pointer-events-none">
      {/* 
        A single Canvas spanning the entire viewport.
        This eliminates the overhead of running two separate WebGL contexts.
      */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas camera={{ position: [0, 8, 22], fov: 45 }} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <ambientLight intensity={0.7} />
          {/* Shared lighting for the entire scene */}
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#0b2e59" />
          <directionalLight position={[-10, 10, -5]} intensity={1.2} color="#ff6b1a" />
          
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, 0, 0]} 
            polar={[-Math.PI / 4, Math.PI / 4]} 
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            {/* The City Skyline (positioned on the left) */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <CitySkyline />
            </Float>

            {/* The Modern Villa (positioned on the right) */}
            <Float speed={2} rotationIntensity={0.02} floatIntensity={0.1}>
              <ModernVilla />
            </Float>
          </PresentationControls>
          
          <DataParticles />
          <fog attach="fog" args={['#ffffff', 10, 45]} />
        </Canvas>
      </div>
    </div>
  );
}
