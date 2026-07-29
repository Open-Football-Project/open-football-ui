import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AllLeagues from "./AllLeagues";
import { LeaguesGroups } from "@matchinsights/core";
import { BannerProps } from "../../common-props/BannerProps";

vi.mock("../../components/league/leagues-menu/LeaguesMenu", () => ({
  LeaguesMenu: ({
    leaguesGroups,
    loading,
  }: {
    leaguesGroups: any;
    loading: boolean;
  }) => (
    <div data-testid="leagues-menu">
      <span>loading: {loading ? "true" : "false"}</span>
      <span>groups: {leaguesGroups ? "present" : "null"}</span>
    </div>
  ),
}));

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="subheader">SubHeader: {title}</div>
  ),
}));

vi.mock("../../main/seo/Seo", () => {
  return {
    default: ({ children }: any) => <>{children}</>,
  };
});

vi.mock("../../main/seo/breadcrumb/Breadcrumb", () => ({
  default: () => null,
}));

describe("AllLeagues", () => {
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };

  const mockGroups: LeaguesGroups = {
    internationals: [{ id: 1, name: "World Cup", type: "cup" }],
    others: [],
    countryLeagues: [
      {
        country: "England",
        leagues: [{ id: 2, name: "Premier League", type: "league" }],
      },
    ],
  };

  it("renders loading state initially", () => {
    const apiService = {
      leagueService: { fetchLeaguesGroups: vi.fn(() => new Promise(() => {})) },
    };
    render(<AllLeagues apiService={apiService as any} bannerProps={bannerProps} />);
    expect(screen.getByText("loading: true")).toBeInTheDocument();
  });

  it("renders leagues on successful fetch", async () => {
    const apiService = {
      leagueService: {
        fetchLeaguesGroups: vi.fn().mockResolvedValue(mockGroups),
      },
    };
    render(<AllLeagues apiService={apiService as any} bannerProps={bannerProps} />);

    await waitFor(() => {
      expect(screen.getByText("loading: false")).toBeInTheDocument();
      expect(screen.getByText("groups: present")).toBeInTheDocument();
    });
  });

  it("renders null groups on fetch failure", async () => {
    const apiService = {
      leagueService: {
        fetchLeaguesGroups: vi.fn().mockRejectedValue(new Error("fail")),
      },
    };
    render(<AllLeagues apiService={apiService as any} bannerProps={bannerProps} />);

    await waitFor(() => {
      expect(screen.getByText("loading: false")).toBeInTheDocument();
      expect(screen.getByText("groups: null")).toBeInTheDocument();
    });
  });

  it("renders subheader", async () => {
    const apiService = {
      leagueService: {
        fetchLeaguesGroups: vi.fn().mockResolvedValue(mockGroups),
      },
    };
    render(<AllLeagues apiService={apiService as any} bannerProps={bannerProps} />);

    const subheader = screen.getByTestId("subheader");

    expect(subheader).toBeInTheDocument();
  });
});
