import { ThemeProvider as BaseThemeProvider } from "@sudobility/components";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseThemeProvider
      themeStorageKey="starter-theme"
      fontSizeStorageKey="starter-font-size"
    >
      {children}
    </BaseThemeProvider>
  );
}
