import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useFeedbackForm, { FeedbackField, FormStatus } from "./useFeedbackForm";

const mockPostFeedback = vi.fn();

const mockApiService = {
  feedbackService: {
    postFeedback: mockPostFeedback,
  },
} as any;

const mockEvent = {
  preventDefault: vi.fn(),
} as unknown as React.FormEvent;

const fillRequiredFields = (result: ReturnType<typeof renderHook<ReturnType<typeof useFeedbackForm>, unknown>>["result"]) => {
  act(() => {
    result.current.handleChange(FeedbackField.FavoriteTeam, "Barcelona");
    result.current.handleChange(FeedbackField.League, "La Liga");
    result.current.handleChange(FeedbackField.Liked, "Great stats");
    result.current.handleChange(FeedbackField.Improvements, "More leagues");
  });
};

describe("useFeedbackForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default form values, idle status and no errors", () => {
    const { result } = renderHook(() => useFeedbackForm(mockApiService));

    expect(result.current.form).toEqual({
      favoriteTeam: "",
      league: "",
      liked: "",
      improvements: "",
      wantsAndroidBeta: false,
      googleEmail: null,
    });
    expect(result.current.status).toBe(FormStatus.Idle);
    expect(result.current.emailError).toBe(false);
    expect(result.current.fieldErrors.size).toBe(0);
  });

  it("updates a field via handleChange", () => {
    const { result } = renderHook(() => useFeedbackForm(mockApiService));

    act(() => {
      result.current.handleChange(FeedbackField.FavoriteTeam, "Barcelona");
    });

    expect(result.current.form.favoriteTeam).toBe("Barcelona");
  });

  it("toggles wantsAndroidBeta on handleAndroidToggle", () => {
    const { result } = renderHook(() => useFeedbackForm(mockApiService));

    act(() => {
      result.current.handleAndroidToggle();
    });

    expect(result.current.form.wantsAndroidBeta).toBe(true);

    act(() => {
      result.current.handleAndroidToggle();
    });

    expect(result.current.form.wantsAndroidBeta).toBe(false);
  });

  it("clears googleEmail when toggling wantsAndroidBeta off", () => {
    const { result } = renderHook(() => useFeedbackForm(mockApiService));

    act(() => {
      result.current.handleAndroidToggle();
    });
    act(() => {
      result.current.handleChange(FeedbackField.UserEmail, "test@example.com");
    });
    act(() => {
      result.current.handleAndroidToggle();
    });

    expect(result.current.form.googleEmail).toBeNull();
  });

  it("sets status to success on successful submit", async () => {
    mockPostFeedback.mockResolvedValue(undefined);
    const { result } = renderHook(() => useFeedbackForm(mockApiService));

    fillRequiredFields(result);

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.status).toBe(FormStatus.Success);
  });

  it("sets status to error on failed submit", async () => {
    mockPostFeedback.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useFeedbackForm(mockApiService));

    fillRequiredFields(result);

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.status).toBe(FormStatus.Error);
  });

  it("resets status to idle on handleRetry", async () => {
    mockPostFeedback.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useFeedbackForm(mockApiService));

    fillRequiredFields(result);

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    expect(result.current.status).toBe(FormStatus.Error);

    act(() => {
      result.current.handleRetry();
    });

    expect(result.current.status).toBe(FormStatus.Idle);
  });

  describe("required field validation", () => {
    it("blocks submit and sets fieldErrors when required fields are empty", async () => {
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.fieldErrors.size).toBe(4);
      expect(result.current.fieldErrors.has(FeedbackField.FavoriteTeam)).toBe(true);
      expect(result.current.fieldErrors.has(FeedbackField.League)).toBe(true);
      expect(result.current.fieldErrors.has(FeedbackField.Liked)).toBe(true);
      expect(result.current.fieldErrors.has(FeedbackField.Improvements)).toBe(true);
      expect(result.current.status).toBe(FormStatus.Idle);
      expect(mockPostFeedback).not.toHaveBeenCalled();
    });

    it("only flags the specific empty fields", async () => {
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      act(() => {
        result.current.handleChange(FeedbackField.FavoriteTeam, "Barcelona");
        result.current.handleChange(FeedbackField.League, "La Liga");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.fieldErrors.size).toBe(2);
      expect(result.current.fieldErrors.has(FeedbackField.Liked)).toBe(true);
      expect(result.current.fieldErrors.has(FeedbackField.Improvements)).toBe(true);
    });

    it("clears a field error when that field gets a value", async () => {
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });
      expect(result.current.fieldErrors.has(FeedbackField.FavoriteTeam)).toBe(true);

      act(() => {
        result.current.handleChange(FeedbackField.FavoriteTeam, "Barcelona");
      });

      expect(result.current.fieldErrors.has(FeedbackField.FavoriteTeam)).toBe(false);
    });

    it("does not clear a field error when set to whitespace", async () => {
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      act(() => {
        result.current.handleChange(FeedbackField.FavoriteTeam, "   ");
      });

      expect(result.current.fieldErrors.has(FeedbackField.FavoriteTeam)).toBe(true);
    });
  });

  describe("email validation", () => {
    it("sets emailError and does not submit when email is invalid", async () => {
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      fillRequiredFields(result);
      act(() => {
        result.current.handleAndroidToggle();
        result.current.handleChange(FeedbackField.UserEmail, "not-an-email");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.emailError).toBe(true);
      expect(result.current.status).toBe(FormStatus.Idle);
      expect(mockPostFeedback).not.toHaveBeenCalled();
    });

    it("clears emailError when googleEmail field changes", async () => {
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      fillRequiredFields(result);
      act(() => {
        result.current.handleAndroidToggle();
        result.current.handleChange(FeedbackField.UserEmail, "not-an-email");
      });
      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });
      expect(result.current.emailError).toBe(true);

      act(() => {
        result.current.handleChange(FeedbackField.UserEmail, "valid@example.com");
      });

      expect(result.current.emailError).toBe(false);
    });

    it("clears emailError when toggling android beta", async () => {
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      fillRequiredFields(result);
      act(() => {
        result.current.handleAndroidToggle();
        result.current.handleChange(FeedbackField.UserEmail, "bad");
      });
      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });
      expect(result.current.emailError).toBe(true);

      act(() => {
        result.current.handleAndroidToggle();
      });

      expect(result.current.emailError).toBe(false);
    });

    it("submits successfully with a valid email", async () => {
      mockPostFeedback.mockResolvedValue(undefined);
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      fillRequiredFields(result);
      act(() => {
        result.current.handleAndroidToggle();
        result.current.handleChange(FeedbackField.UserEmail, "user@gmail.com");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.emailError).toBe(false);
      expect(result.current.status).toBe(FormStatus.Success);
      expect(mockPostFeedback).toHaveBeenCalledOnce();
    });

    it("submits without error when wantsAndroidBeta is false even if email field has a value", async () => {
      mockPostFeedback.mockResolvedValue(undefined);
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      fillRequiredFields(result);
      act(() => {
        result.current.handleChange(FeedbackField.UserEmail, "not-an-email");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.emailError).toBe(false);
      expect(result.current.status).toBe(FormStatus.Success);
    });

    it("submits without error when wantsAndroidBeta is true but googleEmail is null", async () => {
      mockPostFeedback.mockResolvedValue(undefined);
      const { result } = renderHook(() => useFeedbackForm(mockApiService));

      fillRequiredFields(result);
      act(() => {
        result.current.handleAndroidToggle();
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.emailError).toBe(false);
      expect(result.current.status).toBe(FormStatus.Success);
    });
  });
});
