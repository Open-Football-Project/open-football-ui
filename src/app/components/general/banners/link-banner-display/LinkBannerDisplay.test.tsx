import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LinkBannerDisplay from "./LinkBannerDisplay";
import { BannerType, BannerSize } from "@matchinsights/core";

describe("LinkBannerDisplay", () => {
  it("renders an image when imgSrc is set", () => {
    render(<LinkBannerDisplay banner={{
      id: "test", type: BannerType.Link, href: "https://example.com",
      imgSrc: "https://example.com/img.png", label: "Shop Jerseys", size: BannerSize.Wide,
    }} />);
    expect(screen.getByAltText("Shop Jerseys")).toHaveAttribute("src", "https://example.com/img.png");
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
  });

  it("renders a label when only label is set", () => {
    render(<LinkBannerDisplay banner={{
      id: "test", type: BannerType.Link, href: "https://example.com",
      label: "Shop Now", size: BannerSize.Wide,
    }} />);
    expect(screen.getByText("Shop Now")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
  });
});
