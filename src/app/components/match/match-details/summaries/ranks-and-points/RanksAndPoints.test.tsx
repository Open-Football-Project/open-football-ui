import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RanksAndPoints } from "./RanksAndPoints";
import { PositionAndPoints } from "@matchinsights/core";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

describe("RanksAndPoints Component", () => {
  const mockData: PositionAndPoints[] = [
    { description: "Team A", position: 1, points: 30 },
    { description: "Team B", position: 2, points: 25 },
  ];

  it("renders loading state", () => {
    const { container } = render(<RanksAndPoints positionAndPoints={[]} loading={true} />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders NoData when array is empty and loading is false", () => {
    render(<RanksAndPoints positionAndPoints={[]} loading={false} />);
    expect(screen.getByText("nodata.default")).toBeInTheDocument();
  });

  it("renders TinyCards for each positionAndPoints item", () => {
    render(<RanksAndPoints positionAndPoints={mockData} loading={false} />);

    expect(screen.getByTestId("Team A-0")).toBeInTheDocument();
    expect(screen.getByTestId("Team B-1")).toBeInTheDocument();

    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
