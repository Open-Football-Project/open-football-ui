import { useCountryBanners, useCountryExtraBanners } from "@matchinsights/core";
import BannerDisplay from "../banner-display/BannerDisplay";
import { getBannerSize } from "../../../../utils/getBannerSize";
import { BannerProps } from "../../../../common-props/BannerProps";

interface CountryBannersProps {
  bannerProps: BannerProps;
}

const CountryBanners = ({ bannerProps }: CountryBannersProps) => {
  const showBanners = import.meta.env.VITE_SHOW_BANNERS === "true";

  const countryBanners = useCountryBanners(
    getBannerSize(),
    bannerProps.countryApiHost,
    bannerProps.storage,
    bannerProps.bannersService,
    showBanners,
  );

  const countryExtraBanners = useCountryExtraBanners(
    getBannerSize(),
    bannerProps.countryApiHost,
    bannerProps.storage,
    bannerProps.bannersService,
    showBanners,
  );

  const allBanners = [...countryBanners, ...countryExtraBanners];

  return (
    <div className="px-2 sm:px-4">
      {showBanners && (
        <BannerDisplay banners={allBanners} rotationIntervalMs={4000} fadeDurationMs={400} />
      )}
    </div>
  );
};

export default CountryBanners;
