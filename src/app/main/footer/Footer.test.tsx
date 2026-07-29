import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import Footer from "./Footer";
import { BannersService, FutballeroUIStorage } from "@matchinsights/core";

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
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
const mockStorage = {} as FutballeroUIStorage;
const mockCountryApiHost = "https://api.country.is";

describe("Footer", () => {
  it("renders without crashing", () => {
    render(<Footer bannersService={mockBannersService} storage={mockStorage} countryApiHost={mockCountryApiHost} />);
  });
});
