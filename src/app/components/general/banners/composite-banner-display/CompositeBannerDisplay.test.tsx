import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CompositeBannerDisplay from "./CompositeBannerDisplay";
import { BannerType, BannerSize, CompositeBanner } from "@matchinsights/core";

const compositeBanner: CompositeBanner = {
  id: "composite-1",
  type: BannerType.Composite,
  size: BannerSize.Wide,
  banners: [
    {
      id: "child-1",
      type: BannerType.Link,
      href: "https://example.com/1",
      imgSrc: "https://example.com/img1.png",
      label: "Banner 1",
      size: BannerSize.Wide,
    },
    {
      id: "child-2",
      type: BannerType.Link,
      href: "https://example.com/2",
      imgSrc: "https://example.com/img2.png",
      label: "Banner 2",
      size: BannerSize.Wide,
    },
    {
      id: "child-3",
      type: BannerType.Link,
      href: "https://example.com/3",
      imgSrc: "https://example.com/img3.png",
      label: "Banner 3",
      size: BannerSize.Wide,
    },
  ],
};

describe("CompositeBannerDisplay", () => {
  it("renders all child banners", () => {
    render(<CompositeBannerDisplay banner={compositeBanner} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("renders each child with correct href", () => {
    render(<CompositeBannerDisplay banner={compositeBanner} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "https://example.com/1");
    expect(links[1]).toHaveAttribute("href", "https://example.com/2");
    expect(links[2]).toHaveAttribute("href", "https://example.com/3");
  });

  it("renders child images", () => {
    render(<CompositeBannerDisplay banner={compositeBanner} />);
    expect(screen.getByAltText("Banner 1")).toHaveAttribute("src", "https://example.com/img1.png");
    expect(screen.getByAltText("Banner 2")).toHaveAttribute("src", "https://example.com/img2.png");
    expect(screen.getByAltText("Banner 3")).toHaveAttribute("src", "https://example.com/img3.png");
  });

  it("wraps children in a flex row", () => {
    const { container } = render(<CompositeBannerDisplay banner={compositeBanner} />);
    const flexRow = container.firstChild as HTMLElement;
    expect(flexRow).toHaveClass("flex", "gap-2", "justify-center", "items-center");
  });

  it("gives each child a fixed size", () => {
    const { container } = render(<CompositeBannerDisplay banner={compositeBanner} />);
    const flexRow = container.firstChild as HTMLElement;
    const children = Array.from(flexRow.children);
    expect(children).toHaveLength(3);
    children.forEach((child) => {
      expect(child).toHaveClass("w-40", "h-40");
    });
  });
});
