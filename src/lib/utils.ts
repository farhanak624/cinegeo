import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = "GEL"): string {
  return new Intl.NumberFormat("en-GE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, locale = "en"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime(date: string | Date, locale = "en"): string {
  const d = new Date(date);
  return d.toLocaleTimeString(locale === "ka" ? "ka-GE" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function generateSeatLabel(row: string, number: number): string {
  return `${row}${number}`;
}

export function getDayOfWeek(date: Date, locale = "en"): string {
  return date.toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US", {
    weekday: "short",
  });
}

export function getWeekDays(startDate: Date = new Date()): Date[] {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  // Find Monday
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}
