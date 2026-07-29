import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ArrowStatusTile from "./ArrowStatusTile";

describe("ArrowStatusTile", () => {
  it("renders upward green arrow when isUp=true and isFlat=false", () => {
    render(<ArrowStatusTile isUp={true} isFlat={false} status="Good" />);

    const wrapper = screen.getByTestId("arrow-icon");
    expect(wrapper).toHaveClass("bg-brand-success text-black");

    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("renders downward red arrow when isUp=false and isFlat=false", () => {
    render(<ArrowStatusTile isUp={false} isFlat={false} status="Bad" />);

    const wrapper = screen.getByTestId("arrow-icon");
    expect(wrapper).toHaveClass("bg-brand-danger text-black");

    expect(screen.getByText("Bad")).toBeInTheDocument();
  });

  it("renders flat yellow arrow when isFlat=true", () => {
    render(<ArrowStatusTile isUp={false} isFlat={true} status="Neutral" />);

    const wrapper = screen.getByTestId("arrow-icon");
    expect(wrapper).toHaveClass("bg-brand-yellow text-black");

    expect(screen.getByText("Neutral")).toBeInTheDocument();
  });
});
