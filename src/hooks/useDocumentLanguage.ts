import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

export function useDocumentLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    if (!currentLanguage) return;
    document.documentElement.lang = currentLanguage;
    const isRtl = RTL_LANGUAGES.includes(currentLanguage);
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [currentLanguage]);
}
