"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Movie } from "@/lib/types";
import { getLocalizedTitle } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const item = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const locale = useLocale();
  const title = getLocalizedTitle(movie, locale);

  return (
    <motion.div
      variants={item}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <Link href={`/${locale}/movies/${movie.id}`} className="group block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          {/* Poster */}
          <Image
            src={movie.poster_url || "/placeholder-poster.jpg"}
            alt={title}
            fill
            className="object-cover transition-all duration-base group-hover:scale-[1.04] group-hover:brightness-110"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 20vw"
          />

          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-base group-hover:opacity-100"
            style={{ boxShadow: "inset 0 0 40px rgba(232, 33, 43, 0.2)" }}
          />

          {/* Bottom Overlay */}
          <div className="card-overlay absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-base group-hover:opacity-100">
            <h3 className="font-heading text-h3 text-text-primary leading-tight">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">
                  {movie.rating?.toFixed(1)}
                </span>
              </div>
              {movie.genre?.[0] && (
                <span className="genre-tag !text-[0.6rem]">{movie.genre[0]}</span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          {movie.status === "booking_open" && (
            <div className="absolute right-2 top-2">
              <span className="badge-open !py-0.5 !text-[0.6rem]">OPEN</span>
            </div>
          )}
          {movie.status === "enquiry" && (
            <div className="absolute right-2 top-2">
              <span className="badge-enquiry !py-0.5 !text-[0.6rem]">
                {movie.enquiry_count}
              </span>
            </div>
          )}
        </div>

        {/* Title below (always visible) */}
        <div className="mt-2 px-1">
          <h3 className="truncate text-sm font-medium text-text-primary">
            {title}
          </h3>
          <p className="text-xs text-text-muted">
            {movie.genre?.slice(0, 2).join(" · ")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
