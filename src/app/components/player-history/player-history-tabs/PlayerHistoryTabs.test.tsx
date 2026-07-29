import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PlayerHistoryTabs from "./PlayerHistoryTabs";
import { PlayerTransferInfo, PlayerTrophyInfo } from "@matchinsights/core";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../player-transfers/PlayerTransfers", () => ({
  default: ({ transfers }: { transfers: any[] }) => (
    <div data-testid="transfers">{`Transfers ${transfers.length}`}</div>
  ),
}));

vi.mock("../player-trophies/PlayerTrophies", () => ({
  default: ({ trophies }: { trophies: any[] }) => (
    <div data-testid="trophies">{`Trophies ${trophies.length}`}</div>
  ),
}));

describe("PlayerHistoryTabs Component", () => {
  const transfersMock: PlayerTransferInfo[] = [
    {
      fromTeamName: "t0",
      toTeamName: "t1",
      date: "28/02/205",
      fromTeamId: 1,
      toTeamId: 2,
    },
  ];
  const trophiesMock: PlayerTrophyInfo[] = [
    { country: "c1", league: "l1", place: "1st", season: "s1" },
  ];

  it("renders transfers tab by default", () => {
    render(
      <PlayerHistoryTabs transfers={transfersMock} trophies={trophiesMock} />
    );
    expect(screen.getByTestId("transfers")).toHaveTextContent("Transfers 1");
    expect(screen.queryByTestId("trophies")).not.toBeInTheDocument();
  });

  it("switches to trophies tab when clicked", () => {
    render(
      <PlayerHistoryTabs transfers={transfersMock} trophies={trophiesMock} />
    );

    const trophiesButton = screen.getByText("common.trophies");
    fireEvent.click(trophiesButton);

    expect(screen.getByTestId("trophies")).toHaveTextContent("Trophies 1");
    expect(screen.queryByTestId("transfers")).not.toBeInTheDocument();
  });

  it("switches back to transfers tab when clicked again", () => {
    render(
      <PlayerHistoryTabs transfers={transfersMock} trophies={trophiesMock} />
    );

    fireEvent.click(screen.getByText("common.trophies"));
    fireEvent.click(screen.getByText("common.transfers"));

    expect(screen.getByTestId("transfers")).toHaveTextContent("Transfers 1");
    expect(screen.queryByTestId("trophies")).not.toBeInTheDocument();
  });
});
