import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HtmlBannerDisplay from "./HtmlBannerDisplay";
import { BannerType, BannerSize } from "open-football-project-core";

describe("HtmlBannerDisplay", () => {
  it("renders the html content", () => {
    render(<HtmlBannerDisplay banner={{
      id: "test", type: BannerType.Html,
      html: "<p data-testid='widget'>Widget</p>", size: BannerSize.Wide,
    }} />);
    expect(screen.getByTestId("widget")).toBeInTheDocument();
  });
});
