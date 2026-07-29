import { LiveHomeAwayForm } from "open-football-project-core";
import { FaFire, FaSnowflake, FaMinus } from "react-icons/fa6";

const dotColour = (result: string) => {
  if (result === "W") return "bg-brand-success";
  if (result === "D") return "bg-amber-400";
  return "bg-brand-danger";
};

const FormDots = ({ form }: { form: string[] }) => (
  <div className="flex gap-0.5">
    {form.map((result, i) => (
      <span key={i} className={`w-2.5 h-2.5 rounded-full ${dotColour(result)}`} />
    ))}
  </div>
);

const HotBadge = () => <FaFire className="text-brand-danger text-lg shrink-0" />;
const ColdBadge = () => <FaSnowflake className="text-brand-white text-lg shrink-0" />;
const NeutralBadge = () => <FaMinus className="text-gray-400 text-sm shrink-0" />;

interface LiveFormBadgeProps {
  homeAwayForm: LiveHomeAwayForm;
  isHome: boolean;
}

export const LiveFormBadge = ({ homeAwayForm, isHome }: LiveFormBadgeProps) => {
  const form = isHome ? homeAwayForm.homeForm : homeAwayForm.awayForm;
  const isHot = isHome ? homeAwayForm.isHomeHot : homeAwayForm.isAwayHot;
  const isCold = isHome ? homeAwayForm.isHomeCold : homeAwayForm.isAwayCold;

  return (
    <div className="flex items-center gap-1">
      <FormDots form={form} />
      {isHot && <HotBadge />}
      {isCold && <ColdBadge />}
      {!isHot && !isCold && <NeutralBadge />}
    </div>
  );
};
