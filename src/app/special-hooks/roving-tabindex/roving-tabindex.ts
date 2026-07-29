import { MutableRefObject, useRef } from "react";
import { KeyboardKey } from "../../utils/keyboard/events";

export function useRovingTabIndex(
  allFocusable: MutableRefObject<(HTMLElement | null)[]>,
) {
  const focusedReference = useRef<HTMLElement | null>(null);

  const getFirstFocusable = () => allFocusable.current[0] || null;

  const getLastFocusable = () =>
    allFocusable.current[allFocusable.current.length - 1] || null;

  const getAdjacentFocusable = (delta: 1 | -1) => {
    const idx = allFocusable.current.findIndex(
      (el) => el === focusedReference.current,
    );
    const boundary = delta === 1 ? allFocusable.current.length - 1 : 0;
    if (idx === -1 || idx === boundary) return focusedReference.current;
    return allFocusable.current[idx + delta];
  };

  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    const target = focusedReference.current ?? allFocusable.current[0] ?? null;
    if (target) {
      focusedReference.current = target;
      target.focus();
    }
  };

  const keyMap: Partial<Record<string, () => HTMLElement | null>> = {
    [KeyboardKey.ArrowUp]: () => getAdjacentFocusable(-1),
    [KeyboardKey.ArrowLeft]: () => getAdjacentFocusable(-1),
    [KeyboardKey.ArrowDown]: () => getAdjacentFocusable(1),
    [KeyboardKey.ArrowRight]: () => getAdjacentFocusable(1),
    [KeyboardKey.Home]: getFirstFocusable,
    [KeyboardKey.PageUp]: getFirstFocusable,
    [KeyboardKey.End]: getLastFocusable,
    [KeyboardKey.PageDown]: getLastFocusable,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === KeyboardKey.Tab) {
      if (!e.shiftKey) return;
      const container = e.currentTarget;
      container.tabIndex = -1;
      requestAnimationFrame(() => { container.tabIndex = 0; });
      return;
    }

    e.preventDefault();
    const getFocusable = keyMap[e.key];
    if (!getFocusable) return;

    const nextFocusable = getFocusable();
    if (nextFocusable) {
      nextFocusable.focus();
      focusedReference.current = nextFocusable;
    }
  };

  return { onFocus, handleKeyDown };
}
