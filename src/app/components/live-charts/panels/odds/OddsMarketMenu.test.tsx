import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BetMarketInfo } from "@matchinsights/core";
import OddsMarketMenu from "./OddsMarketMenu";

const markets: BetMarketInfo[] = [
  { id: 1, name: "fulltime_result", history: {} },
  { id: 2, name: "double_chance", history: {} },
];

describe("OddsMarketMenu", () => {
  it("renders the Markets section header", () => {
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={["fulltime_result"]}
        onToggleMarket={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Markets")).toBeInTheDocument();
  });

  it("renders one toggle entry per market", () => {
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={["fulltime_result"]}
        onToggleMarket={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByTestId("odds-market-toggle-fulltime_result")).toBeInTheDocument();
    expect(screen.getByTestId("odds-market-toggle-double_chance")).toBeInTheDocument();
  });

  it("marks enabled markets as pressed and disabled markets as not pressed", () => {
    render(
      <OddsMarketMenu
        markets={markets}
        enabledMarketNames={["fulltime_result"]}
        onToggleMarket={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByTestId("odds-market-toggle-fulltime_result")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("odds-market-toggle-double_chance")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onToggleMarket with the market's name when an entry is clicked", () => {
    const onToggleMarket = vi.fn();
    render(
      <OddsMarketMenu markets={markets} enabledMarketNames={[]} onToggleMarket={onToggleMarket} onClose={vi.fn()} />,
    );

    fireEvent.click(screen.getByTestId("odds-market-toggle-double_chance"));

    expect(onToggleMarket).toHaveBeenCalledWith("double_chance");
  });

  it("calls onClose when the close control is clicked", () => {
    const onClose = vi.fn();
    render(<OddsMarketMenu markets={markets} enabledMarketNames={[]} onToggleMarket={vi.fn()} onClose={onClose} />);

    fireEvent.click(screen.getByTestId("odds-market-menu-close"));

    expect(onClose).toHaveBeenCalled();
  });
});
