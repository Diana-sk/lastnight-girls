"use client";
import { ArrowRight } from "lucide-react";
import ScrollFade from "./ScrollFade";

export default function FinalSection() {
  return (
    <section className="py-28 sm:py-36 px-6 max-w-4xl mx-auto border-t border-[#C8A86B]/20 text-center">
      <ScrollFade>
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C8A86B] font-mono mb-6">
          <span>✦</span>
          <span>19–20 декабря 2026 · Санкт-Петербург</span>
          <span>✦</span>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FAF7F2] mb-6 leading-tight">
          Твоя история этой ночью
          <span className="block font-brush text-[#C8A86B] text-6xl sm:text-8xl md:text-9xl mt-2 drop-shadow-md">
            только начинается
          </span>
        </h2>

        <p className="font-serif text-xl sm:text-2xl text-[#FAF7F2]/75 max-w-xl mx-auto leading-relaxed mb-10">
          15 девушек. Бокалы с пузырьками. Музыка, тайны и ночь, которую ты будешь с нежностью вспоминать весь следующий год.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#pass" className="btn-editorial text-center">
            <span>Забронировать место&nbsp;<span className="whitespace-nowrap">(3 500 ₽)</span></span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E2C889] shrink-0" />
          </a>

          <a href="#hero" className="btn-editorial-secondary">
            <span>В начало</span>
          </a>
        </div>

        <div className="text-xs text-white/40 tracking-widest uppercase mt-12 font-mono">
          Только 15 мест · 18+ · Закрытый отбор по анкетам
        </div>
      </ScrollFade>
    </section>
  );
}
