import { useCallback, useState } from "react";
import { svgToPng } from "../../converter/svg-png-converter/svg-png-converter";
import { TriviaSvgResult } from "open-football-project-core";

export function useDownloadTrivia(getSvgData: () => TriviaSvgResult): {
  download: () => Promise<void>;
  downloading: boolean;
} {
  const [downloading, setDownloading] = useState(false);

  const download = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { svgString, width, height, filename } = getSvgData();
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      await svgToPng(svgEl, filename, width, height);
    } finally {
      setDownloading(false);
    }
  }, [getSvgData, downloading]);

  return { download, downloading };
}
