import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";
import { getScrollProgress } from "../lib/scrollProgress";

/**
 * The project preview as a 3D object. On mount it starts turned away and
 * pushed back, then eases flat to face the viewer. Scroll pulls it slightly back.
 */
function Panel({ src }: { src: string }) {
  const texture = useTexture(src);
  const mesh = useRef<Mesh>(null);
  const t = useRef(0);
  const img = texture.image as { width?: number; height?: number } | undefined;
  const aspect = (img?.width ?? 16) / (img?.height ?? 9);
  const height = 2.2;
  const width = height * aspect;

  useFrame((state, delta) => {
    if (!mesh.current) return;
    t.current = Math.min(1, t.current + delta * 0.7);
    const e = 1 - Math.pow(1 - t.current, 3);
    mesh.current.rotation.y = (1 - e) * -1.1 + state.pointer.x * 0.12 * e;
    mesh.current.rotation.x = (1 - e) * 0.35 + state.pointer.y * -0.08 * e;
    mesh.current.position.z = (1 - e) * -2.5 - getScrollProgress() * 0.6;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export default function ProjectObject({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[24rem] w-full overflow-hidden rounded-2xl border border-white/10 bg-navy/40" role="img" aria-label={alt}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: "none" }}>
        <Suspense fallback={null}>
          <Panel src={src} />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] tracking-widest text-white/40">PREVIEW OBJECT</p>
    </div>
  );
}
