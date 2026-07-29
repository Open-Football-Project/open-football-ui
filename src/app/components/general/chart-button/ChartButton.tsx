import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ChartButtonProps {
  fixtureId: number;
}

const ChartButton = ({ fixtureId }: ChartButtonProps) => {
  const { t } = useTranslation();
  return (
    <Link
      data-testid="chart-link"
      to={`/charts/${fixtureId}`}
      className="relative inline-flex items-center justify-center text-[10px] sm:text-xs font-semibold rounded-full shadow-md transition-all duration-300 px-3 py-1 min-w-[60px] text-white bg-brand-blueintense hover:bg-brand-blueintense/80"
    >
      {t("matchbtn.chart")}
    </Link>
  );
};

export default ChartButton;
