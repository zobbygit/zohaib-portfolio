import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group, Mesh } from "three";
import { getElementScrollProgress } from "../../lib/homeScroll";

/**
 * Education as a physical timeline: one marker per entry, laid along a line the
 * camera dollies through as the visitor scrolls. Sits behind the existing DOM
 * timeline (which stays the readable, accessible source of the actual content) —
 * this adds the "the visitor travels through it" feeling rather than replacing
 * the text.
 */
function Milestones({ count, containerRef }: { count: number; containerRef: RefObject<HTMLDivElement>; }) {
  const group = useRef<Group>(null);
  const nodeRefs = useRef<(Mesh | null)[]>([]);
  const smoothed = useRef(0);

  const positions = useMemo(() => Array.from({ length: count }, (_, i) => -(i / Math.max(1, count - 1)) * 8), [count]);

  useFrame((state) => {
    const target = getElementScrollProgress(containerRef.current);
    smoothed.current += (target - smoothed.current) * 0.08;
    const p = smoothed.current;
    if (group.current) group.current.rotation.y = state.pointer.x * 0.08;
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const entryProgress = i / Math.max(1, count - 1);
      const active = p >= entryProgress - 0.05;
      const mat = mesh.material as { opacity: number };
      mat.opacity = active ? 0.9 : 0.15;
      mesh.scale.setScalar(active ? 1 : 0.6);
    });
  });

  return (
    <group ref={group}>
      {positions.map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          <mesh ref={(el) => (nodeRefs.current[i] = el)}>
            <torusGeometry args={[0.35, 0.02, 8, 24]} />
            <meshBasicMaterial color="#38e1d0" transparent opacity={0.15} />
          </mesh>
        </group>
      ))}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0, 0, 0, positions[positions.length - 1] ?? 0]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#4a5568" transparent opacity={0.4} />
      </line>
    </group>
  );
}

function Dolly({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  useFrame((state) => {
    const target = getElementScrollProgress(containerRef.current);
    smoothed.current += (target - smoothed.current) * 0.08;
    camera.position.z = 3 - smoothed.current * 8;
    camera.position.y = 0.2 + state.pointer.y * 0.08;
    camera.lookAt(0, 0, camera.position.z - 2);
  });
  return null;
}

export default function EducationWorld({ containerRef, count, lite }: { containerRef: RefObject<HTMLDivElement>; count: number; lite: boolean }) {
  return (
    <Canvas dpr={[1, lite ? 1.2 : 1.6]} camera={{ position: [0, 0.2, 3], fov: 42 }} gl={{ antialias: !lite, alpha: true }} style={{ pointerEvents: "none" }}>
      <Dolly containerRef={containerRef} />
      <Milestones count={count} containerRef={containerRef} />
    </Canvas>
  );
}
