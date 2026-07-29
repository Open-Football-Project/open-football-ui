import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PlayerHistoryDownloads from "./PlayerHistoryDownloads";

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("open-football-project-core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("open-football-project-core")>();
  return {
    ...actual,
    buildPlayerHistorySvgString: vi.fn(() => "<svg></svg>"),
    getPlayerHistorySvgDimensions: vi.fn(() => ({ width: 800, height: 400 })),
    TransfersSvgStrategy: vi.fn().mockImplementation(() => ({
      filterItems: vi.fn((items: unknown[]) => items),
      getFilename: vi.fn(() => "transfers.png"),
    })),
    TrophiesSvgStrategy: vi.fn().mockImplementation(() => ({
      filterItems: vi.fn((items: unknown[]) => items),
      getFilename: vi.fn(() => "trophies.png"),
    })),
    QuizMixSvgStrategy: vi.fn().mockImplementation(() => ({
      filterItems: vi.fn((items: unknown[]) => items),
      getFilename: vi.fn(() => "quiz.png"),
    })),
  };
});

const baseTransfer = {
  date: "2021-08-10",
  fromTeamName: "Barcelona",
  fromTeamLogo: null,
  toTeamName: "PSG",
  toTeamLogo: null,
};

const baseTrophy = {
  league: "FIFA World Cup",
  country: "QA",
  season: "2022",
  place: "1st",
};

describe("PlayerHistoryDownloads", () => {
  it("renders all three download buttons", () => {
    render(
      <PlayerHistoryDownloads
        playerName="Lionel Messi"
        playerPhoto="/messi.jpg"
        transfers={[]}
        trophies={[]}
      />,
    );

    expect(
      screen.getByText("playerhistory.downloadTransfers"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("playerhistory.downloadTrophies"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("playerhistory.downloadQuiz"),
    ).toBeInTheDocument();
  });

  it("disables transfers button when there are no transfers", () => {
    render(
      <PlayerHistoryDownloads
        playerName="Lionel Messi"
        playerPhoto="/messi.jpg"
        transfers={[]}
        trophies={[baseTrophy]}
      />,
    );

    const transfersBtn = screen.getByText("playerhistory.downloadTransfers").closest("button");
    const trophiesBtn = screen.getByText("playerhistory.downloadTrophies").closest("button");

    expect(transfersBtn).toBeDisabled();
    expect(trophiesBtn).not.toBeDisabled();
  });

  it("disables trophies button when there are no trophies", () => {
    render(
      <PlayerHistoryDownloads
        playerName="Lionel Messi"
        playerPhoto="/messi.jpg"
        transfers={[baseTransfer]}
        trophies={[]}
      />,
    );

    const trophiesBtn = screen.getByText("playerhistory.downloadTrophies").closest("button");
    const transfersBtn = screen.getByText("playerhistory.downloadTransfers").closest("button");

    expect(trophiesBtn).toBeDisabled();
    expect(transfersBtn).not.toBeDisabled();
  });

  it("disables quiz button when there are no transfers and no trophies", () => {
    render(
      <PlayerHistoryDownloads
        playerName="Lionel Messi"
        playerPhoto="/messi.jpg"
        transfers={[]}
        trophies={[]}
      />,
    );

    const quizBtn = screen.getByText("playerhistory.downloadQuiz").closest("button");
    expect(quizBtn).toBeDisabled();
  });

  it("enables all buttons when data is present", () => {
    render(
      <PlayerHistoryDownloads
        playerName="Lionel Messi"
        playerPhoto="/messi.jpg"
        transfers={[baseTransfer]}
        trophies={[baseTrophy]}
      />,
    );

    const transfersBtn = screen.getByText("playerhistory.downloadTransfers").closest("button");
    const trophiesBtn = screen.getByText("playerhistory.downloadTrophies").closest("button");
    const quizBtn = screen.getByText("playerhistory.downloadQuiz").closest("button");

    expect(transfersBtn).not.toBeDisabled();
    expect(trophiesBtn).not.toBeDisabled();
    expect(quizBtn).not.toBeDisabled();
  });

  it("shows loading indicator when transfers download is in progress", async () => {
    const { svgToPng } = await import("../../../converter/svg-png-converter/svg-png-converter");
    let resolveDownload!: () => void;
    (svgToPng as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise<void>((res) => { resolveDownload = res; }),
    );

    render(
      <PlayerHistoryDownloads
        playerName="Lionel Messi"
        playerPhoto="/messi.jpg"
        transfers={[baseTransfer]}
        trophies={[]}
      />,
    );

    const transfersBtn = screen.getByText("playerhistory.downloadTransfers").closest("button")!;
    fireEvent.click(transfersBtn);

    await waitFor(() => {
      expect(transfersBtn).toHaveTextContent("…");
    });

    resolveDownload();

    await waitFor(() => {
      expect(transfersBtn).toHaveTextContent("playerhistory.downloadTransfers");
    });
  });
});
