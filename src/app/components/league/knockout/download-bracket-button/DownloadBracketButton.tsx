import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BracketNode,
  collectRounds,
  buildBracketSvgString,
  SVG_W,
  HEADER_H,
  FOOTER_H,
  SLOT_H,
} from "@matchinsights/core";
import { svgToPng } from "../../../../converter/svg-png-converter/svg-png-converter";

interface DownloadBracketButtonProps {
  root: BracketNode | null;
  leagueName: string;
}

const DownloadBracketButton = ({ root, leagueName }: DownloadBracketButtonProps) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const download = useCallback(async () => {
    if (!root || downloading) return;

    setDownloading(true);
    try {
      const rounds = collectRounds(root);
      const maxNodes = Math.max(...rounds.map((r) => r.nodes.length));
      const svgH = HEADER_H + maxNodes * SLOT_H + FOOTER_H;
      const svgString = buildBracketSvgString(rounds, maxNodes, svgH, leagueName, t, true);

      const container = containerRef.current!;
      container.innerHTML = svgString;
      const svgEl = container.querySelector("svg") as SVGSVGElement;
      await svgToPng(
        svgEl,
        `${leagueName.replace(/\s+/g, "-").toLowerCase()}-knockout-bracket-results.png`,
        SVG_W,
        svgH,
      );
      container.innerHTML = "";
    } finally {
      setDownloading(false);
    }
  }, [root, downloading, leagueName, t]);

  return (
    <>
      <button
        onClick={download}
        disabled={!root || downloading}
        className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-darkBg text-xs font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {downloading ? "…" : t("knockout.download", { defaultValue: "Download PNG" })}
      </button>
      <div ref={containerRef} className="hidden" />
    </>
  );
};

export default DownloadBracketButton;
