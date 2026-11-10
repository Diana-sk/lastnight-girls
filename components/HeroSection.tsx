"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Maximize2, Sparkles, X } from "lucide-react";
import ScrollFade from "./ScrollFade";

interface BaubleDef {
  src: string;
  alt: string;
  className: string;
  stringClassName: string;
  delay: string;
}

const baubles: BaubleDef[] = [
  {
    src: "/images/bauble-disco.jpg",
    alt: "Диско-шар — фрагмент постера",
    className: "left-[-3%] sm:left-[3%] xl:left-[8%] top-[5%] sm:top-[16%] w-20 sm:w-44 xl:w-56",
    stringClassName: "h-[50vh] min-h-32",
    delay: "0s",
  },
  {
    src: "/images/bauble-glasses.jpg",
    alt: "Бокалы шампанского — фрагмент постера",
    className: "right-[-3%] sm:right-[3%] xl:right-[8%] top-[9%] sm:top-[22%] w-24 sm:w-48 xl:w-64",
    stringClassName: "h-[50vh] min-h-32",
    delay: "1.4s",
  },
];

function Bauble({ b }: { b: BaubleDef }) {
  return (
    <div className={`absolute ${b.className} pointer-events-none`}>
      {/* string: белая, тянется вверх до самого края страницы */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-full w-px ${b.stringClassName} bg-white/70`}
      />
      {/* cap */}
      <div
        className="relative z-10 w-3.5 sm:w-4 h-2.5 sm:h-3 mx-auto rounded-t-[3px] bg-gradient-to-b from-[#E2C889] to-[#9A7B3F] shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
        style={{ clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }}
      />
      {/* ball: без обводки — край задаёт сама картинка */}
      <div
        className="ornament-sway relative aspect-square w-full rounded-full overflow-hidden shadow-[0_14px_36px_rgba(0,0,0,0.55)]"
        style={{ animationDelay: b.delay, transformOrigin: "50% 0%" }}
      >
        <Image src={b.src} alt={b.alt} fill sizes="280px" className="object-cover" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_26px_rgba(0,0,0,0.4)]" />
        <div className="absolute top-[7%] left-[13%] w-[24%] h-[13%] rounded-full bg-white/25 blur-[3px] -rotate-12" />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Фон: глубокий красный бархат с бумажной фактурой */}
      <div className="absolute inset-0 bg-[#4A060F]" />
      <div className="absolute inset-0 opacity-[0.38]">
        <Image
          src="/images/burgundy-paper.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(18,2,5,0.62)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/45 to-transparent" />

      {/* Подвешенные новогодние шары с фрагментами постера */}
      {baubles.map((b) => (
        <Bauble key={b.src} b={b} />
      ))}

      {/* Центральный блок */}
      <div className="relative max-w-3xl mx-auto px-6 pt-32 sm:pt-40 pb-20 sm:pb-24 text-center">
        <ScrollFade>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="stamp-badge">
              <Sparkles className="w-3 h-3 text-[#C8A86B]" />
              Private Event · 15 мест
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-[#E2C889]/85 font-mono">
              Санкт-Петербург · 19–20 декабря 2026
            </span>
          </div>
        </ScrollFade>

        <ScrollFade delay={100}>
          <div className="mt-8 space-y-1">
            <div className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FAF7F2] leading-[0.98] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
              LAST NIGHT
              <span className="block font-light text-[#FAF7F2]/85">OF THE YEAR</span>
            </div>
            <div className="font-script text-6xl sm:text-8xl md:text-9xl text-[#E2C889] leading-[0.95] pt-3 tracking-[0.04em] drop-shadow-[0_6px_28px_rgba(0,0,0,0.5)]">
              girls
            </div>
          </div>
        </ScrollFade>

        <ScrollFade delay={200}>
          <p className="font-serif text-xl sm:text-2xl text-[#FAF7F2]/85 leading-relaxed max-w-xl mx-auto mt-8">
            Последняя большая ночь этого года. Только девушки, роскошные образы, тайная
            ролевая игра, подарки и ледяное шампанское в кругу своих.
          </p>
        </ScrollFade>

        {/* Три ключевых факта */}
        <ScrollFade delay={300}>
          <div className="grid sm:grid-cols-3 gap-6 mt-10 pt-7 border-t border-[#E2C889]/25 text-left">
            <div>
              <span className="text-[#E2C889] font-mono block text-xs mb-1 uppercase tracking-widest">Дата и время</span>
              <span className="text-[#FAF7F2] font-display text-base font-semibold block">19–20 декабря 2026</span>
              <span className="text-white/50 text-[0.7rem] block mt-0.5">20:00 — 00:00 · secret chapter до 06:00</span>
            </div>
            <div>
              <span className="text-[#E2C889] font-mono block text-xs mb-1 uppercase tracking-widest">Формат</span>
              <span className="text-[#FAF7F2] font-display text-base font-semibold block">15 участниц</span>
              <span className="text-white/50 text-[0.7rem] block mt-0.5">Закрытый круг по анкетам</span>
            </div>
            <div>
              <span className="text-[#E2C889] font-mono block text-xs mb-1 uppercase tracking-widest">Стоимость</span>
              <span className="text-[#E2C889] font-display text-base font-semibold block">3 500 ₽</span>
              <span className="text-white/50 text-[0.7rem] block mt-0.5">Всё включено: фуршет и напитки</span>
            </div>
          </div>
        </ScrollFade>

        {/* Действия */}
        <ScrollFade delay={400}>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <a href="#pass" className="btn-editorial shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              <span>Book your spot</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E2C889]" />
            </a>
            <a href="#lookbook" className="btn-editorial-secondary">
              <span>Атмосфера вечера</span>
            </a>
          </div>
        </ScrollFade>

        <ScrollFade delay={500}>
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center gap-2 mt-7 text-xs uppercase tracking-[0.2em] text-[#E2C889]/75 hover:text-[#E2C889] font-mono transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Официальный арт-постер</span>
          </button>
        </ScrollFade>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white p-2"
              aria-label="Закрыть"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="relative w-full aspect-[2/3] max-h-[85vh] rounded-2xl overflow-hidden border-2 border-[#C8A86B]/40 shadow-2xl">
              <Image
                src="/images/poster.jpg"
                alt="Last Night of the Year Girls Poster"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
