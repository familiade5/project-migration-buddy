import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

export interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

interface Funnel3DProps {
  stages: FunnelStage[]; // ordered top→bottom (largest first)
  height?: number;
}

function FunnelSegment({
  topRadius, bottomRadius, height, y, color, label, value, pct,
}: {
  topRadius: number; bottomRadius: number; height: number; y: number;
  color: string; label: string; value: string; pct: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    }
  });
  return (
    <group position={[0, y, 0]}>
      <mesh ref={ref} castShadow receiveShadow>
        <cylinderGeometry args={[topRadius, bottomRadius, height, 64, 1, false]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.35}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Edge ring (subtle outline) */}
      <mesh position={[0, height / 2, 0]}>
        <torusGeometry args={[topRadius, 0.012, 12, 80]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Floating label */}
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.25}>
        <Text
          position={[topRadius + 0.55, 0.02, 0]}
          fontSize={0.22}
          color="#0F172A"
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor="#ffffff"
        >
          {label}
        </Text>
        <Text
          position={[topRadius + 0.55, -0.24, 0]}
          fontSize={0.32}
          color={color}
          anchorX="left"
          anchorY="middle"
          fontWeight={700 as any}
        >
          {value}
        </Text>
        <Text
          position={[topRadius + 0.55, -0.5, 0]}
          fontSize={0.16}
          color="#64748B"
          anchorX="left"
          anchorY="middle"
        >
          {pct}
        </Text>
      </Float>
    </group>
  );
}

function FunnelScene({ stages }: { stages: FunnelStage[] }) {
  const segments = useMemo(() => {
    const top = Math.max(...stages.map((s) => s.value), 1);
    const minRadius = 0.35;
    const maxRadius = 1.9;
    const segHeight = 0.85;
    const totalHeight = segHeight * stages.length;
    const startY = totalHeight / 2 - segHeight / 2;

    return stages.map((s, i) => {
      const next = stages[i + 1];
      const ratioTop = Math.max(s.value / top, 0.0001);
      const ratioBottom = next ? Math.max(next.value / top, 0.0001) : Math.max(s.value / top, 0.0001) * 0.55;
      const tR = minRadius + (maxRadius - minRadius) * Math.sqrt(ratioTop);
      const bR = minRadius + (maxRadius - minRadius) * Math.sqrt(ratioBottom);
      const y = startY - i * segHeight;
      const pct = i === 0 ? '100%' : `${((s.value / (stages[0].value || 1)) * 100).toFixed(1)}% do topo`;
      return {
        ...s,
        topRadius: tR,
        bottomRadius: bR,
        height: segHeight * 0.96,
        y,
        pctLabel: pct,
      };
    });
  }, [stages]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />
      <directionalLight position={[-5, 3, -3]} intensity={0.4} color="#F47920" />
      <Environment preset="city" />

      <group ref={groupRef} position={[-0.4, 0, 0]}>
        {segments.map((seg) => (
          <FunnelSegment
            key={seg.label}
            topRadius={seg.topRadius}
            bottomRadius={seg.bottomRadius}
            height={seg.height}
            y={seg.y}
            color={seg.color}
            label={seg.label}
            value={seg.value.toLocaleString('pt-BR')}
            pct={seg.pctLabel}
          />
        ))}
      </group>
    </>
  );
}

export default function Funnel3D({ stages, height = 460 }: Funnel3DProps) {
  return (
    <div style={{ width: '100%', height, borderRadius: 16, overflow: 'hidden', background: 'radial-gradient(circle at 30% 20%, #FFF7ED 0%, #F8FAFC 60%, #EFF4F8 100%)' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [3.4, 1.4, 4.6], fov: 42 }}
      >
        <Suspense fallback={null}>
          <FunnelScene stages={stages} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}