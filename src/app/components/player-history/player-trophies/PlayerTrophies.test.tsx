import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlayerTrophies from "./PlayerTrophies";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => opts?.defaultValue || key,
  }),
}));

describe("PlayerTrophies Component", () => {
  const trophies = [
    {
      league: "LaLiga",
      country: "Spain",
      season: "2020/21",
      place: "Winner",
    },
    {
      league: "Champions League",
      country: "Europe",
      season: "2021/22",
      place: "Runner-up",
    },
  ];

  it("renders NoData when trophies array is empty", () => {
    render(<PlayerTrophies trophies={[]} />);
    expect(screen.getByText(/nodata.default/i)).toBeInTheDocument();
  });

  it("renders trophy cards for each item", () => {
    render(<PlayerTrophies trophies={trophies} />);
    const cards = screen.getAllByText(/Winner|Runner-up/i);
    expect(cards.length).toBe(2);
  });

  it("renders league, country, season, and place fields", () => {
    render(<PlayerTrophies trophies={trophies} />);
    expect(screen.getByText("LaLiga")).toBeInTheDocument();
    expect(screen.getByText("Spain")).toBeInTheDocument();
    expect(screen.getByText("2020/21")).toBeInTheDocument();
    expect(screen.getByText("Winner")).toBeInTheDocument();

    expect(screen.getByText("Champions Lg.")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("2021/22")).toBeInTheDocument();
    expect(screen.getByText("Runner-up")).toBeInTheDocument();
  });
});
