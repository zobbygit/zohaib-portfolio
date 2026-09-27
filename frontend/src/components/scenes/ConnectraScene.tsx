import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

/** Real-time social motif: pulsing user nodes connected by live message pulses (SSE metaphor). */
function Rig() {
  const group = useRef<Group>(null);
  const pulses = useRef<(Mesh | null)[]>([]);
  const nodes = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return { x: Math.cos(angle) * 1.3, y: Math.sin(angle) * 1.3, angle };
    });
  }, []);

  useFrame((state) => {
    if (group.current) group.current.rotation.z = state.clock.elapsedTime * 0.08 + state.pointer.x * 0.15;
    const t = state.clock.elapsedTime;
    pulses.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = (t * 0.6 + i / nodes.length) % 1;
      mesh.position.x = nodes[i].x * (1 - phase);
      mesh.position.y = nodes[i].y * (1 - phase);
      const material = mesh.material as { opacity: number };
      material.opacity = 1 - phase;
    });
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#7c6cff" wireframe />
      </mesh>
      {nodes.map((n, i) => (
        <group key={i}>
          <mesh position={[n.x, n.y, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshBasicMaterial color="#38e1d0" wireframe />
          </mesh>
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0, n.x, n.y, 0]), 3]} />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#334" transparent opacity={0.5} />
          </line>
          <mesh ref={(el) => (pulses.current[i] = el)}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#38e1d0" transparent opacity={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function ConnectraScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 42 }} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: "none" }}>
      <Rig />
    </Canvas>
  );
}
