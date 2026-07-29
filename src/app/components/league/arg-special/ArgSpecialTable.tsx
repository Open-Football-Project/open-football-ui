import { Link } from "react-router-dom";
import { ArgLeagueEntry } from "open-football-project-core";
import NoData from "../../../components/general/no-data/NoData";
import { useTranslation } from "react-i18next";

interface ArgTableProps {
  teams: ArgLeagueEntry[];
  mode: "annual" | "promedios";
}

const ArgSpecialTable = ({ teams, mode }: ArgTableProps) => {
  const { t } = useTranslation();

  if (!teams || teams.length === 0) return <NoData />;

  return (
    <div className="overflow-x-auto bg-brand-darkBg p-1 sm:p-4 rounded-lg ">
      <table className="w-full table-auto border-collapse text-[10px] sm:text-sm">
        <thead>
          <tr className="bg-brand-blueintense text-white uppercase text-[10px] sm:text-xs">
            <th className="p-0.5 sm:p-2 text-center border border-white">#</th>
            <th className="p-0.5 sm:p-2 border border-white text-left">
              {t("leaguestanding.team")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white">
              {t("leaguestanding.pts")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white">
              {t("leaguestanding.p")}
            </th>

            {mode === "annual" && (
              <>
                <th className="p-0.5 sm:p-2 text-center border border-white">
                  {t("leaguestanding.w")}
                </th>
                <th className="p-0.5 sm:p-2 text-center border border-white">
                  {t("leaguestanding.d")}
                </th>
                <th className="p-0.5 sm:p-2 text-center border border-white">
                  {t("leaguestanding.l")}
                </th>
                <th className="p-0.5 sm:p-2 text-center border border-white">
                  {t("leaguestanding.gf")}
                </th>
                <th className="p-0.5 sm:p-2 text-center border border-white">
                  {t("leaguestanding.ga")}
                </th>
              </>
            )}

            {mode === "promedios" && (
              <th className="p-0.5 sm:p-2 text-center border border-white">
                {t("leaguestanding.avg")}
              </th>
            )}
          </tr>
        </thead>

        <tbody className="text-white text-[10px] sm:text-sm">
          {teams.map((team, index) => (
            <tr
              key={team.teamId}
              className="border border-white even:bg-brand-card odd:bg-brand-navbar-900 hover:bg-gray-800 transition-colors"
            >
              <td className="text-center py-0.5 sm:py-2 border border-white font-bold">
                {index + 1}
              </td>

              <td className="py-0.5 sm:py-2 border border-white font-bold text-[8px] sm:text-xs hover:text-brand-orange uppercase hover:underline">
                <Link
                  to={`/team/${team.teamId}`}
                  className="flex items-center gap-1 sm:gap-2 min-w-0"
                >
                  {team.teamLogo && (
                    <img
                      src={team.teamLogo}
                      alt={team.teamName}
                      className="w-4 h-4 sm:w-6 sm:h-6 shrink-0"
                    />
                  )}
                  <span className="block truncate sm:overflow-visible sm:whitespace-normal">
                    {team.teamName}
                  </span>
                </Link>
              </td>

              <td className="text-center border border-white font-bold">
                {team.points}
              </td>
              <td className="text-center border border-white">{team.played}</td>

              {mode === "annual" && (
                <>
                  <td className="text-center border border-white">
                    {team.wins}
                  </td>
                  <td className="text-center border border-white">
                    {team.draws}
                  </td>
                  <td className="text-center border border-white">
                    {team.losses}
                  </td>
                  <td className="text-center border border-white">
                    {team.goalsFor}
                  </td>
                  <td className="text-center border border-white">
                    {team.goalsAgainst}
                  </td>
                </>
              )}

              {mode === "promedios" && (
                <td className="text-center text-brand-yellow border border-white">
                  {team.promedio}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArgSpecialTable;
