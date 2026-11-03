"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(170deg, #0a0a0a 0%, #0f0305 60%, #160208 100%)" }}
    >
      {/* Background collage images */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Top-left: Christmas table with candles */}
        <div
          className="absolute top-0 left-0 w-[40%] h-[55%] opacity-30 collage-rotate-1"
          style={{ mixBlendMode: "luminosity" }}
        >
          <Image src="/images/img6.jpg" alt="" fill className="object-cover photo-flash" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-60" />
        </div>

        {/* Top-right: woman at table */}
        <div
          className="absolute top-0 right-0 w-[38%] h-[60%] opacity-25"
          style={{ mixBlendMode: "luminosity" }}
        >
          <Image src="/images/img4.jpg" alt="" fill className="object-cover object-top photo-flash" />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-black opacity-70" />
        </div>

        {/* Bottom-left: gifts */}
        <div
          className="absolute bottom-0 left-0 w-[30%] h-[40%] opacity-20 collage-rotate-2"
          style={{ mixBlendMode: "luminosity" }}
        >
          <Image src="/images/img5.jpg" alt="" fill className="object-cover photo-flash" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black opacity-60" />
        </div>

        {/* Bottom-right: Christmas decor collage */}
        <div
          className="absolute bottom-0 right-0 w-[35%] h-[45%] opacity-20"
          style={{ mixBlendMode: "luminosity" }}
        >
          <Image src="/images/img2.jpg" alt="" fill className="object-cover photo-flash" />
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black opacity-60" />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)"
        }} />
      </div>

      {/* Scattered decorative notes */}
      <div className="absolute top-[8%] left-[4%] max-w-[160px] collage-rotate-1 hidden md:block z-10">
        <div className="cutout-card text-xs leading-relaxed" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "0.8rem" }}>
          <span className="text-[#8B0000]">Дресс-код:</span><br />
          то, что хотелось<br />
          надеть в этом году,<br />
          но не выдалось<br />
          случая ♡
        </div>
      </div>

      <div className="absolute top-[10%] right-[5%] max-w-[150px] collage-rotate-3 hidden md:block z-10">
        <div className="cutout-card text-xs leading-relaxed" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "0.8rem" }}>
          Новый год —<br />
          это не только<br />
          про подарки,<br />
          но и про нас ♡
        </div>
      </div>

      <div className="absolute bottom-[15%] left-[3%] max-w-[155px] collage-rotate-2 hidden md:block z-10">
        <div className="cutout-card" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1rem", lineHeight: 1.4 }}>
          <em>В этот вечер<br />можно всё.<br />Почти.</em> ♡
        </div>
      </div>

      <div className="absolute bottom-[12%] right-[4%] max-w-[145px] collage-rotate-1 hidden md:block z-10">
        <div className="cutout-card text-xs leading-relaxed" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "0.78rem" }}>
          <strong>Что тебя ждёт?</strong><br />
          • Частная вечеринка<br />
          • Ролевая игра<br />
          • Новогодняя атмосфера<br />
          • Незабываемая ночь
        </div>
      </div>

      {/* Star decorations */}
      <div className="absolute top-[20%] left-[35%] star-deco text-[#C41E3A] text-2xl z-10">✦</div>
      <div className="absolute top-[35%] right-[30%] star-deco text-[#C0C0C0] text-lg z-10" style={{animationDelay: "1s"}}>✦</div>
      <div className="absolute bottom-[25%] left-[45%] star-deco text-[#C41E3A] text-xl z-10" style={{animationDelay: "2s"}}>✦</div>
      <div className="absolute top-[65%] left-[20%] star-deco text-[#C0C0C0] text-sm z-10" style={{animationDelay: "0.5s"}}>✦</div>
      <div className="absolute top-[55%] right-[18%] star-deco text-[#C41E3A] text-sm z-10" style={{animationDelay: "1.5s"}}>✦</div>

      {/* Main content */}
      <div className="relative z-20 text-center px-6 py-16 max-w-4xl mx-auto">
        {/* Private Event badge */}
        <div className="mb-8 inline-flex items-center gap-3">
          <span className="ornament-divider w-16" />
          <span
            className="text-[0.65rem] tracking-[0.35em] uppercase"
            style={{ color: "#C0C0C0", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Private Event · Санкт-Петербург
          </span>
          <span className="ornament-divider w-16" />
        </div>

        {/* Main title */}
        <h1 className="hero-title mb-0">
          <span className="block text-[clamp(2.8rem,11vw,8rem)]">LAST NIGHT</span>
          <span className="block text-[clamp(2.2rem,8.5vw,6rem)]">OF THE YEAR</span>
        </h1>
        <div
          className="hero-girls block text-[clamp(4rem,16vw,11rem)] mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: "italic" }}
        >
          GIRLS
        </div>

        {/* Subtitle */}
        <p
          className="text-[clamp(0.85rem,2vw,1.05rem)] leading-relaxed mb-10 max-w-lg mx-auto"
          style={{ color: "rgba(245,240,232,0.7)", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(0.9rem, 2.2vw, 1.1rem)" }}
        >
          Последняя большая ночь этого года.<br />
          Только девочки, красивые образы<br />
          и истории, которые останутся с нами.
        </p>

        {/* Date / Time row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
          <div className="cutout-card text-center" style={{ minWidth: "130px" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: "#1a1a1a" }}>
              19 ДЕКАБРЯ
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#444" }}>
              20:00
            </div>
          </div>

          <span style={{ color: "#C41E3A", fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>—</span>

          <div className="cutout-card text-center" style={{ minWidth: "130px" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: "#1a1a1a" }}>
              20 ДЕКАБРЯ
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#444" }}>
              06:00
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-10">
          <div
            className="inline-block px-8 py-3"
            style={{
              background: "linear-gradient(135deg, #6B0F1A, #8B0000)",
              border: "1px solid #C41E3A",
              boxShadow: "0 4px 30px rgba(196,30,58,0.3)"
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                color: "#F5F0E8",
                letterSpacing: "0.05em"
              }}
            >
              3 500 ₽
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.7)",
                letterSpacing: "0.2em",
                textTransform: "uppercase"
              }}
            >
              билет на вечеринку
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#registration" className="cta-button">
            <span>ПОДАТЬ ЗАЯВКУ</span>
          </a>
          <a
            href="#info"
            className="text-[0.75rem] tracking-[0.2em] uppercase underline underline-offset-4"
            style={{ color: "rgba(245,240,232,0.5)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Подробнее
          </a>
        </div>

        {/* 18+ badge */}
        <div className="mt-8 text-[#C0C0C0] text-xs tracking-widest opacity-60">18+</div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent" />
    </section>
  );
}
