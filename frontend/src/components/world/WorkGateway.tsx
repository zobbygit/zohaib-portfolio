import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { useProgressRef } from "./ProgressContext";
import { rangeWeight } from "./chapters";

/** A large open frame the camera approaches and passes through — the threshold into Work. */
export default function WorkGateway() {
  const group = useRef<Group>(null);
  const progressRef = useProgressRef();

  useFrame(() => {
    const p = progressRef.current;
    const presence = rangeWeight(p, 0.55, 0.95);
    if (!group.current) return;
    group.current.visible = presence > 0.01;
    group.current.position.z = -3 + p * 4;
    group.current.scale.setScalar(0.8 + presence * 0.4);
    const mat = (group.current.children[0] as unknown as { material: { opacity: number } })?.material;
    if (mat) mat.opacity = presence * 0.6;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[1.6, 0.02, 8, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
