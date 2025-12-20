"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface Beehive3DViewerProps {
  className?: string;
}

export function Beehive3DViewer({ className }: Beehive3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const textureLoader = new THREE.TextureLoader();

    const diffuseTexture = textureLoader.load("/assets/3d_model/texture_diffuse.png");
    const normalTexture = textureLoader.load("/assets/3d_model/texture_normal.png");
    const roughnessTexture = textureLoader.load("/assets/3d_model/texture_roughness.png");
    const metallicTexture = textureLoader.load("/assets/3d_model/texture_metallic.png");

    const material = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      metalnessMap: metallicTexture,
      roughness: 0.7,
      metalness: 0.3,
    });

    const loader = new OBJLoader();
    let model: THREE.Group | null = null;

    loader.load(
      "/assets/3d_model/base.obj",
      (obj) => {
        model = obj;

        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        obj.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        obj.scale.setScalar(scale);

        scene.add(obj);
        setIsLoading(false);
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`Loading: ${percentComplete.toFixed(0)}%`);
      },
      (error) => {
        console.error("Error loading model:", error);
        setLoadError("3D 모델을 불러올 수 없습니다");
        setIsLoading(false);
      }
    );

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let autoRotate = true;

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseLeave = () => {
      isDragging = false;
      autoRotate = true;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isDragging = true;
        autoRotate = false;
        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isDragging || event.touches.length !== 1) return;

      const deltaX = event.touches[0].clientX - previousMousePosition.x;
      const deltaY = event.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    };

    const onTouchEnd = () => {
      isDragging = false;
      autoRotate = true;
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (model) {
        if (autoRotate) {
          targetRotationY += 0.005;
        }

        currentRotationY += (targetRotationY - currentRotationY) * 0.1;
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;

        model.rotation.y = currentRotationY;
        model.rotation.x = currentRotationX;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: "none" }}
      data-testid="beehive-3d-viewer"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">3D 모델 로딩 중...</p>
          </div>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
          <p className="text-sm text-muted-foreground">{loadError}</p>
        </div>
      )}
    </div>
  );
}
