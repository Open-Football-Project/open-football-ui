import MatchDetailsSlider, {
  SliderItem,
} from "../match-details-slider/MatchDetailsSlider";

import HeadToHead from "../h2h/HeadToHead";
import { H2HDetails } from "open-football-project-core";

interface MatchDetailsThirdRowProps {
  h2hDetails: H2HDetails[];
  isLoading: boolean;
  homeTeamName: string;
  awayTeamName: string;
}
const MatchDetailsThirdRow = ({
  h2hDetails,
  isLoading,
  homeTeamName,
  awayTeamName,
}: MatchDetailsThirdRowProps) => {
  const sliding: SliderItem[] = h2hDetails.map((it) => ({
    isLoading: isLoading,
    title: `${homeTeamName} vs ${awayTeamName}`,
    component: <HeadToHead h2hDetails={it} loading={isLoading} />,
  }));

  return (
    <MatchDetailsSlider
      key={`h2h-row-slider-${homeTeamName}-${awayTeamName}`}
      items={sliding.filter((it) => !it.isLoading)}
    />
  );
};

export default MatchDetailsThirdRow;
