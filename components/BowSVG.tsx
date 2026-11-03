"use client";

export default function BowSVG({ className = "", color = "#8B0000" }: { className?: string; color?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left wing */}
      <path
        d="M60 40 C45 25, 10 10, 5 30 C0 50, 35 55, 60 40Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M60 40 C50 32, 20 20, 12 32 C6 42, 38 50, 60 40Z"
        fill={color}
        opacity="0.5"
      />
      {/* Right wing */}
      <path
        d="M60 40 C75 25, 110 10, 115 30 C120 50, 85 55, 60 40Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M60 40 C70 32, 100 20, 108 32 C114 42, 82 50, 60 40Z"
        fill={color}
        opacity="0.5"
      />
      {/* Center knot */}
      <ellipse cx="60" cy="40" rx="8" ry="7" fill={color} />
      <ellipse cx="60" cy="40" rx="5" ry="4" fill={color} opacity="0.7" />
      {/* Tails */}
      <path d="M55 44 C50 58, 42 68, 38 75" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M65 44 C70 58, 78 68, 82 75" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}
