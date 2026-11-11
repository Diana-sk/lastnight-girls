"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Check,
  Clock,
  LogOut,
  RefreshCw,
  CreditCard,
  RotateCcw,
  Ban,
  Save,
} from "lucide-react";

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
  secretChapter: string | null;
  status: ApplicationStatus;
  isWaitlist: boolean;
  reservedUntil: string | null;
  participantChatId: string | null;
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

const actionBtn =
  "flex min-h-[44px] w-full items-center justify-center gap-2 border px-4 py-2.5 text-sm transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-50 font-['Inter',sans-serif]";

const fieldLabel =
  "mb-1 text-[0.68rem] uppercase tracking-[0.15em] text-[#666]";

const inputStyle =
  "w-full min-w-0 border border-[#333] bg-[#1a1a1a] px-3 py-2.5 text-sm text-[#F5F0E8] outline-none transition-colors duration-200 placeholder:text-[#555] focus:border-[#C9A96E] font-['Inter',sans-serif]";

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
  const [actionMsg, setActionMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const fetchApplications = useCallback(async () => {
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
  }, [filterStatus, search, router]);

  // Загрузка при смене фильтра/поиска. Отложенный вызов, чтобы не дергать
  // setState синхронно в теле эффекта; cleanup отменяет устаревший запрос.
  useEffect(() => {
    const t = setTimeout(fetchApplications, 0);
    return () => clearTimeout(t);
  }, [fetchApplications]);

  // Esc закрывает карточку заявки (актуально на мобильных, где это оверлей)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedApp(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleAction = async (appId: string, action: string) => {
    setActionLoading(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNotes: notes, participantChatId: chatId || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg({ text: data.error || "Ошибка", ok: false });
      } else {
        setActionMsg({ text: "Выполнено", ok: true });
        if (selectedApp) {
          setSelectedApp(data.application ? { ...selectedApp, ...data.application } : null);
        }
        fetchApplications();
      }
    } catch {
      setActionMsg({ text: "Ошибка соединения", ok: false });
    }
    setActionLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  };

  const openApp = (app: Application) => {
    setSelectedApp(app);
    setNotes(app.adminNotes || "");
    setChatId(app.participantChatId || "");
    setActionMsg(null);
  };

  // Текущее время: обновляется раз в минуту, таймеры резерва идут без перерендера
  const [now, setNow] = useState(0);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const initial = setTimeout(tick, 0);
    const interval = setInterval(tick, 60000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  const timeLeft = (reservedUntil: string | null) => {
    if (!reservedUntil || !now) return null;
    const diff = new Date(reservedUntil).getTime() - now;
    if (diff <= 0) return "Истёк";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}ч ${m}м`;
  };

  const filterBtnClass = (active: boolean) =>
    [
      "shrink-0 whitespace-nowrap border px-4 py-2.5 text-sm transition-colors duration-200 lg:w-full lg:rounded-none lg:py-2 lg:text-left",
      active
        ? "border-[rgba(196,30,58,0.4)] bg-[rgba(196,30,58,0.15)] text-[#F5F0E8]"
        : "border-transparent text-[#777] hover:text-[#F5F0E8] lg:hover:bg-[#1e1e1e]",
    ].join(" ");

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[#2a2a2a] bg-[#161616]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="min-w-0">
          <div className="truncate font-['Playfair_Display',serif] text-base font-bold md:text-xl">
            LAST NIGHT OF THE YEAR GIRLS
          </div>
          <div className="font-['Cormorant_Garamond',serif] text-[0.7rem] tracking-[0.15em] text-[#888] md:text-xs">
            АДМИНИСТРАТИВНАЯ ПАНЕЛЬ
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex min-h-[40px] shrink-0 items-center gap-2 border border-[#444] px-4 py-2 text-xs tracking-[0.1em] text-[#999] transition-colors duration-200 hover:border-[#C9A96E] hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A96E] font-['Inter',sans-serif]"
        >
          <LogOut size={14} strokeWidth={1.75} />
          Выйти
        </button>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar / Stats */}
        <aside className="w-full border-b border-[#2a2a2a] bg-[#161616] p-4 md:p-6 lg:min-h-[calc(100vh-61px)] lg:w-[260px] lg:min-w-[260px] lg:border-b-0 lg:border-r">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="admin-card p-3.5 text-center md:p-5">
              <div className="font-['Playfair_Display',serif] text-xl font-bold text-[#C41E3A] md:text-3xl">
                {paidCount}/{maxSpots}
              </div>
              <div className="mt-1 text-[0.65rem] tracking-[0.1em] text-[#666] md:text-xs">МЕСТ ЗАНЯТО</div>
            </div>

            <div className="admin-card p-3.5 text-center md:p-5">
              <div className="font-['Playfair_Display',serif] text-xl font-bold text-[#7ee39c] md:text-3xl">
                {spotsLeft}
              </div>
              <div className="mt-1 text-[0.65rem] tracking-[0.1em] text-[#666] md:text-xs">СВОБОДНО</div>
            </div>

            <div className="admin-card p-3.5 text-center md:p-5">
              <div className="font-['Playfair_Display',serif] text-lg font-bold text-[#C9A96E] md:text-2xl">
                {totalRevenue.toLocaleString("ru")} ₽
              </div>
              <div className="mt-1 text-[0.65rem] tracking-[0.1em] text-[#666] md:text-xs">ПОЛУЧЕНО</div>
            </div>

            <div className="admin-card p-3.5 text-center md:p-5">
              <div className="font-['Playfair_Display',serif] text-xl font-bold md:text-3xl">
                {total}
              </div>
              <div className="mt-1 text-[0.65rem] tracking-[0.1em] text-[#666] md:text-xs">ВСЕГО ЗАЯВОК</div>
            </div>
          </div>

          {/* Filters: горизонтальные чипы на мобильных, вертикальный список на десктопе */}
          <div className="mt-6">
            <div className="mb-3 text-[0.7rem] tracking-[0.2em] text-[#555]">
              ФИЛЬТР ПО СТАТУСУ
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
              <button
                onClick={() => setFilterStatus("ALL")}
                className={filterBtnClass(filterStatus === "ALL")}
              >
                Все заявки
              </button>
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={filterBtnClass(filterStatus === s)}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6">
          {/* Search */}
          <div className="mb-5 flex gap-2 md:gap-3">
            <input
              type="text"
              placeholder="Поиск по имени, Telegram или ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputStyle}
            />
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="flex min-h-[44px] shrink-0 items-center gap-2 bg-[#C41E3A] px-4 text-sm text-[#F5F0E8] transition-colors duration-200 hover:bg-[#a81930] disabled:opacity-60 md:px-5 font-['Inter',sans-serif]"
            >
              <RefreshCw size={14} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Обновить</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#555]">Загрузка...</div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Applications list */}
              <div className="min-w-0 flex-1">
                {applications.length === 0 ? (
                  <div className="border border-dashed border-[#2a2a2a] py-16 text-center text-[#555]">
                    Заявок не найдено
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => openApp(app)}
                        className={[
                          "flex cursor-pointer items-center justify-between gap-3 border p-3.5 transition-colors duration-200 md:p-4",
                          selectedApp?.id === app.id
                            ? "border-[rgba(196,30,58,0.5)] bg-[#1e1010]"
                            : "border-[#2a2a2a] bg-[#161616] hover:border-[#3d3d3d] hover:bg-[#1a1a1a]",
                        ].join(" ")}
                      >
                        <div className="min-w-0">
                          <div className="mb-1 truncate font-['Playfair_Display',serif] font-semibold">
                            {app.name}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#666]">
                            <span>{app.applicationId}</span>
                            <span className="truncate">{app.telegram}</span>
                            <span>{app.age} лет</span>
                          </div>
                          {app.reservedUntil && app.status === "PAYMENT_PENDING" && (
                            <div className="mt-1 flex items-center gap-1.5 text-[0.7rem] text-[#C9A96E]">
                              <Clock size={11} strokeWidth={1.75} />
                              Резерв: {timeLeft(app.reservedUntil)}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0">
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
                <section
                  role="dialog"
                  aria-label={`Заявка ${selectedApp.applicationId}`}
                  className="admin-panel-in fixed inset-0 z-50 overflow-y-auto bg-[#161616] p-4 md:p-6 lg:static lg:z-auto lg:max-h-[calc(100vh-140px)] lg:w-[360px] lg:min-w-[360px] lg:self-start lg:border lg:border-[#2a2a2a]"
                >
                  <button
                    onClick={() => setSelectedApp(null)}
                    aria-label="Закрыть карточку заявки"
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center border border-[#333] text-[#888] transition-colors duration-200 hover:border-[#C9A96E] hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A96E] lg:hidden"
                  >
                    <X size={17} strokeWidth={1.75} />
                  </button>

                  <div className="mb-5 flex items-start justify-between gap-3 pr-12 lg:pr-0">
                    <div className="min-w-0">
                      <div className="mb-1 font-['Playfair_Display',serif] text-lg font-bold">
                        {selectedApp.name}
                      </div>
                      <div className="text-xs text-[#666]">{selectedApp.applicationId}</div>
                    </div>
                    <span className={`status-badge shrink-0 status-${selectedApp.status}`}>
                      {STATUS_LABELS[selectedApp.status]}
                    </span>
                  </div>

                  {/* Fields */}
                  <div className="mb-6 flex flex-col gap-3">
                    {[
                      { label: "Возраст", value: `${selectedApp.age} лет` },
                      { label: "Telegram", value: selectedApp.telegram },
                      { label: "Контакт", value: selectedApp.contact },
                      { label: "Аллергии", value: selectedApp.allergies || "—" },
                      { label: "Пожелания к еде", value: selectedApp.foodWishes || "—" },
                      { label: "Секретная глава (00:00–06:00)", value: selectedApp.secretChapter ? ({ yes: "Да", no: "Нет", unsure: "Затрудняется" } as Record<string, string>)[selectedApp.secretChapter] || selectedApp.secretChapter : "—" },
                      { label: "Пожелания", value: selectedApp.wishes || "—" },
                    ].map(f => (
                      <div key={f.label}>
                        <div className={fieldLabel}>{f.label}</div>
                        <div className="break-words text-sm text-[#F5F0E8]">{f.value}</div>
                      </div>
                    ))}

                    <div>
                      <div className={fieldLabel}>Подана</div>
                      <div className="text-sm text-[#888]">
                        {new Date(selectedApp.createdAt).toLocaleString("ru")}
                      </div>
                    </div>

                    {selectedApp.reservedUntil && (
                      <div>
                        <div className={fieldLabel}>Резерв до</div>
                        <div className="text-sm text-[#C9A96E]">
                          {new Date(selectedApp.reservedUntil).toLocaleString("ru")} ({timeLeft(selectedApp.reservedUntil)})
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payments */}
                  {selectedApp.payments.length > 0 && (
                    <div className="mb-6">
                      <div className="mb-2 text-[0.7rem] tracking-[0.2em] text-[#555]">
                        ПЛАТЕЖИ
                      </div>
                      {selectedApp.payments.map(p => (
                        <div
                          key={p.id}
                          className="mb-1 border border-[#2a2a2a] bg-[#1a1a1a] p-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="tabular-nums">{p.amount.toLocaleString("ru")} ₽</span>
                            <span className={p.status === "CONFIRMED" ? "text-[#7ee39c]" : "text-[#888]"}>
                              {p.status === "CONFIRMED" ? "Подтверждён" : p.status === "REFUNDED" ? "Возвращён" : "Ожидается"}
                            </span>
                          </div>
                          {p.confirmedAt && (
                            <div className="mt-1 text-xs text-[#555]">
                              {new Date(p.confirmedAt).toLocaleString("ru")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chat ID input */}
                  <div className="mb-3">
                    <div className={`${fieldLabel} normal-case`}>
                      Telegram Chat ID (для уведомления участницы)
                      {selectedApp.participantChatId && (
                        <span className="text-[#7ee39c]"> — привязан ботом</span>
                      )}
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Числовой ID (напр. 123456789)"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <div className={fieldLabel}>Заметки администратора</div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className={`${inputStyle} resize-y`}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    {["NEW", "UNDER_REVIEW"].includes(selectedApp.status) && (
                      <>
                        <button
                          onClick={() => handleAction(selectedApp.id, "approve")}
                          disabled={actionLoading}
                          className={`${actionBtn} border-[#2a6a2a] bg-[#1a3a1a] text-[#7ee39c]`}
                        >
                          <Check size={15} strokeWidth={2} />
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleAction(selectedApp.id, "reject")}
                          disabled={actionLoading}
                          className={`${actionBtn} border-[#6a2a2a] bg-[#3a1a1a] text-[#e37e7e]`}
                        >
                          <X size={15} strokeWidth={2} />
                          Отклонить
                        </button>
                      </>
                    )}

                    {selectedApp.status === "APPROVED" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "send_payment")}
                        disabled={actionLoading}
                        className={`${actionBtn} border-[#5a2a8a] bg-[#2a1a3a] text-[#c87ee3]`}
                      >
                        <CreditCard size={15} strokeWidth={1.75} />
                        Отправить реквизиты
                      </button>
                    )}

                    {selectedApp.status === "PAYMENT_PENDING" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "confirm_payment")}
                        disabled={actionLoading}
                        className={`${actionBtn} border-[#16a34a] bg-[#0d2b0d] text-[#4ade80]`}
                      >
                        <Check size={15} strokeWidth={2} />
                        Подтвердить оплату
                      </button>
                    )}

                    {selectedApp.status === "PAID" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "refund_pending")}
                        disabled={actionLoading}
                        className={`${actionBtn} border-[#8a4a0a] bg-[#2a1a0a] text-[#e3a87e]`}
                      >
                        <RotateCcw size={15} strokeWidth={1.75} />
                        Инициировать возврат
                      </button>
                    )}

                    {selectedApp.status === "REFUND_PENDING" && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "refund_complete")}
                        disabled={actionLoading}
                        className={`${actionBtn} border-[#2a5a8a] bg-[#1a2a3a] text-[#7ea8e3]`}
                      >
                        <Check size={15} strokeWidth={2} />
                        Возврат выполнен
                      </button>
                    )}

                    {!["PAID", "CANCELLED", "REJECTED", "REFUNDED"].includes(selectedApp.status) && (
                      <button
                        onClick={() => handleAction(selectedApp.id, "cancel")}
                        disabled={actionLoading}
                        className={`${actionBtn} border-[#333] bg-[#1a1a1a] text-[#888] hover:text-[#F5F0E8]`}
                      >
                        <Ban size={15} strokeWidth={1.75} />
                        Отменить заявку
                      </button>
                    )}

                    <button
                      onClick={() => handleAction(selectedApp.id, "update_notes")}
                      disabled={actionLoading}
                      className={`${actionBtn} border-[#333] bg-[#1a1a1a] text-[#aaa] hover:text-[#F5F0E8]`}
                    >
                      <Save size={15} strokeWidth={1.75} />
                      Сохранить заметки
                    </button>
                  </div>

                  {actionMsg && (
                    <div
                      role="status"
                      className={`mt-3 border p-2.5 text-center text-sm ${
                        actionMsg.ok
                          ? "border-[rgba(74,222,128,0.35)] bg-[rgba(74,222,128,0.08)] text-[#4ade80]"
                          : "border-[rgba(196,30,58,0.4)] bg-[rgba(196,30,58,0.1)] text-[#e37e7e]"
                      }`}
                    >
                      {actionMsg.text}
                    </div>
                  )}
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
