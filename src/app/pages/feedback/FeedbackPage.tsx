import { useTranslation } from "react-i18next";
import { ApiService } from "@matchinsights/core";
import Seo from "../../main/seo/Seo";
import feedbackSeoData from "../../main/seo/feedback-metadata";
import useFeedbackForm, { FeedbackField, FormStatus } from "./form-status/useFeedbackForm";

interface FeedbackPageProps {
  apiService: ApiService;
}

const inputClass =
"w-full rounded-lg bg-brand-card text-white text-sm p-3 ring-1 ring-gray-500 border border-gray-700 focus:ring-2 focus:ring-brand-orange focus:outline-none placeholder-gray-500"

const labelClass = "py-2 px-4 mb-4 text-center font-semibold bg-black/40 text-brand-cream rounded-t-lg";

const FeedbackPage = ({ apiService }: FeedbackPageProps) => {
  const { t } = useTranslation();
  const {
    form,
    status,
    emailError,
    fieldErrors,
    handleChange,
    handleAndroidToggle,
    handleSubmit,
    handleRetry,
  } = useFeedbackForm(apiService);

  return (
    <Seo {...feedbackSeoData(t)}>
      <section className="text-brand-lightGray px-6 py-12 md:px-16 lg:px-32 w-full">
        <div className="max-w-2xl mx-auto">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-6 text-lg leading-tight rounded-lg">
            <p>{t("feedback.head")}</p>
          </div>

          <p className="text-center text-brand-lightGray mb-8 text-sm">
            {t("feedback.subhead")}
          </p>

          {status === FormStatus.Success ? (
            <div className="bg-brand-success/10 border border-brand-success/40 rounded-lg p-8 text-center">
              <p className="text-brand-success text-2xl font-bold mb-2">
                {t("feedback.successHead")}
              </p>
              <p className="text-brand-lightGray">
                {t("feedback.successText")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    {t("feedback.favoriteTeam")}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={t("feedback.favoriteTeamPlaceholder")}
                    value={form.favoriteTeam}
                    onChange={(e) =>
                      handleChange(FeedbackField.FavoriteTeam, e.target.value)
                    }
                  />
                  {fieldErrors.has(FeedbackField.FavoriteTeam) && (
                    <p className="text-xs text-brand-danger mt-1">{t("feedback.fieldRequired")}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>{t("feedback.league")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={t("feedback.leaguePlaceholder")}
                    value={form.league}
                    onChange={(e) => handleChange(FeedbackField.League, e.target.value)}
                  />
                  {fieldErrors.has(FeedbackField.League) && (
                    <p className="text-xs text-brand-danger mt-1">{t("feedback.fieldRequired")}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t("feedback.liked")}</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder={t("feedback.likedPlaceholder")}
                  value={form.liked}
                  onChange={(e) => handleChange(FeedbackField.Liked, e.target.value)}
                />
                {fieldErrors.has(FeedbackField.Liked) && (
                  <p className="text-xs text-brand-danger mt-1">{t("feedback.fieldRequired")}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  {t("feedback.improvements")}
                </label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder={t("feedback.improvementsPlaceholder")}
                  value={form.improvements}
                  onChange={(e) => handleChange(FeedbackField.Improvements, e.target.value)}
                />
                {fieldErrors.has(FeedbackField.Improvements) && (
                  <p className="text-xs text-brand-danger mt-1">{t("feedback.fieldRequired")}</p>
                )}
              </div>

              <div className="flex items-center gap-3 bg-brand-card border border-gray-700 rounded-lg px-4 py-3">
                <button
                  type="button"
                  onClick={handleAndroidToggle}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    form.wantsAndroidBeta ? "bg-brand-orange" : "bg-gray-600"
                  }`}
                  aria-pressed={form.wantsAndroidBeta}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      form.wantsAndroidBeta ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-brand-lightGray">
                  {t("feedback.wantsAndroidBeta")}
                </span>
              </div>

              {form.wantsAndroidBeta && (
                <div>
                  <label className={labelClass}>
                    {t("feedback.googleEmail")}
                  </label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder={t("feedback.googleEmailPlaceholder")}
                    value={form.googleEmail ?? ""}
                    onChange={(e) =>
                      handleChange(FeedbackField.UserEmail, e.target.value)
                    }
                  />
                  {emailError && (
                    <p className="text-xs text-brand-danger mt-1">
                      {t("feedback.googleEmailError")}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {t("feedback.googleEmailHint")}
                  </p>
                </div>
              )}

              {status === FormStatus.Error && (
                <p className="text-brand-danger text-sm text-center">
                  {t("feedback.errorText")}
                </p>
              )}

              <button
                type="submit"
                disabled={status === FormStatus.Submitting}
                className="w-full bg-brand-orange hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-opacity duration-200"
              >
                {status === FormStatus.Submitting
                  ? t("feedback.submitting")
                  : t("feedback.submit")}
              </button>

              {status === FormStatus.Error && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full border border-gray-600 hover:border-gray-400 text-brand-lightGray text-sm py-2 rounded-lg transition-colors duration-200"
                >
                  {t("feedback.retry")}
                </button>
              )}
            </form>
          )}
        </div>
      </section>
    </Seo>
  );
};

export default FeedbackPage;
