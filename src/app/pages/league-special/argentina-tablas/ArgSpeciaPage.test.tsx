import { render, screen, waitFor } from "@testing-library/react";
import ArgSpecialPage from "./ArgSpecialPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { ArgSpecial } from "@matchinsights/core";
import { BannerProps } from "../../../common-props/BannerProps";

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useLeaguePage: vi.fn(),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../components/league/arg-special/ArgSpecialTable", () => ({
  default: ({ teams, mode }: any) => (
    <div data-testid={`arg-special-${mode}`}>
      {teams.map((t: any) => t.teamName).join(",")}
    </div>
  ),
}));

vi.mock("../../../main/seo/Seo", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock("../../../components/general/sub-header/SubHeader", () => ({
  default: () => <div data-testid="subheader" />,
}));

vi.mock("../../../components/general/no-data/NoData", () => ({
  default: ({ loading }: any) => (
    <div data-testid={loading ? "loading" : "nodata"} />
  ),
}));

import { useLeaguePage } from "@matchinsights/core";

describe("ArgSpecialPage", () => {
  const mockApiService: any = {};
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };
  const mockArgSpecial: ArgSpecial = {
    annualTable: [
      { teamId: 1, teamName: "Team A" },
      { teamId: 2, teamName: "Team B" },
    ],
    promediosTable: [
      { teamId: 1, teamName: "Team A" },
      { teamId: 2, teamName: "Team B" },
    ],
  };

  const renderPage = (leagueId: string) =>
    render(
      <MemoryRouter initialEntries={[`/league/special/${leagueId}`]}>
        <Routes>
          <Route
            path="/league/special/:leagueId"
            element={
              <ArgSpecialPage
                apiService={mockApiService}
                bannerProps={bannerProps}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    (useLeaguePage as any).mockReset();
  });

  it("renders loading state correctly", () => {
    (useLeaguePage as any).mockReturnValue({
      leagueInfo: null,
      leagueLinks: [],
      isArgSpecialAvailable: false,
      loadingArgSpecial: true,
      loadingLeagueInfo: true,
      argSpecial: null,
    });

    renderPage("123");
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders NoData when argSpecial is not available", () => {
    (useLeaguePage as any).mockReturnValue({
      leagueInfo: null,
      leagueLinks: [],
      isArgSpecialAvailable: false,
      loadingArgSpecial: false,
      loadingLeagueInfo: false,
      argSpecial: null,
    });

    renderPage("123");
    expect(screen.getByTestId("nodata")).toBeInTheDocument();
  });

  it("renders ArgSpecialTable for annual and promedios when data is available", async () => {
    (useLeaguePage as any).mockReturnValue({
      leagueInfo: { logo: "logo.png", country: "Argentina" },
      leagueLinks: [],
      isArgSpecialAvailable: true,
      loadingArgSpecial: false,
      loadingLeagueInfo: false,
      argSpecial: {
        annualTable: [
          { teamId: 1, teamName: "Team A" },
          { teamId: 2, teamName: "Team B" },
        ],
        promediosTable: [
          { teamId: 3, teamName: "Team C" },
          { teamId: 4, teamName: "Team D" },
        ],
      },
    });

    render(
      <MemoryRouter initialEntries={["/league/special/123"]}>
        <Routes>
          <Route
            path="/league/special/:leagueId"
            element={
              <ArgSpecialPage
                apiService={mockApiService}
                bannerProps={bannerProps}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const annual = await screen.findByTestId("arg-special-annual");
    const promedios = await screen.findByTestId("arg-special-promedios");

    expect(annual).toHaveTextContent("Team A,Team B");
    expect(promedios).toHaveTextContent("Team C,Team D");
  });
});
