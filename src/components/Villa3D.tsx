import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function ApartmentBuilding() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Build animation for apartment (delayed start)
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, t > 1.0 ? 1 : 0, 0.1 * 2.5));
    }
  });

  return (
    <group ref={groupRef} scale={0} position={[12, 0, -8]}>
      {/* Apartment Base */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[8, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[8.05, 8.05, 8.05]} />
        <meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Apartment Tower */}
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[6, 12, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[6.05, 12.05, 6.05]} />
        <meshBasicMaterial color="#0b2e59" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Balconies (Grey Wireframes instead of orange) */}
      {[...Array(6)].map((_, i) => (
        <group key={`balcony-${i}`} position={[0, 9 + i * 2, 3]}>
          <mesh position={[0, 0, 0.5]}>
            <boxGeometry args={[5, 1, 1]} />
            <meshBasicMaterial color="#64748b" wireframe transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
      
      {/* Roof feature */}
      <mesh position={[0, 20.5, 0]}>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 20.5, 0]}>
        <boxGeometry args={[4.05, 1.05, 4.05]} />
        <meshBasicMaterial color="#64748b" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function ModernVilla() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs for animation
  const foundationRef: any = useRef<THREE.Group>(null);
  const poolRef = useRef<THREE.Group>(null);
  const garageRef = useRef<THREE.Group>(null);
  const groundFloorRef = useRef<THREE.Group>(null);
  const stairsRef = useRef<THREE.Group>(null);
  const cantileverRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const landscapeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Intro camera sweep animation: smoothly tilt up and pan left over the first 3.5 seconds
      const introProgress = Math.min(t / 3.5, 1);
      const easedIntro = 1 - Math.pow(1 - introProgress, 3); // cubic ease out
      
      // Changed to match the requested angle (looking slightly up from below, rotated to show left side closer)
      const targetRotX = -0.15 * easedIntro; 
      const targetRotY = 0.6 * easedIntro + (Math.sin(t * 0.2) * 0.05); // Add subtle hover on top
      
      groupRef.current.rotation.x = targetRotX;
      groupRef.current.rotation.y = targetRotY;
      
      // Dropped significantly lower to start directly from bottom of hero section
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.2 - 7.5;
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

  // Pure White and Slate Grey for solid materials to match the new color scheme
  const baseColor = "#ffffff";
  const wireColor = "#0b2e59"; // Deep Blue
  const accentColor = "#64748b"; // Slate Grey (Replaced Orange)

  return (
    // Shifted left from 2 to 0.5 to keep everything fully in frame
    <group ref={groupRef} scale={[0.55, 0.55, 0.55]} position={[0.5, 0, 0]}>
      {/* Apartment Building in the background */}
      <ApartmentBuilding />

      {/* 1. Foundation */}
      <group ref={foundationRef} scale={0}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[18, 0.5, 12]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[18.05, 0.55, 12.05]} />
          <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} />
        </mesh>
      </group>

      {/* 2. Pool & Sunbeds */}
      <group ref={poolRef} scale={0}>
        <group position={[3, 0.2, 4.5]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[8, 0.2, 3]} />
            <meshPhysicalMaterial color={baseColor} transmission={0.9} opacity={1} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0.1, 1.5]}>
            <boxGeometry args={[8, 0.25, 0.1]} />
            <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.5} />
          </mesh>
        </group>
        {[...Array(2)].map((_, i) => (
          <group key={`sunbed-${i}`} position={[0 + i * 2, 0.2, 7]}>
            <mesh position={[0, 0.1, 0]}>
               <boxGeometry args={[1, 0.1, 2]} />
               <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0, 0.3, -0.8]} rotation={[0.5, 0, 0]}>
               <boxGeometry args={[1, 0.1, 0.8]} />
               <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. Garage */}
      <group ref={garageRef} scale={0}>
        <group position={[-6, 1.5, -2]}>
          <mesh>
            <boxGeometry args={[5, 3, 6]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh>
            <boxGeometry args={[5.05, 3.05, 6.05]} />
            <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} />
          </mesh>
          <mesh position={[0, -0.2, 3.01]}>
            <boxGeometry args={[4, 2.6, 0.1]} />
            <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.4} />
          </mesh>
        </group>
      </group>

      {/* 4. Ground Floor & Stairs */}
      <group ref={stairsRef} scale={0}>
        {[...Array(6)].map((_, i) => (
          <mesh key={`stair-${i}`} position={[-2, -0.2 + i * 0.2, 7 + i * 0.4]}>
            <boxGeometry args={[3, 0.1, 1]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        ))}
      </group>
      
      <group ref={groundFloorRef} scale={0}>
        <group position={[1, 2.5, 0]}>
          <mesh>
            <boxGeometry args={[8, 5, 8]} />
            <meshPhysicalMaterial color={baseColor} transmission={0.95} opacity={1} roughness={0.05} thickness={0.5} />
          </mesh>
          <mesh>
            <boxGeometry args={[8.05, 5.05, 8.05]} />
            <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} />
          </mesh>
        </group>
        <group position={[1, 2.5, -3]}>
          <mesh>
            <boxGeometry args={[8, 5, 2]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh>
            <boxGeometry args={[8.05, 5.05, 2.05]} />
            <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} />
          </mesh>
        </group>
      </group>

      {/* 5. Cantilever (Second Floor) */}
      <group ref={cantileverRef} scale={0}>
        <group position={[3, 5.5, 2]}>
          <mesh>
            <boxGeometry args={[14, 1.5, 10]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh>
            <boxGeometry args={[14.05, 1.55, 10.05]} />
            <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.2} />
          </mesh>
        </group>
        <group position={[8.5, 5.5, 4]}>
          <mesh>
            <boxGeometry args={[3, 1.5, 6]} />
            <mesh castShadow receiveShadow />
          </mesh>
          <mesh>
            <boxGeometry args={[3.05, 1.55, 6.05]} />
            <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.15} />
          </mesh>
        </group>
      </group>

      {/* 6. Roof Pergola */}
      <group ref={roofRef} scale={0}>
        {[...Array(12)].map((_, i) => (
          <mesh key={`pergola-${i}`} position={[-1 + i * 0.8, 6.5, 2]}>
            <boxGeometry args={[0.2, 0.2, 8]} />
            <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* 7. Landscape Elements */}
      <group ref={landscapeRef} scale={0}>
        {[...Array(5)].map((_, i) => (
          <group key={`land-${i}`} position={[-7 + i * 1.5, 1.5, 6]}>
            <mesh position={[0, -0.8, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1.5]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh>
              <icosahedronGeometry args={[0.6, 1]} />
              <meshPhysicalMaterial color={baseColor} transmission={0.8} opacity={1} roughness={0.1} />
            </mesh>
            <mesh>
              <icosahedronGeometry args={[0.65, 1]} />
              <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export default function Villa3D() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 w-full h-full lg:w-2/5 lg:left-auto lg:right-0">
        <Canvas camera={{ position: [0, 8, 22], fov: 45 }} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#0b2e59" />
          <directionalLight position={[-10, 10, 5]} intensity={1.0} color="#ff6b1a" />
          
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={true} 
            rotation={[0, 0, 0]} 
            polar={[-Math.PI / 4, Math.PI / 4]} 
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <Float speed={2} rotationIntensity={0.02} floatIntensity={0.1}>
              <ModernVilla />
            </Float>
          </PresentationControls>
        </Canvas>
      </div>
    </div>
  );
}
