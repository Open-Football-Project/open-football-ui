import { Link } from "react-router-dom";
import Logo from "../../general/logo/Logo";
import teamLogoDefault from "../../../assets/images/fclogo.png";

import { PlayerTransferInfo } from "open-football-project-core";
import NoData from "../../general/no-data/NoData";
import { getFormattedDate } from "open-football-project-core";

interface PlayerTransfersProps {
  transfers: PlayerTransferInfo[];
}

export default function PlayerTransfers({ transfers }: PlayerTransfersProps) {
  if (!transfers.length) return <NoData />;

  const teamLogo = (url?: string | null) => url || teamLogoDefault;

  const sortedTransfers = [...transfers].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <ul className="space-y-3">
      {sortedTransfers.map((t, idx) => (
        <li key={`${t.date}-${idx}`} className="bg-brand-darkBg rounded-lg p-3">
          <div className="text-xs text-brand-lightGray mb-1 sm:mb-0 sm:text-brand-white sm:font-medium">
            {t.date ? getFormattedDate(t.date, "dd MMM yyyy") : "Unknown Date"}
          </div>

          <div className="flex items-center gap-2 flex-nowrap">
            {t.fromTeamId && (
              <Link
                to={`/team/${t.fromTeamId}`}
                className="flex items-center gap-1 hover:text-brand-yellow truncate"
              >
                <Logo
                  src={teamLogo(t.fromTeamLogo)}
                  customImageClass="w-4 h-4 shrink-0"
                  name={t.fromTeamName}
                />
                <span className="text-xs uppercase truncate">
                  {t.fromTeamName}
                </span>
              </Link>
            )}

            <span className="text-brand-orange font-bold shrink-0">→</span>

            {t.toTeamId && (
              <Link
                to={`/team/${t.toTeamId}`}
                className="flex items-center gap-1 hover:text-brand-yellow truncate"
              >
                <Logo
                  src={teamLogo(t.toTeamLogo)}
                  customImageClass="w-4 h-4 shrink-0"
                  name={t.toTeamName}
                />
                <span className="text-xs uppercase truncate">
                  {t.toTeamName}
                </span>
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
