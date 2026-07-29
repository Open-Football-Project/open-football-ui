import { useState } from "react";
import { ApiService, FeedbackRequest } from "open-football-project-core";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

export enum FormStatus {
  Idle = "idle",
  Submitting = "submitting",
  Success = "success",
  Error = "error",
}

export enum FeedbackField {
  FavoriteTeam = "favoriteTeam",
  League = "league",
  Liked = "liked",
  Improvements = "improvements",
  UserEmail = "googleEmail",
}

const initalForm: FeedbackRequest = {
  favoriteTeam: "",
  league: "",
  liked: "",
  improvements: "",
  wantsAndroidBeta: false,
  googleEmail: null,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

const REQUIRED_FIELDS = [
  FeedbackField.FavoriteTeam,
  FeedbackField.League,
  FeedbackField.Liked,
  FeedbackField.Improvements,
] as const;

const useFeedbackForm = (apiService: ApiService) => {
  const [form, setForm] = useState<FeedbackRequest>(initalForm);
  const [status, setStatus] = useState<FormStatus>(FormStatus.Idle);
  const [emailError, setEmailError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Set<FeedbackField>>(new Set());
  const { feedbackService } = apiService;

  const handleChange = (
    field: keyof Omit<FeedbackRequest, "wantsAndroidBeta">,
    value: string,
  ) => {
    if (field === FeedbackField.UserEmail) setEmailError(false);
    if (value.trim()) {
      setFieldErrors((prev) => {
        if (!prev.has(field as FeedbackField)) return prev;
        const next = new Set(prev);
        next.delete(field as FeedbackField);
        return next;
      });
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAndroidToggle = () => {
    setEmailError(false);
    setForm((prev) => ({
      ...prev,
      wantsAndroidBeta: !prev.wantsAndroidBeta,
      googleEmail: prev.wantsAndroidBeta ? null : prev.googleEmail,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyFields = new Set(
      REQUIRED_FIELDS.filter((field) => !form[field]?.trim()),
    );
    if (emptyFields.size > 0) {
      setFieldErrors(emptyFields);
      return;
    }

    if (
      form.wantsAndroidBeta &&
      form.googleEmail &&
      !isValidEmail(form.googleEmail)
    ) {
      setEmailError(true);
      return;
    }

    setStatus(FormStatus.Submitting);
    try {
      await feedbackService.postFeedback(form);
      trackEvent(AnalyticsEvent.FEEDBACK_SUBMITTED);
      setStatus(FormStatus.Success);
    } catch {
      setStatus(FormStatus.Error);
    }
  };

  const handleRetry = () => setStatus(FormStatus.Idle);

  return {
    form,
    status,
    emailError,
    fieldErrors,
    handleChange,
    handleAndroidToggle,
    handleSubmit,
    handleRetry,
  };
};

export default useFeedbackForm;
