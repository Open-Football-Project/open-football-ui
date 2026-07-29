import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SubHeader from "./SubHeader";
import { MemoryRouter } from "react-router-dom";
import { ApiService } from "open-football-project-core";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../leagues-menu/LeaguesMenu", () => ({
  LeaguesMenu: () => <div data-testid="leagues-menu">leagues-menu</div>,
}));

vi.mock("../banners/global-banners/GlobalBanners", () => ({
  default: () => <div data-testid="banner-display" />,
}));

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useNewsInfo: vi.fn(() => ({
      isPlayerNewsAvailable: true,
      news: [
        {
          title:
            "Pablo Durán y Borja Iglesias, listos para reaparecer ante el Valencia",
          url: "https://www.marca.com/futbol/celta/2026/01/01/pablo-duran-borja-iglesias-listos-reaparecer-valencia.html",
          description:
            "El fantasma de la temporada 2028/19 se apodera del entorno viendo a su equipo incapaz de mejorar",
          image:
            "https://objetos-xlk.estaticos-marca.com/files/og_thumbnail/uploads/2025/11/16/691998c47b1bf.jpeg",
          source: "https://www.marca.com/rss/futbol.xml",
        },
        {
          title: "Mercado de fichajes de invierno: altas, bajas y rumores",
          url: "https://www.marca.com/futbol/primera-division/2025/12/29/mercado-fichajes-invierno-2026-laliga-ea-sports-altas-bajas-rumores.html",
          description:
            "El Betis resistió ante el líder, se pone quinto provisional de LaLiga y sueña con la Champions",
          image:
            "https://objetos-xlk.estaticos-marca.com/files/og_thumbnail/uploads/2025/12/29/6952a22fe4121.jpeg",
          source: "https://www.marca.com/rss/futbol.xml",
        },
      ],
    })),
  };
});

describe("SubHeader component", () => {
  let mockApiService: any;

  it("renders the title and league menu", () => {
    const mockBannerService = {
      bannersManager: vi.fn(() => ({
        getCountryCode: vi.fn(async () => "AR"),
        getBannerScripts: vi.fn(() => [
          { id: "1", scscriptSrcript: "banner1", isWide: true },
          { id: "2", scriptSrc: "banner2", isWide: true },
        ]),
      })),
    } as any;

    render(
      <MemoryRouter>
        <SubHeader
          title="Test Title"
          apiService={mockApiService as ApiService}
          bannersService={mockBannerService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders optional link buttons", () => {
    const mockBannerService = {
      bannersManager: vi.fn(() => ({
        getCountryCode: vi.fn(async () => "US"),
        getBannerScripts: vi.fn(() => [
          { id: "1", scriptSrc: "banner1", isWide: true },
          { id: "2", scriptSrc: "banner2", isWide: true },
        ]),
      })),
    } as any;
    render(
      <MemoryRouter>
        <SubHeader
          title="Test Title"
          optionalLinks={[{ label: "Link 1", url: "/link1" }]}
          apiService={mockApiService as ApiService}
          bannersService={mockBannerService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Link 1")).toBeInTheDocument();
  });

  it("renders BannerDisplay when global banners are available", () => {
    const mockBannerService = { bannersManager: vi.fn() } as any;

    render(
      <MemoryRouter>
        <SubHeader
          title="Banner Test"
          bannersService={mockBannerService}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("banner-display")).toBeInTheDocument();
  });
});
