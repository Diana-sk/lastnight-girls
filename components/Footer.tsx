import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#C8A86B]/20 py-14 px-6 bg-[#090708]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#FAF7F2]">
            <span>Last Night</span>
            <span className="font-script text-[#C8A86B] text-xl font-normal lowercase">girls</span>
          </div>
          <div className="text-xs text-white/45 mt-1 font-serif">
            Закрытая новогодняя вечеринка · 19 декабря 2026 · Санкт-Петербург
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-wider text-white/55 font-mono">
          <Link href="#lookbook" className="hover:text-[#E2C889] transition-colors">
            Атмосфера
          </Link>
          <Link href="#manifesto" className="hover:text-[#E2C889] transition-colors">
            Дресс-код
          </Link>
          <Link href="#timeline" className="hover:text-[#E2C889] transition-colors">
            Программа
          </Link>
          <Link href="#details" className="hover:text-[#E2C889] transition-colors">
            Детали
          </Link>
          <Link href="#faq" className="hover:text-[#E2C889] transition-colors">
            FAQ
          </Link>
          <Link href="/admin" className="text-white/25 hover:text-[#C8A86B] transition-colors">
            Организаторам
          </Link>
        </div>
      </div>
    </footer>
  );
}
