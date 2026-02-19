import { ThemeProvider as BaseThemeProvider, useTheme } from "@sudobility/components";
export { useTheme };
export { Theme, FontSize } from "@sudobility/components";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseThemeProvider
      storageKeyTheme="starter-theme"
      storageKeyFontSize="starter-font-size"
    >
      {children}
    </BaseThemeProvider>
  );
}
