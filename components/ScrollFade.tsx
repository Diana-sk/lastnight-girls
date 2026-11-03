"use client";
import { useEffect, useRef } from "react";

interface Props { className?: string; }

export default function ScrollFade({ className = "", children }: React.PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section-fade ${className}`}>
      {children}
    </div>
  );
}
