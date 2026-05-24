"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Search, Clock, Star, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import EnquiryCounter from "@/components/movie/EnquiryCounter";
import { getLocalizedTitle, getLocalizedSynopsis } from "@/lib/types";
import { formatTime, formatDuration, getWeekDays, getDayOfWeek, cn } from "@/lib/utils";
import type { Movie, Screening } from "@/lib/types";

const container = { animate: { transition: { staggerChildren: 0.06 } } };

interface Props {
  movies: Movie[];
  featured: Movie | null;
  screenings: Screening[];
}

export default function HomePageClient({ movies, featured, screenings }: Props) {
  const locale = useLocale();
  const t = useTranslations("hero");
  const tm = useTranslations("movies");
  const [selectedDate, setSelectedDate] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const heroMovie = featured || movies[0];
  const weekDays = getWeekDays();

  // Filter movies
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach((m) => m.genre?.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      if (statusFilter === "now_showing" && m.status !== "booking_open") return false;
      if (statusFilter === "booking_soon" && m.status !== "enquiry") return false;
      if (genreFilter !== "all" && !m.genre?.includes(genreFilter)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const title = getLocalizedTitle(m, locale).toLowerCase();
        return title.includes(q);
      }
      return true;
    });
  }, [movies, statusFilter, genreFilter, searchQuery, locale]);

  const screeningsForFeatured = heroMovie
    ? screenings.filter((s) => s.movie_id === heroMovie.id)
    : [];

  if (!heroMovie) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-text-muted">No movies yet</h1>
          <p className="mt-2 text-text-muted">Add movies from the admin panel to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
        >
          {heroMovie.poster_url && (
            <Image
              src={heroMovie.poster_url}
              alt={getLocalizedTitle(heroMovie, locale)}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-hero-vignette" />
        </motion.div>

        <div className="hero-gradient-overlay absolute inset-0" />
        <div className="hero-bottom-gradient absolute inset-x-0 bottom-0 h-48" />

        <div className="container-cinema relative z-10 flex h-full flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-2xl"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {heroMovie.genre?.map((g) => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>

            <h1 className="font-display text-hero uppercase leading-none tracking-wider text-text-primary">
              {getLocalizedTitle(heroMovie, locale)}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
              {heroMovie.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{heroMovie.rating}</span>
                </div>
              )}
              {heroMovie.duration_min && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(heroMovie.duration_min)}</span>
                </div>
              )}
              {heroMovie.season && <span>{heroMovie.season}</span>}
            </div>

            <p className="mt-4 line-clamp-2 max-w-lg text-body text-text-secondary">
              {getLocalizedSynopsis(heroMovie, locale)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {heroMovie.status === "booking_open" ? (
                <>
                  <Link href={`/${locale}/movies/${heroMovie.id}`} className="btn-primary">
                    {t("bookNow")}
                    <ChevronRight size={16} />
                  </Link>
                  <Link href={`/${locale}/movies/${heroMovie.id}`} className="btn-secondary">
                    {t("readMore")}
                  </Link>
                </>
              ) : heroMovie.status === "enquiry" ? (
                <EnquiryCounter
                  count={heroMovie.enquiry_count}
                  threshold={heroMovie.enquiry_threshold}
                  movieId={heroMovie.id}
                  onNotifyMe={(email) => console.log("Notify:", email)}
                />
              ) : (
                <Link href={`/${locale}/movies/${heroMovie.id}`} className="btn-secondary">
                  {t("readMore")}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Date Strip + Time Slots ─────────────────────── */}
      <section className="border-b border-white/5 bg-bg-surface py-4">
        <div className="container-cinema">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weekDays.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(i)}
                className={cn(
                  "flex min-w-[64px] flex-col items-center rounded-lg px-3 py-2 text-sm transition-all duration-fast",
                  selectedDate === i
                    ? "bg-accent-primary text-white shadow-glow"
                    : "bg-bg-elevated text-text-secondary hover:bg-white/5"
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {getDayOfWeek(day, locale)}
                </span>
                <span className="text-lg font-bold">{day.getDate()}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            {screeningsForFeatured.length > 0 ? (
              screeningsForFeatured.map((s) => (
                <Link
                  key={s.id}
                  href={`/${locale}/screenings/${s.id}`}
                  className="rounded-md border border-white/10 bg-bg-elevated px-4 py-2 font-mono text-sm text-text-primary transition-all hover:border-accent-primary hover:text-accent-primary"
                >
                  {formatTime(s.starts_at, locale)}
                </Link>
              ))
            ) : (
              <p className="text-sm text-text-muted">{t("noScreenings")}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Movie Grid ──────────────────────────────────── */}
      <section className="py-16">
        <div className="container-cinema">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: tm("title") },
                { key: "now_showing", label: tm("nowShowing") },
                { key: "booking_soon", label: tm("bookingSoon") },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={cn(
                    "rounded-pill px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                    statusFilter === key
                      ? "bg-accent-primary text-white"
                      : "bg-bg-elevated text-text-secondary hover:text-text-primary"
                  )}
                >
                  {label}
                </button>
              ))}

              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="rounded-pill border border-white/10 bg-bg-elevated px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary outline-none"
              >
                <option value="all">{tm("allGenres")}</option>
                {allGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tm("search")}
                className="input-cinema !rounded-pill !py-2 !pl-9 !pr-4 text-sm"
              />
            </div>
          </div>

          <motion.div
            variants={container}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </motion.div>

          {filteredMovies.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-text-muted">No movies found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
