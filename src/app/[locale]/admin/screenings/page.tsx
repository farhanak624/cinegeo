"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Calendar as CalendarIcon, List } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { mockScreenings, mockMovies, mockTheaters } from "@/lib/mock-data";
import { formatDate, formatTime, cn } from "@/lib/utils";

export default function AdminScreeningsPage() {
  const t = useTranslations("admin");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-h2">{t("screenings")}</h1>
        <div className="flex gap-3">
          <div className="flex overflow-hidden rounded-md border border-white/10">
            <button onClick={() => setViewMode("list")} className={cn("px-3 py-1.5 text-xs", viewMode === "list" ? "bg-accent-primary text-white" : "text-text-muted")}><List size={14} /></button>
            <button onClick={() => setViewMode("calendar")} className={cn("px-3 py-1.5 text-xs", viewMode === "calendar" ? "bg-accent-primary text-white" : "text-text-muted")}><CalendarIcon size={14} /></button>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary !gap-2"><Plus size={16} /> {t("createScreening")}</button>
        </div>
      </div>

      {/* List View */}
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
            {mockScreenings.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-text-primary">{s.movie?.title_en}</td>
                <td className="px-4 py-3 text-text-secondary">{s.theater?.name}</td>
                <td className="px-4 py-3 text-text-secondary">{formatDate(s.starts_at)}</td>
                <td className="px-4 py-3 font-mono text-text-primary">{formatTime(s.starts_at)}</td>
                <td className="px-4 py-3"><span className="badge badge-open">{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Screening Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t("createScreening")} size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Movie</label>
            <select className="input-cinema">
              {mockMovies.filter(m => m.status === "booking_open").map(m => (
                <option key={m.id} value={m.id}>{m.title_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Theater</label>
            <select className="input-cinema">
              {mockTheaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Date & Time</label><input type="datetime-local" className="input-cinema" /></div>
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Rows × Columns</label>
              <div className="flex gap-2"><input type="number" placeholder="10" className="input-cinema" /><input type="number" placeholder="14" className="input-cinema" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Booking Opens</label><input type="datetime-local" className="input-cinema" /></div>
            <div><label className="mb-1 block text-label uppercase tracking-widest text-text-muted">Booking Closes</label><input type="datetime-local" className="input-cinema" /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button className="btn-primary flex-1">{t("createScreening")}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
