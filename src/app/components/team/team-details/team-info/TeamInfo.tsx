import { useTranslation } from "react-i18next";
import { LeagueBasicInfo, TeamDetails } from "open-football-project-core";

import Logo from "../../../general/logo/Logo";
import { LeaguesMenuGrid } from "../../../league/leagues-menu/leagues-menu-grid/LeaguesMenuGrid";

interface TeamDetailsComponentProps {
  teamDetails: TeamDetails;
  teamLeagues?: LeagueBasicInfo[];
  isTeamLeaguesAvailable?: boolean;
  teamId?: number;
}

export const TeamInfo = ({
  teamDetails,
  isTeamLeaguesAvailable,
  teamLeagues,
}: TeamDetailsComponentProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-darkBg rounded-lg p-4">
        <div className="flex flex-col justify-between">
          <div>
            <Logo
              src={teamDetails.teamLogo}
              customIconWrapperClass="w-20 h-20 bg-transparent flex items-center justify-center"
              customImageClass="w-20 h-20 object-contain m-2 p-2"
              customIconClass="w-20 h-20 object-contain m-2 p-2"
              name={teamDetails.teamName}
            />
            <div>
              <h1 className="text-lg font-bold uppercase text-brand-yellow">
                {teamDetails.teamName}
              </h1>
              <p className="text-xs font-semibold uppercase text-brand-white">
                {t(`country.${teamDetails.teamCountry.toLowerCase()}`, {
                  defaultValue: teamDetails.teamCountry,
                })}{" "}
                • {t("common.founded")}
                <span className="ml-1">
                  {teamDetails.teamFounded > 0
                    ? teamDetails.teamFounded
                    : t("common.unknown")}
                </span>
              </p>
            </div>
            <div className="mt-2">
              <h2 className="text-lg font-semibold text-brand-white">
                {t("common.venue")}
              </h2>
              <p className="text-sm font-semibold uppercase text-brand-yellow">
                {teamDetails.venueName}
              </p>
              <p className="text-xs font-semibold uppercase text-brand-lightGray">
                {teamDetails.venueCity}
              </p>
            </div>
          </div>
        </div>

        {isTeamLeaguesAvailable && (
          <div className="md:col-span-2 rounded-lg p-3">
            <h2 className="text-lg font-semibold text-brand-white mb-2">
              {t("common.leagues")}
            </h2>
            <LeaguesMenuGrid leagues={teamLeagues ?? []} />
          </div>
        )}
      </div>
    </>
  );
};

export default TeamInfo;
