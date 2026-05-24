"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, List } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatTime } from "@/lib/utils";
import type { Movie, Screening, Theater } from "@/lib/types";

interface Props {
  initialScreenings: Screening[];
  movies: Movie[];
  theaters: Theater[];
}

export default function AdminScreeningsClient({ initialScreenings, movies, theaters }: Props) {
  const t = useTranslations("admin");
  const { addToast } = useToast();
  const supabase = createClient();
  const [screenings, setScreenings] = useState(initialScreenings);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    movie_id: "",
    theater_id: "",
    starts_at: "",
    booking_opens_at: "",
    booking_closes_at: "",
  });

  const handleCreate = async () => {
    if (!form.movie_id || !form.theater_id || !form.starts_at) {
      addToast("Please fill all required fields", "warning");
      return;
    }

    const { data, error } = await supabase.from("screenings").insert({
      movie_id: form.movie_id,
      theater_id: form.theater_id,
      starts_at: new Date(form.starts_at).toISOString(),
      booking_opens_at: form.booking_opens_at ? new Date(form.booking_opens_at).toISOString() : null,
      booking_closes_at: form.booking_closes_at ? new Date(form.booking_closes_at).toISOString() : null,
      status: "active",
    }).select("*, movie:movies(*), theater:theaters(*)").single();

    if (error) {
      addToast(`Error: ${error.message}`, "error");
    } else if (data) {
      setScreenings((prev) => [...prev, data as Screening]);
      setModalOpen(false);
      setForm({ movie_id: "", theater_id: "", starts_at: "", booking_opens_at: "", booking_closes_at: "" });
      addToast("Screening created!", "success");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-h2">{t("screenings")}</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary !gap-2"><Plus size={16} /> {t("createScreening")}</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-bg-elevated">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-label uppercase tracking-widest text-text-muted">
              <th className="px-4 py-3">Movie</th>
              <th className="px-4 py-3">Theater</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {screenings.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No screenings yet.</td></tr>
            ) : (
              screenings.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-text-primary">{s.movie?.title_en || "—"}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.theater?.name || "—"}</td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(s.starts_at)}</td>
                  <td className="px-4 py-3 font-mono text-text-primary">{formatTime(s.starts_at)}</td>
                  <td className="px-4 py-3"><span className="badge badge-open">{s.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t("createScreening")} size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Movie *</label>
            <select className="input-cinema" value={form.movie_id} onChange={(e) => setForm({ ...form, movie_id: e.target.value })}>
              <option value="">Select a movie...</option>
              {movies.filter((m) => m.status === "booking_open").map((m) => (
                <option key={m.id} value={m.id}>{m.title_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Theater *</label>
            <select className="input-cinema" value={form.theater_id} onChange={(e) => setForm({ ...form, theater_id: e.target.value })}>
              <option value="">Select a theater...</option>
              {theaters.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Date & Time *</label>
            <input type="datetime-local" className="input-cinema" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Booking Opens</label><input type="datetime-local" className="input-cinema" value={form.booking_opens_at} onChange={(e) => setForm({ ...form, booking_opens_at: e.target.value })} /></div>
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Booking Closes</label><input type="datetime-local" className="input-cinema" value={form.booking_closes_at} onChange={(e) => setForm({ ...form, booking_closes_at: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleCreate} className="btn-primary flex-1">{t("createScreening")}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
