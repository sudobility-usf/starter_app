import { Navigate, useLocation } from "react-router-dom";
import { isLanguageSupported, SUPPORTED_LANGUAGES } from "../../config/constants";

function detectLanguage(): string {
  // Check localStorage
  try {
    const stored = localStorage.getItem("language");
    if (stored && isLanguageSupported(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }

  // Check browser language
  if (typeof navigator !== "undefined") {
    const browserLangs = navigator.languages || [navigator.language];
    for (const lang of browserLangs) {
      const code = lang.toLowerCase().split("-")[0];
      if (isLanguageSupported(code)) {
        return code;
      }
      // Handle zh-Hant
      const full = lang.toLowerCase().replace("_", "-");
      if (full === "zh-hant" || full === "zh-tw" || full === "zh-hk") {
        return "zh-hant";
      }
    }
  }

  return "en";
}

export default function LanguageRedirect() {
  const location = useLocation();
  const lang = detectLanguage();
  const path = location.pathname === "/" ? "" : location.pathname;
  return <Navigate to={`/${lang}${path}`} replace />;
}
