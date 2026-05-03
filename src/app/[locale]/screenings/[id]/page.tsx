"use client";

import { use, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { X, ChevronRight, AlertCircle } from "lucide-react";
import SeatMap from "@/components/booking/SeatMap";
import CountdownTimer from "@/components/booking/CountdownTimer";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useBookingStore } from "@/store/booking";
import { mockScreenings, generateMockSeats } from "@/lib/mock-data";
import { getLocalizedTitle } from "@/lib/types";
import { formatDate, formatTime, formatCurrency, cn } from "@/lib/utils";
import type { Seat } from "@/lib/types";

export default function SeatSelectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations("seats");
  const router = useRouter();
  const { addToast } = useToast();

  const screening = mockScreenings.find((s) => s.id === id) || mockScreenings[0];
  const movie = screening.movie!;
  const title = getLocalizedTitle(movie, locale);

  const [seats] = useState(() => generateMockSeats(screening.id));
  const [expiredModal, setExpiredModal] = useState(false);

  const { selectedSeats, addSeat, removeSeat, holdExpiresAt, total } = useBookingStore();
  const selectedIds = selectedSeats.map((s) => s.seat_id);

  const handleSeatClick = useCallback((seat: Seat) => {
    if (selectedIds.includes(seat.id)) {
      removeSeat(seat.id);
      return;
    }
    if (seat.status !== "available") {
      addToast(t("seatTaken"), "warning");
      return;
    }
    addSeat({ seat_id: seat.id, row: seat.row, number: seat.number, type: seat.type, price: seat.price });
  }, [selectedIds, removeSeat, addSeat, addToast, t]);

  const handleExpired = useCallback(() => {
    setExpiredModal(true);
    useBookingStore.getState().clearSeats();
  }, []);

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="container-cinema py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Panel — Summary */}
          <div className="w-full lg:sticky lg:top-24 lg:w-80 lg:self-start">
            <div className="rounded-xl border border-white/10 bg-bg-surface p-6">
              {/* Movie Info */}
              <div className="flex gap-4">
                <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image src={movie.poster_url} alt={title} fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <h2 className="font-heading text-h3 leading-tight">{title}</h2>
                  <p className="mt-1 text-xs text-text-muted">{formatDate(screening.starts_at, locale)}</p>
                  <p className="font-mono text-sm text-text-secondary">{formatTime(screening.starts_at, locale)}</p>
                  <p className="text-xs text-text-muted">{screening.theater?.name}</p>
                </div>
              </div>

              {/* Timer */}
              {holdExpiresAt && (
                <div className="mt-6 flex flex-col items-center border-t border-white/5 pt-4">
                  <p className="mb-2 text-label uppercase tracking-widest text-text-muted">{t("timeRemaining")}</p>
                  <CountdownTimer expiresAt={holdExpiresAt} onExpired={handleExpired} />
                </div>
              )}

              {/* Selected Seats */}
              <div className="mt-6 border-t border-white/5 pt-4">
                <h3 className="mb-3 text-label uppercase tracking-widest text-text-muted">{t("selected")}</h3>
                {selectedSeats.length === 0 ? (
                  <p className="text-sm text-text-muted">{t("noSeatsSelected")}</p>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {selectedSeats.map((s) => (
                        <motion.div
                          key={s.seat_id}
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -20, scale: 0.9 }}
                          transition={{ type: "spring", duration: 0.35 }}
                          className="flex items-center justify-between rounded-md bg-bg-elevated px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-text-secondary">
                              {t("row")} {s.row} · {t("seat")} {s.number}
                            </span>
                            {s.type === "vip" && <span className="badge-vip !py-0 !text-[0.55rem]">VIP</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-accent-primary">₾{s.price}</span>
                            <button onClick={() => removeSeat(s.seat_id)} className="text-text-muted hover:text-accent-primary">
                              <X size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Total */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-sm font-semibold text-text-secondary">{t("total")}</span>
                  <span className="font-mono text-2xl font-bold text-text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button onClick={() => router.back()} className="btn-secondary flex-1 !py-2.5 text-sm">
                  {t("cancel")}
                </button>
                <Link
                  href={selectedSeats.length > 0 ? `/${locale}/booking/confirm` : "#"}
                  className={cn("btn-primary flex-1 !py-2.5 text-sm", selectedSeats.length === 0 && "pointer-events-none opacity-40")}
                >
                  {t("next")} <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Panel — Seat Map */}
          <div className="flex-1">
            <h1 className="mb-6 text-center font-heading text-h2">{t("title")}</h1>
            <SeatMap seats={seats} selectedSeatIds={selectedIds} onSeatClick={handleSeatClick} />
          </div>
        </div>
      </div>

      {/* Expired Modal */}
      <Modal isOpen={expiredModal} onClose={() => setExpiredModal(false)} title={t("holdExpired")}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-accent-primary" />
          <p className="text-text-secondary">{t("holdExpiredDesc")}</p>
          <button onClick={() => setExpiredModal(false)} className="btn-primary">{t("cancel")}</button>
        </div>
      </Modal>
    </div>
  );
}
