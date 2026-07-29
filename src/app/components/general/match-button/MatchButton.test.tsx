import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { MemoryRouter } from "react-router-dom";
import MatchButton from "./MatchButton";

describe("MatchButton", () => {
  it("renders Live button when isLiveNow is true", () => {
    render(
      <MemoryRouter>
        <MatchButton isLiveNow={true} fixtureId={123} />
      </MemoryRouter>
    );

    const liveLink = screen.getByTestId("live-now-link");
    expect(liveLink).toBeInTheDocument();
    expect(liveLink.textContent).toBe("matchbtn.live");

    expect(liveLink.closest("a")).toHaveAttribute("href", "/live/123");

    expect(liveLink.closest("a")).toHaveClass("min-w-[60px]");
  });

  it("renders Details button when isLiveNow is false", () => {
    render(
      <MemoryRouter>
        <MatchButton isLiveNow={false} fixtureId={456} />
      </MemoryRouter>
    );

    const detailsLink = screen.getByTestId("match-details-link");
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink.textContent).toBe("matchbtn.detail");

    expect(detailsLink.closest("a")).toHaveAttribute("href", "/match/456");

    expect(detailsLink.closest("a")).toHaveClass("min-w-[60px]");
  });

  it("forwards ref to the anchor element", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <MemoryRouter>
        <MatchButton ref={ref} isLiveNow={false} fixtureId={789} />
      </MemoryRouter>
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("A");
  });
});
