import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MatchDetailsSlider from "./MatchDetailsSlider";

describe("MatchDetailsSlider", () => {
  const items = [
    { title: "Slide 1", component: <div>Content 1</div> },
    { title: "Slide 2", component: <div>Content 2</div> },
    { title: "Slide 3", component: <div>Content 3</div> },
  ];

  it("renders NoData when no items are passed", () => {
    render(<MatchDetailsSlider items={[]} />);
    expect(screen.getByText(/nodata.default/i)).toBeInTheDocument();
  });

  it("renders first slide by default", () => {
    render(<MatchDetailsSlider items={items} />);
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("navigates to next slide when right button is clicked", async () => {
    render(<MatchDetailsSlider items={items} />);

    fireEvent.click(screen.getAllByRole("button")[1]);

    await waitFor(() => {
      expect(screen.getByText("Slide 2")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  it("navigates to previous slide when left button is clicked", async () => {
    render(<MatchDetailsSlider items={items} />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(screen.getByText("Slide 3")).toBeInTheDocument();
      expect(screen.getByText("Content 3")).toBeInTheDocument();
    });
  });

  it("wraps around when going past the last slide", async () => {
    render(<MatchDetailsSlider items={items} />);

    const rightBtn = screen.getAllByRole("button")[1];
    fireEvent.click(rightBtn);
    fireEvent.click(rightBtn);
    fireEvent.click(rightBtn);

    await waitFor(() => {
      expect(screen.getByText("Slide 1")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });
  });
});
