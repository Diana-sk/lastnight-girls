"use client";
import ScrollFade from "./ScrollFade";
import BowSVG from "./BowSVG";

export default function InfoSection() {
  const details = [
    { label: "Дата", value: "19 декабря 2026", sub: "пятница" },
    { label: "Время", value: "20:00 — 06:00", sub: "до утра" },
    { label: "Место", value: "Санкт-Петербург", sub: "адрес — за 2 недели до мероприятия" },
    { label: "Стоимость", value: "3 500 ₽", sub: "один билет" },
    { label: "Возраст", value: "18+", sub: "только совершеннолетние" },
    { label: "Участниц", value: "до 15", sub: "закрытый формат" },
  ];

  return (
    <section
      id="info"
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080808 0%, #0a0205 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <ScrollFade>
          <div className="text-center mb-16">
            <BowSVG className="w-16 h-12 mx-auto mb-4" color="#8B0000" />
            <h2
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "#F5F0E8" }}
            >
              Информация
            </h2>
            <div className="ornament-divider mx-auto max-w-xs mt-4">
              <span style={{ color: "#C41E3A", fontSize: "1.2rem" }}>✦</span>
            </div>
          </div>
        </ScrollFade>

        {/* Details grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.06)" }}>
          {details.map((d) => (
            <ScrollFade key={d.label}>
              <div
                className="text-center py-10 px-6"
                style={{ background: "#080808" }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#C41E3A",
                    marginBottom: "0.75rem"
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                    color: "#F5F0E8",
                    marginBottom: "0.4rem"
                  }}
                >
                  {d.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.85rem",
                    color: "rgba(245,240,232,0.45)"
                  }}
                >
                  {d.sub}
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>

        {/* Note about address */}
        <ScrollFade>
          <div className="text-center mt-10">
            <div
              className="inline-block"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "0.95rem",
                color: "rgba(245,240,232,0.5)",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: "1.5rem"
              }}
            >
              ✦ Точный адрес приходит участницам за 2 недели до мероприятия ✦
            </div>
          </div>
        </ScrollFade>
      </div>
    </section>
  );
}
