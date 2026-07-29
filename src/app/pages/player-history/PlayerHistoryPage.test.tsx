import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerHistoryPage from "./PlayerHistoryPage";
import { usePlayerHistory, usePlayerInfo } from "@matchinsights/core";
import { BannerProps } from "../../common-props/BannerProps";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ playerId: "1" }),
  };
});

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    usePlayerHistory: vi.fn(),
    usePlayerInfo: vi.fn(),
  };
});

vi.mock(
  "../../components/player-history/player-downloads/PlayerHistoryDownloads",
  () => ({
    default: ({ playerName }: any) => (
      <div data-testid="player-downloads">{playerName}</div>
    ),
  }),
);

vi.mock(
  "../../components/player-history/player-header/PlayerHistoryHeader",
  () => ({
    default: ({ player }: any) => (
      <div data-testid="player-header">{player?.name}</div>
    ),
  }),
);

vi.mock(
  "../../components/player-history/player-history-tabs/PlayerHistoryTabs",
  () => ({
    default: ({ transfers, trophies }: any) => (
      <div data-testid="player-tabs">{`Transfers: ${transfers.length}, Trophies: ${trophies.length}`}</div>
    ),
  }),
);

vi.mock("../../components/general/no-data/NoData", () => ({
  default: ({ loading }: any) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No data"}</div>
  ),
}));

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: () => <div data-testid="sub-header">SubHeader</div>,
}));

vi.mock("../../main/seo/Seo", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../main/seo/breadcrumb/Breadcrumb", () => ({
  default: () => null,
}));

vi.mock("../../components/general/video-content/VideoContentComponent", () => ({
  default: ({ videos }: any) => (
    <div data-testid="video-content">{videos.map((v: any) => v.label).join(", ")}</div>
  ),
}));

describe("PlayerHistoryPage", () => {
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };

  beforeEach(() => {
    vi.mocked(usePlayerHistory).mockReset();
    vi.mocked(usePlayerInfo).mockReset();
  });

  it("renders player history correctly when available", () => {
    vi.mocked(usePlayerHistory).mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: {
        player: { id: 2, photo: "aaaa", name: "Lionel Messi" },
        transfers: [],
        trophies: [],
      },
    });

    vi.mocked(usePlayerInfo).mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: {
        playerId: 1,
        age: 30,
        height: "180",
        weight: "75",
        injured: false,
        nationality: "Argentina",
        position: "Forward",
        teamId: 10,
        teamName: "FC Barcelona",
        teamLogo: "https://example.com/barcelona.png",
        name: "Lionel Messi",
        photo: "https://example.com/messi.png",
      },
    });

    render(
      <MemoryRouter>
        <PlayerHistoryPage apiService={{} as any} bannerProps={bannerProps} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("player-header")).toBeDefined();
    expect(screen.getByTestId("player-tabs")).toBeInTheDocument();
    expect(screen.getByText("playerhistory.head")).toBeInTheDocument();
    expect(screen.getByTestId("sub-header")).toBeInTheDocument();
    expect(screen.getByTestId("player-downloads")).toBeInTheDocument();
  });

  it("renders PlayerHistoryDownloads with the player name", () => {
    vi.mocked(usePlayerHistory).mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: {
        player: { id: 2, photo: null, name: "Ronaldinho" },
        transfers: [],
        trophies: [],
      },
    });

    vi.mocked(usePlayerInfo).mockReturnValue({
      isPlayerInfoAvailable: false,
      loadingPlayerInfo: false,
      playerInfo: undefined,
    });

    render(
      <MemoryRouter>
        <PlayerHistoryPage apiService={{} as any} bannerProps={bannerProps} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("player-downloads")).toBeInTheDocument();
  });

  it("does not render PlayerHistoryDownloads when history is unavailable", () => {
    vi.mocked(usePlayerHistory).mockReturnValue({
      isPlayerHistoryAvailable: false,
      loadingPlayerHistory: true,
      playerHistory: undefined,
    });

    vi.mocked(usePlayerInfo).mockReturnValue({
      isPlayerInfoAvailable: false,
      loadingPlayerInfo: true,
      playerInfo: undefined,
    });

    render(
      <MemoryRouter>
        <PlayerHistoryPage apiService={{} as any} bannerProps={bannerProps} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("player-downloads")).not.toBeInTheDocument();
  });

  it("renders video content when player info has videos", () => {
    vi.mocked(usePlayerHistory).mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: {
        player: { id: 2, photo: "aaaa", name: "Lionel Messi" },
        transfers: [],
        trophies: [],
      },
    });

    vi.mocked(usePlayerInfo).mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: {
        playerId: 1,
        age: 30,
        height: "180",
        weight: "75",
        injured: false,
        nationality: "Argentina",
        position: "Forward",
        teamId: 10,
        teamName: "FC Barcelona",
        teamLogo: "https://example.com/barcelona.png",
        name: "Lionel Messi",
        photo: "https://example.com/messi.png",
        videos: [{ url: "https://youtube.com/embed/abc", label: "Player Highlights" }],
      },
    });

    render(
      <MemoryRouter>
        <PlayerHistoryPage apiService={{} as any} bannerProps={bannerProps} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("video-content")).toHaveTextContent("Player Highlights");
  });

  it("does not render video content when player info has no videos", () => {
    vi.mocked(usePlayerHistory).mockReturnValue({
      isPlayerHistoryAvailable: true,
      loadingPlayerHistory: false,
      playerHistory: {
        player: { id: 2, photo: "aaaa", name: "Lionel Messi" },
        transfers: [],
        trophies: [],
      },
    });

    vi.mocked(usePlayerInfo).mockReturnValue({
      isPlayerInfoAvailable: true,
      loadingPlayerInfo: false,
      playerInfo: {
        playerId: 1,
        age: 30,
        height: "180",
        weight: "75",
        injured: false,
        nationality: "Argentina",
        position: "Forward",
        teamId: 10,
        teamName: "FC Barcelona",
        teamLogo: "https://example.com/barcelona.png",
        name: "Lionel Messi",
        photo: "https://example.com/messi.png",
        videos: [],
      },
    });

    render(
      <MemoryRouter>
        <PlayerHistoryPage apiService={{} as any} bannerProps={bannerProps} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("video-content")).not.toBeInTheDocument();
  });
});
