"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  expiresAt: Date;
  onExpired: () => void;
  size?: number;
}

export default function CountdownTimer({ expiresAt, onExpired, size = 80 }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const total = Math.max(0, expiresAt.getTime() - Date.now());
    setTotalDuration(total);
    setTimeLeft(total);
  }, [expiresAt]);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, expiresAt.getTime() - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) { clearInterval(interval); onExpired(); }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const progress = totalDuration > 0 ? timeLeft / totalDuration : 1;
  const getColor = () => {
    if (timeLeft <= 120000) return "#E8212B";
    if (timeLeft <= 300000) return "#C9A84C";
    return "#3d6b3d";
  };
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={getColor()} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
            style={{ filter: `drop-shadow(0 0 6px ${getColor()}40)` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-bold tabular-nums" style={{ color: getColor() }}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
