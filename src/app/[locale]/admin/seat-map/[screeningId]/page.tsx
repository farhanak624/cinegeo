"use client";

import { use, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Eye, UserPlus, Ban } from "lucide-react";
import SeatMap from "@/components/booking/SeatMap";
import { generateMockSeats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Seat } from "@/lib/types";

type AdminMode = "view" | "prebook" | "block";

export default function AdminSeatMapPage({ params }: { params: Promise<{ screeningId: string }> }) {
  const { screeningId } = use(params);
  const t = useTranslations("admin");
  const [mode, setMode] = useState<AdminMode>("view");
  const [seats, setSeats] = useState(() => generateMockSeats(screeningId || "s1"));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const stats = useMemo(() => {
    const s = { total: 0, available: 0, held: 0, booked: 0, blocked: 0 };
    seats.forEach((seat) => {
      if (seat.type === "empty") return;
      s.total++;
      if (seat.status === "available") s.available++;
      else if (seat.status === "held") s.held++;
      else if (seat.status === "booked") s.booked++;
      else if (seat.status === "blocked") s.blocked++;
    });
    return s;
  }, [seats]);

  const handleSeatClick = (seat: Seat) => {
    if (mode === "view") return;
    if (mode === "block") {
      setSeats((prev) => prev.map((s) => s.id === seat.id ? { ...s, status: s.status === "blocked" ? "available" : "blocked" } : s));
      return;
    }
    // Prebook mode
    setSelectedIds((prev) => prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]);
  };

  const modes: { key: AdminMode; icon: typeof Eye; label: string }[] = [
    { key: "view", icon: Eye, label: t("viewMode") },
    { key: "prebook", icon: UserPlus, label: t("preBookMode") },
    { key: "block", icon: Ban, label: t("blockMode") },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-h2">{t("seatMap")}</h1>

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-5 gap-3">
        {[
          { label: t("totalSeats"), value: stats.total, color: "text-text-primary" },
          { label: t("availableSeats"), value: stats.available, color: "text-green-400" },
          { label: t("heldSeats"), value: stats.held, color: "text-amber-400" },
          { label: t("bookedSeats"), value: stats.booked, color: "text-accent-primary" },
          { label: t("blockedSeats"), value: stats.blocked, color: "text-purple-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg border border-white/10 bg-bg-elevated p-4 text-center">
            <p className={cn("font-mono text-2xl font-bold", color)}>{value}</p>
            <p className="mt-1 text-label uppercase tracking-widest text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="mb-6 flex gap-2">
        {modes.map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => { setMode(key); setSelectedIds([]); }}
            className={cn("flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              mode === key ? "bg-accent-primary text-white" : "bg-bg-elevated text-text-secondary hover:text-text-primary"
            )}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Seat Map */}
      <div className="rounded-xl border border-white/10 bg-bg-elevated p-8">
        <SeatMap seats={seats} selectedSeatIds={selectedIds} onSeatClick={handleSeatClick} adminMode={mode} />
      </div>

      {/* Pre-book Drawer (when seats selected in prebook mode) */}
      {mode === "prebook" && selectedIds.length > 0 && (
        <div className="mt-6 rounded-xl border border-white/10 bg-bg-elevated p-6">
          <h3 className="mb-4 font-heading text-h3">Pre-book {selectedIds.length} seat(s)</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">{t("guestName")}</label><input className="input-cinema" /></div>
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">{t("guestEmail")}</label><input className="input-cinema" /></div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" className="accent-accent-primary" /> {t("markPaid")}
            </label>
            <button className="btn-secondary text-sm">{t("sendPaymentLink")}</button>
          </div>
          <button className="btn-primary mt-4">{t("preBookMode")}</button>
        </div>
      )}
    </div>
  );
}
