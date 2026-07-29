import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LeaguesMenuOptions } from "./LeaguesMenuOptions";

describe("LeaguesMenuOptions", () => {
  const mockItems = [
    { id: 0, country: "England" },
    { id: 1, country: "Spain" },
    { id: 2, country: "Argentina" },
  ];

  const mockSelectItem = vi.fn();

  const setup = (items = mockItems) =>
    render(<LeaguesMenuOptions items={items} selectItem={mockSelectItem} />);

  it("renders without crashing", () => {
    setup();
    expect(
      screen.getByRole("list", { name: /aria.leaguesMenu.countries/i }),
    ).toBeInTheDocument();
  });

  it("renders all items", () => {
    setup();
    mockItems.forEach((item) => {
      expect(
        screen.getByTestId(`${item.country}-${item.id}`),
      ).toBeInTheDocument();
      expect(screen.getByText(item.country)).toBeVisible();
    });
  });

  it("calls selectItem when an item is clicked", () => {
    setup();
    const item = screen.getByText("England");
    fireEvent.click(item);
    expect(mockSelectItem).toHaveBeenCalledWith({
      id: 0,
      country: "England",
    });
  });

  it("renders correctly when no items are passed", () => {
    setup([]);
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });
});
