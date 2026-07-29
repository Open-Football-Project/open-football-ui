import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../../general/logo/Logo";
import prof from "../../../assets/images/player.png";

import {
  PlayerMainInfo,
  translateCountry,
  translatePlayerPosition,
} from "@matchinsights/core";

interface PlayerHeaderProps {
  player: PlayerMainInfo;
}

export default function PlayerHeader({ player }: PlayerHeaderProps) {
  const { t } = useTranslation();
  const photo = player.photo || prof;

  const formatHeight = (heightCm: string): string => `${heightCm} cm`;
  const formatWeight = (weightKg: string): string => `${weightKg} kg`;

  return (
    <div className="bg-brand-card rounded-lg p-4 ring-1 ring-gray-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

        {/* Jugador */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-start gap-3">
          <Logo
            src={photo}
            customIconWrapperClass="w-24 h-24 bg-transparent flex items-center justify-center"
            customImageClass="w-24 h-24 object-cover rounded-full"
            customIconClass="w-24 h-24 object-cover rounded-full"
            name={player.name}
          />

          <div className="text-center md:text-left">
            <h1 className="text-lg font-bold uppercase text-brand-yellow">
              {player.name}
            </h1>

            {player.nationality && player.nationality !== "Unknown" && (
              <p className="text-xs font-semibold uppercase text-brand-white">
                {t("player.nationality")}:
                <span className="ml-1 text-brand-aqualight">
                  {translateCountry(player.nationality, t)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Datos */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          {player.age > 0 && (
            <p className="text-xs font-medium text-brand-orange">
              {t("player.age")}:
              <span className="ml-1 text-brand-aqualight">
                {player.age}
              </span>
            </p>
          )}

          {player.position && player.position !== "Unknown" && (
            <p className="text-xs font-medium text-brand-orange">
              {t("player.position")}:
              <span className="ml-1 text-brand-aqualight">
                {translatePlayerPosition(player.position, t)}
              </span>
            </p>
          )}

          {player.height && player.height !== "Unknown" && (
            <p className="text-xs font-medium text-brand-orange">
              {t("player.height")}:
              <span className="ml-1 text-brand-aqualight">
                {formatHeight(player.height)}
              </span>
            </p>
          )}

          {player.weight && player.weight !== "Unknown" && (
            <p className="text-xs font-medium text-brand-orange">
              {t("player.weight")}:
              <span className="ml-1 text-brand-aqualight">
                {formatWeight(player.weight)}
              </span>
            </p>
          )}

          {player.injured === true && (
            <p className="text-xs font-medium text-brand-orange">
              {t("player.injured")}:
              <span className="ml-1 text-brand-aqualight">
                {t("player.isInjured")}
              </span>
            </p>
          )}
        </div>

        {/* Equipo */}
        {player.teamId > 0 && player.teamName !== "Unknown" && (
          <div className="flex flex-col items-center gap-2">
            <Link
              to={`/team/${player.teamId}`}
              aria-label={`${player.teamName} team page`}
              className="flex items-center justify-center"
            >
              <Logo
                src={player.teamLogo ?? undefined}
                customIconWrapperClass="w-24 h-24 bg-transparent flex items-center justify-center"
                customImageClass="w-24 h-24 object-contain hover:scale-105 transition-transform"
                customIconClass="w-24 h-24 object-contain hover:scale-105 transition-transform"
                name={player.teamName}
              />
            </Link>

            <Link
              to={`/team/${player.teamId}`}
              aria-label={`${player.teamName} team page`}
              className="text-sm font-semibold uppercase text-brand-yellowa hover:text-brand-orange text-center"
            >
              {player.teamName}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}