"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Plus, X, ToggleLeft, ToggleRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Movie, MovieStatus } from "@/lib/types";

const statusColors: Record<MovieStatus, string> = {
  draft: "bg-white/10 text-text-muted",
  enquiry: "badge-enquiry",
  booking_open: "badge-open",
  archived: "bg-white/5 text-text-muted",
};

interface Props {
  initialMovies: Movie[];
}

export default function AdminMoviesClient({ initialMovies }: Props) {
  const t = useTranslations("admin");
  const { addToast } = useToast();
  const supabase = createClient();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title_en: "", title_ka: "", poster_url: "", genre: "",
    duration_min: "", rating: "", director: "", cast: "",
    synopsis_en: "", synopsis_ka: "", season: "", trailer_url: "",
    enquiry_threshold: "800",
  });

  const handleAddMovie = async () => {
    const { data, error } = await supabase.from("movies").insert({
      title_en: form.title_en,
      title_ka: form.title_ka || null,
      poster_url: form.poster_url || null,
      genre: form.genre.split(",").map((g) => g.trim()).filter(Boolean),
      duration_min: parseInt(form.duration_min) || null,
      rating: parseFloat(form.rating) || null,
      director: form.director || null,
      cast: form.cast.split(",").map((c) => c.trim()).filter(Boolean),
      synopsis_en: form.synopsis_en || null,
      synopsis_ka: form.synopsis_ka || null,
      season: form.season || null,
      trailer_url: form.trailer_url || null,
      enquiry_threshold: parseInt(form.enquiry_threshold) || 800,
      status: "enquiry" as MovieStatus,
    }).select().single();

    if (error) {
      addToast(`Error: ${error.message}`, "error");
    } else if (data) {
      setMovies((prev) => [data as Movie, ...prev]);
      setDrawerOpen(false);
      setForm({ title_en: "", title_ka: "", poster_url: "", genre: "", duration_min: "", rating: "", director: "", cast: "", synopsis_en: "", synopsis_ka: "", season: "", trailer_url: "", enquiry_threshold: "800" });
      addToast("Movie added!", "success");
    }
  };

  const handleEnableBooking = async (movie: Movie) => {
    if (movie.enquiry_count < movie.enquiry_threshold) {
      setConfirmModal(movie.id);
      return;
    }
    await enableBooking(movie.id);
  };

  const enableBooking = async (movieId: string) => {
    const { error } = await supabase
      .from("movies")
      .update({ status: "booking_open" })
      .eq("id", movieId);

    if (error) {
      addToast(`Error: ${error.message}`, "error");
    } else {
      setMovies((prev) => prev.map((m) => m.id === movieId ? { ...m, status: "booking_open" as MovieStatus } : m));
      addToast("Booking enabled!", "success");
    }
    setConfirmModal(null);
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
            {movies.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No movies yet. Click &quot;Add Movie&quot; to get started.</td></tr>
            ) : (
              movies.map((movie) => (
                <tr key={movie.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-8 overflow-hidden rounded">
                        {movie.poster_url ? (
                          <Image src={movie.poster_url} alt="" fill className="object-cover" sizes="32px" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-bg-surface text-[8px] text-text-muted">N/A</div>
                        )}
                      </div>
                      <span className="font-medium text-text-primary">{movie.title_en}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{movie.season || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-accent-primary" style={{ width: `${Math.min((movie.enquiry_count / movie.enquiry_threshold) * 100, 100)}%` }} />
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
              ))
            )}
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
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Title (English) *</label><input className="input-cinema" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Title (Georgian)</label><input className="input-cinema" value={form.title_ka} onChange={(e) => setForm({ ...form, title_ka: e.target.value })} /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Poster URL</label><input className="input-cinema" value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Genre</label><input className="input-cinema" placeholder="Drama, Thriller..." value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Duration (min)</label><input type="number" className="input-cinema" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: e.target.value })} /></div>
                  <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Rating</label><input type="number" step="0.1" className="input-cinema" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
                </div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Director</label><input className="input-cinema" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Cast</label><input className="input-cinema" placeholder="Actor 1, Actor 2..." value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Synopsis (EN)</label><textarea className="input-cinema min-h-[100px]" value={form.synopsis_en} onChange={(e) => setForm({ ...form, synopsis_en: e.target.value })} /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Season</label><input className="input-cinema" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Trailer URL</label><input className="input-cinema" value={form.trailer_url} onChange={(e) => setForm({ ...form, trailer_url: e.target.value })} /></div>
                <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Enquiry Threshold</label><input type="number" className="input-cinema" value={form.enquiry_threshold} onChange={(e) => setForm({ ...form, enquiry_threshold: e.target.value })} /></div>
                <button onClick={handleAddMovie} disabled={!form.title_en} className="btn-primary w-full disabled:opacity-50">{t("addMovie")}</button>
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
          <button onClick={() => confirmModal && enableBooking(confirmModal)} className="btn-primary flex-1">{t("enableBooking")}</button>
        </div>
      </Modal>
    </div>
  );
}
