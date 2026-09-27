import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";

export interface LabNode {
  id: string;
  label: string;
}

/**
 * The Lab as physical objects, not a scrolling list: one node per experiment,
 * arranged in a loose ring. Clicking or pressing Enter/Space on a node scrolls to
 * and briefly highlights that experiment's actual, fully-interactive demo below —
 * the 3D world is real and clickable, but the demos themselves stay as accessible
 * DOM/SVG (a JSON tree, a live HTTP request, an auth-flow diagram) rather than
 * being reimplemented as WebGL widgets, which would trade real functionality and
 * accessibility for a worse version of what already works well.
 */
function Ring({ nodes, onSelect, hovered, setHovered }: { nodes: LabNode[]; onSelect: (id: string) => void; hovered: string | null; setHovered: (id: string | null) => void }) {
  const group = useRef<Group>(null);
  const meshRefs = useRef<(Mesh | null)[]>([]);
  const positions = useMemo(
    () => nodes.map((_, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      return [Math.cos(angle) * 2.2, Math.sin(angle * 0.7) * 0.6, Math.sin(angle) * 2.2] as const;
    }),
    [nodes],
  );

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.05 + state.pointer.x * 0.15;
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const active = hovered === nodes[i].id;
      mesh.scale.setScalar(active ? 1.3 : 1);
      const mat = mesh.material as { opacity: number };
      mat.opacity = active ? 0.9 : 0.35;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh
          key={n.id}
          ref={(el) => (meshRefs.current[i] = el)}
          position={positions[i]}
          onClick={() => onSelect(n.id)}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(n.id); }}
          onPointerOut={() => setHovered(null)}
        >
          <octahedronGeometry args={[0.32, 0]} />
          <meshBasicMaterial color="#38e1d0" wireframe transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export default function LabWorld({ nodes, onSelect, lite }: { nodes: LabNode[]; onSelect: (id: string) => void; lite: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div data-cursor="explore" className="relative h-[46vh] w-full">
      <Canvas dpr={[1, lite ? 1.2 : 1.6]} camera={{ position: [0, 0.5, 5], fov: 45 }} gl={{ antialias: !lite, alpha: true }}>
        <Ring nodes={nodes} onSelect={onSelect} hovered={hovered} setHovered={setHovered} />
      </Canvas>
      <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-xs tracking-widest text-white/40">
        {hovered ? nodes.find((n) => n.id === hovered)?.label.toUpperCase() : "CLICK A NODE TO JUMP TO AN EXPERIMENT"}
      </p>
    </div>
  );
}
