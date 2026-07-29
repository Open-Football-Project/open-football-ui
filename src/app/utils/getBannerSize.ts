import { BannerSize } from "open-football-project-core";

export const getBannerSize = (): BannerSize =>
  window.innerWidth >= 768 ? BannerSize.Wide : BannerSize.Narrow;
