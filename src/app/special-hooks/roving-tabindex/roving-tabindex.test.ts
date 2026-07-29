import { renderHook, act } from "@testing-library/react";
import { MutableRefObject } from "react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useRovingTabIndex } from "./roving-tabindex";
import { KeyboardKey } from "../../utils/keyboard/events";

describe("useRovingTabIndex", () => {
  let mockFocusableElements: (HTMLElement | null)[];
  let mockRef: MutableRefObject<(HTMLElement | null)[]>;

  beforeEach(() => {
    mockFocusableElements = [
      { focus: vi.fn(), tagName: "BUTTON" } as unknown as HTMLElement,
      { focus: vi.fn(), tagName: "BUTTON" } as unknown as HTMLElement,
      { focus: vi.fn(), tagName: "BUTTON" } as unknown as HTMLElement,
    ];

    mockRef = { current: mockFocusableElements };
  });

  describe("initialization", () => {
    it("should initialize with onFocus and handleKeyDown", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      expect(result.current).toHaveProperty("onFocus");
      expect(result.current).toHaveProperty("handleKeyDown");
    });
  });

  describe("onFocus", () => {
    it("should focus the element at focusedIndex when target matches currentTarget", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      const sharedElement = {};

      const mockEvent = {
        target: sharedElement,
        currentTarget: sharedElement,
        preventDefault: vi.fn(),
      } as unknown as React.FocusEvent<HTMLElement>;

      act(() => {
        result.current.onFocus(mockEvent);
      });

      expect(mockFocusableElements[0]?.focus).toHaveBeenCalled();
    });

    it("should lazily initialize to first element when array is populated after mount", () => {
      const asyncRef: MutableRefObject<(HTMLElement | null)[]> = {
        current: [],
      };
      const { result } = renderHook(() => useRovingTabIndex(asyncRef));

      asyncRef.current = [...mockFocusableElements];

      const sharedElement = {};
      act(() => {
        result.current.onFocus({
          target: sharedElement,
          currentTarget: sharedElement,
        } as unknown as React.FocusEvent<HTMLElement>);
      });

      expect(mockFocusableElements[0]?.focus).toHaveBeenCalled();
    });

    it("should NOT focus when target does NOT match currentTarget", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      const mockEvent = {
        target: {},
        currentTarget: {},
        preventDefault: vi.fn(),
      } as unknown as React.FocusEvent<HTMLElement>;

      act(() => {
        result.current.onFocus(mockEvent);
      });

      expect(mockFocusableElements[0]?.focus).not.toHaveBeenCalled();
    });
  });

  describe("Arrow key navigation", () => {
    const focusContainer = (result: {
      current: ReturnType<typeof useRovingTabIndex>;
    }) => {
      const container = {};
      act(() => {
        result.current.onFocus({
          target: container,
          currentTarget: container,
        } as unknown as React.FocusEvent<HTMLElement>);
      });
    };

    it("should move focus up with ArrowUp", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      focusContainer(result);

      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      const mockPreventDefault = vi.fn();
      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowUp,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[0]?.focus).toHaveBeenCalled();
    });

    it("should stay on first element when ArrowUp is pressed at row 0", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      focusContainer(result);

      const mockPreventDefault = vi.fn();
      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowUp,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[0]?.focus).toHaveBeenCalled();
    });

    it("should move focus down with ArrowDown", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      focusContainer(result);

      const mockPreventDefault = vi.fn();
      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowDown,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[1]?.focus).toHaveBeenCalled();
    });

    it("should move focus up with ArrowLeft", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      focusContainer(result);

      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      const mockPreventDefault = vi.fn();
      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowLeft,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[0]?.focus).toHaveBeenCalled();
    });

    it("should move focus down with ArrowRight", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      focusContainer(result);

      const mockPreventDefault = vi.fn();
      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowRight,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[1]?.focus).toHaveBeenCalled();
    });
  });

  describe("Special keys", () => {
    it("should move to first element with Home key", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      act(() => {
        const event = {
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });
      act(() => {
        const event = {
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });

      const mockPreventDefault = vi.fn();
      act(() => {
        const event = {
          key: KeyboardKey.Home,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[0]?.focus).toHaveBeenCalled();
    });

    it("should move to first element with PageUp key", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      act(() => {
        const event = {
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });
      act(() => {
        const event = {
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });

      const mockPreventDefault = vi.fn();
      act(() => {
        const event = {
          key: KeyboardKey.PageUp,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[0]?.focus).toHaveBeenCalled();
    });

    it("should move to last element with End key", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      const mockPreventDefault = vi.fn();
      act(() => {
        const event = {
          key: KeyboardKey.End,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[2]?.focus).toHaveBeenCalled();
    });

    it("should move to last element with PageDown key", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      const mockPreventDefault = vi.fn();
      act(() => {
        const event = {
          key: KeyboardKey.PageDown,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>;
        result.current.handleKeyDown(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[2]?.focus).toHaveBeenCalled();
    });
  });

  describe("Re-entry after focus loss (Shift+Tab back)", () => {
    it("should allow arrow navigation when onFocus and arrow key fire in the same React batch", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      const container = {};
      const mockPreventDefault = vi.fn();

      act(() => {
        result.current.onFocus({
          target: container,
          currentTarget: container,
        } as unknown as React.FocusEvent<HTMLElement>);

        result.current.handleKeyDown({
          key: KeyboardKey.ArrowDown,
          preventDefault: mockPreventDefault,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockFocusableElements[1]?.focus).toHaveBeenCalled();
    });

    it("should navigate from correct position after re-entering the grid", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));

      const container = {};

      act(() => {
        result.current.onFocus({
          target: container,
          currentTarget: container,
        } as unknown as React.FocusEvent<HTMLElement>);
      });

      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      act(() => {
        result.current.onFocus({
          target: container,
          currentTarget: container,
        } as unknown as React.FocusEvent<HTMLElement>);

        result.current.handleKeyDown({
          key: KeyboardKey.ArrowDown,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockFocusableElements[2]?.focus).toHaveBeenCalled();
    });
  });

  describe("Shift+Tab exit", () => {
    it("should NOT call preventDefault — browser handles the navigation", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      const mockContainer = { tabIndex: 0 };
      const mockPreventDefault = vi.fn();

      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.Tab,
          shiftKey: true,
          preventDefault: mockPreventDefault,
          currentTarget: mockContainer,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).not.toHaveBeenCalled();
    });

    it("should set container tabIndex to -1 immediately, then restore to 0 after requestAnimationFrame", () => {
      let rafCallback: (() => void) | null = null;
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rafCallback = cb as () => void;
        return 0;
      });

      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      const mockContainer = { tabIndex: 0 };

      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.Tab,
          shiftKey: true,
          preventDefault: vi.fn(),
          currentTarget: mockContainer,
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockContainer.tabIndex).toBe(-1);

      act(() => { rafCallback?.(); });

      expect(mockContainer.tabIndex).toBe(0);

      vi.restoreAllMocks();
    });

    it("should do nothing when Tab is pressed without Shift", () => {
      const { result } = renderHook(() => useRovingTabIndex(mockRef));
      const mockPreventDefault = vi.fn();

      act(() => {
        result.current.handleKeyDown({
          key: KeyboardKey.Tab,
          shiftKey: false,
          preventDefault: mockPreventDefault,
          currentTarget: {},
        } as unknown as React.KeyboardEvent<HTMLElement>);
      });

      expect(mockPreventDefault).not.toHaveBeenCalled();
      mockFocusableElements.forEach((el) =>
        expect(el?.focus).not.toHaveBeenCalled(),
      );
    });
  });
});
