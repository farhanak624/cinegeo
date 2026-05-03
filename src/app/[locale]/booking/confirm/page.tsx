"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CreditCard, Building2, CheckCircle } from "lucide-react";
import CountdownTimer from "@/components/booking/CountdownTimer";
import { useBookingStore } from "@/store/booking";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, cn } from "@/lib/utils";

const steps = ["chooseSeats", "payment", "ticket"] as const;

export default function BookingConfirmPage() {
  const locale = useLocale();
  const t = useTranslations("booking");
  const router = useRouter();
  const { addToast } = useToast();
  const [processing, setProcessing] = useState(false);

  const { selectedSeats, total, holdExpiresAt, screening } = useBookingStore();
  const currentStep = 1; // Payment step

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    // Navigate to ticket
    router.push(`/${locale}/booking/mock-booking-id/ticket`);
  };

  const handleBankPay = () => {
    addToast(t("bankComingSoon"), "info");
  };

  return (
    <div className="min-h-screen bg-bg-base py-8">
      <div className="container-cinema max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-10 flex items-center justify-center gap-4">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                i < currentStep ? "bg-accent-primary text-white" :
                i === currentStep ? "border-2 border-accent-primary bg-accent-muted text-accent-primary" :
                "border border-white/20 text-text-muted"
              )}>
                {i < currentStep ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={cn("hidden text-sm font-medium sm:block",
                i <= currentStep ? "text-text-primary" : "text-text-muted"
              )}>{t(step)}</span>
              {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-white/10 bg-bg-surface p-6"
          >
            <h2 className="mb-4 font-heading text-h3">{t("orderSummary")}</h2>

            {screening && (
              <div className="mb-4 text-sm text-text-secondary">
                <p className="font-semibold text-text-primary">{screening.movie?.title_en}</p>
                <p>{screening.theater?.name}</p>
              </div>
            )}

            <div className="space-y-2 border-t border-white/5 pt-4">
              {selectedSeats.map((s) => (
                <div key={s.seat_id} className="flex justify-between text-sm">
                  <span className="text-text-secondary">Row {s.row} · Seat {s.number} {s.type === "vip" ? "(VIP)" : ""}</span>
                  <span className="font-mono text-text-primary">₾{s.price}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/5 pt-3 text-lg font-bold">
                <span>{t("orderSummary")}</span>
                <span className="font-mono text-accent-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            {holdExpiresAt && (
              <div className="mt-6 flex justify-center">
                <CountdownTimer expiresAt={holdExpiresAt} onExpired={() => router.push(`/${locale}`)} size={64} />
              </div>
            )}
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-bg-surface p-6"
          >
            <h2 className="mb-4 font-heading text-h3">{t("payment")}</h2>

            {/* Stripe-styled mock form */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Card Number</label>
                <input type="text" placeholder="4242 4242 4242 4242" className="input-cinema font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="input-cinema font-mono" />
                </div>
                <div>
                  <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">CVC</label>
                  <input type="text" placeholder="123" className="input-cinema font-mono" />
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing || selectedSeats.length === 0}
              className="btn-primary mt-6 w-full !gap-2 disabled:opacity-50"
            >
              <CreditCard size={16} />
              {processing ? t("processing") : `${t("payNow")} — ${formatCurrency(total)}`}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-text-muted">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Georgian Bank Pay (placeholder) */}
            <button onClick={handleBankPay} className="btn-secondary w-full !gap-2">
              <Building2 size={16} />
              {t("payWithBank")}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
