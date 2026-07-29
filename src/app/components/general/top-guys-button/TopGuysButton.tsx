import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TopGuysButtonProps {
  fixtureId: number;
}

const TopGuysButton = ({ fixtureId }: TopGuysButtonProps) => {
  const { t } = useTranslation();
  return (
    <Link
      data-testid="top-guys-link"
      to={`/today-players/${fixtureId}`}
      className="relative inline-flex items-center justify-center text-[10px] sm:text-xs font-semibold rounded-full shadow-md transition-all duration-300 px-3 py-1 min-w-[60px] text-white bg-brand-green hover:bg-brand-green/80"
    >
      {t("matchbtn.top_guys")}
    </Link>
  );
};

export default TopGuysButton;
