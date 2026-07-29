import { BannersService, useGlobalBanners } from "@matchinsights/core";
import BannerDisplay from "../banner-display/BannerDisplay";
import { getBannerSize } from "../../../../utils/getBannerSize";

interface GlobalBannersProps {
  bannersService: BannersService;
}

const GlobalBanners = ({ bannersService }: GlobalBannersProps) => {
  const banners = useGlobalBanners(getBannerSize(), bannersService);
  const showBanners = import.meta.env.VITE_SHOW_BANNERS === "true";

  return (
    <div className="px-2 sm:px-4">
      {showBanners && (
        <BannerDisplay banners={banners} rotationIntervalMs={5000} fadeDurationMs={500} />
      )}
    </div>
  );
};

export default GlobalBanners;
