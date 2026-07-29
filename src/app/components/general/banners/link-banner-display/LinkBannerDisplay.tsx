import { LinkBanner } from "@matchinsights/core";

interface Props {
  banner: LinkBanner;
}

const LinkBannerDisplay = ({ banner }: Props) => {
  return (
    <a
      href={banner.href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="block w-full h-full"
    >
      {banner.imgSrc ? (
        <img
          src={banner.imgSrc}
          alt={banner.label ?? ""}
          className="w-full h-full object-contain"
        />
      ) : (
        <span className="flex items-center justify-center w-full h-full bg-brand-bluelight text-white font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity">
          {banner.label}
        </span>
      )}
    </a>
  );
};

export default LinkBannerDisplay;
