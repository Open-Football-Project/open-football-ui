import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IndicatorResult } from "open-football-project-core";
import { LiveMatchPieChart } from "./LiveMatchPieChart";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) =>
      opts?.team ? `${opts.team} ${key}` : key,
  }),
}));

const buildIndicator = (homePercent: number, awayPercent: number): IndicatorResult => ({
  emoji: "⚡",
  label: "indicators.momentum",
  homePercent,
  awayPercent,
});

const HOME = "Arsenal";
const AWAY = "Chelsea";

describe("LiveMatchPieChart", () => {
  it("renders the indicator label", () => {
    render(
      <LiveMatchPieChart indicator={buildIndicator(60, 40)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
    );
    expect(screen.getByText(/indicators\.momentum/)).toBeInTheDocument();
  });

  it("renders home and away team names", () => {
    render(
      <LiveMatchPieChart indicator={buildIndicator(60, 40)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
    );
    expect(screen.getByText(HOME)).toBeInTheDocument();
    expect(screen.getByText(AWAY)).toBeInTheDocument();
  });

  it("renders home and away percentages", () => {
    render(
      <LiveMatchPieChart indicator={buildIndicator(65, 35)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
    );
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();
  });

  describe("verdict label", () => {
    it("shows home team dominating when homePercent >= 70", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(75, 25)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      expect(screen.getByText(`${HOME} indicators.verdict.dominating`)).toBeInTheDocument();
    });

    it("shows home team ahead when homePercent is between 58 and 69", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(62, 38)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      expect(screen.getByText(`${HOME} indicators.verdict.ahead`)).toBeInTheDocument();
    });

    it("shows even battle when homePercent is between 43 and 57", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(50, 50)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      expect(screen.getByText("indicators.verdict.even")).toBeInTheDocument();
    });

    it("shows away team ahead when homePercent is between 31 and 42", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(38, 62)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      expect(screen.getByText(`${AWAY} indicators.verdict.ahead`)).toBeInTheDocument();
    });

    it("shows away team dominating when homePercent <= 30", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(25, 75)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      expect(screen.getByText(`${AWAY} indicators.verdict.dominating`)).toBeInTheDocument();
    });

    it("shows no-data verdict when hasData is false", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(50, 50)} homeTeamName={HOME} awayTeamName={AWAY} hasData={false} />
      );
      expect(screen.getByText("indicators.verdict.no_data")).toBeInTheDocument();
    });
  });

  describe("verdict text color", () => {
    it("applies orange class when home team is leading", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(60, 40)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      const verdict = screen.getByText(`${HOME} indicators.verdict.ahead`);
      expect(verdict.className).toContain("text-brand-orange");
    });

    it("applies aqualight class when away team is leading", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(40, 60)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      const verdict = screen.getByText(`${AWAY} indicators.verdict.ahead`);
      expect(verdict.className).toContain("text-brand-aqualight");
    });

    it("applies yellow class when match is contested", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(50, 50)} homeTeamName={HOME} awayTeamName={AWAY} hasData={true} />
      );
      const verdict = screen.getByText("indicators.verdict.even");
      expect(verdict.className).toContain("text-brand-yellow");
    });

    it("applies yellow class when there is no data", () => {
      render(
        <LiveMatchPieChart indicator={buildIndicator(50, 50)} homeTeamName={HOME} awayTeamName={AWAY} hasData={false} />
      );
      const verdict = screen.getByText("indicators.verdict.no_data");
      expect(verdict.className).toContain("text-brand-yellow");
    });
  });
});
