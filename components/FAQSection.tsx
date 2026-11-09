"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import ScrollFade from "./ScrollFade";

const faqs = [
  {
    q: "Как проходит отбор участниц?",
    a: "Организатор лично рассматривает каждую анкету: проверяет, соблюдены ли условия и правила мероприятия, и собирает гармоничную, тёплую компанию девушек со схожим вайбом. В течение 1–2 дней после подачи заявки ты получишь ответ в Telegram.",
  },
  {
    q: "Как оплатить билет?",
    a: "Оплата происходит только после одобрения заявки организатором. Тебе придёт личное сообщение в Telegram с реквизитами для перевода через СБП на 3 500 ₽. Место резервируется за тобой на 48 часов.",
  },
  {
    q: "Что входит в стоимость 3 500 ₽?",
    a: "Всё включено: шампанское и напитки без ограничений, авторский фуршет (гастрономическая сырная ёлка, свежие ягоды, канапе, десерты), персональная карточка тайной роли, новогодний подарок от организатора, профессиональный свет, фото и аренда апартаментов с 20:00 до 06:00.",
  },
  {
    q: "Когда я узнаю точный адрес?",
    a: "Вечеринка пройдёт в красивых просторных апартаментах в историческом центре Санкт-Петербурга. Точный адрес и ориентиры будут отправлены всем подтверждённым участницам за 14 дней до события.",
  },
  {
    q: "Какой всё-таки дресс-код?",
    a: "«То, что хотелось надеть в этом году, но не выдалось случая». Это может быть вечернее бархатное платье, корсет, брючный шёлковый костюм, сверкающее платье в пайетках или высокие оперные перчатки с жемчугом. Главное — чувствовать себя невероятно.",
  },
  {
    q: "Можно ли пойти с подругой?",
    a: "Конечно! Но твоей подруге нужно отправить отдельную анкету, чтобы организатор закрепил за ней место в списке гостей.",
  },
  {
    q: "Условия возврата билета?",
    a: "При отмене участия более чем за 14 дней возвращается 50% стоимости (так как продукты, декор и реквизит закупаются заранее). Менее чем за 7 дней возврат не предусмотрен. В случае отмены события организатором — гарантирован полный возврат 100%.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-36 px-6 max-w-4xl mx-auto border-t border-[#C8A86B]/20">
      <div className="max-w-2xl mb-16">
        <ScrollFade>
          <div className="flex items-center gap-3 mb-3">
            <span className="stamp-badge">Вопросы и ответы</span>
            <span className="font-script text-[#C8A86B] text-2xl">questions</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7F2] mb-4">
            Частые вопросы
          </h2>
          <p className="font-serif text-xl text-[#FAF7F2]/75 leading-relaxed">
            Ответы на главные организационные вопросы вечеринки.
          </p>
        </ScrollFade>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <ScrollFade key={idx} delay={idx * 30}>
              <div
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-[#140F11] border-[#C8A86B]/40 shadow-lg"
                    : "bg-[#0D0A0C] border-white/[0.08] hover:border-[#C8A86B]/25 hover:bg-[#120E10]"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 p-5 sm:p-6 group cursor-pointer"
                >
                  <span className="font-display text-base sm:text-lg font-medium text-[#FAF7F2] group-hover:text-[#E2C889] transition-colors">
                    {faq.q}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#750D1E] border-[#C8A86B]/60 text-[#E2C889] rotate-45 shadow-[0_0_12px_rgba(117,13,30,0.5)]"
                        : "bg-white/[0.04] border-white/10 text-white/60 group-hover:border-[#C8A86B]/40 group-hover:text-white"
                    }`}
                  >
                    <Plus className="w-4 h-4 transition-transform duration-300" />
                  </span>
                </button>

                {/* Animated accordion panel */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base font-serif text-[#FAF7F2]/75 leading-relaxed border-t border-[#C8A86B]/15 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFade>
          );
        })}
      </div>
    </section>
  );
}
