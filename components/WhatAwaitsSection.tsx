"use client";
import Image from "next/image";
import ScrollFade from "./ScrollFade";

const schedule = [
  {
    time: "20:00",
    title: "Сбор гостей",
    desc: "Welcome-drink, игристое и первые объятия.",
    tag: "Приветствие",
  },
  {
    time: "20:30",
    title: "Знакомство гостей",
    desc: "Уютный круг и конверты с секретными ролями.",
    tag: "Погружение",
  },
  {
    time: "21:00",
    title: "Ролевая игра",
    desc: "Сюжет с тайнами — каждая станет героиней.",
    tag: "Интрига",
  },
  {
    time: "22:30",
    title: "Новогодний стол",
    desc: "Авторский фуршет, тосты и звон бокалов.",
    tag: "Ужин",
  },
  {
    time: "23:30",
    title: "Настолки",
    desc: "Весёлые игры и азарт в кругу своих.",
    tag: "Игры",
  },
  {
    time: "00:30",
    title: "Новогодние фильмы",
    desc: "Пледы, гирлянды и кино до рассвета.",
    tag: "Уют",
  },
];

/* Геометрия экрана фотоаппарата collage-camera-bigscreen.png
   (доли ширины/высоты от изображения) */
const SCREEN = { left: 4.5, top: 15, width: 67, height: 72.5 };

export default function WhatAwaitsSection() {
  return (
    <section
      id="timeline"
      className="relative py-24 sm:py-36 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#C8A86B]/20"
    >
      <div className="max-w-2xl mb-14">
        <ScrollFade>
          <div className="flex items-center gap-3 mb-3">
            <span className="stamp-badge">Хронометраж ночи</span>
            <span className="font-script text-[#C8A86B] text-2xl">program</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7F2] mb-4">
            Программа вечера
          </h2>
          <p className="font-serif text-xl text-[#FAF7F2]/75 leading-relaxed">
            Расписание ночи — прямо на экране праздничной камеры. Листай внутри экрана.
          </p>
        </ScrollFade>
      </div>

      <ScrollFade delay={120}>
        <div className="relative mx-auto max-w-6xl">
          {/* Золотые звёзды — над коллажем (на десктопе), на мобильном — за камерой */}
          <div
            className="collage-float absolute -left-6 sm:-left-28 top-[12%] w-32 sm:w-56 z-0 sm:z-30 pointer-events-none"
            style={{ "--tilt": "-2deg" } as React.CSSProperties}
          >
            <Image
              src="/images/program/collage-stars.png"
              alt="Золотые звёзды"
              width={700}
              height={626}
              sizes="230px"
              className="w-full h-auto drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Диско-шар — верхний правый угол (на мобильном полностью выше камеры) */}
          <div
            className="collage-float absolute -right-3 sm:right-0 -top-24 sm:-top-8 w-20 sm:w-28 z-20 pointer-events-none"
            style={{ "--tilt": "8deg", "--float-delay": "0.7s" } as React.CSSProperties}
          >
            <Image
              src="/images/program/deco-discoball.png"
              alt="Золотой диско-шар"
              width={560}
              height={560}
              sizes="120px"
              className="w-full h-auto drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* Диско-шар — нижний левый угол */}
          <div
            className="collage-float absolute -left-2 sm:-left-8 -bottom-4 sm:bottom-0 w-20 sm:w-28 z-20 pointer-events-none"
            style={{ "--tilt": "-8deg", "--float-delay": "1.1s" } as React.CSSProperties}
          >
            <Image
              src="/images/program/deco-discoball.png"
              alt="Золотой диско-шар"
              width={560}
              height={560}
              sizes="120px"
              className="w-full h-auto drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* Ёлка — нижний правый угол */}
          <div
            className="collage-float absolute -right-3 sm:right-0 -bottom-8 sm:-bottom-12 w-24 sm:w-36 z-20 pointer-events-none"
            style={{ "--tilt": "3deg", "--float-delay": "0.4s" } as React.CSSProperties}
          >
            <Image
              src="/images/program/deco-tree.png"
              alt="Нарядная новогодняя ёлка"
              width={640}
              height={840}
              sizes="150px"
              className="w-full h-auto drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Фотоаппарат с программой внутри экрана */}
          <div className="collage-float relative z-10 mx-auto w-full max-w-[380px] sm:max-w-[700px] lg:max-w-[840px]">
            <div className="relative drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]">
              <Image
                src="/images/program/collage-camera-bigscreen.png"
                alt="Бордовый фотоаппарат с программой вечера на экране"
                width={1536}
                height={1024}
                sizes="(max-width: 640px) 380px, (max-width: 1024px) 700px, 840px"
                className="w-full h-auto"
              />

              {/* Экран камеры: программа вечера с прокруткой */}
              <div
                className="absolute overflow-hidden rounded-[2%]"
                style={{
                  left: `${SCREEN.left}%`,
                  top: `${SCREEN.top}%`,
                  width: `${SCREEN.width}%`,
                  height: `${SCREEN.height}%`,
                }}
              >
                <div className="h-full w-full bg-[#14070A] overflow-y-auto program-scroll px-[5%] py-[4%] space-y-[4%]">
                  {schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-[#C8A86B]/25 pb-[4%] last:border-b-0"
                    >
                      <div className="flex items-baseline gap-[4%]">
                        <span className="font-mono font-bold text-[#E2C889] text-[clamp(11px,1.8vw,18px)] shrink-0">
                          {item.time}
                        </span>
                        <span className="text-[#C8A86B]/70 uppercase tracking-wider font-mono text-[clamp(7px,1vw,10px)] truncate">
                          {item.tag}
                        </span>
                      </div>
                      <div className="font-display font-bold text-[#FAF7F2] text-[clamp(14px,2.2vw,22px)] leading-tight mt-[2%]">
                        {item.title}
                      </div>
                      <div className="font-serif text-[#FAF7F2]/70 leading-snug text-[clamp(10px,1.6vw,15px)] mt-[1.5%]">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                  <div className="pt-[3%] text-center">
                    <span className="font-script text-[#C8A86B] text-[clamp(14px,2.4vw,22px)]">
                      до рассвета ✦
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Подпись под коллажем */}
          <div className="text-center mt-14 sm:mt-16">
            <span className="font-script text-[#C8A86B] text-2xl sm:text-3xl">
              glamorous night
            </span>
          </div>
        </div>
      </ScrollFade>
    </section>
  );
}
