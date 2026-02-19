import { Suspense, lazy, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SudobilityAppWithFirebaseAuth } from "@sudobility/building_blocks/firebase";
import { LanguageValidator } from "@sudobility/components";
import { isLanguageSupported, CONSTANTS } from "./config/constants";
import i18n from "./i18n";
import { useDocumentLanguage } from "./hooks/useDocumentLanguage";
import { AuthProviderWrapper } from "./components/providers/AuthProviderWrapper";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const HistoriesPage = lazy(() => import("./pages/HistoriesPage"));
const HistoryDetailPage = lazy(() => import("./pages/HistoryDetailPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const LanguageRedirect = lazy(
  () => import("./components/layout/LanguageRedirect"),
);
const ProtectedRoute = lazy(
  () => import("./components/layout/ProtectedRoute"),
);

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-theme-bg-primary">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function DocumentLanguageSync({ children }: { children: ReactNode }) {
  useDocumentLanguage();
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <DocumentLanguageSync>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LanguageRedirect />} />
          <Route
            path="/:lang"
            element={
              <LanguageValidator
                isLanguageSupported={isLanguageSupported}
                defaultLanguage="en"
                storageKey="language"
              />
            }
          >
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="histories" element={<HistoriesPage />} />
            <Route
              path="histories/:historyId"
              element={<HistoryDetailPage />}
            />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="sitemap" element={<SitemapPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Route>
          <Route path="*" element={<LanguageRedirect />} />
        </Routes>
      </Suspense>
    </DocumentLanguageSync>
  );
}

function App() {
  return (
    <SudobilityAppWithFirebaseAuth
      i18n={i18n}
      baseUrl={CONSTANTS.API_URL}
      testMode={CONSTANTS.DEV_MODE}
      AuthProviderWrapper={AuthProviderWrapper}
    >
      <AppRoutes />
    </SudobilityAppWithFirebaseAuth>
  );
}

export default App;
