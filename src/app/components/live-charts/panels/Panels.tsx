import { ChartPanel } from "@matchinsights/core";
import IndicatorsPanel from "./indicators-panel/IndicatorsPanel";

interface Props {
  panels: ChartPanel[];
}

const Panels = ({ panels }: Props) => (
  <div className="flex flex-col gap-4">
    {panels.map((panel) => (
      <IndicatorsPanel key={panel.id ?? panel.type} panel={panel} />
    ))}
  </div>
);

export default Panels;
