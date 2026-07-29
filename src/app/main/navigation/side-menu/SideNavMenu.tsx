import { useState } from "react";
import { navigationData } from "./navigationData";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { cleanLeagueName, leagueTranslationKey } from "@matchinsights/core";

interface SideNavMenuProps {
  closeSideNavMenu: () => void;
}

const SideNavMenu = ({ closeSideNavMenu }: SideNavMenuProps) => {
  const [openLiga, setOpenLiga] = useState<string | null>(null);
  const { t } = useTranslation();

  const toggleLiga = (liga: string) => {
    setOpenLiga(openLiga === liga ? null : liga);
  };
  return (
    <div className="flex flex-col px-4 pt-1 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
      {navigationData.map((ligas) => {
        return (
          <div key={ligas.name}>
            <button
              onClick={() => {
                toggleLiga(ligas.name);
              }}
              className="w-full text-left bg-white/5 hover:bg-white/20 px-2 py-1 text-white text-xs flex items-center justify-between gap-2 rounded transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                {ligas.icon && (
                  <img src={ligas.icon} alt={ligas.name} className="w-4 h-4" />
                )}
                <span> {t(`${ligas.name}`)}</span>
              </div>

              <span className="text-xs">
                {openLiga === ligas.name ? "▲" : "▼"}
              </span>
            </button>

            {openLiga === ligas.name && (
              <div className="ml-6 mt-1 flex flex-col space-y-1">
                {ligas.navLinks.map((it) => (
                  <Link
                    key={it.title}
                    to={it.route}
                    className="bg-white/5 hover:bg-white/20 px-2 py-1 text-white text-xs rounded transition-colors duration-150"
                    onClick={() => closeSideNavMenu()}
                  >
                    {it.isTranslated
                      ? t(it.title)
                      : cleanLeagueName(
                          t(`league.${leagueTranslationKey(it.title)}`, {
                            defaultValue: it.title,
                          }),
                        )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SideNavMenu;
