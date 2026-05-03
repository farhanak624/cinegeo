"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Download, QrCode, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const mockBookings = [
  { id: "BK-001", user: "Giorgi M.", email: "giorgi@mail.ge", seats: "E7, E8", amount: 50, status: "confirmed", source: "online", checkedIn: false },
  { id: "BK-002", user: "Nino K.", email: "nino@mail.ge", seats: "D5", amount: 15, status: "confirmed", source: "admin", checkedIn: true },
  { id: "BK-003", user: "Lasha T.", email: "lasha@mail.ge", seats: "F10, F11, F12", amount: 75, status: "pending", source: "online", checkedIn: false },
  { id: "BK-004", user: "Maia S.", email: "maia@mail.ge", seats: "A3", amount: 15, status: "cancelled", source: "online", checkedIn: false },
  { id: "BK-005", user: "Dato A.", email: "dato@mail.ge", seats: "E1, E2", amount: 50, status: "confirmed", source: "online", checkedIn: false },
];

const statusBadge: Record<string, string> = {
  confirmed: "bg-status-success/20 text-green-400",
  pending: "bg-status-warning/20 text-amber-400",
  cancelled: "bg-accent-muted text-accent-primary",
  refunded: "bg-white/10 text-text-muted",
};

export default function AdminBookingsPage() {
  const t = useTranslations("admin");
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkInMode, setCheckInMode] = useState(false);

  const filtered = mockBookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.user.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    }
    return true;
  });

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

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or ID..." className="input-cinema !rounded-pill !py-2 !pl-9 text-sm" />
        </div>
        {["all", "confirmed", "pending", "cancelled"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn("rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all",
              statusFilter === s ? "bg-accent-primary text-white" : "bg-bg-elevated text-text-muted")}>
            {s}
          </button>
        ))}
      </div>

      {/* Check-in Mode */}
      {checkInMode && (
        <div className="mb-6 rounded-xl border border-accent-primary/30 bg-accent-muted p-4">
          <p className="mb-2 text-sm font-semibold text-accent-primary">QR Check-in Mode Active</p>
          <input type="text" placeholder="Scan or type booking QR code..." className="input-cinema" autoFocus />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-bg-elevated">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-label uppercase tracking-widest text-text-muted">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-xs text-text-muted">{b.id}</td>
                <td className="px-4 py-3">
                  <div><p className="font-medium text-text-primary">{b.user}</p><p className="text-xs text-text-muted">{b.email}</p></div>
                </td>
                <td className="px-4 py-3 font-mono text-text-secondary">{b.seats}</td>
                <td className="px-4 py-3 font-mono text-text-primary">₾{b.amount}</td>
                <td className="px-4 py-3"><span className={cn("badge", statusBadge[b.status])}>{b.status}</span></td>
                <td className="px-4 py-3"><span className="text-xs text-text-muted">{b.source}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {b.status === "confirmed" && !b.checkedIn && checkInMode && (
                      <button onClick={() => addToast(`${b.user} checked in`, "success")} className="text-xs text-green-400 hover:underline">{t("checkIn")}</button>
                    )}
                    {b.checkedIn && <span className="text-xs text-green-400">✓ {t("checkedIn")}</span>}
                    {b.status === "confirmed" && (
                      <button onClick={() => addToast("Booking cancelled", "warning")} className="text-xs text-accent-primary hover:underline">
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
