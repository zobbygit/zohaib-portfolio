import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, PointLight } from "three";
import { useProgressRef } from "./ProgressContext";
import { enterWeight, rangeWeight } from "./chapters";

/** A point of light that grows into a single thin architectural plane — the arrival chapter. */
export default function ArrivalMonolith() {
  const plane = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const progressRef = useProgressRef();

  useFrame((state) => {
    const p = progressRef.current;
    const presence = rangeWeight(p, 0, 0.3); // fades in, holds briefly, fades as identity takes over
    const grow = enterWeight(p, 0, 0.1);
    if (plane.current) {
      plane.current.scale.set(1, 0.05 + grow * 0.95, 1);
      (plane.current.material as { opacity: number }).opacity = presence * 0.9;
      plane.current.position.z = -1 + p * 1.5;
      plane.current.rotation.y = state.pointer.x * 0.15;
    }
    if (light.current) light.current.intensity = 0.4 + grow * 1.2;
  });

  return (
    <group>
      <pointLight ref={light} position={[0, 0, 1]} color="#38e1d0" intensity={0.4} distance={6} />
      <mesh ref={plane}>
        <planeGeometry args={[0.03, 3]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} />
      </mesh>
    </group>
  );
}
