import { useTranslation } from "react-i18next";
import { GlobalSettingsPage } from "@sudobility/building_blocks";
import ScreenContainer from "../components/layout/ScreenContainer";

export default function SettingsPage() {
  const { t } = useTranslation("common");

  return (
    <ScreenContainer>
      <div className="container-app px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-theme-text-primary mb-6">
          {t("nav.settings")}
        </h1>
        <GlobalSettingsPage />
      </div>
    </ScreenContainer>
  );
}
