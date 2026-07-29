import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FeedbackPage from "./FeedbackPage";

vi.mock("../../main/seo/Seo", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockPostFeedback = vi.fn();

const mockApiService = {
  feedbackService: {
    postFeedback: mockPostFeedback,
  },
} as any;

describe("FeedbackPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillRequiredFields = () => {
    fireEvent.change(
      screen.getByPlaceholderText("feedback.favoriteTeamPlaceholder"),
      {
        target: { value: "Barcelona" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText("feedback.leaguePlaceholder"),
      {
        target: { value: "La Liga" },
      },
    );
    fireEvent.change(screen.getByPlaceholderText("feedback.likedPlaceholder"), {
      target: { value: "Great stats" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("feedback.improvementsPlaceholder"),
      {
        target: { value: "More leagues" },
      },
    );
  };

  it("renders the form fields", () => {
    render(<FeedbackPage apiService={mockApiService} />);

    expect(
      screen.getByPlaceholderText("feedback.favoriteTeamPlaceholder"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText("feedback.leaguePlaceholder"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText("feedback.likedPlaceholder"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText("feedback.improvementsPlaceholder"),
    ).toBeDefined();
    expect(screen.getByText("feedback.submit")).toBeDefined();
  });

  it("shows google email field when android beta toggle is enabled", () => {
    render(<FeedbackPage apiService={mockApiService} />);

    expect(
      screen.queryByPlaceholderText("feedback.googleEmailPlaceholder"),
    ).toBeNull();

    fireEvent.click(screen.getByRole("button", { pressed: false }));

    expect(
      screen.getByPlaceholderText("feedback.googleEmailPlaceholder"),
    ).toBeDefined();
  });

  it("shows success message after successful submit", async () => {
    mockPostFeedback.mockResolvedValue(undefined);
    render(<FeedbackPage apiService={mockApiService} />);

    fillRequiredFields();
    fireEvent.submit(
      screen.getByRole("button", { name: "feedback.submit" }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByText("feedback.successHead")).toBeDefined();
    });
  });

  it("shows error message after failed submit", async () => {
    mockPostFeedback.mockRejectedValue(new Error("fail"));
    render(<FeedbackPage apiService={mockApiService} />);

    fillRequiredFields();
    fireEvent.submit(
      screen.getByRole("button", { name: "feedback.submit" }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByText("feedback.errorText")).toBeDefined();
    });
  });

  it("shows retry button on error and resets form on click", async () => {
    mockPostFeedback.mockRejectedValue(new Error("fail"));
    render(<FeedbackPage apiService={mockApiService} />);

    fillRequiredFields();
    fireEvent.submit(
      screen.getByRole("button", { name: "feedback.submit" }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByText("feedback.retry")).toBeDefined();
    });

    fireEvent.click(screen.getByText("feedback.retry"));
    expect(screen.queryByText("feedback.errorText")).toBeNull();
  });

  it("shows email validation error for invalid email", async () => {
    render(<FeedbackPage apiService={mockApiService} />);

    fireEvent.click(screen.getByRole("button", { pressed: false }));

    fireEvent.change(
      screen.getByPlaceholderText("feedback.googleEmailPlaceholder"),
      {
        target: { value: "not-an-email" },
      },
    );

    fillRequiredFields();
    fireEvent.submit(
      screen.getByRole("button", { name: "feedback.submit" }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByText("feedback.googleEmailError")).toBeDefined();
    });
    expect(mockPostFeedback).not.toHaveBeenCalled();
  });

  it("clears email error after correcting the email", async () => {
    render(<FeedbackPage apiService={mockApiService} />);

    fireEvent.click(screen.getByRole("button", { pressed: false }));
    fireEvent.change(
      screen.getByPlaceholderText("feedback.googleEmailPlaceholder"),
      {
        target: { value: "bad" },
      },
    );

    fillRequiredFields();
    fireEvent.submit(
      screen.getByRole("button", { name: "feedback.submit" }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByText("feedback.googleEmailError")).toBeDefined();
    });

    fireEvent.change(
      screen.getByPlaceholderText("feedback.googleEmailPlaceholder"),
      {
        target: { value: "valid@gmail.com" },
      },
    );

    expect(screen.queryByText("feedback.googleEmailError")).toBeNull();
  });
});
