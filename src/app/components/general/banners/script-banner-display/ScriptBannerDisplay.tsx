import { ScriptBanner } from "open-football-project-core";
import BannerLoader from "../../banner-loader/BannerLoader";

interface Props {
  banner: ScriptBanner;
}

const ScriptBannerDisplay = ({ banner }: Props) => {
  return <BannerLoader scriptSrc={banner.scriptSrc} />;
};

export default ScriptBannerDisplay;
