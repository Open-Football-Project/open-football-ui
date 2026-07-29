import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import NewsSlider from "./NewsSlider";

const mocks = vi.hoisted(() => ({
  useNewsState: vi.fn(),
}));

vi.mock("./news-state/news-state", () => ({
  default: vi.fn(),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useNewsState: mocks.useNewsState,
  };
});

import { mockNewsData } from "@matchinsights/core";

describe("NewsSlider (feature)", () => {
  const next = vi.fn();
  const prev = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useNewsState.mockReturnValue({
      visibleItems: mockNewsData,
      next,
      prev,
      cardsToShow: 2,
    });
  });

  it("renders visible news cards", () => {
    render(<NewsSlider items={mockNewsData} />);
    expect(screen.getAllByRole("img")).toHaveLength(mockNewsData.length);
  });

  it("renders links correctly", () => {
    render(<NewsSlider items={mockNewsData} />);

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", mockNewsData[0].url);
  });

  it("calls next() when right arrow is clicked", () => {
    render(<NewsSlider items={mockNewsData} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("calls prev() when left arrow is clicked", () => {
    render(<NewsSlider items={mockNewsData} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(prev).toHaveBeenCalledTimes(1);
  });
});
