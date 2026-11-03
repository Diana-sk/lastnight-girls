"use client";
import { useState } from "react";
import ScrollFade from "./ScrollFade";
import BowSVG from "./BowSVG";

const faqs = [
  {
    q: "Как проходит отбор участниц?",
    a: "Организатор рассматривает каждую анкету лично. После изучения заявки ты получишь ответ в Telegram — одобрение или отказ.",
  },
  {
    q: "Когда придёт ответ на заявку?",
    a: "В течение нескольких дней с момента подачи заявки. Следи за сообщениями от @LastNightGirls_bot.",
  },
  {
    q: "Как оплатить билет?",
    a: "Только после одобрения заявки организатором. Тебе придёт персональное сообщение с реквизитами для перевода через СБП. Самостоятельно найти и оплатить билет нельзя.",
  },
  {
    q: "Сколько времени на оплату?",
    a: "После получения реквизитов место резервируется за тобой на 48 часов. Если оплата не поступит — место освобождается.",
  },
  {
    q: "Можно ли передать билет подруге?",
    a: "Билет персональный. Передача возможна только после предварительного согласования с организатором.",
  },
  {
    q: "Какой дресс-код?",
    a: "«То, что хотелось надеть в этом году, но не выдалось случая». Никаких строгих рамок — оденься так, как давно мечтала.",
  },
  {
    q: "Где точный адрес?",
    a: "Адрес квартиры будет отправлен всем подтверждённым участницам за 2 недели до мероприятия.",
  },
  {
    q: "Что будет на вечеринке?",
    a: "Ролевая игра с персональными ролями для каждой, новогодние фильмы, музыка, закуски, шампанское и особая атмосфера. Детали — сюрприз 🖤",
  },
  {
    q: "Возможен ли возврат?",
    a: "Возврат возможен при отмене более чем за 14 дней — 50% стоимости. Менее чем за 7 дней — возврат невозможен. При отмене мероприятия организатором — полный возврат 100%.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative py-24"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <ScrollFade>
          <div className="text-center mb-14">
            <BowSVG className="w-16 h-12 mx-auto mb-4" color="#8B0000" />
            <h2
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "#F5F0E8" }}
            >
              FAQ
            </h2>
            <p
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "rgba(245,240,232,0.5)", marginTop: "0.5rem" }}
            >
              Ответы на частые вопросы
            </p>
            <div className="ornament-divider mx-auto max-w-xs mt-4">
              <span style={{ color: "#C41E3A", fontSize: "1.2rem" }}>✦</span>
            </div>
          </div>
        </ScrollFade>

        <ScrollFade>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question w-full text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem, 2.5vw, 1.15rem)" }}>
                    {faq.q}
                  </span>
                  <span
                    style={{
                      color: "#C41E3A",
                      fontSize: "1.2rem",
                      transition: "transform 0.3s ease",
                      display: "inline-block",
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                      flexShrink: 0,
                      marginLeft: "1rem"
                    }}
                  >
                    +
                  </span>
                </button>
                <div className={`faq-answer ${open === i ? "open" : ""}`}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", lineHeight: 1.7, color: "rgba(245,240,232,0.65)" }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollFade>
      </div>
    </section>
  );
}
