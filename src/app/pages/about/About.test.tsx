import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import About from "./About";

vi.mock("../../main/seo/Seo", () => {
  return {
    default: ({ children }: any) => <>{children}</>,
  };
});

describe("AboutPage", () => {
  it("renders text and headers", () => {
    render(<About />);

    expect(screen.getByText("about.t0")).toBeInTheDocument();

    expect(screen.getByText("about.text0")).toBeInTheDocument();

    expect(screen.getByText("about.t1")).toBeInTheDocument();

    expect(screen.getByText("about.text1")).toBeInTheDocument();

    expect(screen.getByText("about.t2")).toBeInTheDocument();

    expect(screen.getByText("about.text2")).toBeInTheDocument();

    expect(screen.getByText("about.t3")).toBeInTheDocument();

    expect(screen.getByText("about.text3")).toBeInTheDocument();

    expect(screen.getByText("about.t4")).toBeInTheDocument();

    expect(screen.getByText("about.text4")).toBeInTheDocument();
  });
});
