import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LeagueGroupsPage from "./LeagueGroupsPage";
import { useLeaguePage } from "open-football-project-core";
import { LeagueInfo, ApiService } from "open-football-project-core";
import { BannerProps } from "../../../common-props/BannerProps";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ leagueId: "1" }),
  };
});

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useLeaguePage: vi.fn(),
  };
});

vi.mock("../../../components/general/sub-header/SubHeader", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="subheader">{title}</div>
  ),
}));

vi.mock("../../../components/league/groups/grp-grid/LeagueGroupGrid", () => ({
  default: ({ groups }: { groups: any[] }) => (
    <div data-testid="group-grid">Groups rendered: {groups.length}</div>
  ),
}));

vi.mock("../../../components/general/no-data/NoData", () => ({
  default: () => <div data-testid="no-data">No Data</div>,
}));

vi.mock("../../../main/seo/Seo", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockLeagueInfo: LeagueInfo = {
  id: 1,
  name: "Prof. Arg.",
  country: "Argentina",
  logo: "logo.png",
  season: 2024,
  group: [
    {
      label: "Group A",
      teams: [],
    },
    {
      label: "Group B",
      teams: [],
    },
  ],
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/groups/league/1"]}>
      <Routes>
        <Route
          path="/groups/league/:leagueId"
          element={
            <LeagueGroupsPage
              apiService={{} as ApiService}
              bannerProps={{} as BannerProps}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("LeagueGroupsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header, subheader and group grid when groups are available", () => {
    (useLeaguePage as Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: [],
      hasMultipleGroups: true,
    });

    renderPage();

    expect(screen.getByText("lggroups.title")).toBeInTheDocument();
    expect(screen.getByTestId("subheader")).toHaveTextContent("Lg..prof_arg");
    expect(screen.getByTestId("group-grid")).toHaveTextContent(
      "Groups rendered: 2"
    );
  });

  it("shows NoData when league has no groups", () => {
    (useLeaguePage as Mock).mockReturnValue({
      leagueInfo: mockLeagueInfo,
      leagueLinks: [],
      hasMultipleGroups: false,
    });

    renderPage();

    expect(screen.getByTestId("no-data")).toBeInTheDocument();
    expect(screen.queryByTestId("group-grid")).not.toBeInTheDocument();
  });

  it("shows NoData when league info is unavailable", () => {
    (useLeaguePage as Mock).mockReturnValue({
      leagueInfo: undefined,
      leagueLinks: [],
      hasMultipleGroups: true,
    });

    renderPage();

    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });
});
