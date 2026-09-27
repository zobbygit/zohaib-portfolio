import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group, Mesh } from "three";
import { getElementScrollProgress } from "../../lib/homeScroll";

/**
 * Journey as a horizontal line the camera travels along — the spec's "long
 * horizontal / spatial timeline" — sitting behind the existing DOM steps in the
 * same way EducationWorld does: an accompaniment to the readable content, not a
 * replacement for it.
 */
function Waypoints({ count, containerRef }: { count: number; containerRef: RefObject<HTMLDivElement> }) {
  const group = useRef<Group>(null);
  const nodeRefs = useRef<(Mesh | null)[]>([]);
  const smoothed = useRef(0);
  const positions = useMemo(() => Array.from({ length: count }, (_, i) => (i / Math.max(1, count - 1)) * 9 - 4.5), [count]);

  useFrame((state) => {
    const target = getElementScrollProgress(containerRef.current);
    smoothed.current += (target - smoothed.current) * 0.08;
    const p = smoothed.current;
    if (group.current) group.current.position.y = state.pointer.y * 0.1;
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const active = p >= i / Math.max(1, count - 1) - 0.05;
      const mat = mesh.material as { opacity: number };
      mat.opacity = active ? 0.85 : 0.12;
      mesh.rotation.z += active ? 0.01 : 0.002;
    });
  });

  return (
    <group ref={group}>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" args={[new Float32Array([positions[0] ?? 0, 0, 0, positions[positions.length - 1] ?? 0, 0, 0]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#4a5568" transparent opacity={0.4} />
      </line>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} ref={(el) => (nodeRefs.current[i] = el)}>
          <tetrahedronGeometry args={[0.22, 0]} />
          <meshBasicMaterial color={i % 2 ? "#7c6cff" : "#38e1d0"} wireframe transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function TravellingCamera({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  useFrame((state) => {
    const target = getElementScrollProgress(containerRef.current);
    smoothed.current += (target - smoothed.current) * 0.08;
    camera.position.x = smoothed.current * 9 - 4.5;
    camera.position.z = 3.5 - state.pointer.y * 0.2;
    camera.lookAt(camera.position.x, 0, 0);
  });
  return null;
}

export default function JourneyWorld({ containerRef, count, lite }: { containerRef: RefObject<HTMLDivElement>; count: number; lite: boolean }) {
  return (
    <Canvas dpr={[1, lite ? 1.2 : 1.6]} camera={{ position: [-4.5, 0, 3.5], fov: 42 }} gl={{ antialias: !lite, alpha: true }} style={{ pointerEvents: "none" }}>
      <TravellingCamera containerRef={containerRef} />
      <Waypoints count={count} containerRef={containerRef} />
    </Canvas>
  );
}
