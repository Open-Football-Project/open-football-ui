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

const i18nMock = vi.hoisted(() => ({ language: "en" }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      get language() {
        return i18nMock.language;
      },
      changeLanguage: vi.fn(),
    },
  }),
}));

describe("Navbar", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    i18nMock.language = "en";
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
      .parentElement!.parentElement!.parentElement!;

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
      .parentElement!.parentElement!.parentElement!;

    fireEvent.touchStart(sidebar, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(sidebar, { changedTouches: [{ clientX: 150 }] });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("shows the TribuGOL brand name with a small byline crediting Open Football Project when Spanish is selected", () => {
    i18nMock.language = "es";

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("TribuGOL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("by Open Football Project").length).toBeGreaterThan(0);
  });

  it("shows Open Football Project with no byline when English is selected", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Open Football Project").length).toBeGreaterThan(0);
    expect(screen.queryByText("by Open Football Project")).not.toBeInTheDocument();
  });
});
