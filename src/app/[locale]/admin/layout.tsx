"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Film, Calendar, LayoutGrid, Ticket, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "movies", icon: Film, path: "/admin/movies" },
  { key: "screenings", icon: Calendar, path: "/admin/screenings" },
  { key: "seatMap", icon: LayoutGrid, path: "/admin/seat-map" },
  { key: "bookings", icon: Ticket, path: "/admin/bookings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("admin");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-[72px] z-30 flex h-[calc(100vh-72px)] w-56 flex-col border-r border-white/5 bg-[#0f0f0f]">
        <div className="p-4">
          <p className="text-label uppercase tracking-widest text-text-muted">{t("dashboard")}</p>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navItems.map(({ key, icon: Icon, path }) => {
            const fullPath = `/${locale}${path}`;
            const isActive = pathname.startsWith(fullPath);
            return (
              <Link key={key} href={fullPath}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "border-l-2 border-accent-primary bg-accent-muted text-text-primary"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}>
                <Icon size={18} />
                {t(key)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-56 flex-1 bg-bg-surface p-8">
        {children}
      </main>
    </div>
  );
}
