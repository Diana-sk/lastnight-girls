"use client";
import { useState } from "react";
import ScrollFade from "./ScrollFade";
import BowSVG from "./BowSVG";

interface FormData {
  name: string;
  age: string;
  telegram: string;
  contact: string;
  wishes: string;
  allergies: string;
  foodWishes: string;
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
  agreeRules: false,
  agreePrivacy: false,
};

export default function RegistrationSection() {
  const [form, setForm] = useState<FormData>(initialData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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
        throw new Error(data.error || "Произошла ошибка. Попробуй ещё раз.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Произошла ошибка. Попробуй ещё раз.");
    }
  };

  if (status === "success") {
    return (
      <section id="registration" className="relative py-24" style={{ background: "#0a0a0a" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <BowSVG className="w-20 h-16 mx-auto mb-6" color="#C41E3A" />
          <h3
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "#F5F0E8", marginBottom: "1rem" }}
          >
            Заявка получена!
          </h3>
          <p
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgba(245,240,232,0.75)", lineHeight: 1.7, marginBottom: "1.5rem" }}
          >
            Спасибо! Мы рассмотрим твою заявку<br />и свяжемся с тобой в Telegram.
          </p>
          <p
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1rem", color: "rgba(245,240,232,0.45)" }}
          >
            ✦ Следи за сообщениями от @LastNightGirls_bot ✦
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="registration"
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0205 0%, #0a0a0a 100%)" }}
    >
      <div className="max-w-2xl mx-auto px-6">
        <ScrollFade>
          <div className="text-center mb-12">
            <BowSVG className="w-16 h-12 mx-auto mb-4" color="#8B0000" />
            <h2
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 6vw, 3rem)", color: "#F5F0E8", marginBottom: "0.75rem" }}
            >
              Подать заявку
            </h2>
            <p
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "rgba(245,240,232,0.6)", lineHeight: 1.6 }}
            >
              Заявки рассматриваются организатором лично.<br />
              Место закрепляется только после одобрения и оплаты.
            </p>
            <div className="ornament-divider mx-auto max-w-xs mt-4">
              <span style={{ color: "#C41E3A", fontSize: "1.2rem" }}>✦</span>
            </div>
          </div>
        </ScrollFade>

        <ScrollFade>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", display: "block", marginBottom: "0.5rem" }}
              >
                Имя *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-field"
                placeholder="Как тебя зовут?"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", display: "block", marginBottom: "0.5rem" }}
              >
                Возраст * (18+)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                required
                min={18}
                max={99}
                className="form-field"
                placeholder="Твой возраст"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            {/* Telegram */}
            <div>
              <label
                htmlFor="telegram"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", display: "block", marginBottom: "0.5rem" }}
              >
                Telegram *
              </label>
              <input
                id="telegram"
                name="telegram"
                type="text"
                required
                className="form-field"
                placeholder="@username"
                value={form.telegram}
                onChange={handleChange}
              />
            </div>

            {/* Contact */}
            <div>
              <label
                htmlFor="contact"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", display: "block", marginBottom: "0.5rem" }}
              >
                Контактная информация *
              </label>
              <input
                id="contact"
                name="contact"
                type="text"
                required
                className="form-field"
                placeholder="Номер телефона или другой способ связи"
                value={form.contact}
                onChange={handleChange}
              />
            </div>

            {/* Divider */}
            <div className="py-2">
              <div className="ornament-divider">
                <span style={{ color: "#C41E3A", fontSize: "0.9rem" }}>пожелания</span>
              </div>
            </div>

            {/* Wishes */}
            <div>
              <label
                htmlFor="wishes"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", display: "block", marginBottom: "0.5rem" }}
              >
                Пожелания организатору
              </label>
              <textarea
                id="wishes"
                name="wishes"
                className="form-field"
                placeholder="Есть ли у тебя пожелания?"
                value={form.wishes}
                onChange={handleChange}
              />
            </div>

            {/* Allergies */}
            <div>
              <label
                htmlFor="allergies"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", display: "block", marginBottom: "0.5rem" }}
              >
                Аллергии
              </label>
              <input
                id="allergies"
                name="allergies"
                type="text"
                className="form-field"
                placeholder="Есть ли у тебя аллергия на что-то?"
                value={form.allergies}
                onChange={handleChange}
              />
            </div>

            {/* Food wishes */}
            <div>
              <label
                htmlFor="foodWishes"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.6)", display: "block", marginBottom: "0.5rem" }}
              >
                Пожелания к закускам и напиткам
              </label>
              <textarea
                id="foodWishes"
                name="foodWishes"
                className="form-field"
                placeholder="Что ты хотела бы видеть на столе?"
                value={form.foodWishes}
                onChange={handleChange}
              />
            </div>

            {/* Agreements */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeRules"
                  required
                  checked={form.agreeRules}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-[#C41E3A] flex-shrink-0"
                />
                <span
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(245,240,232,0.65)", lineHeight: 1.5 }}
                >
                  Я ознакомилась с{" "}
                  <a href="/rules" target="_blank" className="underline" style={{ color: "#C41E3A" }}>
                    Правилами мероприятия
                  </a>{" "}
                  и принимаю их *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  required
                  checked={form.agreePrivacy}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-[#C41E3A] flex-shrink-0"
                />
                <span
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(245,240,232,0.65)", lineHeight: 1.5 }}
                >
                  Я согласна на обработку персональных данных в соответствии с{" "}
                  <a href="/privacy" target="_blank" className="underline" style={{ color: "#C41E3A" }}>
                    Политикой конфиденциальности
                  </a>{" "}
                  *
                </span>
              </label>
            </div>

            {/* Error message */}
            {status === "error" && (
              <div
                className="p-4 text-sm"
                style={{ background: "rgba(180,30,30,0.15)", border: "1px solid rgba(196,30,58,0.3)", color: "#F5F0E8" }}
              >
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="cta-button w-full justify-center"
                style={{ opacity: status === "loading" ? 0.6 : 1 }}
              >
                <span>
                  {status === "loading" ? "ОТПРАВЛЯЕМ..." : "ОТПРАВИТЬ ЗАЯВКУ"}
                </span>
              </button>
            </div>

            <p
              className="text-center"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", color: "rgba(245,240,232,0.35)" }}
            >
              Приём заявок до 5 декабря 2026 или до заполнения мест
            </p>
          </form>
        </ScrollFade>
      </div>
    </section>
  );
}
