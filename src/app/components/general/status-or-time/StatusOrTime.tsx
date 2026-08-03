import { useTranslation } from "react-i18next";
import { getFormattedDate, getFormattedTime } from "open-football-project-core";

interface StatusOrTimeProps {
  isFinished: boolean;
  statusShort: string;
  utcDate: string;
}

const StatusOrTime = ({
  isFinished,
  statusShort,
  utcDate,
}: StatusOrTimeProps) => {
  const { t } = useTranslation();
  return (
    <>
      {isFinished ? (
        <p
          data-testid="match-status"
          className="text-[9px] sm:text-xs text-brand-yellow font-semibold text-center md:text-left"
        >
          {t(`matchstatus.${statusShort}`)}
        </p>
      ) : (
        <p
          data-testid="match-status"
          className="
            text-[9px] sm:text-xs text-brand-yellow font-semibold
            flex flex-col md:flex-row md:items-center md:gap-1
            text-center md:text-left
          "
        >
          <span data-testid="match-day">
            {getFormattedDate(utcDate, "dd/MM")}
          </span>
          <span className="hidden md:inline">•</span>
          <span data-testid="match-time">{getFormattedTime(utcDate)}</span>
        </p>
      )}
    </>
  );
};

export default StatusOrTime;
