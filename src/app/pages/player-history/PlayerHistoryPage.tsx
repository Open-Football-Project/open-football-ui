import { useParams } from "react-router-dom";
import SubHeader from "../../components/general/sub-header/SubHeader";
import NoData from "../../components/general/no-data/NoData";
import { PlayerHeaderSkeleton } from "../../components/general/skeleton/Skeleton";
import { ApiService } from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import { usePlayerHistory, usePlayerInfo } from "@matchinsights/core";
import PlayerHeader from "../../components/player-history/player-header/PlayerHistoryHeader";
import PlayerHistoryTabs from "../../components/player-history/player-history-tabs/PlayerHistoryTabs";
import PlayerHistoryDownloads from "../../components/player-history/player-downloads/PlayerHistoryDownloads";
import Seo from "../../main/seo/Seo";
import playerSeoData from "../../main/seo/player-history-metadata";
import Breadcrumb from "../../main/seo/breadcrumb/Breadcrumb";
import { PlayerHistoryInfo, PlayerMainInfo } from "@matchinsights/core";

import playerSilhouette from "../../assets/images/player.png";
import VideoContentComponent from "../../components/general/video-content/VideoContentComponent";
import { BannerProps } from "../../common-props/BannerProps";

interface PlayerHistoryPageProps {
  apiService: ApiService;
  bannerProps: BannerProps;
}

export default function PlayerHistoryPage({
  apiService,
  bannerProps,
}: PlayerHistoryPageProps) {
  const { playerId } = useParams<{ playerId: string }>();
  const parsedPlayerId = Number(playerId);
  const { t } = useTranslation();

  const { isPlayerInfoAvailable, loadingPlayerInfo, playerInfo } =
    usePlayerInfo(apiService, parsedPlayerId);

  const { isPlayerHistoryAvailable, loadingPlayerHistory, playerHistory } =
    usePlayerHistory(apiService, parsedPlayerId);

  const emergencyPlayer = (
    playerHistory?: PlayerHistoryInfo | null | undefined,
  ): PlayerMainInfo => {
    return {
      playerId: parsedPlayerId,
      name: playerHistory?.name || "Unknown",
      age: -1,
      position: "Unknown",
      height: "Unknown",
      weight: "Unknown",
      teamId: -1,
      teamName: "Unknown",
      teamLogo: null,
      photo: playerHistory?.photo || undefined,
      injured: false,
      nationality: "Unknown",
    };
  };

  if (Number.isNaN(parsedPlayerId) || !playerId) {
    return (
      <Seo
        {...playerSeoData(
          Number(playerId),
          playerHistory?.player?.name ?? "unkown-player",
          t,
        )}
      >
        <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
          <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
            <p className="mx-auto">{t("playerhistory.head")}</p>
          </div>
          <SubHeader
            title={t("playerhistory.title")}
            apiService={apiService}
            bannersService={bannerProps.bannersService}
          />
          {(loadingPlayerInfo || loadingPlayerHistory) && (
            <NoData loading skeleton={<PlayerHeaderSkeleton />} />
          )}
          {(!loadingPlayerInfo || !loadingPlayerHistory) && <NoData />}
        </div>
      </Seo>
    );
  }

  return (
    <Seo
      {...playerSeoData(
        Number(playerId),
        playerHistory?.player?.name ?? "unkown-player",
        t,
      )}
    >
      <Breadcrumb
        items={[
          { name: "Home", url: "https://futballero.com/" },
          { name: "Leagues", url: "https://futballero.com/leaguesall" },
          {
            name: playerHistory?.player?.name ?? "Player",
            url: `https://futballero.com/player/${playerId}`,
          },
        ]}
      />
      <div className="w-full justify-between px-2 sm:px-12 py-6 space-y-6">
        <div className="text-center text-brand-aqualight bg-brand-aqua/15 border border-brand-aqua/30 px-4 py-2 mb-2 text-lg leading-tight rounded-lg">
          <p className="mx-auto">{t("playerhistory.head")}</p>
        </div>
        <SubHeader
          title={t("playerhistory.title")}
          apiService={apiService}
          bannersService={bannerProps.bannersService}
        />

        {isPlayerInfoAvailable && playerInfo && (
          <PlayerHeader player={playerInfo} />
        )}

        {!isPlayerInfoAvailable &&
          isPlayerHistoryAvailable &&
          playerHistory && (
            <PlayerHeader player={emergencyPlayer(playerHistory.player)} />
          )}

        {isPlayerInfoAvailable &&
          playerInfo?.videos &&
          playerInfo.videos.length > 0 && (
            <VideoContentComponent videos={playerInfo.videos} />
          )}


        {isPlayerHistoryAvailable && playerHistory && (
          <PlayerHistoryDownloads
            playerName={playerHistory.player?.name ?? "player"}
            playerPhoto={playerInfo?.photo ?? playerSilhouette}
            transfers={playerHistory.transfers}
            trophies={playerHistory.trophies}
          />
        )}
        {isPlayerHistoryAvailable && playerHistory && (
          <PlayerHistoryTabs
            transfers={playerHistory.transfers}
            trophies={playerHistory.trophies}
          />
        )}
      </div>
    </Seo>
  );
}
