import { useTranslation } from "react-i18next";
import { FaXTwitter } from "react-icons/fa6";
import { showSuccess, showError } from "../../../utils/toast/toast";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

interface SocialSharingProps {
  handleShare: () => void;
  handleDownload: () => Promise<void>;
  downloading: boolean;
}

export const SocialSharing = ({
  handleShare,
  handleDownload,
  downloading,
}: SocialSharingProps) => {
  const { t } = useTranslation();

  const onDownload = async () => {
    try {
      await handleDownload();
      trackEvent(AnalyticsEvent.DOWNLOAD_IMAGE);
      showSuccess(t("toast.downloadReady"));
    } catch {
      showError(t("toast.downloadFailed"));
    }
  };

  return (
    <div className="flex justify-center gap-3">
      <button
        onClick={() => {
          trackEvent(AnalyticsEvent.SHARE_CONTENT);
          handleShare();
        }}
        className="relative inline-flex items-center justify-center gap-2 bg-brand-gray hover:bg-neutral-800 text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-md transition-all duration-300 px-3 py-1 min-w-[60px] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaXTwitter className="w-3.5 h-3.5" />
        {t("common.share", { defaultValue: "Share" })}
      </button>
      <button
        onClick={onDownload}
        disabled={downloading}
        className="relative inline-flex items-center justify-center gap-2 bg-brand-yellow text-brand-darkBg text-[10px] sm:text-xs font-semibold rounded-full shadow-md transition-all duration-300 px-3 py-1 min-w-[60px] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {downloading ? "…" : t("common.download", { defaultValue: "Download" })}
      </button>
    </div>
  );
};
