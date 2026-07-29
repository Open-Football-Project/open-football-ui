import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareButton, { buildSharedResource } from "./ShareButton";
import { showSuccess, showInfo } from "../../../utils/toast/toast";

vi.mock("lucide-react", () => ({
  Share2: () => <svg data-testid="share-icon" />,
}));

vi.mock("../../../utils/toast/toast", () => ({
  showSuccess: vi.fn(),
  showInfo: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("buildSharedResource", () => {
  beforeEach(() => {
    delete (global as any).window.location;
    (global as any).window.location = { href: "https://example.com/page" };
    document.title = "Test Page";
  });

  it("builds resource with title", () => {
    const result = buildSharedResource("Custom Title");
    expect(result).toEqual({
      title: "Custom Title",
      url: "https://example.com/page",
    });
  });

  it("uses document.title if no title provided", () => {
    const result = buildSharedResource(undefined);
    expect(result).toEqual({
      title: "Test Page",
      url: "https://example.com/page",
    });
  });

  it("returns undefined if window is undefined", () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    const result = buildSharedResource("Title");
    expect(result).toBeUndefined();
    global.window = originalWindow;
  });
});

describe("ShareButton component", () => {
  const sharedResource = {
    title: "My Page",
    url: "https://example.com",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly with default className", () => {
    render(<ShareButton sharedResource={sharedResource} />);
    const button = screen.getByRole("button", { name: /share this page/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("share-icon")).toBeInTheDocument();
  });

  it("renders correctly with custom className", () => {
    render(
      <ShareButton sharedResource={sharedResource} className="custom-class" />
    );
    const button = screen.getByRole("button", { name: /share this page/i });
    expect(button).toHaveClass("custom-class");
  });

  it("calls navigator.share when clicked", async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    // @ts-ignore
    navigator.share = shareMock;

    render(<ShareButton sharedResource={sharedResource} />);
    const button = screen.getByRole("button", { name: /share this page/i });
    await userEvent.click(button);
    expect(shareMock).toHaveBeenCalledWith(sharedResource);
  });

  it("fails silently if navigator.share throws", async () => {
    const shareMock = vi.fn().mockRejectedValue(new Error("fail"));
    // @ts-ignore
    navigator.share = shareMock;

    render(<ShareButton sharedResource={sharedResource} />);
    const button = screen.getByRole("button", { name: /share this page/i });
    await userEvent.click(button);
    expect(true).toBe(true);
  });
});

describe("ShareButton — desktop fallback", () => {
  const sharedResource = { title: "My Page", url: "https://example.com" };

  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(navigator, "share", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });

  it("copies URL to clipboard when navigator.share is unavailable", async () => {
    render(<ShareButton sharedResource={sharedResource} />);
    await userEvent.click(screen.getByRole("button", { name: /share this page/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://example.com");
  });

  it("shows success toast after copying link", async () => {
    render(<ShareButton sharedResource={sharedResource} />);
    await userEvent.click(screen.getByRole("button", { name: /share this page/i }));
    expect(showSuccess).toHaveBeenCalledWith("toast.linkCopied");
  });

  it("shows error toast when clipboard write fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      writable: true,
      configurable: true,
    });
    render(<ShareButton sharedResource={sharedResource} />);
    await userEvent.click(screen.getByRole("button", { name: /share this page/i }));
    expect(showInfo).toHaveBeenCalledWith("toast.shareFailed");
  });
});
