import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CountryBanners from "./CountryBanners";
import { BannerType, BannerSize } from "@matchinsights/core";
import { BannerProps } from "../../../../common-props/BannerProps";

const mockUseCountryBanners = vi.fn();
const mockUseCountryExtraBanners = vi.fn();

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useCountryBanners: (...args: any[]) => mockUseCountryBanners(...args),
    useCountryExtraBanners: (...args: any[]) => mockUseCountryExtraBanners(...args),
  };
});

vi.mock("../banner-display/BannerDisplay", () => ({
  default: ({ banners }: any) => (
    <div data-testid="banner-display">{banners.length} banners</div>
  ),
}));

const bannerProps: BannerProps = {
  bannersService: { bannersManager: vi.fn() } as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

describe("CountryBanners", () => {
  it("renders BannerDisplay with merged country + extra banners", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", "true");
    mockUseCountryBanners.mockReturnValue([
      { id: "c1", type: BannerType.Link, href: "https://a.com", imgSrc: "a.png", size: BannerSize.Wide },
    ]);
    mockUseCountryExtraBanners.mockReturnValue([
      { id: "e1", type: BannerType.Link, href: "https://b.com", imgSrc: "b.png", size: BannerSize.Wide },
    ]);

    render(<CountryBanners bannerProps={bannerProps} />);

    expect(screen.getByTestId("banner-display")).toHaveTextContent("2 banners");
    vi.unstubAllEnvs();
  });

  it("passes enabled=true to the hooks when VITE_SHOW_BANNERS is true", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", "true");
    mockUseCountryBanners.mockReturnValue([]);
    mockUseCountryExtraBanners.mockReturnValue([]);

    render(<CountryBanners bannerProps={bannerProps} />);

    expect(mockUseCountryBanners).toHaveBeenCalledWith(
      expect.anything(), expect.anything(), expect.anything(), expect.anything(), true,
    );
    expect(mockUseCountryExtraBanners).toHaveBeenCalledWith(
      expect.anything(), expect.anything(), expect.anything(), expect.anything(), true,
    );
    vi.unstubAllEnvs();
  });

  it("passes enabled=false to the hooks when VITE_SHOW_BANNERS is not set", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", undefined);
    mockUseCountryBanners.mockReturnValue([]);
    mockUseCountryExtraBanners.mockReturnValue([]);

    render(<CountryBanners bannerProps={bannerProps} />);

    expect(mockUseCountryBanners).toHaveBeenCalledWith(
      expect.anything(), expect.anything(), expect.anything(), expect.anything(), false,
    );
    expect(mockUseCountryExtraBanners).toHaveBeenCalledWith(
      expect.anything(), expect.anything(), expect.anything(), expect.anything(), false,
    );
    vi.unstubAllEnvs();
  });

  it("does not render BannerDisplay when VITE_SHOW_BANNERS is not set, even if banners exist", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", undefined);
    mockUseCountryBanners.mockReturnValue([
      { id: "c1", type: BannerType.Link, href: "https://a.com", imgSrc: "a.png", size: BannerSize.Wide },
    ]);
    mockUseCountryExtraBanners.mockReturnValue([
      { id: "e1", type: BannerType.Link, href: "https://b.com", imgSrc: "b.png", size: BannerSize.Wide },
    ]);

    render(<CountryBanners bannerProps={bannerProps} />);

    expect(screen.queryByTestId("banner-display")).not.toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it("renders BannerDisplay when only country banners exist", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", "true");
    mockUseCountryBanners.mockReturnValue([
      { id: "c1", type: BannerType.Link, href: "https://a.com", imgSrc: "a.png", size: BannerSize.Wide },
    ]);
    mockUseCountryExtraBanners.mockReturnValue([]);

    render(<CountryBanners bannerProps={bannerProps} />);

    expect(screen.getByTestId("banner-display")).toHaveTextContent("1 banners");
    vi.unstubAllEnvs();
  });

  it("renders BannerDisplay when only extra banners exist", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", "true");
    mockUseCountryBanners.mockReturnValue([]);
    mockUseCountryExtraBanners.mockReturnValue([
      { id: "e1", type: BannerType.Link, href: "https://b.com", imgSrc: "b.png", size: BannerSize.Wide },
    ]);

    render(<CountryBanners bannerProps={bannerProps} />);

    expect(screen.getByTestId("banner-display")).toHaveTextContent("1 banners");
    vi.unstubAllEnvs();
  });

});
