"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Download, QrCode, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  confirmed: "bg-status-success/20 text-green-400",
  pending: "bg-status-warning/20 text-amber-400",
  cancelled: "bg-accent-muted text-accent-primary",
  refunded: "bg-white/10 text-text-muted",
};

interface Props {
  initialBookings: any[];
}

export default function AdminBookingsClient({ initialBookings }: Props) {
  const t = useTranslations("admin");
  const { addToast } = useToast();
  const supabase = createClient();
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkInMode, setCheckInMode] = useState(false);

  const filtered = bookings.filter((b: any) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (b.user_email || "").toLowerCase().includes(q) || (b.id || "").toLowerCase().includes(q);
    }
    return true;
  });

  const handleCancel = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      addToast(`Error: ${error.message}`, "error");
    } else {
      setBookings((prev: any[]) => prev.map((b: any) => b.id === id ? { ...b, status: "cancelled" } : b));
      addToast("Booking cancelled", "warning");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-h2">{t("bookings")}</h1>
        <div className="flex gap-3">
          <button onClick={() => setCheckInMode(!checkInMode)}
            className={cn("btn-secondary !gap-2 text-sm", checkInMode && "!border-accent-primary !text-accent-primary")}>
            <QrCode size={16} /> {t("checkIn")}
          </button>
          <button className="btn-secondary !gap-2 text-sm"><Download size={16} /> {t("exportCsv")}</button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or ID..." className="input-cinema !rounded-pill !py-2 !pl-9 text-sm" />
        </div>
        {["all", "confirmed", "pending", "cancelled"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn("rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all",
              statusFilter === s ? "bg-accent-primary text-white" : "bg-bg-elevated text-text-muted")}>
            {s}
          </button>
        ))}
      </div>

      {checkInMode && (
        <div className="mb-6 rounded-xl border border-accent-primary/30 bg-accent-muted p-4">
          <p className="mb-2 text-sm font-semibold text-accent-primary">QR Check-in Mode Active</p>
          <input type="text" placeholder="Scan or type booking QR code..." className="input-cinema" autoFocus />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-bg-elevated">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-label uppercase tracking-widest text-text-muted">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Movie</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No bookings found.</td></tr>
            ) : (
              filtered.map((b: any) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{b.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-text-primary">{b.user_email || "—"}</td>
                  <td className="px-4 py-3 text-text-secondary">{b.screening?.movie?.title_en || "—"}</td>
                  <td className="px-4 py-3 font-mono text-text-primary">₾{b.total_amount || 0}</td>
                  <td className="px-4 py-3"><span className={cn("badge", statusBadge[b.status] || "")}>{b.status}</span></td>
                  <td className="px-4 py-3">
                    {b.status === "confirmed" && (
                      <button onClick={() => handleCancel(b.id)} className="text-xs text-accent-primary hover:underline">
                        <XCircle size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
