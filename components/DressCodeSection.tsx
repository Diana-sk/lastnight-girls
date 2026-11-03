"use client";
import Image from "next/image";
import ScrollFade from "./ScrollFade";
import BowSVG from "./BowSVG";

export default function DressCodeSection() {
  return (
    <section
      id="dresscode"
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #0d0205 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 items-center">

          {/* Left: text (3 cols) */}
          <div className="md:col-span-3 space-y-8">
            <ScrollFade>
              <div className="flex items-center gap-3 mb-2">
                <BowSVG className="w-12 h-9" color="#C41E3A" />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.3em",
                    color: "#C41E3A",
                    textTransform: "uppercase"
                  }}
                >
                  Дресс-код вечера
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: "clamp(1.8rem, 5vw, 3rem)",
                  color: "#F5F0E8",
                  lineHeight: 1.2
                }}
              >
                «То, что хотелось надеть<br />в этом году,<br />но не выдалось случая»
              </h2>
            </ScrollFade>

            <ScrollFade>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  lineHeight: 1.8,
                  color: "rgba(245,240,232,0.75)"
                }}
              >
                Никаких строгих рамок. Наряди себя так, как давно хотела. То платье из магазина, которое так и не дождалось своего выхода. Образ, который казался слишком смелым для обычного вечера.
              </p>

              <p
                className="mt-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  lineHeight: 1.8,
                  color: "rgba(245,240,232,0.75)"
                }}
              >
                Эта ночь — твой шанс.
              </p>
            </ScrollFade>

            <ScrollFade>
              {/* Handwritten note */}
              <div
                className="cutout-card max-w-sm collage-rotate-2"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  borderLeft: "3px solid #8B0000"
                }}
              >
                <p>Приходи такой, какой<br />хочешь себя видеть<br />в последнюю ночь года ♡</p>
              </div>
            </ScrollFade>
          </div>

          {/* Right: image (2 cols) */}
          <div className="md:col-span-2">
            <ScrollFade>
              <div className="relative">
                {/* Main image */}
                <div
                  className="relative h-[420px] overflow-hidden collage-rotate-1"
                  style={{ boxShadow: "12px 12px 40px rgba(0,0,0,0.8)" }}
                >
                  <Image
                    src="/images/img4.jpg"
                    alt="Дресс-код"
                    fill
                    className="object-cover object-top photo-flash"
                  />
                  {/* Red overlay tint */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(107,15,26,0.3) 0%, transparent 60%)" }}
                  />
                </div>

                {/* 18+ badge */}
                <div
                  className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center z-10"
                  style={{ background: "#C41E3A", fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "#F5F0E8" }}
                >
                  18+
                </div>

                {/* Small bow */}
                <div className="absolute -bottom-4 -left-4 z-10">
                  <BowSVG className="w-12 h-9" color="#8B0000" />
                </div>
              </div>
            </ScrollFade>
          </div>
        </div>
      </div>
    </section>
  );
}
