import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

vi.mock("./side-menu/SideNavMenu", () => ({
  default: ({ closeSideNavMenu }: { closeSideNavMenu: () => void }) => (
    <div>
      <button onClick={closeSideNavMenu}>Mock SideNavMenu Item</button>
    </div>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));

describe("Navbar", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("renders main navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches/i)).toBeInTheDocument();
    expect(screen.getByText(/navbar\.charts/i)).toBeInTheDocument();
    expect(screen.getByText(/today_players/i)).toBeInTheDocument();
    expect(screen.getByText(/Leagues/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Live/i)).toBeInTheDocument();
    expect(screen.getByText(/Feedback/i)).toBeInTheDocument();
    expect(screen.getByTestId("side-bar-menu")).toBeInTheDocument();
  });

  it("opens sidebar when menu button clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("side-bar-menu"));
    expect(
      screen.getByRole("heading", { name: /Open Football Project/i }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes sidebar when close button clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("side-bar-menu"));
    expect(
      screen.getByRole("heading", { name: /Open Football Project/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("✕"));
    expect(document.body.style.overflow).toBe("");
  });

  it("closes sidebar on left swipe greater than 50px", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("side-bar-menu"));
    expect(document.body.style.overflow).toBe("hidden");

    const sidebar = screen.getByRole("heading", { name: /Open Football Project/i })
      .parentElement!.parentElement!;

    fireEvent.touchStart(sidebar, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(sidebar, { changedTouches: [{ clientX: 140 }] });

    expect(document.body.style.overflow).toBe("");
  });

  it("keeps sidebar open on left swipe of 50px or less", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("side-bar-menu"));
    expect(document.body.style.overflow).toBe("hidden");

    const sidebar = screen.getByRole("heading", { name: /Open Football Project/i })
      .parentElement!.parentElement!;

    fireEvent.touchStart(sidebar, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(sidebar, { changedTouches: [{ clientX: 150 }] });

    expect(document.body.style.overflow).toBe("hidden");
  });
});
