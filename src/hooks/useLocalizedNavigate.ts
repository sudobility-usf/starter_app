import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  return useCallback(
    (path: string) => {
      const currentLang = lang || "en";
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      navigate(`/${currentLang}${cleanPath}`);
    },
    [navigate, lang],
  );
}
