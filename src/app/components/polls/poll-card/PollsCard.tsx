import { AvailablePollOption } from "@matchinsights/core";
import { useTranslation } from "react-i18next";

interface PollCardProps {
  pollTitle: string;
  options: AvailablePollOption[];
  onVote: (option: string) => Promise<void> | void;
}

const PollsCard = ({ pollTitle, onVote, options }: PollCardProps) => {
  const { t } = useTranslation();
  const translationKey = (statDisplayed: string) => {
    return statDisplayed
      .trim()
      .toLowerCase()
      .replace(/[+\-\s]/g, "");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full lg:w-11/12 flex flex-col gap-2">
        <h3 className="py-2 px-4 text-center font-semibold bg-black/40 text-brand-cream rounded-t-lg">
          {t(`polls.${translationKey(pollTitle)}`)}
        </h3>

        <ul className="w-full flex flex-col gap-2">
          {options.map((option) => (
            <li key={option.optionName}>
              <button
                onClick={() => onVote(option.optionName)}
                className={`w-full p-3 sm:p-3 text-xs font-bold text-brand-white tracking-wide
                            bg-brand-blueintense border border-brand-aqua
                            hover:bg-brand-aqua hover:text-brand-black
                            active:bg-brand-green active:text-brand-black
                            transition-colors duration-150
                            cursor-pointer select-none uppercase rounded-lg`}
              >
                {t(`polls.${translationKey(option.optionTitle)}`)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PollsCard;
