import { createClient } from "@/lib/supabase/server";
import type { Movie, Screening, Seat } from "@/lib/types";

// ── Movies ──────────────────────────────────────────────
export async function getMovies(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  } else {
    query = query.neq("status", "draft");
  }

  const { data, error } = await query;
  if (error) console.error("getMovies error:", error);
  return (data as Movie[]) || [];
}

export async function getFeaturedMovie() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("featured", true)
    .limit(1)
    .single();

  if (error || !data) {
    // Fallback to first booking_open movie
    const { data: fallback } = await supabase
      .from("movies")
      .select("*")
      .neq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    return fallback as Movie | null;
  }

  return data as Movie;
}

export async function getMovie(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) console.error("getMovie error:", error);
  return data as Movie | null;
}

// ── Screenings ──────────────────────────────────────────
export async function getScreenings(movieId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("screenings")
    .select("*, movie:movies(*), theater:theaters(*)")
    .eq("status", "active")
    .order("starts_at", { ascending: true });

  if (movieId) {
    query = query.eq("movie_id", movieId);
  }

  const { data, error } = await query;
  if (error) console.error("getScreenings error:", error);
  return (data as Screening[]) || [];
}

export async function getScreening(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("screenings")
    .select("*, movie:movies(*), theater:theaters(*)")
    .eq("id", id)
    .single();

  if (error) console.error("getScreening error:", error);
  return data as Screening | null;
}

// ── Seats ───────────────────────────────────────────────
export async function getSeats(screeningId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seats")
    .select("*")
    .eq("screening_id", screeningId)
    .order("row")
    .order("number");

  if (error) console.error("getSeats error:", error);
  return (data as Seat[]) || [];
}

// ── Bookings (admin) ────────────────────────────────────
export async function getBookings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, screening:screenings(*, movie:movies(*), theater:theaters(*))")
    .order("created_at", { ascending: false });

  if (error) console.error("getBookings error:", error);
  return data || [];
}

// ── Theaters ────────────────────────────────────────────
export async function getTheaters() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("theaters")
    .select("*")
    .order("name");

  if (error) console.error("getTheaters error:", error);
  return data || [];
}
