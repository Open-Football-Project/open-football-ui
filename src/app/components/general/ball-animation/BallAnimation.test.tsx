import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BallAnimation } from "./BallAnimation";

vi.mock("../../../assets/images/ball.png", () => ({
  default: "mocked-ball.png",
}));

describe("BallAnimation", () => {
  it("renders with the main container class when isSubHeader is false", () => {
    render(<BallAnimation isSubHeader={false} />);

    const container = screen.getByRole("img", {
      name: /football/i,
    }).parentElement;
    expect(container).toHaveClass("animation-container");
  });

  it("renders with the subheader container class when isSubHeader is true", () => {
    render(<BallAnimation isSubHeader={true} />);

    const container = screen.getByRole("img", {
      name: /football/i,
    }).parentElement;
    expect(container).toHaveClass("animation-subheader-container");
  });
});
