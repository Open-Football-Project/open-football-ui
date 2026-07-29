import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OddsWinnerFeelingComponent from "./OddsWinnerFeeling";
import { OddsWinnerFeeling } from "@matchinsights/core";

vi.mock("../../../../general/no-data/NoData", () => ({
  default: ({ loading }: { loading?: boolean }) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No Data"}</div>
  ),
}));

vi.mock("../../../../general/status-tile/ArrowStatusTile", () => ({
  default: ({
    status,
    isFlat,
    isUp,
  }: {
    status: string;
    isFlat: boolean;
    isUp: boolean;
  }) => (
    <div data-testid={`arrow-${status}`}>
      Status:{status} | Flat:{String(isFlat)} | Up:{String(isUp)}
    </div>
  ),
}));

describe("OddsWinnerFeelingComponent", () => {
  const mockWinnerFeeling: OddsWinnerFeeling = {
    home: "Strong Home",
    away: "Weak Away",
    draw: "No Data",
  };

  it("renders loading state", () => {
    render(
      <OddsWinnerFeelingComponent
        loading={true}
        winnerFeeling={null}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders NoData when no winnerFeeling", () => {
    render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={null}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("renders ArrowStatusTiles with correct props", () => {
    render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={mockWinnerFeeling}
        homeTeam="HomeTeam"
        awayTeam="AwayTeam"
      />
    );

    expect(screen.getByTestId("arrow-HomeTeam")).toHaveTextContent(
      "Status:HomeTeam | Flat:false | Up:true"
    );

    expect(screen.getByTestId("arrow-AwayTeam")).toHaveTextContent(
      "Status:AwayTeam | Flat:false | Up:false"
    );

    expect(screen.getByTestId("arrow-common.draw")).toHaveTextContent(
      "Status:common.draw | Flat:true | Up:false"
    );
  });

  it("treats empty string as Flat", () => {
    const wf: OddsWinnerFeeling = { home: "", away: "", draw: "" };
    render(
      <OddsWinnerFeelingComponent
        loading={false}
        winnerFeeling={wf}
        homeTeam="H"
        awayTeam="A"
      />
    );

    expect(screen.getByTestId("arrow-H")).toHaveTextContent(
      "Status:H | Flat:true | Up:false"
    );
    expect(screen.getByTestId("arrow-A")).toHaveTextContent(
      "Status:A | Flat:true | Up:false"
    );
    expect(screen.getByTestId("arrow-common.draw")).toHaveTextContent(
      "Status:common.draw | Flat:true | Up:false"
    );
  });
});
