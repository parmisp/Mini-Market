import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function OwlModel() {
  const meshRef = useRef();
  
  // Subtle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <group ref={meshRef}>
      {/* Owl body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.25, 0.3, 0.6]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.25, 0.3, 0.6]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-0.25, 0.3, 0.75]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.25, 0.3, 0.75]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0, 0.1, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
}

function PetModel3D() {
  return (
    <div className="w-32 h-32">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[5, 5, 5]} angle={0.3} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />
        <OwlModel />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

export default PetModel3D;
