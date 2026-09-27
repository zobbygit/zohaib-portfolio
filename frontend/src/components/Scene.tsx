import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

/**
 * Ambient architectural motif: two thin, layered translucent panels catching light
 * as they turn — a fragment of the same visual language as the homepage world,
 * used sparingly (404 page, one Lab experiment). Deliberately not a sphere or a grid.
 */
function Panels() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.1 + state.pointer.x * 0.2;
    group.current.rotation.x = Math.sin(t * 0.15) * 0.08;
  });
  return (
    <group ref={group}>
      <mesh position={[0, 0, 0.15]}>
        <planeGeometry args={[1.8, 2.6]} />
        <meshBasicMaterial color="#38e1d0" transparent opacity={0.08} side={2} />
      </mesh>
      <mesh position={[0, 0, -0.15]} rotation={[0, 0.5, 0]}>
        <planeGeometry args={[1.4, 2.2]} />
        <meshBasicMaterial color="#7c6cff" transparent opacity={0.1} side={2} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.04, 2.6, 0.04]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function Scene({ lite = false }: { lite?: boolean }) {
  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      gl={{ antialias: !lite, alpha: true }}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <Panels />
    </Canvas>
  );
}
