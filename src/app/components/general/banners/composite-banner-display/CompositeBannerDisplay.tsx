import { CompositeBanner, BannerType } from "@matchinsights/core";
import LinkBannerDisplay from "../link-banner-display/LinkBannerDisplay";
import ScriptBannerDisplay from "../script-banner-display/ScriptBannerDisplay";
import HtmlBannerDisplay from "../html-banner-display/HtmlBannerDisplay";

interface Props {
  banner: CompositeBanner;
}

const CompositeBannerDisplay = ({ banner }: Props) => {
  const renderChild = (child: CompositeBanner["banners"][number]) => {
    switch (child.type) {
      case BannerType.Script:
        return <ScriptBannerDisplay banner={child} />;
      case BannerType.Link:
        return <LinkBannerDisplay banner={child} />;
      case BannerType.Html:
        return <HtmlBannerDisplay banner={child} />;
    }
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      {banner.banners.map((child) => (
        <div key={child.id} className="w-40 h-40">
          {renderChild(child)}
        </div>
      ))}
    </div>
  );
};

export default CompositeBannerDisplay;
