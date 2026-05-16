"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export default function AuthPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const { addToast } = useToast();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate confirm password
        if (password !== confirmPassword) {
          addToast("Passwords do not match", "error");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
          },
        });

        if (error) {
          addToast(error.message, "error");
        } else {
          addToast("Check your email for a confirmation link!", "success");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          addToast(error.message, "error");
        } else {
          addToast("Signed in successfully!", "success");
          router.push(`/${locale}`);
          router.refresh();
        }
      }
    } catch {
      addToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      addToast("Please enter your email first", "warning");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) {
        addToast(error.message, "error");
      } else {
        addToast("Magic link sent! Check your email.", "success");
      }
    } catch {
      addToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) {
        addToast(error.message, "error");
        setLoading(false);
      }
      // Google will redirect, so no need to setLoading(false)
    } catch {
      addToast("Something went wrong", "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-bg-surface p-8 shadow-card">
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl tracking-wider text-accent-primary">CINEGEO</h1>
            <p className="mt-2 text-sm text-text-muted">
              {isSignUp ? t("signUp") : t("signIn")}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                className="input-cinema !pl-10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                className="input-cinema !pl-10 !pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password (sign up only) */}
            {isSignUp && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirmPassword")}
                  className="input-cinema !pl-10"
                  required
                  minLength={6}
                />
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isSignUp ? (
                t("signUp")
              ) : (
                t("signIn")
              )}
            </button>

            {/* Magic Link */}
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="btn-secondary w-full !gap-2 text-sm disabled:opacity-50"
            >
              {t("magicLink")}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-text-muted">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-pill border border-white/10 bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary transition-all hover:bg-white/5 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("googleAuth")}
          </button>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-text-muted">
            {isSignUp ? t("hasAccount") : t("noAccount")}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-accent-primary hover:text-accent-hover"
            >
              {isSignUp ? t("signIn") : t("signUp")}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
