import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { useProgressRef } from "./ProgressContext";
import { rangeWeight } from "./chapters";

const STAGES = ["FRONTEND", "BACKEND", "DATABASE", "APIs", "SECURITY", "TESTING", "CI/CD", "DEPLOY"];

/**
 * The engineering chapter as one physical structure: nodes for each stage, laid along
 * a gentle arc, connected by lines that draw in as scroll progress reaches that stage.
 * This replaces a row of labelled cards with an object the visitor watches assemble.
 */
export default function SystemPipeline() {
  const group = useRef<Group>(null);
  const nodeRefs = useRef<(Mesh | null)[]>([]);
  const progressRef = useProgressRef();

  const nodes = useMemo(
    () =>
      STAGES.map((label, i) => {
        const t = i / (STAGES.length - 1);
        return { label, x: (t - 0.5) * 5.2, y: Math.sin(t * Math.PI) * 0.6, z: -2 - t * 2.2 };
      }),
    [],
  );

  useFrame((state) => {
    const p = progressRef.current;
    const presence = rangeWeight(p, 0.08, 0.55);
    if (group.current) {
      group.current.visible = presence > 0.01;
      group.current.rotation.y = state.pointer.x * 0.1;
    }
    // Each node lights up in sequence as progress sweeps through the chapter range.
    const stageProgress = Math.max(0, Math.min(1, (p - 0.28) / (0.52 - 0.28)));
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const active = stageProgress * STAGES.length > i;
      const mat = mesh.material as { opacity: number; color: { setHex: (h: number) => void } };
      mat.opacity = presence * (active ? 1 : 0.25);
      mesh.scale.setScalar(active ? 1 : 0.7);
    });
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <group key={n.label} position={[n.x, n.y, n.z]}>
          <mesh ref={(el) => (nodeRefs.current[i] = el)}>
            <octahedronGeometry args={[0.18, 0]} />
            <meshBasicMaterial color={i === 4 ? "#f2b134" : i >= 5 ? "#38e1d0" : "#7c6cff"} transparent opacity={0.25} />
          </mesh>
          {i > 0 && (
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([-(n.x - nodes[i - 1].x), -(n.y - nodes[i - 1].y), -(n.z - nodes[i - 1].z), 0, 0, 0]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color="#4a5568" transparent opacity={0.5} />
            </line>
          )}
        </group>
      ))}
    </group>
  );
}
