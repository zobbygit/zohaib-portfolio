import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import { ProgressProvider } from "./ProgressContext";
import ArrivalMonolith from "./ArrivalMonolith";
import SystemPipeline from "./SystemPipeline";
import WorkGateway from "./WorkGateway";

/**
 * One continuous 3D world for the homepage, fixed behind the scrolling content.
 * A single camera travels through it as the visitor scrolls; objects don't reset
 * between "sections" because there are no sections here — only scroll ranges.
 */
export default function WorldScene({ containerRef, lite }: { containerRef: RefObject<HTMLDivElement>; lite: boolean }) {
  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      camera={{ position: [0, 0.3, 6], fov: 45 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <ProgressProvider>
        <CameraRig containerRef={containerRef} />
        <ArrivalMonolith />
        <SystemPipeline />
        <WorkGateway />
      </ProgressProvider>
    </Canvas>
  );
}
