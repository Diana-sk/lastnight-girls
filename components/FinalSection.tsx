"use client";
import ScrollFade from "./ScrollFade";
import BowSVG from "./BowSVG";

export default function FinalSection() {
  return (
    <section
      className="relative py-32 overflow-hidden text-center"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0f0205 40%, #160208 100%)"
      }}
    >
      {/* Stars */}
      <div className="absolute top-[10%] left-[10%] star-deco text-[#C41E3A] text-3xl">✦</div>
      <div className="absolute top-[15%] right-[12%] star-deco text-[#C0C0C0] text-xl" style={{animationDelay:"1s"}}>✦</div>
      <div className="absolute bottom-[20%] left-[15%] star-deco text-[#C0C0C0] text-lg" style={{animationDelay:"0.5s"}}>✦</div>
      <div className="absolute bottom-[25%] right-[8%] star-deco text-[#C41E3A] text-2xl" style={{animationDelay:"1.5s"}}>✦</div>
      <div className="absolute top-[50%] left-[5%] star-deco text-[#C41E3A] text-sm" style={{animationDelay:"2s"}}>✦</div>
      <div className="absolute top-[40%] right-[5%] star-deco text-[#C0C0C0] text-sm" style={{animationDelay:"0.8s"}}>✦</div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <ScrollFade>
          <BowSVG className="w-20 h-16 mx-auto mb-8" color="#C41E3A" />

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 6vw, 3.5rem)",
              color: "#F5F0E8",
              lineHeight: 1.2,
              marginBottom: "1.5rem"
            }}
          >
            Твоя история этой ночью
            <br />
            <span style={{ color: "#C41E3A" }}>только начинается</span>
          </h2>

          <div className="ornament-divider mx-auto max-w-xs mb-8">
            <span style={{ color: "#C41E3A", fontSize: "1.2rem" }}>✦</span>
          </div>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "rgba(245,240,232,0.65)",
              lineHeight: 1.8,
              marginBottom: "2.5rem"
            }}
          >
            19 декабря 2026. Санкт-Петербург.<br />
            Закрытая девичья вечеринка.<br />
            Только 15 мест.
          </p>

          <a href="#registration" className="cta-button">
            <span>ПОДАТЬ ЗАЯВКУ</span>
          </a>

          <div className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "0.9rem",
                color: "rgba(245,240,232,0.3)"
              }}
            >
              LAST NIGHT OF THE YEAR GIRLS · Private Event · Санкт-Петербург · 18+
            </p>
          </div>
        </ScrollFade>
      </div>
    </section>
  );
}
