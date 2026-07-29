import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TeamsRestStatusComponent from "./TeamRestStatus";
import { TeamsRestStatus } from "open-football-project-core";

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

describe("TeamsRestStatusComponent", () => {
  const mockStatus: TeamsRestStatus = {
    homeTeamStatus: "Good Rest",
    awayTeamStatus: "Moderate",
  };

  it("renders loading state", () => {
    render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={true}
        restStatus={null}
      />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders NoData when restStatus is null and loading is false", () => {
    render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={null}
      />
    );
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("renders home team ArrowStatusTile correctly", () => {
    render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={mockStatus}
      />
    );

    const arrow = screen.getByTestId("arrow-common.good_rest");
    expect(arrow).toHaveTextContent(
      "Status:common.good_rest | Flat:false | Up:true"
    );
  });

  it("renders away team ArrowStatusTile correctly", () => {
    render(
      <TeamsRestStatusComponent
        isHome={false}
        loading={false}
        restStatus={mockStatus}
      />
    );

    const arrow = screen.getByTestId("arrow-common.moderate");
    expect(arrow).toHaveTextContent(
      "Status:common.moderate | Flat:true | Up:false"
    );
  });

  it("handles unknown/empty status as flat", () => {
    const status: TeamsRestStatus = {
      homeTeamStatus: "",
      awayTeamStatus: "Unknown",
    };

    render(
      <TeamsRestStatusComponent
        isHome={true}
        loading={false}
        restStatus={status}
      />
    );
    expect(screen.getByTestId("arrow-common.")).toHaveTextContent(
      "Status:common. | Flat:true | Up:false"
    );

    render(
      <TeamsRestStatusComponent
        isHome={false}
        loading={false}
        restStatus={status}
      />
    );
    expect(screen.getByTestId("arrow-common.unknown")).toHaveTextContent(
      "Status:common.unknown | Flat:true | Up:false"
    );
  });
});
