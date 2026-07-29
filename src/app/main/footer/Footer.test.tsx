import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import Footer from "./Footer";
import { BannersService, FootballProjectUIStorage } from "open-football-project-core";

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
  };
});

vi.mock("../../components/general/banners/global-banners/GlobalBanners", () => ({
  default: () => null,
}));

vi.mock("../../components/general/banners/country-banners/CountryBanners", () => ({
  default: () => null,
}));

const mockBannersService = { bannersManager: vi.fn() } as unknown as BannersService;
const mockStorage = {} as FootballProjectUIStorage;
const mockCountryApiHost = "https://api.country.is";

describe("Footer", () => {
  it("renders without crashing", () => {
    render(<Footer bannersService={mockBannersService} storage={mockStorage} countryApiHost={mockCountryApiHost} />);
  });
});
