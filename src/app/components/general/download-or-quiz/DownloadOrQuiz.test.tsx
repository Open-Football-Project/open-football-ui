import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DownloadOrQuiz } from "./DownloadOrQuiz";

const defaultProps = {
  handleDownload: vi.fn(),
  handleQuizDownload: vi.fn(),
  downloading: false,
  downloadingQuiz: false,
};

describe("DownloadOrQuiz", () => {
  it("renders Download and Quiz buttons", () => {
    render(<DownloadOrQuiz {...defaultProps} />);
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quiz/i })).toBeInTheDocument();
  });

  it("calls handleDownload when Download is clicked", () => {
    const handleDownload = vi.fn();
    render(<DownloadOrQuiz {...defaultProps} handleDownload={handleDownload} />);
    fireEvent.click(screen.getByRole("button", { name: /download/i }));
    expect(handleDownload).toHaveBeenCalledOnce();
  });

  it("calls handleQuizDownload when Quiz is clicked", () => {
    const handleQuizDownload = vi.fn();
    render(<DownloadOrQuiz {...defaultProps} handleQuizDownload={handleQuizDownload} />);
    fireEvent.click(screen.getByRole("button", { name: /quiz/i }));
    expect(handleQuizDownload).toHaveBeenCalledOnce();
  });

  it("disables Download button and shows '…' while downloading", () => {
    render(<DownloadOrQuiz {...defaultProps} downloading={true} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
    expect(buttons[0]).toHaveTextContent("…");
  });

  it("disables Quiz button and shows '…' while downloadingQuiz", () => {
    render(<DownloadOrQuiz {...defaultProps} downloadingQuiz={true} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toBeDisabled();
    expect(buttons[1]).toHaveTextContent("…");
  });

  it("re-enables Download when not downloading", () => {
    render(<DownloadOrQuiz {...defaultProps} downloading={false} />);
    expect(screen.getByRole("button", { name: /download/i })).not.toBeDisabled();
  });

  it("re-enables Quiz when not downloadingQuiz", () => {
    render(<DownloadOrQuiz {...defaultProps} downloadingQuiz={false} />);
    expect(screen.getByRole("button", { name: /quiz/i })).not.toBeDisabled();
  });
});
