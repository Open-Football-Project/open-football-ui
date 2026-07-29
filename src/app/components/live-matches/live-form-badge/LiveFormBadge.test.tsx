/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LiveFormBadge } from "./LiveFormBadge";
import { LiveHomeAwayForm } from "@matchinsights/core";

vi.mock("react-icons/fa6", () => ({
  FaFire: () => <span data-testid="icon-fire" />,
  FaSnowflake: () => <span data-testid="icon-snowflake" />,
  FaMinus: () => <span data-testid="icon-neutral" />,
}));

const baseForm: LiveHomeAwayForm = {
  homeForm: ["W", "D", "L"],
  awayForm: ["L", "W", "D"],
  isHomeHot: false,
  isHomeCold: false,
  isAwayHot: false,
  isAwayCold: false,
  isDisplayable: true,
};

describe("LiveFormBadge — home", () => {
  it("renders one dot per home result", () => {
    render(<LiveFormBadge homeAwayForm={baseForm} isHome={true} />);

    const dots = document.querySelectorAll(".rounded-full");
    expect(dots).toHaveLength(3);
  });

  it("applies green class to W dot", () => {
    render(<LiveFormBadge homeAwayForm={{ ...baseForm, homeForm: ["W"] }} isHome={true} />);

    const dot = document.querySelector(".rounded-full");
    expect(dot?.className).toMatch(/brand-success/);
  });

  it("applies amber class to D dot", () => {
    render(<LiveFormBadge homeAwayForm={{ ...baseForm, homeForm: ["D"] }} isHome={true} />);

    const dot = document.querySelector(".rounded-full");
    expect(dot?.className).toMatch(/amber/);
  });

  it("applies red class to L dot", () => {
    render(<LiveFormBadge homeAwayForm={{ ...baseForm, homeForm: ["L"] }} isHome={true} />);

    const dot = document.querySelector(".rounded-full");
    expect(dot?.className).toMatch(/brand-danger/);
  });

  it("shows fire icon when home is hot", () => {
    render(<LiveFormBadge homeAwayForm={{ ...baseForm, isHomeHot: true }} isHome={true} />);

    expect(screen.getByTestId("icon-fire")).toBeInTheDocument();
  });

  it("shows snowflake icon when home is cold", () => {
    render(<LiveFormBadge homeAwayForm={{ ...baseForm, isHomeCold: true }} isHome={true} />);

    expect(screen.getByTestId("icon-snowflake")).toBeInTheDocument();
  });

  it("shows no icons when home is neither hot nor cold", () => {
    render(<LiveFormBadge homeAwayForm={baseForm} isHome={true} />);

    expect(screen.queryByTestId("icon-fire")).not.toBeInTheDocument();
    expect(screen.queryByTestId("icon-snowflake")).not.toBeInTheDocument();
  });
});

describe("LiveFormBadge — away", () => {
  it("renders one dot per away result", () => {
    render(<LiveFormBadge homeAwayForm={baseForm} isHome={false} />);

    const dots = document.querySelectorAll(".rounded-full");
    expect(dots).toHaveLength(3);
  });

  it("shows fire icon when away is hot", () => {
    render(<LiveFormBadge homeAwayForm={{ ...baseForm, isAwayHot: true }} isHome={false} />);

    expect(screen.getByTestId("icon-fire")).toBeInTheDocument();
  });

  it("shows snowflake icon when away is cold", () => {
    render(<LiveFormBadge homeAwayForm={{ ...baseForm, isAwayCold: true }} isHome={false} />);

    expect(screen.getByTestId("icon-snowflake")).toBeInTheDocument();
  });

  it("shows no icons when away is neither hot nor cold", () => {
    render(<LiveFormBadge homeAwayForm={baseForm} isHome={false} />);

    expect(screen.queryByTestId("icon-fire")).not.toBeInTheDocument();
    expect(screen.queryByTestId("icon-snowflake")).not.toBeInTheDocument();
  });
});
