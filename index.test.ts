import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

describe("index.html head", () => {
  const html = readFileSync(path.resolve(__dirname, "index.html"), "utf-8");

  it("does not hardcode a canonical link tag", () => {
    expect(html).not.toMatch(/<link\s+rel=["']canonical["']/i);
  });

  it("does not hardcode a meta description (Seo.tsx sets one per page)", () => {
    expect(html).not.toMatch(/<meta\s+name=["']description["']/i);
  });

  it("does not hardcode an x-default hreflang link (Seo.tsx sets one per page)", () => {
    expect(html).not.toMatch(/<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']/i);
  });

  it("does not hardcode og:image tags (Seo.tsx sets these per page)", () => {
    expect(html).not.toMatch(/<meta\s+property=["']og:image["']/i);
    expect(html).not.toMatch(/<meta\s+property=["']og:image:secure_url["']/i);
    expect(html).not.toMatch(/<meta\s+property=["']og:image:width["']/i);
    expect(html).not.toMatch(/<meta\s+property=["']og:image:height["']/i);
    expect(html).not.toMatch(/<meta\s+property=["']og:image:type["']/i);
    expect(html).not.toMatch(/<meta\s+property=["']og:image:alt["']/i);
  });

  it("does not hardcode twitter:card, twitter:site, or twitter:image tags (Seo.tsx sets these per page)", () => {
    expect(html).not.toMatch(/<meta\s+name=["']twitter:card["']/i);
    expect(html).not.toMatch(/<meta\s+name=["']twitter:site["']/i);
    expect(html).not.toMatch(/<meta\s+name=["']twitter:image["']/i);
    expect(html).not.toMatch(/<meta\s+name=["']twitter:image:alt["']/i);
  });
});
