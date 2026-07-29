import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCaretLeft } from "react-icons/fa6";
import {
  ApiService,
  BannersService,
  SubheaderLink,
  SITE_DOMAIN,
} from "open-football-project-core";
import Logo from "../logo/Logo";
import GlobalBanners from "../banners/global-banners/GlobalBanners";
import ShareButton, { buildSharedResource } from "../share-button/ShareButton";

interface SubHeaderProps {
  apiService: ApiService;
  bannersService: BannersService;
  logoUrl?: string;
  subTitle?: string;
  optionalLinks?: SubheaderLink[];
  title?: string;
}

export default function SubHeader({
  title,
  logoUrl,
  subTitle,
  optionalLinks = [],
  bannersService,
}: SubHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const sharedResource = buildSharedResource(title || SITE_DOMAIN);

  return (
    <div className="w-full mb-4">
      <div className="flex flex-row items-center justify-between items-center bg-brand-card rounded-lg px-3 py-2 ring-2 ring-brand-aqua gap-4">
        <div className="flex items-center gap-2 flex-1 justify-left truncate">
          {logoUrl && (
            <Logo
              src={logoUrl}
              customImageClass="w-8 h-8 bg-white"
              customIconClass="w-8 h-8"
              name={subTitle}
            />
          )}

          <div className="flex flex-col">
            <h2 className="text-brand-white text-xs md:text-2xl font-semibold tracking-wide truncate max-w-[250px]">
              {title}
            </h2>

            {subTitle && (
              <h6 className="text-brand-yellow hover:text-brand-bluelight text-xs font-semibold truncate max-w-[250px]">
                {subTitle}
              </h6>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center justify-end flex-1">
          <button
            onClick={handleBack}
            className="p-2 flex items-center rounded-full justify-center text-brand-white hover:bg-brand-dona hover:text-brand-aqua"
            title="Go back"
          >
            <FaCaretLeft className="w-5 h-5" />
          </button>

          {sharedResource &&
            navigator?.canShare?.({ url: sharedResource.url }) && (
              <ShareButton
                sharedResource={sharedResource}
                className="p-2 flex items-center rounded-full justify-center text-brand-white hover:bg-brand-dona hover:text-brand-red"
              />
            )}
        </div>
      </div>

      <GlobalBanners bannersService={bannersService} />

      {optionalLinks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap justify-center gap-4 my-2">
          {optionalLinks.map((link, index) => {
            const isActive = location.pathname === link.url;

            return (
              <Link
                key={index}
                to={link.url}
                className={`
                  basis-[calc(50%-0.5rem)] lg:flex-1
                  text-center
                  text-sm sm:text-base
                  px-4 sm:px-6 py-3
                  rounded-2xl font-semibold transition
                  ring-2 ring-brand-yellowa/40
                  ${
                    isActive
                      ? "bg-brand-aqua/70 text-white"
                      : "bg-brand-navbar hover:bg-brand-roseint/60 hover:text-white"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}