export const CONSTANTS = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "Starter",
  APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN || "localhost",
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || "Sudobility",
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || "support@example.com",
  API_URL: import.meta.env.VITE_STARTER_API_URL || "http://localhost:3001",
  DEV_MODE: import.meta.env.VITE_DEV_MODE === "true",
  REVENUECAT_API_KEY: "",
  REVENUECAT_API_KEY_SANDBOX: "",
  SOCIAL_LINKS: {},
  STATUS_PAGE_URL: "",
  STATUS_PAGE_API_URL: "",
  NAV_ITEMS: [
    { label: "home", href: "/" },
    { label: "docs", href: "/docs" },
    { label: "histories", href: "/histories", protected: true },
  ],
} as const;

export const SUPPORTED_LANGUAGES = [
  "en",
  "ar",
  "de",
  "es",
  "fr",
  "it",
  "ja",
  "ko",
  "pt",
  "ru",
  "sv",
  "th",
  "uk",
  "vi",
  "zh",
  "zh-hant",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const isLanguageSupported = (
  lang: string,
): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};
