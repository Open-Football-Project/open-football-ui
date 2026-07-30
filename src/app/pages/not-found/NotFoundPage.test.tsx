import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  seo: vi.fn(({ children }: any) => <>{children}</>),
}));

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
}));

import NotFoundPage from "./NotFoundPage";

const renderPage = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <NotFoundPage />
    </MemoryRouter>
  );

describe("NotFoundPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a 404 heading", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /404/i })).toBeTruthy();
  });

  it("renders a descriptive message", () => {
    renderPage();
    expect(screen.getByText(/page not found/i)).toBeTruthy();
  });

  it("renders a link back to home", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/");
  });

  it("renders Seo with noindex, nofollow", () => {
    renderPage();
    expect(mocks.seo.mock.calls[0][0]).toMatchObject({
      robots: "noindex, nofollow",
    });
  });

  it("uses the actual current path as the canonical, not a hardcoded /404", () => {
    renderPage("/quizzes");
    expect(mocks.seo.mock.calls[0][0].url).toBe(
      "https://footballproject.org/quizzes"
    );
  });
});
