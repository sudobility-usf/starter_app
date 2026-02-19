import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { SUPPORTED_LANGUAGES, isLanguageSupported } from "./config/constants";

const detectLanguageFromPath = (): string => {
  if (typeof window === "undefined") {
    return "en";
  }

  const pathLang = window.location.pathname.split("/")[1];
  if (pathLang && isLanguageSupported(pathLang)) {
    return pathLang;
  }

  try {
    const stored = localStorage.getItem("language");
    if (stored && isLanguageSupported(stored)) {
      return stored;
    }
  } catch {
    // localStorage may throw in Safari private browsing
  }

  return "en";
};

let initialized = false;

export function initializeI18n(): void {
  if (initialized) {
    return;
  }
  initialized = true;

  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: detectLanguageFromPath(),
      fallbackLng: {
        zh: ["zh", "en"],
        "zh-hant": ["zh-hant", "zh", "en"],
        default: ["en"],
      },
      initImmediate: false,
      supportedLngs: [...SUPPORTED_LANGUAGES],
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: `/locales/{{lng}}/{{ns}}.json`,
      },
      detection: {
        order: ["path", "localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "language",
        lookupFromPathIndex: 0,
      },
      load: "currentOnly",
      preload: [],
      cleanCode: false,
      lowerCaseLng: true,
      nonExplicitSupportedLngs: false,
      defaultNS: "common",
      ns: ["common"],
    });
}

export default i18n;
