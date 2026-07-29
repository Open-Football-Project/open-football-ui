import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChartButton from "./ChartButton";

describe("ChartButton", () => {
  it("renders a link to the fixture's chart page", () => {
    render(
      <MemoryRouter>
        <ChartButton fixtureId={42} />
      </MemoryRouter>,
    );

    const link = screen.getByTestId("chart-link");
    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe("matchbtn.chart");
    expect(link.closest("a")).toHaveAttribute("href", "/charts/42");
  });
});
