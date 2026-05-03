import { create } from "zustand";
import type { BookingSeat, Screening } from "@/lib/types";

interface BookingState {
  // Screening info
  screening: Screening | null;
  setScreening: (screening: Screening) => void;

  // Selected seats
  selectedSeats: BookingSeat[];
  addSeat: (seat: BookingSeat) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;

  // Timer
  holdExpiresAt: Date | null;
  setHoldExpiry: (date: Date) => void;
  clearHoldExpiry: () => void;

  // Payment
  paymentIntentId: string | null;
  setPaymentIntentId: (id: string) => void;

  // Total
  total: number;

  // Reset
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  screening: null,
  setScreening: (screening) => set({ screening }),

  selectedSeats: [],
  addSeat: (seat) => {
    const seats = [...get().selectedSeats, seat];
    set({ selectedSeats: seats, total: seats.reduce((sum, s) => sum + s.price, 0) });
    // Set hold expiry on first seat selection
    if (seats.length === 1 && !get().holdExpiresAt) {
      set({ holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    }
  },
  removeSeat: (seatId) => {
    const seats = get().selectedSeats.filter((s) => s.seat_id !== seatId);
    set({ selectedSeats: seats, total: seats.reduce((sum, s) => sum + s.price, 0) });
    if (seats.length === 0) {
      set({ holdExpiresAt: null });
    }
  },
  clearSeats: () => set({ selectedSeats: [], total: 0, holdExpiresAt: null }),

  holdExpiresAt: null,
  setHoldExpiry: (date) => set({ holdExpiresAt: date }),
  clearHoldExpiry: () => set({ holdExpiresAt: null }),

  paymentIntentId: null,
  setPaymentIntentId: (id) => set({ paymentIntentId: id }),

  total: 0,

  reset: () =>
    set({
      screening: null,
      selectedSeats: [],
      holdExpiresAt: null,
      paymentIntentId: null,
      total: 0,
    }),
}));
