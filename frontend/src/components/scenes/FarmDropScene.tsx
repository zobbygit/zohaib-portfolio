import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

/** Logistics motif: a moving delivery marker travelling between a store node and a home node. */
function Rig() {
  const group = useRef<Group>(null);
  const dot = useRef<Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3 + state.pointer.x * 0.2;
    if (dot.current) dot.current.position.x = -1.4 + ((state.clock.elapsedTime * 0.4) % 2.8);
  });
  return (
    <group ref={group}>
      <mesh position={[-1.4, 0, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial color="#38e1d0" wireframe />
      </mesh>
      <mesh position={[1.4, 0, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshBasicMaterial color="#f2b134" wireframe />
      </mesh>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" args={[new Float32Array([-1.4, 0, 0, 1.4, 0, 0]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#8899aa" transparent opacity={0.4} />
      </line>
      <group ref={dot}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#7c6cff" />
        </mesh>
      </group>
    </group>
  );
}

export default function FarmDropScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 4], fov: 42 }} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: "none" }}>
      <Rig />
    </Canvas>
  );
}
