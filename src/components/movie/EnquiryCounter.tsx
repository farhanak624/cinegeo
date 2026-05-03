"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

interface EnquiryCounterProps {
  count: number;
  threshold: number;
  movieId: string;
  onNotifyMe?: (email: string) => void;
  size?: "sm" | "lg";
}

export default function EnquiryCounter({
  count,
  threshold,
  movieId,
  onNotifyMe,
  size = "lg",
}: EnquiryCounterProps) {
  const t = useTranslations("hero");
  const [email, setEmail] = useState("");
  const [displayCount, setDisplayCount] = useState(count);

  // Animate counter
  const springValue = useSpring(count, { stiffness: 100, damping: 30 });

  useEffect(() => {
    springValue.set(count);
  }, [count, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (v) => {
      setDisplayCount(Math.round(v));
    });
    return unsubscribe;
  }, [springValue]);

  const progress = Math.min((count / threshold) * 100, 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && onNotifyMe) {
      onNotifyMe(email);
      setEmail("");
    }
  };

  if (size === "sm") {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-mono-sm text-accent-primary">
          {displayCount}
        </span>
        <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
        </div>
        <span className="text-xs text-text-muted">/ {threshold}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Counter */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-5xl font-bold tabular-nums text-accent-primary md:text-6xl">
          {displayCount.toLocaleString()}
        </span>
        <span className="text-lg text-text-muted">
          {t("enquiriesOf")} {threshold.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-hover"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      {/* Notify Me Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="input-cinema max-w-[240px] !py-2.5 text-sm"
          required
        />
        <button type="submit" className="btn-primary !gap-1.5 !px-5 !py-2.5">
          <Bell size={14} />
          {t("notifyMe")}
        </button>
      </form>
    </div>
  );
}
