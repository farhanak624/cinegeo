"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { Seat, SeatStatus, SeatType } from "@/lib/types";

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSeatClick: (seat: Seat) => void;
  adminMode?: "view" | "prebook" | "block";
  disabled?: boolean;
}

const statusColors: Record<SeatStatus, string> = {
  available: "bg-seat-available hover:bg-seat-available-hover hover:shadow-seat-hover cursor-pointer",
  held: "bg-seat-held cursor-not-allowed opacity-70",
  booked: "bg-seat-booked cursor-not-allowed opacity-50",
  blocked: "bg-[#4a1a4a] cursor-not-allowed opacity-40",
};

export default function SeatMap({ seats, selectedSeatIds, onSeatClick, adminMode, disabled }: SeatMapProps) {
  const t = useTranslations("seats");
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  // Group seats by row
  const rows = new Map<string, Seat[]>();
  seats.forEach((seat) => {
    const rowSeats = rows.get(seat.row) || [];
    rowSeats.push(seat);
    rows.set(seat.row, rowSeats);
  });

  // Sort rows and seats within rows
  const sortedRows = Array.from(rows.entries()).sort(([a], [b]) => a.localeCompare(b));
  sortedRows.forEach(([, rowSeats]) => rowSeats.sort((a, b) => a.number - b.number));

  const getSeatClass = (seat: Seat) => {
    if (selectedSeatIds.includes(seat.id)) {
      return "bg-seat-selected shadow-seat-hover animate-seat-pop cursor-pointer";
    }
    if (seat.type === "vip" && seat.status === "available") {
      return "bg-vip-gold/30 border border-vip-gold/50 hover:bg-vip-gold/50 hover:shadow-glow-gold cursor-pointer";
    }
    if (seat.type === "empty") return "invisible";
    return statusColors[seat.status] || statusColors.available;
  };

  const canClick = (seat: Seat) => {
    if (disabled) return false;
    if (adminMode === "block") return seat.status !== "booked";
    if (adminMode === "prebook") return seat.status === "available" || seat.status === "held";
    return seat.status === "available" || selectedSeatIds.includes(seat.id);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Screen */}
      <div className="w-full max-w-md">
        <div className="screen-glow mx-auto h-1.5 w-3/4 rounded-full" />
        <p className="mt-3 text-center text-label tracking-[0.2em] text-text-muted">
          {t("screen")}
        </p>
      </div>

      {/* Seats Grid */}
      <div className="relative overflow-x-auto pb-4">
        <div className="flex flex-col items-center gap-[clamp(3px,0.4vw,5px)]">
          {sortedRows.map(([rowLabel, rowSeats]) => (
            <div key={rowLabel} className="flex items-center gap-[clamp(3px,0.4vw,5px)]">
              {/* Row label */}
              <span className="w-6 text-right font-mono text-xs text-text-muted">
                {rowLabel}
              </span>

              {/* Seats */}
              {rowSeats.map((seat) => (
                <motion.button
                  key={seat.id}
                  whileTap={canClick(seat) ? { scale: 0.9 } : undefined}
                  onClick={() => canClick(seat) && onSeatClick(seat)}
                  onMouseEnter={() => setHoveredSeat(seat)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  disabled={!canClick(seat)}
                  className={cn(
                    "relative rounded-sm transition-all duration-fast",
                    "h-[clamp(18px,2.2vw,28px)] w-[clamp(18px,2.2vw,28px)]",
                    getSeatClass(seat)
                  )}
                  title={`${t("row")} ${seat.row} · ${t("seat")} ${seat.number}`}
                >
                  {/* VIP indicator */}
                  {seat.type === "vip" && seat.status === "available" && (
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-vip-gold">
                      V
                    </span>
                  )}
                </motion.button>
              ))}

              {/* Row label right */}
              <span className="w-6 font-mono text-xs text-text-muted">
                {rowLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredSeat && hoveredSeat.type !== "empty" && (
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-bg-elevated px-3 py-1.5 text-xs shadow-card">
            <span className="text-text-secondary">
              {t("row")} {hoveredSeat.row} · {t("seat")} {hoveredSeat.number}
            </span>
            {hoveredSeat.price > 0 && (
              <span className="ml-2 font-mono text-accent-primary">
                ₾{hoveredSeat.price}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { label: t("available"), color: "bg-seat-available" },
          { label: t("selected"), color: "bg-seat-selected" },
          { label: t("held"), color: "bg-seat-held" },
          { label: t("booked"), color: "bg-seat-booked" },
          { label: t("vip"), color: "bg-vip-gold/40 border border-vip-gold/50" },
          ...(adminMode ? [{ label: t("blocked"), color: "bg-[#4a1a4a]" }] : []),
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-sm", color)} />
            <span className="text-xs text-text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
