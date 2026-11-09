"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`w-full px-4 sm:px-6 py-3 sm:py-5 transition-all duration-300 ${
          scrolled
            ? "bg-[#090708]/92 backdrop-blur-md border-b border-[#C8A86B]/15 shadow-2xl"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link
            href="#hero"
            className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap tracking-[0.1em] sm:tracking-[0.2em] uppercase text-[0.65rem] sm:text-sm font-medium text-[#FAF7F2] transition-opacity hover:opacity-85"
          >
            <span>Last Night</span>
            <span className="font-script text-[#C8A86B] text-base sm:text-2xl lowercase font-normal">
              girls
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-[0.78rem] tracking-[0.18em] uppercase text-white/70 font-medium">
            <Link
              href="#lookbook"
              className="px-3.5 py-1.5 rounded-full hover:text-[#E2C889] hover:bg-white/[0.05] transition-all duration-200"
            >
              Атмосфера
            </Link>
            <Link
              href="#manifesto"
              className="px-3.5 py-1.5 rounded-full hover:text-[#E2C889] hover:bg-white/[0.05] transition-all duration-200"
            >
              Дресс-код
            </Link>
            <Link
              href="#timeline"
              className="px-3.5 py-1.5 rounded-full hover:text-[#E2C889] hover:bg-white/[0.05] transition-all duration-200"
            >
              Программа
            </Link>
            <Link
              href="#details"
              className="px-3.5 py-1.5 rounded-full hover:text-[#E2C889] hover:bg-white/[0.05] transition-all duration-200"
            >
              Детали
            </Link>
            <Link
              href="#faq"
              className="px-3.5 py-1.5 rounded-full hover:text-[#E2C889] hover:bg-white/[0.05] transition-all duration-200"
            >
              FAQ
            </Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 text-[0.72rem] tracking-widest uppercase text-[#C8A86B]/80 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#750D1E] animate-pulse" />
              15 мест
            </span>

            <a
              href="#pass"
              className="btn-editorial !py-1.5 !px-2.5 sm:!px-4 !text-[0.6rem] sm:!text-[0.7rem] !tracking-[0.14em] sm:!tracking-widest whitespace-nowrap"
            >
              <span>Подать заявку</span>
              <ArrowRight className="hidden sm:block w-3 h-3 text-[#E2C889]" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/80 hover:text-white p-1"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#C8A86B]/20 bg-[#090708]/98 backdrop-blur-2xl px-6 py-8 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-5 text-xs tracking-[0.22em] uppercase text-white/80">
            <Link
              href="#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E2C889]"
            >
              Атмосфера
            </Link>
            <Link
              href="#manifesto"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E2C889]"
            >
              Дресс-код
            </Link>
            <Link
              href="#timeline"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E2C889]"
            >
              Программа
            </Link>
            <Link
              href="#details"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E2C889]"
            >
              Детали
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#E2C889]"
            >
              FAQ
            </Link>
            <a
              href="#pass"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-editorial w-full justify-center mt-3 text-center"
            >
              Заполнить анкету
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
