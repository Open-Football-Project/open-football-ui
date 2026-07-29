import { useEffect } from "react";
import { BannerProps } from "../../common-props/BannerProps";
import GlobalBanners from "../../components/general/banners/global-banners/GlobalBanners";

const Footer = ({ bannersService }: BannerProps) => {
  useEffect(() => {
    const seoFooter = document.getElementById("seo-footer");
    if (seoFooter) seoFooter.style.display = "block";
  }, []);

  return (
    <div className="w-full flex justify-center items-center px-6 py-2 bg-brand-gridblue">
      <div className="max-w-4xl w-full">
        <GlobalBanners bannersService={bannersService} />
      </div>
    </div>
  );
};

export default Footer;
