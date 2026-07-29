import { useTranslation } from "react-i18next";

interface DownloadOrQuizProps {
  handleQuizDownload: () => void;
  handleDownload: () => void;
  downloading: boolean;
  downloadingQuiz: boolean;
}

export const DownloadOrQuiz = ({
  handleQuizDownload,
  downloadingQuiz,
  handleDownload,
  downloading,
}: DownloadOrQuizProps) => {
  const { t } = useTranslation();
  return (
    <div className="absolute top-2 left-0 right-0 flex justify-center gap-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          handleDownload();
        }}
        disabled={downloading}
        className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-brand-yellowa/40 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md"
      >
        {downloading ? "…" : t("common.download", { defaultValue: "Download" })}
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleQuizDownload();
        }}
        disabled={downloadingQuiz}
        className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-brand-orangeo/80 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md"
        title="Quiz card — player name and photo hidden"
      >
        {downloadingQuiz
          ? "…"
          : t("common.genquiz", { defaultValue: "Generate Quiz" })}
      </button>
    </div>
  );
};
