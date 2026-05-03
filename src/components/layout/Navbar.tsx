"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Menu, X, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/movies`, label: t("movies") },
    { href: `/${locale}/booking`, label: t("myBookings") },
  ];

  const otherLocale = locale === "en" ? "ka" : "en";
  const localizedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <motion.header
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      className={cn(
        "fixed left-0 right-0 top-0 z-40 h-[72px] transition-all duration-base ease-cinema",
        scrolled
          ? "glass border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="container-cinema flex h-full items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Film className="h-6 w-6 text-accent-primary" />
          <span className="font-display text-[1.8rem] leading-none tracking-wider text-accent-primary">
            CINEGEO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-base",
                pathname === link.href
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <Link
            href={localizedPath}
            className="flex items-center gap-1.5 rounded-pill border border-white/10 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary"
          >
            <Globe size={14} />
            <span>{locale === "en" ? "ქარ" : "ENG"}</span>
          </Link>

          {/* Auth Button */}
          <Link
            href={`/${locale}/auth`}
            className="btn-primary hidden !px-5 !py-2 md:inline-flex"
          >
            {t("login")}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-text-primary md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass absolute left-0 right-0 top-[72px] border-b border-white/5 p-6 md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-base font-medium transition-colors",
                  pathname === link.href
                    ? "text-text-primary"
                    : "text-text-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/auth`}
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2 w-full text-center"
            >
              {t("login")}
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
