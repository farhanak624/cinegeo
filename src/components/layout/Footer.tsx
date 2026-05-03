import { Film } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-bg-base py-12">
      <div className="container-cinema">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-accent-primary" />
            <span className="font-display text-xl tracking-wider text-accent-primary">
              CINEGEO
            </span>
          </div>
          <p className="text-sm text-text-muted">
            {t("tagline")}
          </p>
          <p className="text-xs text-text-muted">
            © {year} {t("cinema")}. {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
