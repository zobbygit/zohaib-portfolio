import type { RefObject } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { getElementScrollProgress } from "../../lib/homeScroll";
import { useProgressRef } from "./ProgressContext";

/**
 * The camera is the storyteller: its position and gentle rotation are a direct
 * function of scroll progress through the homepage container. Pointer offset adds
 * a small amount of parallax without fighting the visitor.
 */
export default function CameraRig({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const { camera } = useThree();
  const progressRef = useProgressRef();

  useFrame((state) => {
    const target = getElementScrollProgress(containerRef.current);
    progressRef.current += (target - progressRef.current) * 0.08;
    const p = progressRef.current;

    camera.position.z = 6 - p * 4.5;
    camera.position.y = 0.3 - p * 1.6 + state.pointer.y * 0.1;
    camera.position.x = state.pointer.x * 0.25 + Math.sin(p * Math.PI * 2) * 0.4;
    camera.rotation.z = Math.sin(p * Math.PI) * 0.02;
    camera.lookAt(0, -p * 1.2, -p * 2);
  });

  return null;
}
