import { Share2 } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { showSuccess, showInfo } from "../../../utils/toast/toast";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

export interface SharedResource {
  title: string;
  url: string;
}

export const buildSharedResource = (
  title: string
): SharedResource | undefined => {
  if (typeof window === "undefined") return undefined;
  const url = window.location.href;
  const shareTitle = title ?? document.title;

  return {
    title: shareTitle,
    url: url,
  };
};

interface ShareButtonProps {
  sharedResource: SharedResource;
  className?: string;
}

export default function ShareButton({
  sharedResource,
  className,
}: ShareButtonProps) {
  const { t } = useTranslation();

  const handleShare = useCallback(async () => {
    try {
      trackEvent(AnalyticsEvent.SHARE_CONTENT, { content_label: sharedResource.title });
      if (navigator.share) {
        await navigator.share({ title: sharedResource.title, url: sharedResource.url });
      } else {
        await navigator.clipboard.writeText(sharedResource.url);
        showSuccess(t("toast.linkCopied"));
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      showInfo(t("toast.shareFailed"));
    }
  }, [sharedResource.title, sharedResource.url, t]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this page"
      className={
        className
          ? className
          : ` p-2 flex items-center rounded-full justify-center text-brand-white hover:bg-brand-dona hover:text-brand-orange`
      }
    >
      <Share2 size={18} />
    </button>
  );
}
