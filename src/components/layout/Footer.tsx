import { useTranslation } from "react-i18next";
import LocalizedLink from "./LocalizedLink";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="border-t border-theme-border bg-theme-bg-secondary py-8">
      <div className="container-app px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm text-theme-text-secondary">
            <LocalizedLink to="/" className="hover:text-theme-text-primary">
              {t("nav.home")}
            </LocalizedLink>
            <LocalizedLink to="/docs" className="hover:text-theme-text-primary">
              {t("nav.docs")}
            </LocalizedLink>
            <LocalizedLink to="/settings" className="hover:text-theme-text-primary">
              {t("nav.settings")}
            </LocalizedLink>
            <LocalizedLink to="/sitemap" className="hover:text-theme-text-primary">
              {t("nav.sitemap")}
            </LocalizedLink>
          </div>
          <p className="text-sm text-theme-text-tertiary">
            &copy; {new Date().getFullYear()} Sudobility. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
