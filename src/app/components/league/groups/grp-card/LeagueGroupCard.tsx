import { LeagueGroup } from "open-football-project-core";
import { LeagueTable } from "../../league-table/LeagueTable";
import { leagueGroupTranslation } from "open-football-project-core";
import { useTranslation } from "react-i18next";

interface LeagueGroupCardProps {
  group: LeagueGroup;
}

export default function LeagueGroupCard({ group }: LeagueGroupCardProps) {
  const { i18n } = useTranslation();

  return (
    <div className="bg-brand-darkBg rounded-lg sm:p-1 border border-white/10">
      <h4 className="py-2 px-4 mb-4 text-center font-semibold bg-black/40 text-brand-cream rounded-t-lg">
        {leagueGroupTranslation(group.label ?? "", i18n.language)}
      </h4>

      <LeagueTable teams={group.teams} />
    </div>
  );
}
