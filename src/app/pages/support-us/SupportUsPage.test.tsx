import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SupportUsPage from "./SupportUsPage";
import { showSuccess, showInfo } from "../../utils/toast/toast";
import { trackEvent, AnalyticsEvent } from "../../utils/analytics/analytics";

const FAKE_BTC_ADDRESS = "bc1qtestaddress0000000000000000000000000";

vi.mock("../../main/seo/Seo", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock("../../utils/toast/toast", () => ({
  showSuccess: vi.fn(),
  showInfo: vi.fn(),
}));

vi.mock("../../utils/analytics/analytics", () => ({
  trackEvent: vi.fn(),
  AnalyticsEvent: { BTC_ADDRESS_COPIED: "btc_address_copied" },
}));

describe("SupportUsPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("VITE_BTC_ADDRESS", FAKE_BTC_ADDRESS);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });

  it("renders heading and explanatory text", () => {
    render(<SupportUsPage />);
    expect(screen.getByText("supportus.head")).toBeInTheDocument();
    expect(screen.getByText("supportus.text")).toBeInTheDocument();
  });

  it("renders the BTC address from the env var as selectable text", () => {
    render(<SupportUsPage />);
    expect(screen.getByText(FAKE_BTC_ADDRESS)).toBeInTheDocument();
  });

  it("copies the address to the clipboard when the copy button is clicked", async () => {
    render(<SupportUsPage />);
    await userEvent.click(
      screen.getByRole("button", { name: /supportus.copyButton/i })
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(FAKE_BTC_ADDRESS);
  });

  it("tracks the copy event and shows a success toast", async () => {
    render(<SupportUsPage />);
    await userEvent.click(
      screen.getByRole("button", { name: /supportus.copyButton/i })
    );
    expect(trackEvent).toHaveBeenCalledWith(AnalyticsEvent.BTC_ADDRESS_COPIED);
    expect(showSuccess).toHaveBeenCalledWith("toast.addressCopied");
  });

  it("shows a failure toast when the clipboard write rejects", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      writable: true,
      configurable: true,
    });
    render(<SupportUsPage />);
    await userEvent.click(
      screen.getByRole("button", { name: /supportus.copyButton/i })
    );
    expect(showInfo).toHaveBeenCalledWith("toast.copyFailed");
  });
});
