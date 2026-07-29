import { LeagueFixture, useLeagueFixtureBinaryTree } from "open-football-project-core";
import BracketTree from "./BracketTree";
import DownloadBracketButton from "../download-bracket-button/DownloadBracketButton";

interface KnockoutBracketSectionProps {
  fixtures: LeagueFixture;
  leagueName: string;
}

const KnockoutBracketSection = ({ fixtures, leagueName }: KnockoutBracketSectionProps) => {
  const root = useLeagueFixtureBinaryTree(fixtures);

  return (
    <div className="space-y-3">
      <div className="flex justify-end px-2">
        <DownloadBracketButton root={root} leagueName={leagueName} />
      </div>
      <BracketTree root={root} />
    </div>
  );
};

export default KnockoutBracketSection;
