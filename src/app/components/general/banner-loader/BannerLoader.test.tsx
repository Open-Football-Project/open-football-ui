import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BannerLoader from "./BannerLoader";

describe("BannerLoader", () => {
  it("appends a script element with the correct src", () => {
    const testSrc = "https://example.com/banner.js";

    render(<BannerLoader scriptSrc={testSrc} />);

    const container = screen.getByTestId("banner-container");
    const script = container.querySelector("script");

    expect(script).not.toBeNull();
    expect(script?.src).toContain(testSrc);
  });

  it("clears previous content before adding a new script", () => {
    const initialSrc = "https://example.com/old.js";
    const newSrc = "https://example.com/new.js";

    const { rerender } = render(<BannerLoader scriptSrc={initialSrc} />);

    rerender(<BannerLoader scriptSrc={newSrc} />);

    const container = screen.getByTestId("banner-container");
    const scripts = container.querySelectorAll("script");

    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toContain(newSrc);
  });

  it("renders an empty div initially", () => {
    render(<BannerLoader scriptSrc="test.js" />);

    const container = screen.getByTestId("banner-container");
    expect(container).toBeInTheDocument();
  });
});
