import type { ReactNode } from "react";
import TopBar from "./TopBar";
import Footer from "./Footer";

interface ScreenContainerProps {
  children: ReactNode;
}

export default function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-theme-bg-primary">
      <TopBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
