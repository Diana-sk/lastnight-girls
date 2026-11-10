"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, AlertCircle, Loader2, Mail, Sparkles } from "lucide-react";
import ScrollFade from "./ScrollFade";
import Confetti from "./Confetti";

interface FormData {
  name: string;
  age: string;
  telegram: string;
  contact: string;
  wishes: string;
  allergies: string;
  foodWishes: string;
  secretChapter: string;
  agreeRules: boolean;
  agreePrivacy: boolean;
}

const initialData: FormData = {
  name: "",
  age: "",
  telegram: "",
  contact: "",
  wishes: "",
  allergies: "",
  foodWishes: "",
  secretChapter: "",
  agreeRules: false,
  agreePrivacy: false,
};

function solveCubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  let t2 = x;
  for (let i = 0; i < 8; i++) {
    const xEst = sampleCurveX(t2) - x;
    if (Math.abs(xEst) < 1e-6) break;
    const dEst = sampleCurveDerivativeX(t2);
    if (Math.abs(dEst) < 1e-6) break;
    t2 -= xEst / dEst;
  }

  return sampleCurveY(Math.max(0, Math.min(1, t2)));
}

const easeOutEnvelope = (t: number) => solveCubicBezier(0.22, 1, 0.36, 1, t);

// Ссылка на Telegram-бота — подставьте реальный юзернейм в .env.local
// (NEXT_PUBLIC_TELEGRAM_BOT_URL). Пока стоит заглушка — заменю, как скинете.
const BOT_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || "https://t.me/lng_girls_bot";
const BOT_USERNAME = "@" + BOT_URL.replace("https://t.me/", "").replace(/\/$/, "");

export default function RegistrationSection() {
  const [form, setForm] = useState<FormData>(initialData);
  const [status, setStatus] = useState<
    "idle" | "loading" | "sealing" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [isWaitlist, setIsWaitlist] = useState(false);

  // Состояния единого физического объекта (конверт + один вложенный лист)
  const [isHovered, setIsHovered] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isAnimatingSheet, setIsAnimatingSheet] = useState(false);
  const [isCardTucked, setIsCardTucked] = useState(false);
  const [isFlapOnFront, setIsFlapOnFront] = useState(false);
  const [isFlapClosed, setIsFlapClosed] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  // Рефы для покадровой синхронизации высоты листа и следования камеры за его топом
  const formCollapsibleRef = useRef<HTMLDivElement | null>(null);
  const formInnerRef = useRef<HTMLDivElement | null>(null);
  const sheetHeaderRef = useRef<HTMLDivElement | null>(null);
  const envelopeRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Синхронный движок: высота листа меняется одновременно с тем, как камера следует за его верхушкой
  const runSheetTransition = useCallback(
    (
      targetOpen: boolean,
      options?: {
        durationMs?: number;
        onComplete?: () => void;
      },
    ) => {
      if (typeof window === "undefined") return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const wrapper = formCollapsibleRef.current;
      const inner = formInnerRef.current;
      const header = sheetHeaderRef.current;
      const envelope = envelopeRef.current;

      if (!wrapper || !inner || !header) {
        setIsOpened(targetOpen);
        options?.onComplete?.();
        return;
      }

      setIsAnimatingSheet(true);
      setIsHovered(false);

      const durationMs = options?.durationMs ?? 880;
      const startHeight = wrapper.getBoundingClientRect().height;
      const fullFormHeight = inner.scrollHeight;
      const endHeight = targetOpen ? fullFormHeight : 0;

      if (targetOpen) {
        setIsOpened(true);
      }

      let hasSwitchedHeaderState = false;
      const startTime = performance.now();
      const startScrollY = typeof window !== "undefined" ? window.scrollY : 0;

      // При сворачивании: центрируем конверт по вертикали в viewport.
      // envelopeRef — div с aspect-[600/520] absolute bottom-0.
      // Пока анкета открыта, её нижний край совпадает с нижним краем конверта.
      // После схлопывания конверт сдвинется ВВЕРХ ровно на startHeight (высота формы).
      // Поэтому предсказываем финальную позицию конверта до начала анимации.
      let targetScrollY: number;
      if (!targetOpen && envelope) {
        const envRect = envelope.getBoundingClientRect();
        // Нижний край конверта в документе после схлопывания формы
        const envDocBottomAfterCollapse =
          envRect.bottom + startScrollY - startHeight;
        // Центр конверта в документе после схлопывания
        const envCenterDocY = envDocBottomAfterCollapse - envRect.height / 2;
        // Смещение, чтобы конверт визуально располагался чуть выше центра экрана
        const verticalOffset =
          typeof window !== "undefined" && window.innerWidth >= 640 ? 60 : 40;
        // Скролл, при котором конверт приподнят относительно центра viewport
        targetScrollY = Math.max(
          0,
          envCenterDocY - window.innerHeight / 2 + verticalOffset,
        );
      } else {
        // При раскрытии: позиционируем так, чтобы top анкеты был на уровне bottom header - 20px
        const siteHeader = document.querySelector("header");
        const headerBottom = siteHeader
          ? siteHeader.getBoundingClientRect().bottom
          : typeof window !== "undefined" && window.innerWidth >= 640
            ? 70
            : 60;
        const initialHeaderRect = header.getBoundingClientRect();
        const sheetDocTop = initialHeaderRect.top + startScrollY;
        targetScrollY = Math.max(0, sheetDocTop - (headerBottom - 20));
      }

      const shouldSyncScrollToHeader =
        Math.abs(startScrollY - targetScrollY) > 15;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / durationMs, 1);
        const easedProgress = easeOutEnvelope(rawProgress);

        // Фиксация позиции топа листа ДО изменения высоты в кадре
        const headerRectBefore = header.getBoundingClientRect();
        const topBefore = headerRectBefore.top;

        // 1. Изменяем высоту анкеты
        const currentHeight =
          startHeight + (endHeight - startHeight) * easedProgress;
        wrapper.style.height = `${currentHeight}px`;
        wrapper.style.opacity = `${targetOpen ? easedProgress : 1 - easedProgress}`;

        const closedPadBottom = window.innerWidth >= 640 ? 156 : 124;
        const openPadBottom = 20;
        const currentPadBottom = targetOpen
          ? closedPadBottom + (openPadBottom - closedPadBottom) * easedProgress
          : openPadBottom + (closedPadBottom - openPadBottom) * easedProgress;
        header.style.paddingBottom = `${currentPadBottom}px`;

        if (!targetOpen && rawProgress >= 0.08 && !hasSwitchedHeaderState) {
          hasSwitchedHeaderState = true;
          setIsOpened(false);
        }

        // 2. Синхронное следование камеры за топом листа и конвертом
        if (shouldSyncScrollToHeader) {
          const currentScroll =
            startScrollY + (targetScrollY - startScrollY) * easedProgress;
          window.scrollTo({
            top: currentScroll,
            behavior: "instant" as ScrollBehavior,
          });
        } else {
          const headerRectAfter = header.getBoundingClientRect();
          const topAfter = headerRectAfter.top;
          const deltaTop = topAfter - topBefore;

          if (Math.abs(deltaTop) > 0.1) {
            window.scrollBy({
              top: deltaTop,
              behavior: "instant" as ScrollBehavior,
            });
          }
        }

        if (rawProgress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          wrapper.style.height = targetOpen ? "auto" : "0px";
          wrapper.style.opacity = targetOpen ? "1" : "0";
          header.style.paddingBottom = targetOpen
            ? `${openPadBottom}px`
            : `${closedPadBottom}px`;
          setIsOpened(targetOpen);
          setIsAnimatingSheet(false);
          options?.onComplete?.();
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.spotsLeft !== undefined) {
          setSpotsLeft(data.spotsLeft);
          setIsWaitlist(data.isWaitlist || data.isFull);
        }
      })
      .catch(() => {});

    if (typeof window !== "undefined" && window.location.hash === "#pass") {
      setIsOpened(true);
      if (formCollapsibleRef.current && sheetHeaderRef.current) {
        formCollapsibleRef.current.style.height = "auto";
        formCollapsibleRef.current.style.opacity = "1";
        sheetHeaderRef.current.style.paddingBottom = "20px";
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleOpenEnvelope = () => {
    if (isOpened || isAnimatingSheet || isSealed || status === "sealing")
      return;
    runSheetTransition(true, { durationMs: 860 });
  };

  const handleCollapseEnvelope = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpened || isAnimatingSheet || status === "sealing") return;
    runSheetTransition(false, { durationMs: 880 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Произошла ошибка при отправке заявки.");
      }

      setApplicationId(data.applicationId);
      setIsWaitlist(data.isWaitlist);
      setStatus("sealing");
      setIsHovered(false);

      // 1. Плавное закрытие анкеты со следованием камеры за верхушкой уходящего листа
      runSheetTransition(false, { durationMs: 880 });

      // 2. Лист опускается глубже внутрь кармана (ниже линии сгиба y=185)
      setTimeout(() => {
        setIsCardTucked(true);
      }, 520);

      // 3. Треугольный корешок переходит на передний план и плавно закрывается сверху вниз
      setTimeout(() => {
        setIsFlapOnFront(true);
      }, 1200);

      setTimeout(() => {
        setIsFlapClosed(true);
      }, 1240);

      // 4. Сургучная печать скрепляет конверт и проявляется штамп с номером заявки
      setTimeout(() => {
        setIsSealed(true);
        setStatus("success");
      }, 2080);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Произошла ошибка. Попробуй ещё раз.",
      );
    }
  };

  const getLetterSheetTransform = () => {
    if (isCardTucked) return "translate3d(0px, 132px, 0px) scale(0.985)";
    if (
      !isOpened &&
      !isAnimatingSheet &&
      isHovered &&
      !isSealed &&
      status !== "sealing"
    ) {
      return "translate3d(0px, -10px, 0px) scale(1)";
    }
    return "translate3d(0px, 0px, 0px) scale(1)";
  };

  return (
    <section
      id="pass"
      className="relative py-24 sm:py-36 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#C8A86B]/20 overflow-hidden"
    >
      {/* Фон: тёмная хвоя с бордовыми лентами, как на референсе конверта */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/envelope-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-90"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090708]/55 via-[#090708]/35 to-[#090708]/75" />
      </div>

      {/* Салют-хлопушка при успешной отправке письма */}
      <Confetti fire={status === "success"} />

      <div className="relative text-center max-w-xl mx-auto mb-16">
        <ScrollFade>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="stamp-badge">
              <Mail className="w-3.5 h-3.5 text-[#C8A86B]" />
              Private RSVP
            </span>
            <span className="font-script text-[#C8A86B] text-2xl">
              invitation
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7F2] mb-4">
            Подать заявку на участие
          </h2>

          <p className="font-serif text-xl text-[#FAF7F2]/75 leading-relaxed mb-6">
            Заполни персональную анкету. Каждая заявка рассматривается
            организатором лично.
          </p>

          <div className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-[#C8A86B] border border-[#C8A86B]/30 bg-black/40 px-4 py-2 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-[#750D1E] animate-pulse" />
            <span>
              {spotsLeft !== null
                ? isWaitlist
                  ? "Основные места заняты · Приём в лист ожидания"
                  : `Осталось свободных мест: ${spotsLeft} из 15`
                : "Только 15 мест · Закрытый отбор"}
            </span>
          </div>
        </ScrollFade>
      </div>

      {/* ЕДИНАЯ ФИЗИЧЕСКАЯ СБОРКА: БАРХАТНЫЙ КОНВЕРТ (600x520) + ОДИН ЦЕЛЬНЫЙ ЛИСТ */}
      <ScrollFade delay={100} className="relative">
        <div className="relative max-w-[640px] w-full mx-auto pt-6 sm:pt-10">
          <div
            onClick={handleOpenEnvelope}
            onMouseEnter={() =>
              !isOpened && !isAnimatingSheet && setIsHovered(true)
            }
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform:
                !isOpened &&
                !isAnimatingSheet &&
                isHovered &&
                !isSealed &&
                status !== "sealing"
                  ? "translate3d(0px, -2px, 0px) scale(1.01)"
                  : "translate3d(0px, 0px, 0px) scale(1)",
              transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className={`relative w-full select-none ${
              !isOpened &&
              !isAnimatingSheet &&
              !isSealed &&
              status !== "sealing"
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            {/* Якорь габаритов конверта (600x520) в нижней части сборки */}
            <div ref={envelopeRef} className="pointer-events-none absolute bottom-0 inset-x-0 w-full aspect-[600/520]">
              <div
                style={{
                  opacity: isHovered || isOpened ? 0.34 : 0.24,
                  transition: "opacity 700ms ease",
                }}
                className="absolute -inset-8 bg-[#750D1E] rounded-full blur-3xl"
              />
            </div>

            {/* СЛОЙ 1 (z-0): ЗАДНЯЯ СТЕНКА КАРМАНА КОНВЕРТА */}
            <svg
              viewBox="0 0 600 520"
              className="pointer-events-none absolute bottom-0 inset-x-0 w-full h-auto z-0 drop-shadow-[0_32px_64px_rgba(0,0,0,0.92)] overflow-visible"
            >
              <defs>
                <pattern
                  id="envPaperTex"
                  width="420"
                  height="420"
                  patternUnits="userSpaceOnUse"
                >
                  <image
                    href="/images/burgundy-paper.jpg"
                    width="420"
                    height="420"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              </defs>
              <rect
                x="0"
                y="185"
                width="600"
                height="335"
                fill="#3D030B"
                rx="10"
              />
              <rect
                x="0"
                y="185"
                width="600"
                height="335"
                fill="url(#envPaperTex)"
                opacity="0.28"
                rx="10"
                style={{ mixBlendMode: "overlay" }}
              />
            </svg>

            {/* СЛОЙ 2 (z-10 -> z-40): ВЕРХНИЙ ТРЕУГОЛЬНЫЙ КОРЕШОК */}
            <svg
              viewBox="0 0 600 520"
              className={`pointer-events-none absolute bottom-0 inset-x-0 w-full h-auto overflow-visible ${
                isFlapOnFront ? "z-40" : "z-10"
              }`}
            >
              <defs>
                <linearGradient
                  id="singleFlapOpenGrad"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#961528" />
                  <stop offset="50%" stopColor="#750D1E" />
                  <stop offset="100%" stopColor="#4A0610" />
                </linearGradient>
                <linearGradient
                  id="singleFlapClosedGrad"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8B1224" />
                  <stop offset="55%" stopColor="#6E0B1A" />
                  <stop offset="100%" stopColor="#4A0610" />
                </linearGradient>
                <filter
                  id="flapDropShadow"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="6"
                    floodColor="#000000"
                    floodOpacity="0.55"
                  />
                </filter>
              </defs>

              <g
                style={{
                  transformOrigin: "300px 185px",
                  transform: isFlapClosed ? "scaleY(-1)" : "scaleY(1)",
                  transition: "transform 880ms cubic-bezier(0.25, 1, 0.35, 1)",
                  willChange: "transform",
                }}
                filter={isFlapClosed ? "url(#flapDropShadow)" : undefined}
              >
                <polygon
                  points="0,185 300,10 600,185"
                  fill={
                    isFlapClosed
                      ? "url(#singleFlapClosedGrad)"
                      : "url(#singleFlapOpenGrad)"
                  }
                />
                <polygon
                  points="0,185 300,10 600,185"
                  fill="url(#envPaperTex)"
                  opacity="0.22"
                  style={{ mixBlendMode: "overlay" }}
                />
                <path
                  d="M 0,185 L 300,10 L 600,185"
                  fill="none"
                  stroke="rgba(200, 168, 107, 0.45)"
                  strokeWidth="1.5"
                />
                <line
                  x1="300"
                  y1="10"
                  x2="300"
                  y2="185"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </g>
            </svg>

            {/* СЛОЙ 3 (z-20): ОДИН МОНОЛИТНЫЙ ЛИСТ ПИСЬМА */}
            <div className="relative z-20 w-full pt-[11.6667%] pb-[12%] overflow-hidden rounded-b-[10px]">
              <div
                style={{
                  transform: getLetterSheetTransform(),
                  transformOrigin: "50% 85%",
                  transition: isCardTucked
                    ? "transform 850ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
                className="w-[88.6667%] mx-auto ivory-letter-card rounded-[12px] sm:rounded-[14px] text-[#1A1516] relative border border-[#C8A86B]/40 shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
              >
                {/* ШАПКА ОДНОГО ЛИСТА */}
                <div
                  ref={sheetHeaderRef}
                  style={{
                    paddingBottom: isOpened ? "20px" : "148px",
                  }}
                  className="relative z-10 px-5 sm:px-10 pt-7 sm:pt-9"
                >
                  <div
                    className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpened
                        ? "grid-rows-[1fr] opacity-100 mb-5 pb-2.5 border-b border-[#750D1E]/15"
                        : "grid-rows-[0fr] opacity-0 mb-0 pb-0 border-b-0"
                    }`}
                  >
                    <div className="overflow-hidden flex justify-between items-center">
                      <span className="text-[0.65rem] uppercase tracking-widest font-mono text-[#750D1E]">
                        Анкета участницы · LNG-2026
                      </span>
                      <button
                        type="button"
                        onClick={handleCollapseEnvelope}
                        className="text-xs text-[#750D1E]/75 hover:text-[#750D1E] underline font-sans cursor-pointer transition-colors"
                      >
                        ✕ Убрать в конверт
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-[#750D1E] font-sans">
                      LAST NIGHT OF THE YEAR
                    </div>

                    <h3
                      className={`font-brush text-[#750D1E] leading-none tracking-normal transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpened
                          ? "text-5xl sm:text-7xl my-2.5"
                          : "text-[52px] sm:text-[64px] my-2"
                      }`}
                    >
                      Reservation
                    </h3>

                    <div
                      className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        !isOpened
                          ? "grid-rows-[1fr] opacity-100 mt-1 mb-1.5"
                          : "grid-rows-[0fr] opacity-0 mt-0 mb-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <span className="font-serif italic text-[#750D1E] text-[15px] sm:text-[18px] leading-tight inline-block">
                          open →
                        </span>
                      </div>
                    </div>

                    <div className="text-[9px] sm:text-[10.5px] uppercase tracking-[0.2em] text-[#1A1516]/55 font-mono mt-1">
                      PRIVATE RSVP · 19 ДЕКАБРЯ 2026
                    </div>
                  </div>
                </div>

                {/* ПОЛЯ АНКЕТЫ */}
                <div
                  ref={formCollapsibleRef}
                  style={{ height: 0, opacity: 0 }}
                  className={`relative z-10 overflow-hidden ${
                    isOpened ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <div
                    ref={formInnerRef}
                    className="px-5 sm:px-10 pt-5 pb-48 sm:pb-56 border-t border-[#750D1E]/15"
                  >
                    {errorMsg && (
                      <div className="mb-5 p-3.5 rounded-xl bg-red-100 border border-red-300 flex items-start gap-3 text-red-900 text-xs sm:text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                            Имя и фамилия{" "}
                            <span className="text-[#750D1E]">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Например, Анна Смирнова"
                            className="cream-input"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                            Возраст (18+){" "}
                            <span className="text-[#750D1E]">*</span>
                          </label>
                          <input
                            type="number"
                            name="age"
                            min="18"
                            max="99"
                            required
                            value={form.age}
                            onChange={handleChange}
                            placeholder="21"
                            className="cream-input"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                            Telegram (@username){" "}
                            <span className="text-[#750D1E]">*</span>
                          </label>
                          <input
                            type="text"
                            name="telegram"
                            required
                            value={form.telegram}
                            onChange={handleChange}
                            placeholder="@username"
                            className="cream-input"
                          />
                          <p className="text-[0.68rem] text-[#1A1516]/55">
                            Основной канал для подтверждения и адреса
                          </p>
                          <p className="text-[0.68rem] text-[#750D1E]/85 leading-snug mt-1.5">
                            ⚠️ Чтобы мы могли написать тебе первыми, сначала
                            запусти нашего бота:{" "}
                            <a
                              href={BOT_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold underline underline-offset-2 hover:text-[#750D1E]"
                            >
                              {BOT_USERNAME}
                            </a>
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                            Телефон для связи{" "}
                            <span className="text-[#750D1E]">*</span>
                          </label>
                          <input
                            type="tel"
                            name="contact"
                            required
                            value={form.contact}
                            onChange={handleChange}
                            placeholder="+7 (999) 000-00-00"
                            className="cream-input"
                          />
                          <p className="text-[0.68rem] text-[#1A1516]/55">
                            Для СБП и связи в день вечеринки
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                          Пожелания к фуршету и напиткам (опционально)
                        </label>
                        <input
                          type="text"
                          name="foodWishes"
                          value={form.foodWishes}
                          onChange={handleChange}
                          placeholder="Сухое игристое, фрукты, сыры..."
                          className="cream-input"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                          Аллергии или ограничения в еде (опционально)
                        </label>
                        <input
                          type="text"
                          name="allergies"
                          value={form.allergies}
                          onChange={handleChange}
                          placeholder="Орехи, лактоза, цитрусовые..."
                          className="cream-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                          Останешься на секретную главу (00:00–06:00)?
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {[
                            { value: "yes", label: "Да" },
                            { value: "no", label: "Нет" },
                            { value: "unsure", label: "Затрудняюсь ответить" },
                          ].map((opt) => (
                            <label
                              key={opt.value}
                              className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-all ${
                                form.secretChapter === opt.value
                                  ? "border-[#750D1E] bg-[#750D1E] text-[#FAF7F2]"
                                  : "border-[#750D1E]/25 bg-white text-[#1A1516]/80 hover:border-[#750D1E]/50"
                              }`}
                            >
                              <input
                                type="radio"
                                name="secretChapter"
                                value={opt.value}
                                checked={form.secretChapter === opt.value}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-[#1A1516]/75 font-semibold">
                          Вопросы или пожелания к вечеру (опционально)
                        </label>
                        <textarea
                          name="wishes"
                          rows={3}
                          value={form.wishes}
                          onChange={handleChange}
                          placeholder="С каким настроением ты идёшь или что хочешь уточнить..."
                          className="cream-input resize-none"
                        />
                      </div>

                      <div className="space-y-3.5 pt-3 border-t border-[#1A1516]/15">
                        <label className="flex items-start gap-3.5 text-xs text-[#1A1516]/80 cursor-pointer select-none leading-relaxed">
                          <input
                            type="checkbox"
                            name="agreeRules"
                            required
                            checked={form.agreeRules}
                            onChange={handleChange}
                            className="cream-checkbox"
                          />
                          <span>
                            Мне исполнилось 18 лет, я согласна с закрытым
                            форматом девичника и правилом бронирования места на
                            48 часов после одобрения.
                          </span>
                        </label>

                        <label className="flex items-start gap-3.5 text-xs text-[#1A1516]/80 cursor-pointer select-none leading-relaxed">
                          <input
                            type="checkbox"
                            name="agreePrivacy"
                            required
                            checked={form.agreePrivacy}
                            onChange={handleChange}
                            className="cream-checkbox"
                          />
                          <span>
                            Я согласна на обработку контактных данных для связи
                            организатора со мной в Telegram.
                          </span>
                        </label>
                      </div>

                      <div className="pt-3">
                        <button
                          type="submit"
                          disabled={
                            status === "loading" ||
                            status === "sealing" ||
                            isAnimatingSheet
                          }
                          className="btn-wax-seal w-full justify-center disabled:opacity-50 text-center py-4 cursor-pointer transition-all duration-300"
                        >
                          {status === "loading" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#E2C889]" />
                              <span>Запечатываем письмо...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-[#E2C889]" />
                              <span>
                                {isWaitlist
                                  ? "Запечатать в лист ожидания"
                                  : "Запечатать и отправить письмо"}
                              </span>
                              <ArrowRight className="w-4 h-4 text-[#E2C889]" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="pt-8 text-center">
                        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.26em] text-[#750D1E]/55">
                          ✦ Санкт-Петербург · Закрытый девичник ✦
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* СЛОЙ 4 (z-30): ПЕРЕДНИЙ БАРХАТНЫЙ V-КАРМАН КОНВЕРТА */}
            <svg
              viewBox="0 0 600 520"
              className="pointer-events-none absolute bottom-0 inset-x-0 w-full h-auto z-30 overflow-visible"
            >
              <defs>
                <linearGradient
                  id="pocketLeftGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#820F20" />
                  <stop offset="100%" stopColor="#4D0610" />
                </linearGradient>
                <linearGradient
                  id="pocketRightGrad"
                  x1="100%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#820F20" />
                  <stop offset="100%" stopColor="#4D0610" />
                </linearGradient>
                <linearGradient
                  id="pocketBottomGrad"
                  x1="0%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#42040D" />
                  <stop offset="100%" stopColor="#6E0B19" />
                </linearGradient>
                <filter
                  id="pocketLipShadow"
                  x="-10%"
                  y="-15%"
                  width="120%"
                  height="130%"
                >
                  <feDropShadow
                    dx="0"
                    dy="-3"
                    stdDeviation="5"
                    floodColor="#000000"
                    floodOpacity="0.45"
                  />
                </filter>
                <filter
                  id="pocketFoldShadow"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="6"
                    floodColor="#000000"
                    floodOpacity="0.6"
                  />
                </filter>
              </defs>

              <g filter="url(#pocketLipShadow)">
                <polygon
                  points="0,185 300,355 0,520"
                  fill="url(#pocketLeftGrad)"
                />
                <polygon
                  points="600,185 300,355 600,520"
                  fill="url(#pocketRightGrad)"
                />
                <polygon
                  points="0,185 300,355 0,520"
                  fill="url(#envPaperTex)"
                  opacity="0.22"
                  style={{ mixBlendMode: "overlay" }}
                />
                <polygon
                  points="600,185 300,355 600,520"
                  fill="url(#envPaperTex)"
                  opacity="0.22"
                  style={{ mixBlendMode: "overlay" }}
                />
              </g>
              <polygon
                points="0,520 300,330 600,520"
                fill="url(#pocketBottomGrad)"
                filter="url(#pocketFoldShadow)"
                stroke="rgba(200, 168, 107, 0.22)"
                strokeWidth="0.6"
              />
              <polygon
                points="0,520 300,330 600,520"
                fill="url(#envPaperTex)"
                opacity="0.22"
                style={{ mixBlendMode: "overlay" }}
              />
            </svg>

            {/* СЛОЙ 5 (z-50): ЗОЛОТАЯ СУРГУЧНАЯ ПЕЧАТЬ И ШТАМП ДОСТАВКИ */}
            <svg
              viewBox="0 0 600 520"
              className="pointer-events-none absolute bottom-0 inset-x-0 w-full h-auto z-50 overflow-visible"
            >
              <defs>
                <radialGradient id="waxGoldSealGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFE8B5" />
                  <stop offset="45%" stopColor="#C8A86B" />
                  <stop offset="100%" stopColor="#7A561E" />
                </radialGradient>
                <filter
                  id="waxSealShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="6"
                    floodColor="#000000"
                    floodOpacity="0.65"
                  />
                </filter>
              </defs>

              <g
                filter="url(#waxSealShadow)"
                style={{
                  transformOrigin: "300px 350px",
                  transform: isSealed
                    ? "scale(1.1)"
                    : isFlapClosed
                      ? "scale(1.03)"
                      : "scale(1)",
                  transition: "transform 750ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <circle
                  cx="300"
                  cy="350"
                  r="38"
                  fill="none"
                  stroke="#E2C889"
                  strokeWidth="1.2"
                  style={{
                    opacity: isSealed ? 0.45 : 0,
                    transformOrigin: "300px 350px",
                    transform: isSealed ? "scale(1.08)" : "scale(0.85)",
                    transition:
                      "opacity 800ms ease, transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
                <image
                  href="/images/wax-seal.png"
                  x="249"
                  y="300"
                  width="102"
                  height="99"
                  preserveAspectRatio="xMidYMid meet"
                />
                <text
                  x="300"
                  y="352"
                  textAnchor="middle"
                  fill="#5A3F14"
                  fontSize="12.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  letterSpacing="1"
                  opacity="0.9"
                >
                  LNG
                </text>
                <text
                  x="300"
                  y="366"
                  textAnchor="middle"
                  fill="#5A3F14"
                  fontSize="9"
                  fontFamily="monospace"
                  opacity="0.85"
                >
                  2026
                </text>
              </g>

              <g
                style={{
                  opacity: isSealed ? 1 : 0,
                  transform: isSealed
                    ? "translate3d(0px, 0px, 0px)"
                    : "translate3d(0px, 10px, 0px)",
                  transition:
                    "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Тонкая золотая рамка с результатом — целиком внутри письма */}
                <rect
                  x="132"
                  y="402"
                  width="336"
                  height="106"
                  rx="16"
                  fill="#14070A"
                  opacity="0.68"
                  stroke="#C8A86B"
                  strokeOpacity="0.85"
                  strokeWidth="1"
                />
                <rect
                  x="139"
                  y="409"
                  width="322"
                  height="92"
                  rx="12"
                  fill="none"
                  stroke="#C8A86B"
                  strokeOpacity="0.35"
                  strokeWidth="0.6"
                />
                <text
                  x="300"
                  y="432"
                  textAnchor="middle"
                  fill="#E2C889"
                  fontSize="11.5"
                  fontWeight="bold"
                  letterSpacing="2"
                  fontFamily="monospace"
                >
                  ✓ ПИСЬМО ЗАПЕЧАТАНО И ДОСТАВЛЕНО
                </text>
                <text
                  x="300"
                  y="459"
                  textAnchor="middle"
                  fill="#FAF7F2"
                  fontSize="15.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  НОМЕР ЗАЯВКИ: {applicationId}
                </text>
                <text
                  x="300"
                  y="480"
                  textAnchor="middle"
                  fill="#E2C889"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  Напиши боту {BOT_USERNAME}
                </text>
                <text
                  x="300"
                  y="496"
                  textAnchor="middle"
                  fill="#FAF7F2"
                  opacity="0.75"
                  fontSize="10.5"
                  fontFamily="sans-serif"
                >
                  ответ организатора придёт тебе именно там
                </text>
              </g>
            </svg>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            {isSealed ? (
              <a
                href="#hero"
                className="btn-wax-seal text-xs tracking-wider inline-flex"
              >
                Вернуться на главную
              </a>
            ) : !isOpened ? (
              <button
                type="button"
                onClick={handleOpenEnvelope}
                disabled={status === "sealing" || isAnimatingSheet}
                className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#E2C889] bg-black/60 px-5 py-2.5 rounded-full border transition-all duration-500 cursor-pointer ${
                  isHovered && status !== "sealing"
                    ? "border-[#E2C889] shadow-[0_0_20px_rgba(200,168,107,0.2)]"
                    : "border-[#C8A86B]/30"
                }`}
              >
                <span>
                  {status === "sealing"
                    ? "✉ Запечатываем ваше письмо..."
                    : "✉ Нажмите на конверт, чтобы открыть"}
                </span>
                {status !== "sealing" && (
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isHovered ? "translate-x-1" : "translate-x-0"
                    }`}
                  />
                )}
              </button>
            ) : null}

            <div className="w-full flex items-center justify-center px-2 pt-1 text-[0.7rem] uppercase tracking-widest text-[#E2C889]/80 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2C889] animate-pulse" />
                Private Guestlist 2026
              </span>
            </div>
          </div>
        </div>
      </ScrollFade>
    </section>
  );
}
