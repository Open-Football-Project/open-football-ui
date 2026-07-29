import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TieCard from "./TieCard";
import { Tie } from "@matchinsights/core";

vi.mock("../../../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="logo" src={src} alt="team-logo" />
  ),
}));

describe("TieCard", () => {
  // Real Libertadores 2025 semifinal, LDU de Quito vs Palmeiras.
  // Leg 1 (home LDU): LDU 3-0 Palmeiras. Leg 2 (home Palmeiras): Palmeiras 4-0 LDU.
  // Real aggregate: LDU 3, Palmeiras 4 (Palmeiras advances).
  const twoLeggedTie: Tie = {
    t1: "LDU de Quito",
    t1logo: "/ldu.png",
    t2: "Palmeiras",
    t2logo: "/palmeiras.png",
    legs: [
      { t1Score: 3, t2Score: 0, isFinished: true },
      { t1Score: 0, t2Score: 4, isFinished: true },
    ],
    aggregate: { t1Score: 3, t2Score: 4 },
  };

  const pendingTwoLeggedTie: Tie = {
    t1: "Real Madrid",
    t1logo: "/rm.png",
    t2: "Man City",
    t2logo: "/mc.png",
    legs: [
      { t1Score: 2, t2Score: 1, isFinished: true },
      { t1Score: null, t2Score: null, isFinished: false },
    ],
    aggregate: null,
  };

  const singleMatchTie: Tie = {
    t1: "Palmeiras",
    t1logo: "/palmeiras.png",
    t2: "Flamengo",
    t2logo: "/flamengo.png",
    legs: [{ t1Score: 0, t2Score: 1, isFinished: true }],
    aggregate: { t1Score: 0, t2Score: 1 },
  };

  const upcomingSingleMatchTie: Tie = {
    t1: "Palmeiras",
    t1logo: "/palmeiras.png",
    t2: "Flamengo",
    t2logo: "/flamengo.png",
    legs: [{ t1Score: null, t2Score: null, isFinished: false }],
    aggregate: null,
  };

  it("renders both team names", () => {
    render(<TieCard tie={twoLeggedTie} />);
    expect(screen.getByText("LDU de Quito")).toBeInTheDocument();
    expect(screen.getByText("Palmeiras")).toBeInTheDocument();
  });

  it("renders both team logos", () => {
    render(<TieCard tie={twoLeggedTie} />);
    const logos = screen.getAllByTestId("logo");
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveAttribute("src", "/ldu.png");
    expect(logos[1]).toHaveAttribute("src", "/palmeiras.png");
  });

  it("renders a single score and no leg/aggregate rows for a single-match tie", () => {
    render(<TieCard tie={singleMatchTie} />);
    expect(screen.getByTestId("tie-single-score")).toHaveTextContent("0 – 1");
    expect(screen.queryByTestId("tie-leg1-score")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tie-leg2-score")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tie-aggregate-score")).not.toBeInTheDocument();
  });

  it("renders a placeholder score for an unplayed single-match tie", () => {
    render(<TieCard tie={upcomingSingleMatchTie} />);
    expect(screen.getByTestId("tie-single-score")).toHaveTextContent("–");
  });

  it("renders leg 1, leg 2, and the correct aggregate for a decided two-legged tie (regression: aggregate must be 3-4, not 7-0)", () => {
    render(<TieCard tie={twoLeggedTie} />);
    expect(screen.getByTestId("tie-leg1-score")).toHaveTextContent("3 – 0");
    expect(screen.getByTestId("tie-leg2-score")).toHaveTextContent("0 – 4");
    expect(screen.getByTestId("tie-aggregate-score")).toHaveTextContent("3 – 4");
  });

  it("renders leg 2 and the aggregate as placeholders while a two-legged tie is still undecided", () => {
    render(<TieCard tie={pendingTwoLeggedTie} />);
    expect(screen.getByTestId("tie-leg1-score")).toHaveTextContent("2 – 1");
    expect(screen.getByTestId("tie-leg2-score")).toHaveTextContent("–");
    expect(screen.getByTestId("tie-aggregate-score")).toHaveTextContent("–");
  });
});
