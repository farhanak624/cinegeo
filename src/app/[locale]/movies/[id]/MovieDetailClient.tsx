"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, Clock, Calendar, Play, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import EnquiryCounter from "@/components/movie/EnquiryCounter";
import { getLocalizedTitle, getLocalizedSynopsis } from "@/lib/types";
import { formatTime, formatDate, formatDuration } from "@/lib/utils";
import type { Movie, Screening } from "@/lib/types";

interface Props {
  movie: Movie;
  screenings: Screening[];
  relatedMovies: Movie[];
}

export default function MovieDetailClient({ movie, screenings, relatedMovies }: Props) {
  const locale = useLocale();
  const t = useTranslations("movies");
  const title = getLocalizedTitle(movie, locale);
  const synopsis = getLocalizedSynopsis(movie, locale);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          {movie.poster_url && (
            <Image src={movie.poster_url} alt="" fill className="object-cover blur-xl scale-110 opacity-30" sizes="100vw" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 via-bg-base/80 to-bg-base" />
        </div>

        <div className="container-cinema relative z-10 flex flex-col gap-8 py-12 md:flex-row md:items-start md:gap-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="flex-shrink-0"
          >
            <div className="relative aspect-[2/3] w-[240px] overflow-hidden rounded-xl shadow-card md:w-[300px]">
              {movie.poster_url ? (
                <Image src={movie.poster_url} alt={title} fill className="object-cover" sizes="300px" priority />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-bg-elevated text-text-muted">No Poster</div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="flex-1"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {movie.genre?.map((g) => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>

            <h1 className="font-display text-h1 uppercase tracking-wider">{title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              {movie.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{movie.rating}</span>
                </div>
              )}
              {movie.duration_min && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{formatDuration(movie.duration_min)}</span>
                </div>
              )}
              {movie.season && <span>{movie.season}</span>}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              {movie.director && (
                <p><span className="text-text-muted">{t("director")}:</span> <span className="text-text-primary">{movie.director}</span></p>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <p><span className="text-text-muted">{t("cast")}:</span> <span className="text-text-primary">{movie.cast.join(", ")}</span></p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-label uppercase tracking-widest text-text-muted">{t("synopsis")}</h3>
              <p className="max-w-xl text-body leading-relaxed text-text-secondary">{synopsis}</p>
            </div>

            {movie.trailer_url && (
              <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer"
                className="btn-secondary mt-6 inline-flex !gap-2">
                <Play size={16} />
                {t("trailer")}
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Booking / Enquiry */}
      <section className="border-t border-white/5 bg-bg-surface py-12">
        <div className="container-cinema">
          {movie.status === "enquiry" ? (
            <div className="mx-auto max-w-lg text-center">
              <h2 className="mb-6 font-heading text-h2">{t("bookingSoon")}</h2>
              <EnquiryCounter
                count={movie.enquiry_count}
                threshold={movie.enquiry_threshold}
                movieId={movie.id}
                onNotifyMe={(email) => console.log("Notify:", email)}
              />
            </div>
          ) : movie.status === "booking_open" ? (
            <div>
              <h2 className="mb-6 font-heading text-h2">{t("selectScreening")}</h2>
              {screenings.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {screenings.map((s) => (
                    <Link key={s.id} href={`/${locale}/screenings/${s.id}`}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-bg-elevated p-5 transition-all hover:border-accent-primary/50 hover:shadow-glow">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <Calendar size={14} />
                          <span>{formatDate(s.starts_at, locale)}</span>
                        </div>
                        <p className="mt-1 font-mono text-xl font-bold text-text-primary">
                          {formatTime(s.starts_at, locale)}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">{s.theater?.name}</p>
                      </div>
                      <ChevronRight className="text-text-muted transition-colors group-hover:text-accent-primary" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-text-muted">No screenings available yet</p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="py-16">
          <div className="container-cinema">
            <h2 className="mb-8 font-heading text-h2">{t("relatedMovies")}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {relatedMovies.map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
