import { HtmlBanner } from "@matchinsights/core";

interface Props {
  banner: HtmlBanner;
}

const HtmlBannerDisplay = ({ banner }: Props) => {
  return <div dangerouslySetInnerHTML={{ __html: banner.html }} />;
};

export default HtmlBannerDisplay;
