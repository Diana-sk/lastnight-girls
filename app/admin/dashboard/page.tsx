"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ApplicationStatus =
  | "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"
  | "PAYMENT_PENDING" | "PAID" | "CANCELLED"
  | "REFUND_PENDING" | "REFUNDED" | "WAITLIST" | "EXPIRED";

interface Application {
  id: string;
  applicationId: string;
  name: string;
  age: number;
  telegram: string;
  contact: string;
  wishes: string | null;
  allergies: string | null;
  foodWishes: string | null;
  status: ApplicationStatus;
  isWaitlist: boolean;
  reservedUntil: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    confirmedAt: string | null;
    notes: string | null;
  }>;
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: "Новая",
  UNDER_REVIEW: "На рассмотрении",
  APPROVED: "Одобрена",
  REJECTED: "Отклонена",
  PAYMENT_PENDING: "Ожидается оплата",
  PAID: "Оплачено",
  CANCELLED: "Отменено",
  REFUND_PENDING: "Ожидается возврат",
  REFUNDED: "Возвращено",
  WAITLIST: "Лист ожидания",
  EXPIRED: "Резерв истёк",
};

const ALL_STATUSES: ApplicationStatus[] = [
  "NEW", "UNDER_REVIEW", "APPROVED", "REJECTED",
  "PAYMENT_PENDING", "PAID", "CANCELLED",
  "REFUND_PENDING", "REFUNDED", "WAITLIST", "EXPIRED"
];

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [spotsLeft, setSpotsLeft] = useState(15);
  const [maxSpots, setMaxSpots] = useState(15);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [chatId, setChatId] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "ALL") params.set("status", filterStatus);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/applications?${params}`);
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setApplications(data.applications || []);
      setTotal(data.total || 0);
      setPaidCount(data.paidCount || 0);
      setSpotsLeft(data.spotsLeft ?? 15);
      setMaxSpots(data.maxSpots || 15);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, [filterStatus, search]);

  const handleAction = async (appId: string, action: string) => {
    setActionLoading(true);
    setActionMsg("");
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNotes: notes, participantChatId: chatId || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg("❌ " + (data.error || "Ошибка"));
      } else {
        setActionMsg("✅ Выполнено");
        if (selectedApp) {
          setSelectedApp(data.application ? { ...selectedApp, ...data.application } : null);
        }
        fetchApplications();
      }
    } catch {
      setActionMsg("❌ Ошибка соединения");
    }
    setActionLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  };

  const timeLeft = (reservedUntil: string | null) => {
    if (!reservedUntil) return null;
    const diff = new Date(reservedUntil).getTime() - Date.now();
    if (diff <= 0) return "Истёк";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}ч ${m}м`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#F5F0E8" }}>
      {/* Header */}
      <div
        style={{
          background: "#161616",
          borderBottom: "1px solid #2a2a2a",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem" }}>
            LAST NIGHT OF THE YEAR GIRLS
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", color: "#888", letterSpacing: "0.15em" }}>
            АДМИНИСТРАТИВНАЯ ПАНЕЛЬ
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent", border: "1px solid #444", color: "#888",
            padding: "0.4rem 1rem", fontSize: "0.8rem", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em"
          }}
        >
          Выйти
        </button>
      </div>

      <div style={{ display: "flex", gap: 0 }}>
        {/* Sidebar / Stats */}
        <div
          style={{
            width: "260px",
            minWidth: "260px",
            background: "#161616",
            borderRight: "1px solid #2a2a2a",
            padding: "1.5rem",
            minHeight: "calc(100vh - 65px)"
          }}
        >
          {/* Stats cards */}
          <div className="space-y-3">
            <div className="admin-card text-center">
              <div style={{ fontSize: "2rem", fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#C41E3A" }}>
                {paidCount}/{maxSpots}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em" }}>МЕСТ ЗАНЯТО</div>
            </div>

            <div className="admin-card text-center">
              <div style={{ fontSize: "2rem", fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#7ee39c" }}>
                {spotsLeft}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em" }}>СВОБОДНО</div>
            </div>

            <div className="admin-card text-center">
              <div style={{ fontSize: "1.6rem", fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#C9A96E" }}>
                {totalRevenue.toLocaleString("ru")} ₽
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em" }}>ПОЛУЧЕНО</div>
            </div>

            <div className="admin-card text-center">
              <div style={{ fontSize: "2rem", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                {total}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em" }}>ВСЕГО ЗАЯВОК</div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ marginTop: "2rem" }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#555", marginBottom: "0.75rem" }}>
              ФИЛЬТР ПО СТАТУСУ
            </div>
            <button
              onClick={() => setFilterStatus("ALL")}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "0.5rem 0.75rem", marginBottom: "0.25rem",
                background: filterStatus === "ALL" ? "rgba(196,30,58,0.15)" : "transparent",
                border: filterStatus === "ALL" ? "1px solid rgba(196,30,58,0.4)" : "1px solid transparent",
                color: filterStatus === "ALL" ? "#F5F0E8" : "#888",
                fontSize: "0.85rem", cursor: "pointer",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Все заявки
            </button>
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "0.4rem 0.75rem", marginBottom: "0.2rem",
                  background: filterStatus === s ? "rgba(196,30,58,0.15)" : "transparent",
                  border: filterStatus === s ? "1px solid rgba(196,30,58,0.4)" : "1px solid transparent",
                  color: filterStatus === s ? "#F5F0E8" : "#666",
                  fontSize: "0.8rem", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "1.5rem", overflow: "auto" }}>
          {/* Search */}
          <div style={{ marginBottom: "1.25rem", display: "flex", gap: "0.75rem" }}>
            <input
              type="text"
              placeholder="Поиск по имени, Telegram или ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a",
                color: "#F5F0E8", padding: "0.6rem 1rem", fontSize: "0.9rem",
                outline: "none", fontFamily: "'Inter', sans-serif"
              }}
            />
            <button
              onClick={fetchApplications}
              style={{
                background: "#C41E3A", border: "none", color: "#F5F0E8",
                padding: "0.6rem 1.2rem", cursor: "pointer", fontSize: "0.85rem",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Обновить
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#555" }}>Загрузка...</div>
          ) : (
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {/* Applications list */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {applications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#555" }}>
                    Заявок не найдено
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => { setSelectedApp(app); setNotes(app.adminNotes || ""); setActionMsg(""); }}
                        style={{
                          background: selectedApp?.id === app.id ? "#1e1010" : "#161616",
                          border: selectedApp?.id === app.id ? "1px solid rgba(196,30,58,0.5)" : "1px solid #2a2a2a",
                          padding: "1rem 1.25rem",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: "0.25rem" }}>
                            {app.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#666", display: "flex", gap: "0.75rem" }}>
                            <span>{app.applicationId}</span>
                            <span>{app.telegram}</span>
                            <span>{app.age} лет</span>
                          </div>
                          {app.reservedUntil && app.status === "PAYMENT_PENDING" && (
                            <div style={{ fontSize: "0.7rem", color: "#C9A96E", marginTop: "0.25rem" }}>
                              ⏰ Резерв: {timeLeft(app.reservedUntil)}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className={`status-badge status-${app.status}`}>
                            {STATUS_LABELS[app.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Application detail panel */}
              {selectedApp && (
                <div
                  style={{
                    width: "360px", minWidth: "360px",
                    background: "#161616", border: "1px solid #2a2a2a",
                    padding: "1.5rem",
                    maxHeight: "calc(100vh - 140px)",
                    overflowY: "auto"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                        {selectedApp.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>{selectedApp.applicationId}</div>
                    </div>
                    <span className={`status-badge status-${selectedApp.status}`}>
                      {STATUS_LABELS[selectedApp.status]}
                    </span>
                  </div>

                  {/* Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {[
                      { label: "Возраст", value: `${selectedApp.age} лет` },
                      { label: "Telegram", value: selectedApp.telegram },
                      { label: "Контакт", value: selectedApp.contact },
                      { label: "Аллергии", value: selectedApp.allergies || "—" },
                      { label: "Пожелания к еде", value: selectedApp.foodWishes || "—" },
                      { label: "Пожелания", value: selectedApp.wishes || "—" },
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#555", marginBottom: "0.2rem" }}>
                          {f.label.toUpperCase()}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#F5F0E8" }}>{f.value}</div>
                      </div>
                    ))}

                    <div>
                      <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#555", marginBottom: "0.2rem" }}>
                        ПОДАНА
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#888" }}>
                        {new Date(selectedApp.createdAt).toLocaleString("ru")}
                      </div>
                    </div>

                    {selectedApp.reservedUntil && (
                      <div>
                        <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#555", marginBottom: "0.2rem" }}>
                          РЕЗЕРВ ДО
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#C9A96E" }}>
                          {new Date(selectedApp.reservedUntil).toLocaleString("ru")} ({timeLeft(selectedApp.reservedUntil)})
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payments */}
                  {selectedApp.payments.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#555", marginBottom: "0.5rem" }}>
                        ПЛАТЕЖИ
                      </div>
                      {selectedApp.payments.map(p => (
                        <div
                          key={p.id}
                          style={{
                            background: "#1a1a1a", padding: "0.75rem",
                            fontSize: "0.85rem", border: "1px solid #2a2a2a",
                            marginBottom: "0.25rem"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{p.amount.toLocaleString("ru")} ₽</span>
                            <span style={{ color: p.status === "CONFIRMED" ? "#7ee39c" : "#888" }}>
                              {p.status === "CONFIRMED" ? "✓ Подтверждён" : p.status === "REFUNDED" ? "↩ Возвращён" : "○ Ожидается"}
                            </span>
                          </div>
                          {p.confirmedAt && (
                            <div style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.2rem" }}>
                              {new Date(p.confirmedAt).toLocaleString("ru")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chat ID input */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#555", marginBottom: "0.35rem" }}>
                      TELEGRAM CHAT ID (для уведомления участницы)
                    </div>
                    <input
                      type="text"
                      placeholder="Числовой ID (напр. 123456789)"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                      style={{
                        width: "100%", background: "#1a1a1a", border: "1px solid #333",
                        color: "#F5F0E8", padding: "0.5rem 0.75rem", fontSize: "0.85rem",
                        outline: "none", fontFamily: "'Inter', sans-serif"
                      }}
                    />
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#555", marginBottom: "0.35rem" }}>
                      ЗАМЕТКИ АДМИНИСТРАТОРА
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%", background: "#1a1a1a", border: "1px solid #333",
                        color: "#F5F0E8", padding: "0.5rem 0.75rem", fontSize: "0.85rem",
                        outline: "none", fontFamily: "'Inter', sans-serif", resize: "vertical"
                      }}
                    />
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {["NEW", "UNDER_REVIEW"].includes(selectedApp.status) && (
                      <>
                        <button
                          onClick={() => handleAction(selectedApp.id, "approve")}
                          disabled={actionLoading}
                          style={{ ...btnStyle, background: "#1a3a1a", border: "1px solid #2a6a2a", color: "#7ee39c" }}
                        >
                          ✓ Одобрить
                        </button>
                        <button
                          onClick={() => handleAction(selectedApp.id, "reject")}
                          disabled={actionLoading}
                          style={{ ...btnStyle, background: "#3a1a1a", border: "1px solid #6a2a2a", color: "#e37e7e" }}
                        >
                          ✕ Отклонить
                        </button>
                      </>
                    )}

                    {selectedApp.status === "APPROVED" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "send_payment")}
                        disabled={actionLoading}
                        style={{ ...btnStyle, background: "#2a1a3a", border: "1px solid #5a2a8a", color: "#c87ee3" }}
                      >
                        💳 Отправить реквизиты
                      </button>
                    )}

                    {selectedApp.status === "PAYMENT_PENDING" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "confirm_payment")}
                        disabled={actionLoading}
                        style={{ ...btnStyle, background: "#0d2b0d", border: "1px solid #16a34a", color: "#4ade80" }}
                      >
                        ✓ Подтвердить оплату
                      </button>
                    )}

                    {selectedApp.status === "PAID" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "refund_pending")}
                        disabled={actionLoading}
                        style={{ ...btnStyle, background: "#2a1a0a", border: "1px solid #8a4a0a", color: "#e3a87e" }}
                      >
                        ↩ Инициировать возврат
                      </button>
                    )}

                    {selectedApp.status === "REFUND_PENDING" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "refund_complete")}
                        disabled={actionLoading}
                        style={{ ...btnStyle, background: "#1a2a3a", border: "1px solid #2a5a8a", color: "#7ea8e3" }}
                      >
                        ✓ Возврат выполнен
                      </button>
                    )}

                    {!["PAID", "CANCELLED", "REJECTED", "REFUNDED"].includes(selectedApp.status) && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "cancel")}
                        disabled={actionLoading}
                        style={{ ...btnStyle, background: "#1a1a1a", border: "1px solid #333", color: "#888" }}
                      >
                        Отменить заявку
                      </button>
                    )}

                    <button
                      onClick={() => handleAction(selectedApp.id, "update_notes")}
                      disabled={actionLoading}
                      style={{ ...btnStyle, background: "#1a1a1a", border: "1px solid #333", color: "#aaa" }}
                    >
                      Сохранить заметки
                    </button>
                  </div>

                  {actionMsg && (
                    <div style={{ marginTop: "0.75rem", padding: "0.5rem", background: "#1a1a1a", fontSize: "0.85rem", textAlign: "center" }}>
                      {actionMsg}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "0.6rem 1rem",
  fontSize: "0.85rem",
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  transition: "opacity 0.2s",
  textAlign: "center",
  width: "100%",
};
