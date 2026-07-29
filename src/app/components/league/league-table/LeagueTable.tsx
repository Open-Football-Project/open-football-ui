import { Link } from "react-router-dom";
import { LeagueTeamInfo } from "open-football-project-core";
import NoData from "../../../components/general/no-data/NoData";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useRovingTabIndex } from "../../../special-hooks/roving-tabindex/roving-tabindex";

interface LeagueTableProps {
  teams: LeagueTeamInfo[];
}

export const LeagueTable = ({ teams }: LeagueTableProps) => {
  const { t } = useTranslation();
  const allFocusable = useRef<(HTMLElement | null)[]>([]);
  const { onFocus, handleKeyDown } = useRovingTabIndex(allFocusable);

  const formBgColor = (data: string) => {
    switch (data) {
      case "W":
        return "bg-green-500";
      case "D":
        return "bg-yellow-400";
      default:
        return "bg-red-500";
    }
  };

  if (teams.length === 0) return <NoData />;

  if (allFocusable.current.length > 0) {
    allFocusable.current = [];
  }

  return (
    <div className="overflow-x-auto bg-brand-darkBg p-1 sm:p-4 rounded-lg ">
      <table
        tabIndex={0}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        className="w-full table-auto border-collapse text-[10px] sm:text-sm roving-container"
      >
        <thead>
          <tr className="bg-brand-blueintense text-white uppercase text-[10px] sm:text-xs tracking-wider">
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              #
            </th>
            <th className="p-0.5 sm:p-2 border border-white/20 text-left">
              {t("leaguestanding.team")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.pts")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.p")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.w")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.d")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.l")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.gf")}
            </th>
            <th className="p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.ga")}
            </th>
            <th className="hidden sm:table-cell p-0.5 sm:p-2 text-center border border-white/20">
              {t("leaguestanding.form")}
            </th>
          </tr>
        </thead>

        <tbody className="text-white text-[10px] sm:text-sm">
          {teams.map((team) => (
            <tr
              key={team.rank}
              className="border border-white/10 even:bg-brand-card odd:bg-brand-navbar-900 hover:bg-gray-800 transition-colors duration-150"
            >
              <td className="text-center py-0.5 sm:py-2 border border-white/10 font-bold">
                {team.rank}
              </td>

              <td className="py-0.5 sm:py-2 border border-white/10 font-bold text-[8px] sm:text-xs hover:text-brand-orange uppercase hover:underline">
                <Link
                  tabIndex={-1}
                  ref={(el) => { if (el) allFocusable.current.push(el); }}
                  to={`/team/${team.teamId}`}
                  className="flex items-center gap-1 sm:gap-2 min-w-0 roving-item"
                >
                  <img
                    src={team.logo}
                    alt={team.teamName}
                    className="w-3 h-3 sm:w-6 sm:h-6 shrink-0"
                  />
                  <span className="block truncate sm:overflow-visible sm:whitespace-normal">
                    {team.teamName}
                  </span>
                </Link>
              </td>

              <td className="text-center border border-white/10 font-bold">
                {team.points}
              </td>
              <td className="text-center border border-white/10">
                {team.played}
              </td>
              <td className="text-center border border-white/10">{team.won}</td>
              <td className="text-center border border-white/10">
                {team.draw}
              </td>
              <td className="text-center border border-white/10">
                {team.lost}
              </td>
              <td className="text-center border border-white/10">
                {team.goalsFor}
              </td>
              <td className="text-center border border-white/10">
                {team.goalsAgainst}
              </td>

              <td className="hidden sm:table-cell border border-white/10 py-0.5 sm:py-2">
                <div className="flex justify-center items-center gap-0.5 sm:gap-1">
                  {team.form.split("").map((data, index) => (
                    <span
                      key={index}
                      className={`w-2 h-2 sm:w-5 sm:h-5 rounded-sm ${formBgColor(
                        data,
                      )} flex items-center justify-center text-[6px] sm:text-sm font-bold text-black`}
                      title={data}
                    >
                      {t(`common.${data}`)}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
