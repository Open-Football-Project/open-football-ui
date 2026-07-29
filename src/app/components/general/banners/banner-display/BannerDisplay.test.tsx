import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import BannerDisplay from "./BannerDisplay";
import { BannerType, BannerSize, AnyBanner } from "@matchinsights/core";

const scriptBanner: AnyBanner = {
  id: "script-1", type: BannerType.Script,
  scriptSrc: "https://example.com/banner.js", size: BannerSize.Wide,
};

const linkBanner: AnyBanner = {
  id: "link-1", type: BannerType.Link,
  href: "https://example.com", imgSrc: "https://example.com/img.png",
  label: "Shop Now", size: BannerSize.Wide,
};

const htmlBanner: AnyBanner = {
  id: "html-1", type: BannerType.Html,
  html: "<p data-testid='widget'>Widget</p>", size: BannerSize.Wide,
};

describe("BannerDisplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders ScriptBannerDisplay for a Script banner", () => {
    render(<BannerDisplay banners={[scriptBanner]} />);
    expect(screen.getByTestId("banner-container")).toBeInTheDocument();
  });

  it("renders LinkBannerDisplay for a Link banner", () => {
    render(<BannerDisplay banners={[linkBanner]} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
  });

  it("renders HtmlBannerDisplay for an Html banner", () => {
    render(<BannerDisplay banners={[htmlBanner]} />);
    expect(screen.getByTestId("widget")).toBeInTheDocument();
  });

  it("picks the first banner when only one is provided", () => {
    render(<BannerDisplay banners={[linkBanner]} />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("picks randomly when multiple banners are provided", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    render(<BannerDisplay banners={[scriptBanner, linkBanner, htmlBanner]} />);
    expect(screen.getByTestId("widget")).toBeInTheDocument();
  });

  it("applies wide size class for Wide banners", () => {
    const { container } = render(<BannerDisplay banners={[linkBanner]} />);
    expect(container.firstChild).toHaveClass("w-full", "h-24");
  });

  it("renders CompositeBanner as a flex row of link banners", () => {
    const compositeBanner: AnyBanner = {
      id: "composite-1",
      type: BannerType.Composite,
      size: BannerSize.Wide,
      banners: [
        {
          id: "child-1", type: BannerType.Link,
          href: "https://example.com/1", imgSrc: "https://example.com/img1.png",
          size: BannerSize.Wide,
        },
        {
          id: "child-2", type: BannerType.Link,
          href: "https://example.com/2", imgSrc: "https://example.com/img2.png",
          size: BannerSize.Wide,
        },
        {
          id: "child-3", type: BannerType.Link,
          href: "https://example.com/3", imgSrc: "https://example.com/img3.png",
          size: BannerSize.Wide,
        },
      ],
    };
    const { container } = render(<BannerDisplay banners={[compositeBanner]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-full");
    expect(wrapper).not.toHaveClass("h-24");
    const flexRow = wrapper.firstChild as HTMLElement;
    expect(flexRow).toHaveClass("flex", "gap-2", "justify-center", "items-center");
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "https://example.com/1");
    expect(links[1]).toHaveAttribute("href", "https://example.com/2");
    expect(links[2]).toHaveAttribute("href", "https://example.com/3");
  });

  it("rotates to the next banner after the given interval when multiple banners are provided", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<BannerDisplay banners={[linkBanner, htmlBanner]} rotationIntervalMs={4000} fadeDurationMs={400} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");

    act(() => { vi.advanceTimersByTime(4400); });

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByTestId("widget")).toBeInTheDocument();
  });

  it("does not rotate when only one banner is provided", () => {
    render(<BannerDisplay banners={[linkBanner]} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");

    act(() => { vi.advanceTimersByTime(6000); });

    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com");
  });

  it("renders Gamble Aware text when showGambleAware is true", () => {
    const gambleBanner: AnyBanner = {
      ...scriptBanner,
      showGambleAware: true,
    };

    render(<BannerDisplay banners={[gambleBanner]} />);

    expect(screen.getByText("+18 | Gamble Aware")).toBeInTheDocument();
  });

  it("does not render Gamble Aware text when showGambleAware is absent", () => {
    render(<BannerDisplay banners={[linkBanner]} />);

    expect(screen.queryByText("+18 | Gamble Aware")).not.toBeInTheDocument();
  });
});
