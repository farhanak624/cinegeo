/* ── Database Types ─────────────────────────────────────── */

export type MovieStatus = "draft" | "enquiry" | "booking_open" | "archived";
export type SeatType = "standard" | "vip" | "blocked" | "empty";
export type SeatStatus = "available" | "held" | "booked" | "blocked";
export type PaymentStatus = "pending" | "confirmed" | "refunded" | "cancelled";
export type BookedBy = "user" | "admin";

export interface Theater {
  id: string;
  name: string;
  location: string;
  capacity: number;
  type: string;
  created_at: string;
}

export interface Movie {
  id: string;
  title_en: string;
  title_ka: string;
  synopsis_en: string;
  synopsis_ka: string;
  poster_url: string;
  trailer_url: string | null;
  genre: string[];
  director: string;
  cast: string[];
  duration_min: number;
  rating: number;
  season: string;
  status: MovieStatus;
  enquiry_count: number;
  enquiry_threshold: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Screening {
  id: string;
  movie_id: string;
  theater_id: string;
  starts_at: string;
  booking_opens_at: string;
  booking_closes_at: string;
  seat_layout_id: string | null;
  status: string;
  created_at: string;
  // Joined
  movie?: Movie;
  theater?: Theater;
}

export interface SeatLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  layout: SeatLayoutCell[][];
  created_at: string;
}

export interface SeatLayoutCell {
  type: SeatType;
  label?: string;
  price?: number;
}

export interface Seat {
  id: string;
  screening_id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
  held_by: string | null;
  held_until: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  screening_id: string;
  seats: BookingSeat[];
  total_amount: number;
  payment_status: PaymentStatus;
  payment_intent_id: string | null;
  qr_code: string;
  booked_by: BookedBy;
  guest_name: string | null;
  guest_email: string | null;
  checked_in: boolean;
  created_at: string;
  // Joined
  screening?: Screening;
}

export interface BookingSeat {
  seat_id: string;
  row: string;
  number: number;
  type: SeatType;
  price: number;
}

export interface Enquiry {
  id: string;
  user_id: string;
  movie_id: string;
  email: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at: string;
}

/* ── Localized Helpers ─────────────────────────────────── */

export function getLocalizedTitle(movie: Movie, locale: string): string {
  return locale === "ka" ? movie.title_ka || movie.title_en : movie.title_en;
}

export function getLocalizedSynopsis(movie: Movie, locale: string): string {
  return locale === "ka" ? movie.synopsis_ka || movie.synopsis_en : movie.synopsis_en;
}
