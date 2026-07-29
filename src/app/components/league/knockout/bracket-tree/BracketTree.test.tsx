import { describe, it, expect, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import BracketTree from "./BracketTree";
import { BracketNode, Tie } from "open-football-project-core";

vi.mock("../../../general/no-data/NoData", () => ({
  default: () => <div data-testid="no-data" />,
}));

vi.mock("../../../general/logo/Logo", () => ({
  default: () => null,
}));

vi.mock("../tie-card/TieCard", () => ({
  default: ({ tie }: { tie: Tie }) => (
    <div data-testid="tie-card">
      {tie.t1} vs {tie.t2}
    </div>
  ),
}));

describe("BracketTree", () => {
  const decidedTie = (t1: string, t2: string, t1Score: number, t2Score: number): Tie => ({
    t1,
    t2,
    legs: [{ t1Score, t2Score, isFinished: true }],
    aggregate: { t1Score, t2Score },
  });

  const undecidedTie = (t1: string, t2: string): Tie => ({
    t1,
    t2,
    legs: [{ t1Score: null, t2Score: null, isFinished: false }],
    aggregate: null,
  });

  it("renders NoData when there is no tree", () => {
    render(<BracketTree root={null} />);
    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("orders the columns from the leaf round to the final, left to right", () => {
    const root: BracketNode = {
      roundKey: "final",
      tie: decidedTie("Palmeiras", "Flamengo", 1, 0),
      missingData: false,
      left: { roundKey: "semi_finals", tie: decidedTie("Palmeiras", "LDU de Quito", 3, 4), missingData: false },
      right: { roundKey: "semi_finals", tie: decidedTie("Flamengo", "Racing", 2, 0), missingData: false },
    };

    render(<BracketTree root={root} />);

    const headers = screen.getAllByRole("heading").map((h) => h.textContent);
    expect(headers.indexOf("semi_finals")).toBeLessThan(headers.indexOf("final"));
  });

  it("renders one TieCard per decided tie within each round's column", () => {
    const root: BracketNode = {
      roundKey: "final",
      tie: decidedTie("Palmeiras", "Flamengo", 1, 0),
      missingData: false,
      left: { roundKey: "semi_finals", tie: decidedTie("Palmeiras", "LDU de Quito", 3, 4), missingData: false },
      right: { roundKey: "semi_finals", tie: decidedTie("Flamengo", "Racing", 2, 0), missingData: false },
    };

    render(<BracketTree root={root} />);

    const semiFinalsColumn = screen.getByTestId("bracket-column-semi_finals");
    const finalColumn = screen.getByTestId("bracket-column-final");

    expect(within(semiFinalsColumn).getAllByTestId("tie-card")).toHaveLength(2);
    expect(within(finalColumn).getAllByTestId("tie-card")).toHaveLength(1);
  });

  it("renders a pending placeholder instead of a TieCard when a node has no tie yet", () => {
    const root: BracketNode = {
      roundKey: "final",
      tie: null,
      missingData: true,
      left: { roundKey: "semi_finals", tie: decidedTie("Palmeiras", "LDU de Quito", 3, 4), missingData: false },
      right: { roundKey: "semi_finals", tie: decidedTie("Flamengo", "Racing", 2, 0), missingData: false },
    };

    render(<BracketTree root={root} />);

    const finalColumn = screen.getByTestId("bracket-column-final");
    expect(within(finalColumn).getByTestId("bracket-tie-pending")).toBeInTheDocument();
    expect(within(finalColumn).queryByTestId("tie-card")).not.toBeInTheDocument();
  });

  it("renders a single column for a tree with only one round", () => {
    const root: BracketNode = {
      roundKey: "final",
      tie: decidedTie("Palmeiras", "Flamengo", 1, 0),
      missingData: false,
    };

    render(<BracketTree root={root} />);

    expect(screen.getAllByTestId("bracket-column-final")).toHaveLength(1);
    expect(screen.getAllByTestId("tie-card")).toHaveLength(1);
  });

  it("renders TiePrediction instead of TieCard for a tie that hasn't been played yet", () => {
    const root: BracketNode = {
      roundKey: "final",
      tie: undecidedTie("Real Madrid", "Man City"),
      missingData: false,
    };

    render(<BracketTree root={root} />);

    expect(screen.queryByTestId("tie-card")).not.toBeInTheDocument();
    expect(screen.getByTestId("tie-prediction-input-t1")).toBeInTheDocument();
    expect(screen.getByTestId("tie-prediction-input-t2")).toBeInTheDocument();
  });

  it("shows a missingData parent's already-decided child winner without needing a prediction", () => {
    const root: BracketNode = {
      roundKey: "final",
      tie: null,
      missingData: true,
      left: { roundKey: "semi_finals", tie: decidedTie("Palmeiras", "LDU de Quito", 3, 4), missingData: false },
      right: { roundKey: "semi_finals", tie: undecidedTie("Real Madrid", "Man City"), missingData: false },
    };

    render(<BracketTree root={root} />);

    const pending = screen.getByTestId("bracket-tie-pending");
    expect(within(pending).getByTestId("bracket-tie-pending-left")).toHaveTextContent("LDU de Quito");
    expect(within(pending).getByTestId("bracket-tie-pending-right")).toHaveTextContent("TBD");
  });

  it("shows the user's predicted winner in a missingData parent's placeholder once predicted", () => {
    const root: BracketNode = {
      roundKey: "final",
      tie: null,
      missingData: true,
      left: { roundKey: "semi_finals", tie: decidedTie("Palmeiras", "LDU de Quito", 3, 4), missingData: false },
      right: { roundKey: "semi_finals", tie: undecidedTie("Real Madrid", "Man City"), missingData: false },
    };

    render(<BracketTree root={root} />);

    fireEvent.change(screen.getByTestId("tie-prediction-input-t1"), { target: { value: "2" } });
    fireEvent.change(screen.getByTestId("tie-prediction-input-t2"), { target: { value: "1" } });

    const pending = screen.getByTestId("bracket-tie-pending");
    expect(within(pending).getByTestId("bracket-tie-pending-left")).toHaveTextContent("LDU de Quito");
    expect(within(pending).getByTestId("bracket-tie-pending-right")).toHaveTextContent("Real Madrid");
  });
});
