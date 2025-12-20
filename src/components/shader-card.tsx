"use client";

import { useRef, useState, useCallback } from "react";

interface ShaderCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function ShaderCard({ children, className = "", glowColor = "rgba(255, 217, 90, 0.4)" }: ShaderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`shader-card relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        "--mouse-x": `${mousePosition.x}px`,
        "--mouse-y": `${mousePosition.y}px`,
        "--glow-color": glowColor,
        "--glow-opacity": isHovering ? "1" : "0",
      } as React.CSSProperties}
    >
      <div className="shader-card-glow" />
      <div className="shader-card-border" />
      <div className="shader-card-content relative z-10">
        {children}
      </div>
    </div>
  );
}

interface PhoneMockupProps {
  children?: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className = "" }: PhoneMockupProps) {
  return (
    <div className={`phone-mockup ${className}`}>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          {children}
        </div>
        <div className="phone-home-indicator" />
      </div>
    </div>
  );
}
