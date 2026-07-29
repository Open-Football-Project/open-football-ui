import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScriptBannerDisplay from "./ScriptBannerDisplay";
import { BannerType, BannerSize } from "open-football-project-core";

describe("ScriptBannerDisplay", () => {
  it("renders a banner container with the correct script src", () => {
    render(<ScriptBannerDisplay banner={{
      id: "test", type: BannerType.Script,
      scriptSrc: "https://example.com/banner.js", size: BannerSize.Wide,
    }} />);
    const container = screen.getByTestId("banner-container");
    expect(container.querySelector("script")?.src).toContain("https://example.com/banner.js");
  });
});
