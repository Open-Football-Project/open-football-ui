import { Poll } from "@matchinsights/core";
import { useTranslation } from "react-i18next";

interface PollResultsCardProps {
  poll: Poll;
}

const PollResult = ({ poll }: PollResultsCardProps) => {
  const { t } = useTranslation();

  const translationKey = (statDisplayed: string) => {
    return statDisplayed
      .trim()
      .toLowerCase()
      .replace(/[+\-\s]/g, "");
  };

  const { pollTitle, pollVotingOptions } = poll;

  const totalVotes = pollVotingOptions.reduce((sum, opt) => sum + opt.value, 0);

  const getPercentage = (count: number) =>
    totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : "0";

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full lg:w-11/12 flex flex-col gap-2">
        <h3 className="text-brand-orange text-sm sm:text-base font-bold text-center my-2">
          {t(`polls.${translationKey(pollTitle)}`)}
        </h3>

        {totalVotes === 0 ? (
          <p className="text-[11px] sm:text-sm text-brand-lightGray text-center mt-2">
            {t("polls.thanks")}
          </p>
        ) : (
          <>
            <ul className="w-full flex flex-col gap-1 sm:gap-2">
              {pollVotingOptions.map((option) => {
                const percentage = getPercentage(option.value);

                return (
                  <li
                    key={option.optionName}
                    className="relative bg-brand-card p-2 w-full flex flex-row items-center justify-between overflow-hidden"
                  >
                    <div className="flex justify-between items-center w-full z-10 relative">
                      <span className="text-[10px] sm:text-xs font-semibold uppercase text-brand-white truncate">
                        {t(`polls.${translationKey(option.optionTitle)}`)}
                      </span>
                      <span className="text-[10px] sm:text-sm font-semibold text-brand-success">
                        {percentage}%
                      </span>
                    </div>

                    <div
                      className="absolute left-0 top-0 h-full bg-brand-purple opacity-20 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default PollResult;
