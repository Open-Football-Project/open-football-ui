import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { SocialSharing } from "./SocialSharing";
import { showSuccess, showError } from "../../../utils/toast/toast";

vi.mock("../../../utils/toast/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultProps = {
  handleShare: vi.fn(),
  handleDownload: vi.fn(),
  downloading: false,
};

describe("SocialSharing", () => {
  it("renders Share and Download buttons", () => {
    render(<SocialSharing {...defaultProps} />);
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
  });

  it("calls handleShare when Share is clicked", () => {
    const handleShare = vi.fn();
    render(<SocialSharing {...defaultProps} handleShare={handleShare} />);
    fireEvent.click(screen.getByRole("button", { name: /share/i }));
    expect(handleShare).toHaveBeenCalledOnce();
  });

  it("calls handleDownload when Download is clicked", () => {
    const handleDownload = vi.fn();
    render(<SocialSharing {...defaultProps} handleDownload={handleDownload} />);
    fireEvent.click(screen.getByRole("button", { name: /download/i }));
    expect(handleDownload).toHaveBeenCalledOnce();
  });

  it("disables Download and shows '…' while downloading", () => {
    render(<SocialSharing {...defaultProps} downloading={true} />);
    const btn = screen.getByRole("button", { name: /…/ });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("…");
  });

  it("re-enables Download when downloading is false", () => {
    render(<SocialSharing {...defaultProps} downloading={false} />);
    expect(screen.getByRole("button", { name: /download/i })).not.toBeDisabled();
  });
});

describe("SocialSharing — download toasts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows success toast after download completes", async () => {
    const handleDownload = vi.fn().mockResolvedValue(undefined);
    render(<SocialSharing {...defaultProps} handleDownload={handleDownload} />);
    await userEvent.click(screen.getByRole("button", { name: /download/i }));
    expect(showSuccess).toHaveBeenCalledWith("toast.downloadReady");
  });

  it("shows error toast when download fails", async () => {
    const handleDownload = vi.fn().mockRejectedValue(new Error("fail"));
    render(<SocialSharing {...defaultProps} handleDownload={handleDownload} />);
    await userEvent.click(screen.getByRole("button", { name: /download/i }));
    expect(showError).toHaveBeenCalledWith("toast.downloadFailed");
  });
});
