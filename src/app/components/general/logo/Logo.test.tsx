import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "./Logo";

const getShieldIcon = () =>
  screen.queryByTestId("shield-icon") ||
  screen.queryByRole("img", { hidden: true });

describe("Logo", () => {
  it("renders shield icon when no src is provided", () => {
    render(<Logo />);
    expect(screen.getByTestId("shield-fallback")).toBeInTheDocument();
  });

  it("renders image when src is provided", () => {
    render(<Logo src="https://example.com/logo.png" />);
    const img = screen.getByTestId("team-logo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/logo.png");
  });
});
