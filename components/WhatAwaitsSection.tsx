"use client";
import Image from "next/image";
import ScrollFade from "./ScrollFade";
import BowSVG from "./BowSVG";

const features = [
  {
    icon: "🎭",
    title: "Ролевая игра",
    desc: "У каждой участницы будет своя роль, своя цель на эту ночь и своя история. Что произойдёт — узнаешь только там.",
  },
  {
    icon: "🎬",
    title: "Новогодние фильмы",
    desc: "Атмосферные фильмы в лучших традициях уютного новогоднего вечера.",
  },
  {
    icon: "🎵",
    title: "Музыка и атмосфера",
    desc: "Музыка, которая создаёт настроение. Праздничный декор, свечи и блёстки.",
  },
  {
    icon: "🥂",
    title: "Закуски и напитки",
    desc: "Шампанское, закуски и всё, что делает вечер по-настоящему праздничным.",
  },
  {
    icon: "🔒",
    title: "Только свои",
    desc: "Закрытый формат — максимум 15 девушек. Никаких случайных людей, только тёплый круг.",
  },
  {
    icon: "✨",
    title: "Незабываемая ночь",
    desc: "С 20:00 до 06:00 — целая ночь, чтобы создать воспоминания, которые останутся с тобой навсегда.",
  },
];

export default function WhatAwaitsSection() {
  return (
    <section
      id="awaits"
      className="relative py-24 overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Background images */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Image src="/images/img7.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#080808]" />
        </div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 opacity-10">
          <Image src="/images/img1.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ScrollFade>
          <div className="text-center mb-16">
            <BowSVG className="w-16 h-12 mx-auto mb-4" color="#8B0000" />
            <h2
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "#F5F0E8" }}
            >
              Что тебя ждёт
            </h2>
            <div className="ornament-divider mx-auto max-w-xs mt-4">
              <span style={{ color: "#C41E3A", fontSize: "1.2rem" }}>✦</span>
            </div>
          </div>
        </ScrollFade>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ScrollFade key={f.title}>
              <div
                className="relative group cursor-default"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "2rem 1.75rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(196,30,58,0.4)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(107,15,26,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "#F5F0E8",
                    marginBottom: "0.75rem"
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "rgba(245,240,232,0.65)"
                  }}
                >
                  {f.desc}
                </p>

                {/* Red bottom accent */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#C41E3A] transition-all duration-500 w-0 group-hover:w-full"
                  style={{ opacity: 0.6 }}
                />
              </div>
            </ScrollFade>
          ))}
        </div>

        {/* Highlight quote */}
        <ScrollFade>
          <div className="text-center mt-16">
            <div
              className="inline-block max-w-2xl"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                color: "#F5F0E8",
                lineHeight: 1.5
              }}
            >
              «В этот вечер можно всё. Почти.»
            </div>
            <div className="mt-3">
              <BowSVG className="w-10 h-8 mx-auto" color="#8B0000" />
            </div>
          </div>
        </ScrollFade>
      </div>
    </section>
  );
}
