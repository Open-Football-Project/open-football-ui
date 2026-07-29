import { useState, useEffect } from "react";
import { AnyBanner, BannerSize, BannerType } from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import ScriptBannerDisplay from "../script-banner-display/ScriptBannerDisplay";
import LinkBannerDisplay from "../link-banner-display/LinkBannerDisplay";
import HtmlBannerDisplay from "../html-banner-display/HtmlBannerDisplay";
import CompositeBannerDisplay from "../composite-banner-display/CompositeBannerDisplay";

interface Props {
  banners: AnyBanner[];
  rotationIntervalMs?: number;
  fadeDurationMs?: number;
}

const DEFAULT_ROTATION_INTERVAL_MS = 5000;
const DEFAULT_FADE_DURATION_MS = 500;

const sizeClasses: Record<BannerSize, string> = {
  [BannerSize.Wide]: "w-full h-24",
  [BannerSize.Narrow]: "w-full h-16",
};

const BannerDisplay = ({ banners, rotationIntervalMs = DEFAULT_ROTATION_INTERVAL_MS, fadeDurationMs = DEFAULT_FADE_DURATION_MS }: Props) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(() =>
    banners.length > 1 ? Math.floor(Math.random() * banners.length) : 0
  );
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % banners.length);
        setFading(false);
      }, fadeDurationMs);
    }, rotationIntervalMs);
    return () => clearInterval(timer);
  }, [banners.length, rotationIntervalMs, fadeDurationMs]);

  if (banners.length === 0) return null;

  const banner = banners[index];


  const renderBanner = () => {
    switch (banner.type) {
      case BannerType.Script:
        return <ScriptBannerDisplay banner={banner} />;
      case BannerType.Link:
        return <LinkBannerDisplay banner={banner} />;
      case BannerType.Html:
        return <HtmlBannerDisplay banner={banner} />;
      case BannerType.Composite:
        return <CompositeBannerDisplay banner={banner} />;
    }
  };

  const wrapperClass = banner.type === BannerType.Composite
    ? "w-full"
    : sizeClasses[banner.size];

  return (
    <div
      className={`${wrapperClass} flex flex-col justify-center my-8 ${fading ? "opacity-0" : "opacity-100"}`}
      style={{ transition: `opacity ${fadeDurationMs}ms` }}
    >
      {renderBanner()}
      {banner.showGambleAware && (
        <p className="text-[10px] text-white/50 text-center mt-1">
          {t("odds.gamble_aware", { defaultValue: "+18 | Gamble Aware" })}
        </p>
      )}
    </div>
  );
};

export default BannerDisplay;
