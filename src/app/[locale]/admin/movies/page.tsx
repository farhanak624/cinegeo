"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Plus, X, ToggleLeft, ToggleRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { mockMovies } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Movie, MovieStatus } from "@/lib/types";

const statusColors: Record<MovieStatus, string> = {
  draft: "bg-white/10 text-text-muted",
  enquiry: "badge-enquiry",
  booking_open: "badge-open",
  archived: "bg-white/5 text-text-muted",
};

export default function AdminMoviesPage() {
  const t = useTranslations("admin");
  const { addToast } = useToast();
  const [movies] = useState<Movie[]>(mockMovies);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);

  const handleEnableBooking = (movie: Movie) => {
    if (movie.enquiry_count < movie.enquiry_threshold) {
      setConfirmModal(movie.id);
    } else {
      addToast(`Booking enabled for ${movie.title_en}`, "success");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-h2">{t("movies")}</h1>
        <button onClick={() => setDrawerOpen(true)} className="btn-primary !gap-2">
          <Plus size={16} /> {t("addMovie")}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-bg-elevated">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-label uppercase tracking-widest text-text-muted">
              <th className="px-4 py-3">Movie</th>
              <th className="px-4 py-3">Season</th>
              <th className="px-4 py-3">Enquiries</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-8 overflow-hidden rounded">
                      <Image src={movie.poster_url} alt="" fill className="object-cover" sizes="32px" />
                    </div>
                    <span className="font-medium text-text-primary">{movie.title_en}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{movie.season}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-accent-primary" style={{ width: `${(movie.enquiry_count / movie.enquiry_threshold) * 100}%` }} />
                    </div>
                    <span className="font-mono text-xs text-text-muted">{movie.enquiry_count}/{movie.enquiry_threshold}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("badge", statusColors[movie.status])}>{movie.status}</span>
                </td>
                <td className="px-4 py-3">
                  {movie.status === "enquiry" && (
                    <button onClick={() => handleEnableBooking(movie)}
                      className="flex items-center gap-1 text-xs text-accent-primary hover:text-accent-hover">
                      <ToggleLeft size={16} /> {t("enableBooking")}
                    </button>
                  )}
                  {movie.status === "booking_open" && (
                    <span className="flex items-center gap-1 text-xs text-status-success">
                      <ToggleRight size={16} /> Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Movie Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-bg-surface p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-h3">{t("addMovie")}</h2>
                <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Title (English)</label><input className="input-cinema" /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Title (Georgian)</label><input className="input-cinema" /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Poster URL</label><input className="input-cinema" /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Genre</label><input className="input-cinema" placeholder="Drama, Thriller..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Duration (min)</label><input type="number" className="input-cinema" /></div>
                  <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Rating</label><input type="number" step="0.1" className="input-cinema" /></div>
                </div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Director</label><input className="input-cinema" /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Cast</label><input className="input-cinema" placeholder="Actor 1, Actor 2..." /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Synopsis (EN)</label><textarea className="input-cinema min-h-[100px]" /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Season</label><input className="input-cinema" /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Trailer URL</label><input className="input-cinema" /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Enquiry Threshold</label><input type="number" className="input-cinema" defaultValue={800} /></div>
                <button className="btn-primary w-full">{t("addMovie")}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <Modal isOpen={!!confirmModal} onClose={() => setConfirmModal(null)} title={t("confirmAction")}>
        <p className="mb-4 text-text-secondary">{t("thresholdNotReached")}</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmModal(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { setConfirmModal(null); addToast("Booking enabled", "success"); }} className="btn-primary flex-1">{t("enableBooking")}</button>
        </div>
      </Modal>
    </div>
  );
}
