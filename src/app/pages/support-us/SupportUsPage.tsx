import { useCallback } from "react";
import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import Seo from "../../main/seo/Seo";
import supportUsSeoData from "../../main/seo/support-us-metadata";
import { showSuccess, showInfo } from "../../utils/toast/toast";
import { trackEvent, AnalyticsEvent } from "../../utils/analytics/analytics";

const SupportUsPage = () => {
  const { t } = useTranslation();
  const btcAddress = import.meta.env.VITE_BTC_ADDRESS;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(btcAddress);
      trackEvent(AnalyticsEvent.BTC_ADDRESS_COPIED);
      showSuccess(t("toast.addressCopied"));
    } catch {
      showInfo(t("toast.copyFailed"));
    }
  }, [t, btcAddress]);

  return (
    <Seo {...supportUsSeoData(t)}>
      <section className="text-brand-lightGray px-6 py-12 md:px-16 lg:px-32 w-full">
        <div className="max-w-3xl mx-auto text-center md:text-left">
          <h1 className="text-2xl font-bold text-brand-white mb-8">
            {t("supportus.head")}
          </h1>
          <p className="text-lg leading-relaxed mb-6">{t("supportus.text")}</p>

          <p className="text-sm uppercase tracking-wide text-brand-lightGray/70 mb-2">
            {t("supportus.addressLabel")}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="select-all font-mono text-brand-white bg-brand-gridblue px-3 py-2 rounded-lg break-all">
              {btcAddress}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={t("supportus.copyButton")}
              className="p-2 flex items-center rounded-full justify-center text-brand-white hover:bg-brand-dona hover:text-brand-orange"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
      </section>
    </Seo>
  );
};

export default SupportUsPage;
