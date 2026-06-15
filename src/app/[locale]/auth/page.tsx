"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

type AuthView = "sign-in" | "sign-up" | "email-sent";

function PasswordStrength({ password, confirmPassword, isSignUp }: {
  password: string;
  confirmPassword: string;
  isSignUp: boolean;
}) {
  const t = useTranslations("auth");

  if (!isSignUp) return null;

  const hasMinLength = password.length >= 6;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="space-y-1.5 pt-1">
      {/* Min length */}
      <div className="flex items-center gap-2 text-xs">
        {hasMinLength ? (
          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
        ) : (
          <div className="h-[13px] w-[13px] rounded-full border border-white/20 shrink-0" />
        )}
        <span className={hasMinLength ? "text-emerald-400" : "text-text-muted"}>
          {t("passwordMin")}
        </span>
      </div>

      {/* Confirm password match */}
      {confirmPassword.length > 0 && (
        <div className="flex items-center gap-2 text-xs">
          {passwordsMatch ? (
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
          ) : passwordsMismatch ? (
            <XCircle size={13} className="text-red-400 shrink-0" />
          ) : null}
          <span className={passwordsMatch ? "text-emerald-400" : passwordsMismatch ? "text-red-400" : "text-text-muted"}>
            {passwordsMatch ? t("passwordMatch") : t("passwordMismatch")}
          </span>
        </div>
      )}
    </div>
  );
}

function EmailSentScreen({
  email,
  onResend,
  onBackToSignIn,
  resending,
}: {
  email: string;
  onResend: () => void;
  onBackToSignIn: () => void;
  resending: boolean;
}) {
  const t = useTranslations("auth");
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    onResend();
    setCooldown(60);
    setCanResend(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      className="text-center"
    >
      {/* Animated mail icon */}
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-primary/10 border border-accent-primary/20"
      >
        <Mail size={36} className="text-accent-primary" />
      </motion.div>

      <h2 className="font-display text-2xl tracking-wider text-text-primary mb-2">
        {t("checkEmail")}
      </h2>

      <p className="text-sm text-text-muted mb-1">
        {t("checkEmailDesc")}
      </p>

      <p className="text-sm font-medium text-accent-primary mb-4 break-all">
        {email}
      </p>

      <p className="text-xs text-text-muted mb-8">
        {t("checkEmailAction")}
      </p>

      {/* Resend button */}
      <button
        onClick={handleResend}
        disabled={!canResend || resending}
        className="btn-secondary w-full !gap-2 text-sm disabled:opacity-40 mb-4"
      >
        {resending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <RefreshCw size={14} />
        )}
        {canResend
          ? t("resendEmail")
          : `${t("resendIn")} ${cooldown}s`}
      </button>

      {/* Hint text */}
      <p className="text-xs text-text-muted mb-6">
        {t("didntGetEmail")}
      </p>

      {/* Back to sign in */}
      <button
        onClick={onBackToSignIn}
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={14} />
        {t("backToSignIn")}
      </button>
    </motion.div>
  );
}

export default function AuthPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const { addToast } = useToast();
  const supabase = createClient();

  const [view, setView] = useState<AuthView>("sign-in");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const isSignUp = view === "sign-up";

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate confirm password
        if (password !== confirmPassword) {
          addToast(t("passwordMismatch"), "error");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
          },
        });

        if (error) {
          // Handle "already registered" specifically
          if (
            error.message.toLowerCase().includes("already registered") ||
            error.message.toLowerCase().includes("already been registered")
          ) {
            addToast(t("alreadyRegistered"), "error");
          } else {
            addToast(error.message, "error");
          }
        } else if (data.user && !data.session) {
          // User created but needs email confirmation
          setView("email-sent");
        } else if (data.session) {
          // If email confirmation is disabled, user gets session immediately
          addToast("Signed up successfully!", "success");
          router.push(`/${locale}`);
          router.refresh();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Handle unconfirmed email
          if (error.message.toLowerCase().includes("email not confirmed")) {
            addToast(t("emailNotConfirmed"), "warning");
          } else {
            addToast(error.message, "error");
          }
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

  const handleResendEmail = useCallback(async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) {
        addToast(error.message, "error");
      } else {
        addToast("Confirmation email resent!", "success");
      }
    } catch {
      addToast("Something went wrong", "error");
    } finally {
      setResending(false);
    }
  }, [email, locale, supabase.auth, addToast]);

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
        addToast(t("magicLinkSent"), "success");
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

  const handleBackToSignIn = () => {
    setView("sign-in");
    setPassword("");
    setConfirmPassword("");
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
          <AnimatePresence mode="wait">
            {view === "email-sent" ? (
              <EmailSentScreen
                key="email-sent"
                email={email}
                onResend={handleResendEmail}
                onBackToSignIn={handleBackToSignIn}
                resending={resending}
              />
            ) : (
              <motion.div
                key="auth-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
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
                      id="auth-email"
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
                      id="auth-password"
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
                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                          <input
                            id="auth-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t("confirmPassword")}
                            className="input-cinema !pl-10"
                            required
                            minLength={6}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Password strength indicator */}
                  <PasswordStrength
                    password={password}
                    confirmPassword={confirmPassword}
                    isSignUp={isSignUp}
                  />

                  {/* Submit */}
                  <button
                    id="auth-submit"
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50"
                  >
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
                    id="auth-magic-link"
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
                  id="auth-google"
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

                {/* Toggle sign in / sign up */}
                <p className="mt-6 text-center text-sm text-text-muted">
                  {isSignUp ? t("hasAccount") : t("noAccount")}{" "}
                  <button
                    id="auth-toggle"
                    onClick={() => {
                      setView(isSignUp ? "sign-in" : "sign-up");
                      setConfirmPassword("");
                    }}
                    className="text-accent-primary hover:text-accent-hover"
                  >
                    {isSignUp ? t("signIn") : t("signUp")}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
