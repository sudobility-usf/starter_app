import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStatus } from "@sudobility/auth-components";
import { useApi } from "@sudobility/building_blocks/firebase";
import { useHistoriesManager } from "@sudobility/starter_lib";
import ScreenContainer from "../components/layout/ScreenContainer";
import LocalizedLink from "../components/layout/LocalizedLink";

export default function HistoriesPage() {
  const { t } = useTranslation("common");
  const { user } = useAuthStatus();
  const { networkClient, baseUrl, token } = useApi();

  const {
    histories,
    total,
    percentage,
    isLoading,
    error,
    createHistory,
  } = useHistoriesManager({
    baseUrl,
    networkClient,
    userId: user?.uid ?? null,
    token: token ?? null,
  });

  const [showForm, setShowForm] = useState(false);
  const [datetime, setDatetime] = useState("");
  const [value, setValue] = useState("");

  if (!user) {
    return (
      <ScreenContainer>
        <div className="container-app px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-theme-text-primary mb-4">
            {t("histories.title")}
          </h1>
          <p className="text-theme-text-secondary mb-6">
            {t("histories.loginPrompt")}
          </p>
          <LocalizedLink
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("nav.login")}
          </LocalizedLink>
        </div>
      </ScreenContainer>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datetime || !value) return;
    await createHistory({
      datetime: new Date(datetime).toISOString(),
      value: Number(value),
    });
    setDatetime("");
    setValue("");
    setShowForm(false);
  };

  return (
    <ScreenContainer>
      <div className="container-app px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-theme-text-primary">
            {t("histories.title")}
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            {showForm ? t("common.cancel") : t("histories.add")}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-theme-border">
            <p className="text-sm text-theme-text-tertiary">{t("histories.yourTotal")}</p>
            <p className="text-2xl font-bold text-theme-text-primary">
              {histories.reduce((sum, h) => sum + h.value, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-theme-border">
            <p className="text-sm text-theme-text-tertiary">{t("histories.globalTotal")}</p>
            <p className="text-2xl font-bold text-theme-text-primary">
              {total.toFixed(2)}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-theme-border">
            <p className="text-sm text-theme-text-tertiary">{t("histories.percentage")}</p>
            <p className="text-2xl font-bold text-blue-600">
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg border border-theme-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                  {t("histories.datetime")}
                </label>
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-theme-border bg-theme-bg-primary text-theme-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                  {t("histories.value")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-theme-border bg-theme-bg-primary text-theme-text-primary"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              {t("histories.create")}
            </button>
          </form>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && histories.length === 0 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {/* Histories List */}
        {histories.length === 0 && !isLoading ? (
          <p className="text-center text-theme-text-tertiary py-8">
            {t("histories.empty")}
          </p>
        ) : (
          <div className="space-y-2">
            {histories.map((history) => (
              <LocalizedLink
                key={history.id}
                to={`/histories/${history.id}`}
                className="block p-4 rounded-lg border border-theme-border hover:bg-theme-hover-bg transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-theme-text-secondary text-sm">
                    {new Date(history.datetime).toLocaleString()}
                  </span>
                  <span className="text-lg font-semibold text-theme-text-primary">
                    {history.value.toFixed(2)}
                  </span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
