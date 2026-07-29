import { BannersService, FootballProjectUIStorage } from "open-football-project-core";

export interface BannerProps {
  bannersService: BannersService;
  storage: FootballProjectUIStorage;
  countryApiHost: string;
}
