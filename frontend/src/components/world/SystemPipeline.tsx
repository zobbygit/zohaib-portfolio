import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { useProgressRef } from "./ProgressContext";
import { rangeWeight } from "./chapters";

const STAGES = ["FRONTEND", "BACKEND", "DATABASE", "APIs", "SECURITY", "TESTING", "CI/CD", "DEPLOY"];

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

    const stageProgress = Math.max(0, Math.min(1, (p - 0.28) / (0.52 - 0.28)));
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as MeshBasicMaterial;
      const active = stageProgress * STAGES.length > i;
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
            <meshBasicMaterial
              color={i === 4 ? "#f2b134" : i >= 5 ? "#38e1d0" : "#7c6cff"}
              transparent
              opacity={0.25}
            />
          </mesh>
          {i > 0 && (
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array([
                      nodes[i - 1].x - n.x,
                      nodes[i - 1].y - n.y,
                      nodes[i - 1].z - n.z,
                      0,
                      0,
                      0,
                    ]),
                    3,
                  ]}
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