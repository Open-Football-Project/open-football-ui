import { BannerSize } from "@matchinsights/core";

export const getBannerSize = (): BannerSize =>
  window.innerWidth >= 768 ? BannerSize.Wide : BannerSize.Narrow;
