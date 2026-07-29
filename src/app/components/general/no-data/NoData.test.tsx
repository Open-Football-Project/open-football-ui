import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NoData from "./NoData";

describe("NoData component", () => {
  it("renders the displayed message", () => {
    render(<NoData loading={true} />);
    expect(screen.getByText("nodata.loading")).toBeInTheDocument();
  });

  it("renders not available message", () => {
    render(<NoData />);
    expect(screen.getByText("nodata.default")).toBeInTheDocument();
  });

  it("renders skeleton instead of loading text when loading and skeleton are provided", () => {
    const skeleton = <div data-testid="skeleton-mock">skeleton</div>;
    render(<NoData loading={true} skeleton={skeleton} />);
    expect(screen.getByTestId("skeleton-mock")).toBeInTheDocument();
    expect(screen.queryByText("nodata.loading")).not.toBeInTheDocument();
  });

  it("renders loading text when loading is true and no skeleton is provided", () => {
    render(<NoData loading={true} />);
    expect(screen.getByText("nodata.loading")).toBeInTheDocument();
  });

  it("ignores skeleton when not loading", () => {
    const skeleton = <div data-testid="skeleton-mock">skeleton</div>;
    render(<NoData skeleton={skeleton} />);
    expect(screen.queryByTestId("skeleton-mock")).not.toBeInTheDocument();
    expect(screen.getByText("nodata.default")).toBeInTheDocument();
  });

  it("renders the image when provided and not loading", () => {
    render(<NoData image="/chartsnotavailable.jpg" imageAlt="No charts" />);
    const img = screen.getByAltText("No charts");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/chartsnotavailable.jpg");
  });

  it("renders the image when loading too, if provided", () => {
    render(<NoData loading image="/chartsnotavailable.jpg" imageAlt="No charts" />);
    const img = screen.getByAltText("No charts");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/chartsnotavailable.jpg");
  });

  it("does not render an image while loading with a skeleton, since the skeleton replaces the whole view", () => {
    const skeleton = <div data-testid="skeleton-mock">skeleton</div>;
    render(<NoData loading image="/chartsnotavailable.jpg" imageAlt="No charts" skeleton={skeleton} />);
    expect(screen.queryByAltText("No charts")).not.toBeInTheDocument();
    expect(screen.getByTestId("skeleton-mock")).toBeInTheDocument();
  });

  it("does not render an image when none is provided", () => {
    render(<NoData />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("applies the default message color when none is provided", () => {
    render(<NoData />);
    expect(screen.getByText("nodata.default").className).toContain(
      "text-white",
    );
  });

  it("applies a custom messageColor to the message", () => {
    render(<NoData messageColor="text-brand-yellow" />);
    const className = screen.getByText("nodata.default").className;
    expect(className).toContain("text-brand-yellow");
    expect(className).not.toContain("text-white");
  });

  it("applies a custom messageColor to the big message variant", () => {
    render(
      <NoData
        message="No matches today"
        messageColor="text-brand-yellow"
        isBigMessage
      />,
    );
    expect(screen.getByText("No matches today").className).toContain(
      "text-brand-yellow",
    );
  });

  it("renders the big message text size class when isBigMessage is true", () => {
    render(<NoData message="No matches today" isBigMessage />);
    expect(screen.getByText("No matches today").className).toContain(
      "text-xl",
    );
  });

  it("renders the small message text size class by default", () => {
    render(<NoData message="No matches today" />);
    expect(screen.getByText("No matches today").className).toContain(
      "text-xs",
    );
  });
});
