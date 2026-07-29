import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GlobalBanners from "./GlobalBanners";
import { BannerType, BannerSize } from "open-football-project-core";

const mockUseGlobalBanners = vi.fn();

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useGlobalBanners: (...args: any[]) => mockUseGlobalBanners(...args),
  };
});

vi.mock("../banner-display/BannerDisplay", () => ({
  default: ({ banners }: any) => (
    <div data-testid="banner-display">{banners.length} banners</div>
  ),
}));

describe("GlobalBanners", () => {
  const mockBannersService = { bannersManager: vi.fn() } as any;

  it("renders BannerDisplay when global banners exist and VITE_SHOW_BANNERS is true", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", "true");
    mockUseGlobalBanners.mockReturnValue([
      { id: "g1", type: BannerType.Link, href: "https://example.com", imgSrc: "img.png", size: BannerSize.Wide },
    ]);

    render(<GlobalBanners bannersService={mockBannersService} />);

    expect(screen.getByTestId("banner-display")).toHaveTextContent("1 banners");
    vi.unstubAllEnvs();
  });

  it("renders nothing when VITE_SHOW_BANNERS is not set, even if banners exist", () => {
    vi.stubEnv("VITE_SHOW_BANNERS", undefined);
    mockUseGlobalBanners.mockReturnValue([
      { id: "g1", type: BannerType.Link, href: "https://example.com", imgSrc: "img.png", size: BannerSize.Wide },
    ]);

    render(<GlobalBanners bannersService={mockBannersService} />);

    expect(screen.queryByTestId("banner-display")).not.toBeInTheDocument();
    vi.unstubAllEnvs();
  });

});
