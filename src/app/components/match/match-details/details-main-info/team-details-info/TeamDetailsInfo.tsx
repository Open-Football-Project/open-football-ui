import { Link } from "react-router-dom";
import { Team } from "open-football-project-core";
import Logo from "../../../../general/logo/Logo";
import { trackEvent, AnalyticsEvent } from "../../../../../utils/analytics/analytics";

interface TeamDetailsInfoProps {
  team: Team;
}

export default function TeamDetailsInfo({ team }: TeamDetailsInfoProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Logo
        src={team.logo}
        customIconWrapperClass="w-20 h-20 bg-transparent flex items-center justify-center mx-2"
        customImageClass="w-20 h-20 object-contain"
        name={team.name}
      />
      <div className="w-[90px] sm:w-auto">
        {" "}
        <Link
          data-testid={`${team.id}-team-link`}
          onClick={() => team?.id && trackEvent(AnalyticsEvent.TEAM_OPENED, { team_id: String(team.id) })}
          to={team?.id ? `/team/${team.id}` : "#"}
          className="block text-[12px] sm:text-lg font-semibold uppercase text-brand-white hover:text-brand-orange hover:underline transition truncate text-center sm:whitespace-normal sm:overflow-visible"
        >
          {team.name}
        </Link>
      </div>
    </div>
  );
}
