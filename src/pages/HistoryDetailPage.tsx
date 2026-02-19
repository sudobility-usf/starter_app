import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStatus } from "@sudobility/auth-components";
import { useApi } from "@sudobility/building_blocks/firebase";
import { useHistoriesManager } from "@sudobility/starter_lib";
import ScreenContainer from "../components/layout/ScreenContainer";
import { useLocalizedNavigate } from "../hooks/useLocalizedNavigate";

export default function HistoryDetailPage() {
  const { historyId } = useParams<{ historyId: string }>();
  const { t } = useTranslation("common");
  const { user } = useAuthStatus();
  const { networkClient, baseUrl, token } = useApi();
  const { navigate } = useLocalizedNavigate();

  const { histories, deleteHistory, isLoading } = useHistoriesManager({
    baseUrl,
    networkClient,
    userId: user?.uid ?? null,
    token: token ?? null,
  });

  const history = histories.find((h) => h.id === historyId);

  if (isLoading && !history) {
    return (
      <ScreenContainer>
        <div className="container-app px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </ScreenContainer>
    );
  }

  if (!history) {
    return (
      <ScreenContainer>
        <div className="container-app px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-theme-text-secondary">{t("histories.notFound")}</p>
        </div>
      </ScreenContainer>
    );
  }

  const handleDelete = async () => {
    await deleteHistory(history.id);
    navigate("/histories");
  };

  return (
    <ScreenContainer>
      <div className="container-app px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-theme-text-primary mb-6">
            {t("histories.detail")}
          </h1>
          <div className="p-6 rounded-lg border border-theme-border space-y-4">
            <div>
              <p className="text-sm text-theme-text-tertiary">{t("histories.datetime")}</p>
              <p className="text-lg text-theme-text-primary">
                {new Date(history.datetime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-theme-text-tertiary">{t("histories.value")}</p>
              <p className="text-2xl font-bold text-theme-text-primary">
                {history.value.toFixed(2)}
              </p>
            </div>
            {history.created_at && (
              <div>
                <p className="text-sm text-theme-text-tertiary">{t("histories.createdAt")}</p>
                <p className="text-sm text-theme-text-secondary">
                  {new Date(history.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/histories")}
              className="px-4 py-2 border border-theme-border rounded-lg text-theme-text-primary hover:bg-theme-hover-bg text-sm"
            >
              {t("common.back")}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              {t("common.delete")}
            </button>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
