import { BannersService, FutballeroUIStorage } from "@matchinsights/core";

export interface BannerProps {
  bannersService: BannersService;
  storage: FutballeroUIStorage;
  countryApiHost: string;
}
