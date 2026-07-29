import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopGuysButton from "./TopGuysButton";

describe("TopGuysButton", () => {
  it("renders a link to the fixture's today-players page", () => {
    render(
      <MemoryRouter>
        <TopGuysButton fixtureId={42} />
      </MemoryRouter>,
    );

    const link = screen.getByTestId("top-guys-link");
    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe("matchbtn.top_guys");
    expect(link.closest("a")).toHaveAttribute("href", "/today-players/42");
  });
});
