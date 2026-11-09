"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle" | "ribbon";
  life: number;
  maxLife: number;
  gravity: number;
  drag: number;
  wobble: number;
  wobbleSpeed: number;
}

const COLORS = [
  "#E2C889", // золото
  "#C8A86B", // тёмное золото
  "#FAF7F2", // кремовый
  "#750D1E", // винный
  "#961528", // ярко-винный
  "#FFE8B5", // светлое золото
];

/**
 * Праздничная хлопушка: несколько залпов конфетти из нижней части экрана
 * (из-под печати конверта) при успешной отправке письма.
 */
export default function Confetti({ fire }: { fire: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!fire || firedRef.current) return;
    firedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const spawnBurst = (originX: number, originY: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + rand(-0.65, 0.65); // вверх веером
        const speed = rand(9, 18);
        const shapeRoll = Math.random();
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rand(5, 11),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: rand(0, Math.PI * 2),
          rotationSpeed: rand(-0.22, 0.22),
          shape:
            shapeRoll < 0.45 ? "rect" : shapeRoll < 0.8 ? "circle" : "ribbon",
          life: 0,
          maxLife: rand(110, 190),
          gravity: rand(0.16, 0.26),
          drag: 0.985,
          wobble: rand(0, Math.PI * 2),
          wobbleSpeed: rand(0.08, 0.2),
        });
      }
    };

    // Три залпа: центр и два по бокам от конверта
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.62;
    spawnBurst(cx, cy, 90);
    setTimeout(() => spawnBurst(cx - window.innerWidth * 0.18, cy + 30, 55), 380);
    setTimeout(() => spawnBurst(cx + window.innerWidth * 0.18, cy + 30, 55), 720);

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let alive = false;
      for (const p of particles) {
        if (p.life >= p.maxLife) continue;
        alive = true;
        p.life++;

        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.9;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const fade =
          p.life > p.maxLife * 0.7 ? 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3) : 1;

        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // серпантин: вытянутый изгибающийся прямоугольник
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        }
        ctx.restore();
      }

      if (alive) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [fire]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[80] pointer-events-none"
      aria-hidden="true"
    />
  );
}
