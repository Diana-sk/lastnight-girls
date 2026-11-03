"use client";
import { useEffect, useRef } from "react";

export default function GlitterParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = ["#C0C0C0", "#E8E8E8", "#ffffff", "#C9A96E", "#C41E3A"];
    const particles: HTMLSpanElement[] = [];

    for (let i = 0; i < 60; i++) {
      const p = document.createElement("span");
      p.className = "glitter-particle";
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${-size}px;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 8 + 5}s;
        animation-delay: ${Math.random() * 10}s;
        border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
        box-shadow: 0 0 ${size * 2}px currentColor;
      `;
      container.appendChild(p);
      particles.push(p);
    }

    return () => particles.forEach((p) => p.remove());
  }, []);

  return <div ref={containerRef} className="glitter-container" aria-hidden />;
}
