import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MatchDetailsThirdRow from "./MatchDetailsThirdRow";
import { H2HDetails } from "@matchinsights/core";

vi.mock("../match-details-slider/MatchDetailsSlider", () => {
  return {
    default: ({ items }: { items: any[] }) => (
      <div data-testid="slider">
        {items.length > 0 ? (
          items.map((it, idx) => (
            <div key={idx} data-testid="slide">
              {it.title} - {it.component}
            </div>
          ))
        ) : (
          <div>NoData</div>
        )}
      </div>
    ),
  };
});

vi.mock("../h2h/HeadToHead", () => {
  return {
    default: (props: any) => (
      <div data-testid="h2h">
        {props.loading ? "Loading H2H" : `H2H Loaded: ${props.h2hDetails.date}`}
      </div>
    ),
  };
});

describe("MatchDetailsThirdRow", () => {
  const homeTeamName = "Team A";
  const awayTeamName = "Team B";

  it("renders NoData when loading", () => {
    render(
      <MatchDetailsThirdRow
        h2hDetails={[{} as H2HDetails]}
        isLoading={true}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />
    );

    expect(screen.getByText("NoData")).toBeInTheDocument();
  });

  it("renders HeadToHead and slider when data is available", () => {
    const mockH2H = { date: "2025-10-27" } as H2HDetails;

    render(
      <MatchDetailsThirdRow
        h2hDetails={[mockH2H]}
        isLoading={false}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
      />
    );

    expect(screen.getByTestId("h2h")).toHaveTextContent(
      "H2H Loaded: 2025-10-27"
    );

    expect(screen.getByTestId("slide")).toHaveTextContent(
      `${homeTeamName} vs ${awayTeamName}`
    );
  });
});
