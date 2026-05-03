"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, QrCode } from "lucide-react";
import { mockMovies, mockScreenings } from "@/lib/mock-data";

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("booking");

  const screening = mockScreenings[0];
  const movie = mockMovies[0];

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="w-full max-w-sm"
      >
        {/* Ticket Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg-surface shadow-card">
          {/* Movie Poster Top */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image src={movie.poster_url} alt={movie.title_en} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-surface to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h2 className="font-display text-2xl uppercase tracking-wider">{movie.title_en}</h2>
            </div>
          </div>

          {/* Perforation Line */}
          <div className="relative h-8">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/10" />
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-bg-base" />
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-bg-base" />
          </div>

          {/* Details */}
          <div className="px-6 pb-6">
            {/* QR Code area */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-white p-3">
                <QrCode className="h-full w-full text-bg-base" />
              </div>
            </div>

            <p className="mb-4 text-center text-xs text-text-muted">{t("scanQr")}</p>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-label uppercase tracking-widest text-text-muted">{t("date")}</p>
                <p className="mt-1 font-mono text-sm text-text-primary">May 10, 2026</p>
              </div>
              <div>
                <p className="text-label uppercase tracking-widest text-text-muted">{t("time")}</p>
                <p className="mt-1 font-mono text-sm text-text-primary">19:00</p>
              </div>
              <div>
                <p className="text-label uppercase tracking-widest text-text-muted">{t("theater")}</p>
                <p className="mt-1 text-sm text-text-primary">CineGeo Rustaveli</p>
              </div>
              <div>
                <p className="text-label uppercase tracking-widest text-text-muted">{t("seatsList")}</p>
                <p className="mt-1 font-mono text-sm text-text-primary">E7, E8</p>
              </div>
            </div>

            {/* Booking ID */}
            <div className="mt-4 rounded-md bg-bg-elevated px-3 py-2 text-center">
              <p className="text-label uppercase tracking-widest text-text-muted">{t("bookingId")}</p>
              <p className="font-mono text-xs text-text-secondary">{id}</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button className="btn-primary mt-6 w-full !gap-2">
          <Download size={16} />
          {t("downloadPdf")}
        </button>
      </motion.div>
    </div>
  );
}
