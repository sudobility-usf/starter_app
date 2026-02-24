import type { ReactNode } from 'react';
import TopBar from './TopBar';
import Footer from './Footer';

interface ScreenContainerProps {
  /** Page content rendered between the TopBar and Footer. */
  children: ReactNode;
}

/**
 * Standard page layout wrapper that renders the TopBar, a `<main>` area
 * for page content, and the Footer. Every page should be wrapped in this
 * component to maintain a consistent shell.
 */
export default function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-theme-bg-primary">
      <TopBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
