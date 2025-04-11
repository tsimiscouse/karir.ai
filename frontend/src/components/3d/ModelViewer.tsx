'use client';
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = () => {
  const { scene } = useGLTF('/chair.glb');
  const modelRef = useRef<THREE.Object3D>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = mouse.x * 5;
      modelRef.current.rotation.x += (mouse.y - modelRef.current.rotation.x) * 0.05;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = -(e.clientY / innerHeight) * 2 - 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <primitive ref={modelRef} object={scene} scale={4.5} />;
};

const ModelViewer: React.FC = () => {
  return (
    <Canvas className="rounded-lg" camera={{ position: [2, 2, 2], fov: 45 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
