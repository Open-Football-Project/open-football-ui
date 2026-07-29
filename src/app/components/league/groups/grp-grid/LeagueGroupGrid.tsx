import { LeagueGroup } from "open-football-project-core";
import LeagueGroupCard from "../grp-card/LeagueGroupCard";

interface LeagueGroupGridProps {
  groups: LeagueGroup[];
}

export default function LeagueGroupGrid({ groups }: LeagueGroupGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      {groups.map((group, index) => (
        <LeagueGroupCard key={group.label ?? index} group={group} />
      ))}
    </div>
  );
}
