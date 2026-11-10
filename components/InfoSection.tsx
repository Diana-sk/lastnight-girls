"use client";
import ScrollFade from "./ScrollFade";

export default function InfoSection() {
  const specs = [
    { label: "Дата проведения", value: "19–20 декабря 2026", note: "Вечер 19 декабря плавно переходит в ночь на 20-е" },
    { label: "Время", value: "20:00 — 00:00", note: "Основная программа; после полуночи — секретное продолжение до 06:00" },
    { label: "Локация", value: "Санкт-Петербург, центр", note: "Точный адрес красивых апартаментов направляется за 14 дней" },
    { label: "Стоимость участия", value: "3 500 ₽", note: "Всё включено: игристое, фуршет, ролевая игра, подарки", highlight: true },
    { label: "Количество гостей", value: "До 15 девушек", note: "Камерный закрытый круг, отбор по персональным анкетам" },
    { label: "Возрастной ценз", value: "18+", note: "Мероприятие только для совершеннолетних участниц" },
  ];

  return (
    <section id="details" className="py-24 px-6 max-w-5xl mx-auto border-t border-[#C8A86B]/20">
      <div className="max-w-2xl mb-16">
        <ScrollFade>
          <div className="flex items-center gap-3 mb-3">
            <span className="stamp-badge">Параметры вечера</span>
            <span className="font-script text-[#C8A86B] text-2xl">specifications</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7F2] mb-4">
            Детали мероприятия
          </h2>
          <p className="font-serif text-xl text-[#FAF7F2]/75 leading-relaxed">
            Прозрачные условия и ключевые организационные параметры вечеринки.
          </p>
        </ScrollFade>
      </div>

      {/* Specifications Table */}
      <div className="divide-y divide-[#C8A86B]/20 border-y border-[#C8A86B]/20">
        {specs.map((item, idx) => (
          <ScrollFade key={idx} delay={idx * 50}>
            <div className="py-6 sm:py-7 grid sm:grid-cols-12 gap-3 items-baseline">
              <div className="sm:col-span-4 text-xs uppercase tracking-widest text-[#C8A86B] font-mono">
                {item.label}
              </div>
              <div className={`sm:col-span-4 font-display text-xl sm:text-2xl font-bold ${item.highlight ? "text-[#E2C889]" : "text-[#FAF7F2]"}`}>
                {item.value}
              </div>
              <div className="sm:col-span-4 text-xs sm:text-sm text-[#FAF7F2]/65 font-serif">
                {item.note}
              </div>
            </div>
          </ScrollFade>
        ))}
      </div>
    </section>
  );
}
