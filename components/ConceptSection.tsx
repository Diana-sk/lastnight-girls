"use client";
import Image from "next/image";
import ScrollFade from "./ScrollFade";
import BowSVG from "./BowSVG";

export default function ConceptSection() {
  return (
    <section id="concept" className="relative py-24 overflow-hidden" style={{ background: "#0a0a0a" }}>
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <Image src="/images/img6.jpg" alt="" fill className="object-cover" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ScrollFade>
          <div className="text-center mb-16">
            <BowSVG className="w-16 h-12 mx-auto mb-4" color="#8B0000" />
            <h2
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
              className="text-[#F5F0E8] mb-4"
            >
              Концепция
            </h2>
            <div className="ornament-divider mx-auto max-w-xs">
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C41E3A", fontSize: "1.2rem" }}>✦</span>
            </div>
          </div>
        </ScrollFade>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: image collage */}
          <ScrollFade>
            <div className="relative h-[500px]">
              {/* Main image */}
              <div
                className="absolute top-0 left-0 w-[75%] h-[60%] collage-rotate-1 overflow-hidden"
                style={{ boxShadow: "8px 8px 30px rgba(0,0,0,0.8)" }}
              >
                <Image src="/images/img6.jpg" alt="Новогодняя атмосфера" fill className="object-cover photo-flash" />
              </div>

              {/* Secondary image */}
              <div
                className="absolute bottom-0 right-0 w-[65%] h-[55%] collage-rotate-3 overflow-hidden"
                style={{ boxShadow: "8px 8px 30px rgba(0,0,0,0.8)" }}
              >
                <Image src="/images/img4.jpg" alt="Атмосфера вечеринки" fill className="object-cover object-top photo-flash" />
              </div>

              {/* Bow decoration */}
              <div className="absolute top-[55%] left-[60%] z-20">
                <BowSVG className="w-14 h-10" color="#C41E3A" />
              </div>

              {/* Star */}
              <div className="absolute top-[5%] right-[10%] star-deco text-[#C41E3A] text-2xl z-20">✦</div>
            </div>
          </ScrollFade>

          {/* Right: text */}
          <ScrollFade>
            <div className="space-y-6">
              <p
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", lineHeight: 1.7, color: "#F5F0E8" }}
              >
                Это не просто вечеринка. Это финальная точка года — место, где собираются только свои.
              </p>

              <p
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.8, color: "rgba(245,240,232,0.75)" }}
              >
                Закрытый формат. Максимум 15 участниц. Уютная квартира в Санкт-Петербурге, которая на одну ночь станет местом, где можно быть собой — без масок, без лишних людей, только в кругу тех, кто разделяет твоё настроение.
              </p>

              <p
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.8, color: "rgba(245,240,232,0.75)" }}
              >
                Здесь не соревнуются и не сравнивают. Здесь наряжаются, смеются, создают воспоминания и красиво провожают этот год.
              </p>

              <div
                className="cutout-card collage-rotate-1 max-w-xs"
                style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.05rem", lineHeight: 1.5 }}
              >
                <span style={{ color: "#8B0000" }}>«</span>
                Новый год — это не только<br />про подарки, но и про нас
                <span style={{ color: "#8B0000" }}>»</span>
                <span className="block mt-1 text-right text-sm opacity-60">♡</span>
              </div>

              {/* Capacity badge */}
              <div className="flex items-center gap-3 mt-4">
                <span className="w-8 h-px bg-[#C41E3A] opacity-60" />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#C41E3A", letterSpacing: "0.15em" }}>
                  ТОЛЬКО 15 УЧАСТНИЦ
                </span>
                <span className="w-8 h-px bg-[#C41E3A] opacity-60" />
              </div>
            </div>
          </ScrollFade>
        </div>
      </div>
    </section>
  );
}
