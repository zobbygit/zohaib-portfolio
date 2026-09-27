import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useRef, type RefObject } from "react";
import type { Mesh, MeshBasicMaterial } from "three";
import { getElementScrollProgress } from "../../lib/homeScroll";

type ContainerRef = RefObject<HTMLDivElement | null>;

/**
 * One shared canvas for the Work gallery: a single textured panel that the camera
 * approaches, which swaps to the next project's image and fades through as scroll
 * crosses each project's range. Chosen over one Canvas per project row so the page
 * stays light on mid-range phones — a real constraint, not a shortcut for its own sake.
 */
function GalleryPanel({ images, containerRef }: { images: string[]; containerRef: ContainerRef }) {
  const mesh = useRef<Mesh>(null);
  const smoothed = useRef(0);
  const textures = useTexture(images.length > 0 ? images : ["/projects/agentforge.jpg"]);
  const list = Array.isArray(textures) ? textures : [textures];

  useFrame((state) => {
    const target = getElementScrollProgress(containerRef.current);
    smoothed.current += (target - smoothed.current) * 0.1;
    const p = smoothed.current;
    if (!mesh.current) return;

    mesh.current.position.z = -1 + Math.sin(p * Math.PI) * 0.6;
    mesh.current.rotation.y = state.pointer.x * 0.08;

    const slot = Math.min(list.length - 1, Math.floor(p * list.length));
    const mat = mesh.current.material as MeshBasicMaterial;
    if (mat.map !== list[slot]) {
      mat.map = list[slot];
      mat.needsUpdate = true;
    }
    // brief fade at each hand-off between projects
    const within = (p * list.length) % 1;
    mat.opacity = within < 0.15 ? 0.3 + (within / 0.15) * 0.7 : 1;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[3.4, 2.1]} />
      <meshBasicMaterial map={list[0]} transparent toneMapped={false} />
    </mesh>
  );
}

function Dolly({ containerRef }: { containerRef: ContainerRef }) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  useFrame((state) => {
    const target = getElementScrollProgress(containerRef.current);
    smoothed.current += (target - smoothed.current) * 0.08;
    camera.position.z = 4.5 - smoothed.current * 0.8;
    camera.position.y = state.pointer.y * 0.1;
  });
  return null;
}

export default function WorkWorld({
  containerRef,
  images,
  lite,
}: {
  containerRef: ContainerRef;
  images: string[];
  lite: boolean;
}) {
  return (
    <Canvas
      dpr={[1, lite ? 1.2 : 1.6]}
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      gl={{ antialias: !lite, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <Dolly containerRef={containerRef} />
      <Suspense fallback={null}>
        <GalleryPanel images={images} containerRef={containerRef} />
      </Suspense>
    </Canvas>
  );
}