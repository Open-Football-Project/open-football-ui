import { useState } from "react";
import {
  FaFutbol,
  FaExchangeAlt,
  FaVideo,
  FaTimesCircle,
} from "react-icons/fa";
import { IoSquare } from "react-icons/io5";
import { SocialSharing } from "../../general/social-sharing/SocialSharing";
import { BsDot } from "react-icons/bs";
import { MatchEvent, SITE_DOMAIN } from "open-football-project-core";
import { useTranslation } from "react-i18next";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";
import {
  buildMatchEventsSvgString,
  getMatchEventsSvgH,
  MATCH_EVENTS_SVG_W,
  MatchEventDetail,
  MatchEventType,
} from "open-football-project-core";

interface MatchEventsTableProps {
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  events: MatchEvent[];
}

const MatchEventsTable = ({
  events,
  homeTeamName,
  homeTeamLogo,
  awayTeamName,
  awayTeamLogo,
}: MatchEventsTableProps) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const eventDetailTKey = (eType: string) => {
    return eType
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "");
  };

  const sortedEvents: MatchEvent[] =
    events.sort(
      (a, b) =>
        b.timeElapsed +
        (b.timeExtra ?? 0) -
        (a.timeElapsed + (a.timeExtra ?? 0)),
    ) ?? [];

  const formatEventTime = (elapsed?: number, extra?: number): string => {
    if (elapsed == null) return "-";
    return extra ? `${elapsed}' +${extra}` : `${elapsed}'`;
  };

  const goalIcon = (eventDetail: string) => {
    if (eventDetail.includes(MatchEventDetail.MISSED))
      return (
        <span className="flex items-center gap-1">
          <FaTimesCircle className="text-white w-4 h-4" /> (X)
        </span>
      );

    if (eventDetail.includes(MatchEventDetail.PENALTY))
      return (
        <span className="flex items-center gap-1">
          <FaFutbol className="text-white w-4 h-4" /> (P)
        </span>
      );

    return <FaFutbol className="text-white w-4 h-4" />;
  };

  const eventIcon = (eventType: string, eventDetail: string): JSX.Element => {
    const detail = (eventDetail ?? "").toLowerCase();
    const eType = (eventType ?? "").toLowerCase();

    if (eType.includes(MatchEventType.VAR))
      return <FaVideo className="text-white w-4 h-4" />;
    if (eType.includes(MatchEventType.GOAL)) return goalIcon(detail);
    if (
      eType.includes(MatchEventType.CARD) &&
      detail.includes(MatchEventDetail.YELLOW)
    )
      return <IoSquare className="text-yellow-400 w-4 h-4" />;
    if (
      eType.includes(MatchEventType.CARD) &&
      detail.includes(MatchEventDetail.RED)
    )
      return <IoSquare className="text-red-600 w-4 h-4" />;
    if (detail.includes(MatchEventDetail.SUBSTITUTION))
      return <FaExchangeAlt className="text-green-300 w-4 h-4" />;

    return <BsDot className="text-gray-400 w-4 h-4" />;
  };

  const displayPlayer = (
    eventType: string,
    eventDetail: string,
    playerName?: string,
  ): boolean => {
    const detail = (eventDetail ?? "").toLowerCase();
    const eType = (eventType ?? "").toLowerCase();

    return (
      (detail.includes(MatchEventDetail.SUBSTITUTION) ||
        eType.includes(MatchEventType.CARD) ||
        eType.includes(MatchEventType.GOAL)) &&
      playerName !== null &&
      playerName !== undefined &&
      playerName.length > 0
    );
  };

  const renderedPlayerName = (playerName: string): string => {
    const parts = playerName.trim().split(" ");
    const firstInitial = parts[0]?.charAt(0) || "";
    const lastName = parts[parts.length - 1] || "";
    return `${firstInitial}. ${lastName}`;
  };

  const eventLabel = (event: MatchEvent): string => {
    if (displayPlayer(event.eventType, event.eventDetails, event.playerName)) {
      return renderedPlayerName(event.playerName as string);
    }
    return t(`liveevents.${eventDetailTKey(event.eventType)}`, {
      defaultValue: event.eventDetails,
    });
  };

  const handleShare = () => {
    const shareEvents = sortedEvents.filter((e) => {
      const eType = (e.eventType ?? "").toLowerCase();
      return (
        eType.includes(MatchEventType.GOAL) ||
        eType.includes(MatchEventType.CARD)
      );
    });
    const lines = [
      `\u26BD ${homeTeamName} vs ${awayTeamName}`,
      ...shareEvents.map((e) => {
        const time = formatEventTime(e.timeElapsed, e.timeExtra);
        const label = eventLabel(e);
        const side = e.teamName === homeTeamName ? homeTeamName : awayTeamName;
        const eType = (e.eventType ?? "").toLowerCase();
        const detail = (e.eventDetails ?? "").toLowerCase();
        const emoji = eType.includes(MatchEventType.GOAL)
          ? "\u26BD"
          : detail.includes(MatchEventDetail.YELLOW)
            ? "\uD83D\uDFE8"
            : "\uD83D\uDFE5";
        return `${emoji} ${time} ${label} (${side})`;
      }),
      SITE_DOMAIN,
    ];
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const svgString = buildMatchEventsSvgString({
        homeTeamName,
        homeTeamLogo,
        awayTeamName,
        awayTeamLogo,
        events: sortedEvents,
        timeLabel: t("liveevents.time"),
        eventLabel,
      });
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const slug = (name: string) => name.replace(/\s+/g, "-").toLowerCase();
      const filename = `footballproject-${slug(homeTeamName)}-vs-${slug(awayTeamName)}-events.png`;
      await svgToPng(
        svgEl,
        filename,
        MATCH_EVENTS_SVG_W,
        getMatchEventsSvgH(sortedEvents.length),
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-brand-navbar sm:p-1 mt-4 py-4 px-1 rounded-lg border border-brand-orange/30 shadow-md text-white overflow-x-auto">
      <div className="flex items-center justify-between p-2 mb-4 text-sm sm:text-lg flex-wrap">
        <div className="flex-1 flex items-center justify-start gap-1 min-w-[80px]">
          {homeTeamLogo && (
            <img
              src={homeTeamLogo}
              alt={homeTeamName}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          )}
          <span className="truncate text-[12px] sm:text-lg font-semibold">
            {homeTeamName}
          </span>
        </div>

        <div className="w-12 text-center text-brand-yellow font-semibold text-xs sm:text-sm">
          {t("liveevents.time")}
        </div>

        <div className="flex-1 flex items-center justify-end gap-1 min-w-[80px]">
          <span className="truncate text-[12px] sm:text-lg font-semibold">
            {awayTeamName}
          </span>
          {awayTeamLogo && (
            <img
              src={awayTeamLogo}
              alt={awayTeamName}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {sortedEvents.map((event, idx) => {
          const isHomeTeamEvent = event.teamName === homeTeamName;
          const rowBg = idx % 2 === 0 ? "bg-brand-navbar" : "bg-brand-darkBg";

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-1 rounded text-xs sm:text-sm ${rowBg} flex-wrap`}
            >
              <div className="flex-1 flex items-center justify-start gap-1 min-w-[60px]">
                {isHomeTeamEvent && (
                  <>
                    <span className="text-[10px] sm:text-xs text-brand-orange font-semibold">
                      {eventIcon(event.eventType, event.eventDetails)}
                    </span>
                    {displayPlayer(
                      event.eventType,
                      event.eventDetails,
                      event.playerName,
                    ) ? (
                      <span
                        data-testid="homePlayer"
                        className="text-[10px] sm:text-xs text-brand-white uppercase truncate"
                      >
                        {renderedPlayerName(event.playerName as string)}
                      </span>
                    ) : (
                      <span
                        data-testid="homeDetail"
                        className="text-[10px] sm:text-xs text-brand-white uppercase truncate"
                      >
                        {t(`liveevents.${eventDetailTKey(event.eventType)}`, {
                          defaultValue: event.eventDetails,
                        })}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="w-12 text-center text-[10px] sm:text-[13px] text-brand-success font-semibold">
                {formatEventTime(event.timeElapsed, event.timeExtra)}
              </div>

              <div className="flex-1 flex items-center justify-end gap-1 min-w-[60px]">
                {!isHomeTeamEvent && (
                  <>
                    {displayPlayer(
                      event.eventType,
                      event.eventDetails,
                      event.playerName,
                    ) ? (
                      <span
                        data-testid="awayPlayer"
                        className="text-[10px] sm:text-xs text-brand-white uppercase truncate"
                      >
                        {renderedPlayerName(event.playerName as string)}
                      </span>
                    ) : (
                      <span
                        data-testid="awayDetail"
                        className="text-[10px] sm:text-xs text-brand-white uppercase truncate"
                      >
                        {t(`liveevents.${eventDetailTKey(event.eventType)}`, {
                          defaultValue: event.eventDetails,
                        })}
                      </span>
                    )}
                    <span className="text-[10px] sm:text-xs text-brand-orange font-semibold">
                      {eventIcon(event.eventType, event.eventDetails)}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-brand-darkBg">
        <SocialSharing
          handleShare={handleShare}
          handleDownload={handleDownload}
          downloading={downloading}
        />
      </div>
    </div>
  );
};

export default MatchEventsTable;
