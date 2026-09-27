import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

/** Orchestration motif: a planner core with three orbiting agent nodes. */
function Rig() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.25 + state.pointer.x * 0.3;
  });
  return (
    <group ref={group}>
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color="#7c6cff" wireframe />
      </mesh>
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[1.6, 0, 0]}>
              <tetrahedronGeometry args={[0.28, 0]} />
              <meshBasicMaterial color="#38e1d0" wireframe />
            </mesh>
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0, 1.6, 0, 0]), 3]} />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color="#38e1d0" transparent opacity={0.4} />
            </line>
          </group>
        );
      })}
    </group>
  );
}

export default function AgentForgeScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1, 4], fov: 42 }} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: "none" }}>
      <Rig />
    </Canvas>
  );
}
