"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BowSVG from "@/components/BowSVG";

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка входа");
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Ошибка соединения");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #080808 0%, #0f0205 100%)"
      }}
    >
      <div
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          padding: "3rem 2.5rem",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center"
        }}
      >
        <BowSVG className="w-12 h-9 mx-auto mb-4" color="#8B0000" />
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#F5F0E8",
            letterSpacing: "0.1em",
            marginBottom: "0.25rem"
          }}
        >
          LAST NIGHT OF THE YEAR GIRLS
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.8rem",
            color: "#555",
            letterSpacing: "0.2em",
            marginBottom: "2rem"
          }}
        >
          ПАНЕЛЬ АДМИНИСТРАТОРА
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#F5F0E8",
              padding: "0.75rem 1rem",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              width: "100%"
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#F5F0E8",
              padding: "0.75rem 1rem",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              width: "100%"
            }}
          />

          {error && (
            <div style={{
              background: "rgba(180,30,30,0.15)",
              border: "1px solid rgba(196,30,58,0.3)",
              color: "#F5F0E8",
              padding: "0.6rem",
              fontSize: "0.85rem"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#333" : "#C41E3A",
              border: "none",
              color: "#F5F0E8",
              padding: "0.85rem",
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Playfair Display', serif",
              transition: "background 0.3s"
            }}
          >
            {loading ? "ВХОД..." : "ВОЙТИ"}
          </button>
        </form>
      </div>
    </div>
  );
}
