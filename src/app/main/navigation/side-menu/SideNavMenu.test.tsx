import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SideNavMenu from "./SideNavMenu";

vi.mock("./navigationData", () => ({
  navigationData: [
    {
      name: "Leagues",
      icon: null,
      navLinks: [
        { title: "Premier League", route: "/premier-league" },
        { title: "La Liga", route: "/la-liga" },
      ],
    },
    {
      name: "International",
      icon: null,
      navLinks: [{ title: "World Cup", route: "/world-cup" }],
    },
  ],
}));

describe("SideNavMenu", () => {
  let closeSideNavMenu: any;

  beforeEach(() => {
    closeSideNavMenu = vi.fn();
  });

  it("renders main menu items", () => {
    render(
      <MemoryRouter>
        <SideNavMenu closeSideNavMenu={closeSideNavMenu} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Leagues")).toBeInTheDocument();
    expect(screen.getByText("International")).toBeInTheDocument();
  });

  it("toggles submenu on main item click", () => {
    render(
      <MemoryRouter>
        <SideNavMenu closeSideNavMenu={closeSideNavMenu} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Premier League")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Leagues"));
    expect(screen.getByText("Premier Lg.")).toBeInTheDocument();
    expect(screen.getByText("La Liga")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Leagues"));
    expect(screen.queryByText("Premier Lg.")).not.toBeInTheDocument();
    expect(screen.queryByText("La Liga")).not.toBeInTheDocument();
  });

  it("only toggles one submenu at a time", () => {
    render(
      <MemoryRouter>
        <SideNavMenu closeSideNavMenu={closeSideNavMenu} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Leagues"));
    expect(screen.getByText("Premier Lg.")).toBeInTheDocument();

    fireEvent.click(screen.getByText("International"));
    expect(screen.getByText("World Cup")).toBeInTheDocument();

    expect(screen.queryByText("Premier Lg.")).not.toBeInTheDocument();
  });

  it("submenu links call closeSideNavMenu", () => {
    render(
      <MemoryRouter>
        <SideNavMenu closeSideNavMenu={closeSideNavMenu} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Leagues"));
    fireEvent.click(screen.getByText("Premier Lg."));

    expect(closeSideNavMenu).toHaveBeenCalledTimes(1);
  });
});
