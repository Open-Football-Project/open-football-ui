import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Seo from "./Seo";

vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: any) => <>{children}</>,
  HelmetProvider: ({ children }: any) => <>{children}</>,
}));

const base = {
  title: "Test Page",
  description: "A test description",
  url: "https://footballproject.org/test",
};

describe("Seo robots prop", () => {
  it("defaults to 'index, follow' when robots prop is omitted", () => {
    const { container } = render(<Seo {...base} />);
    const meta = container.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute("content")).toBe("index, follow");
  });

  it("uses the provided robots value when passed", () => {
    const { container } = render(<Seo {...base} robots="noindex, nofollow" />);
    const meta = container.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute("content")).toBe("noindex, nofollow");
  });
});
