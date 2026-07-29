import { VideoContent } from "open-football-project-core";
import { useTranslation } from "react-i18next";

interface VideoContentProps {
  videos: VideoContent[];
}

export default function VideoContentComponent({ videos }: VideoContentProps) {
  const { i18n } = useTranslation();
  return (
    <div className="w-full bg-brand-card p-4 rounded-lg shadow-md ring-1 ring-gray-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, idx) => {
          const label = i18n.language === "es" ? video.esLabel : video.enLabel;
          const thumbnail = video.thumbnailUrl || getYouTubeThumbnail(video.url);
          return (
            <a
              key={idx}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col rounded-md overflow-hidden border border-brand-aqua/30 hover:border-brand-aqua/60 transition-colors"
            >
              <div className="relative w-full aspect-video bg-black/40">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={label || "Video Content"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-brand-aqualight text-4xl">&#9654;</span>
                  </div>
                )}
              </div>
              {label && (
                <span className="p-2 text-sm font-semibold text-brand-aqualight bg-brand-aqua/10 text-center">
                  {label}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}
