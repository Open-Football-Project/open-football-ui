import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    button: ({ children, onClick, className, "aria-label": ariaLabel }: any) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel}>
        {children}
      </button>
    ),
  },
}));

import ScrollToTopButton from "./ScrollToTopButton";

beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
  Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 0 });
});

describe("ScrollToTopButton", () => {
  it("is not rendered when scroll position is 0", () => {
    render(<ScrollToTopButton />);
    expect(screen.queryByRole("button", { name: /scroll to top/i })).toBeNull();
  });

  it("appears after scrolling past 300px", () => {
    render(<ScrollToTopButton />);

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 301 });
      fireEvent.scroll(window);
    });

    expect(screen.getByRole("button", { name: /scroll to top/i })).toBeTruthy();
  });

  it("hides again when scrolling back above 300px", () => {
    render(<ScrollToTopButton />);

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 301 });
      fireEvent.scroll(window);
    });

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 100 });
      fireEvent.scroll(window);
    });

    expect(screen.queryByRole("button", { name: /scroll to top/i })).toBeNull();
  });

  it("calls window.scrollTo with smooth behavior on click", () => {
    render(<ScrollToTopButton />);

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 400 });
      fireEvent.scroll(window);
    });

    fireEvent.click(screen.getByRole("button", { name: /scroll to top/i }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
