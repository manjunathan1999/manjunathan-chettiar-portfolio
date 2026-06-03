import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function LogoShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, state.mouse.y * 1.5, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, state.mouse.x * 1.5, 0.1);
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.008;
      ringRef.current.rotation.x = state.mouse.y * 0.4;
      ringRef.current.rotation.y = state.mouse.x * 0.4;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= 0.012;
      ringRef2.current.rotation.x = -state.mouse.y * 0.2;
      ringRef2.current.rotation.y = -state.mouse.x * 0.2;
    }
  });

  return (
    <group>
      <Float speed={3} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color="#aaaaaa"
            speed={1.5}
            distort={0.25}
            radius={0.9}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      {/* Sci-Fi Tech Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.015, 16, 100]} />
        <meshBasicMaterial color="#888888" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.7, 0.008, 16, 100]} />
        <meshBasicMaterial color="#555555" transparent opacity={0.4} wireframe />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-[250px] sm:h-[350px] cursor-grab active:cursor-grabbing relative select-none">
      {/* Decorative technical coordinate labels */}
      <div className="absolute top-3 left-4 font-mono text-[9px] font-extrabold uppercase tracking-widest text-primary/40 leading-none">
        VECTOR_STREAM_SOURCE // XYZ_ORBITAL
      </div>
      <div className="absolute bottom-3 right-4 font-mono text-[9px] font-extrabold text-primary/40">
        RATE: 60FPS // LOCK_SECURE
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={1} />
        <LogoShape />
      </Canvas>
    </div>
  );
}
