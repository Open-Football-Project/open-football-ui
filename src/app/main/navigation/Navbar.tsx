import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SideNavMenu from "./side-menu/SideNavMenu";
import { HiMenu } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    const sidebar = sidebarRef.current;

    if (sidebar && sidebarOpen) {
      sidebar.removeAttribute("inert");
      const firstItem = sidebar.querySelector<HTMLElement>(
        ".overflow-y-auto button, .overflow-y-auto [href]",
      );
      firstItem?.focus({ preventScroll: true });
    }

    if (sidebar && !sidebarOpen) {
      sidebar.setAttribute("inert", "");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const closeSideBar = () => {
    setSidebarOpen(false);
    burgerRef.current?.focus();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as HTMLElement).dataset.touchStartX = String(
      touch.clientX,
    );
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = Number((e.currentTarget as HTMLElement).dataset.touchStartX);
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) closeSideBar();
  };

  return (
    <div className="relative">
      <nav
        className="bg-brand-blueintense text-white px-6 py-3 flex items-center border-b border-white/10"
        tabIndex={-1}
      >
        <button
          ref={burgerRef}
          aria-label={t("aria.navbar.openNavigationMenu")}
          data-testid="side-bar-menu"
          className="text-white text-2xl hover:text-brand-bluelight transition-colors duration-300"
          onClick={() => setSidebarOpen(true)}
        >
          <HiMenu className="text-brand-white w-8 h-8" />
        </button>

        <Link
          to="/"
          className="ml-3 text-sm font-bold text-white tracking-wide hover:text-brand-bluelight transition-colors duration-200 shrink-0 lg:hidden"
        >
          Open Football Project
        </Link>

        <div className="flex-1 flex justify-center">
          <div className="space-x-6 text-base font-medium hidden lg:flex">
            <Link
              to="/"
              className="text-lg px-1 hover:text-brand-bluelight transition-colors"
            >
              {t("navbar.home")}
            </Link>

            <Link
              to="/live"
              className="text-lg px-1 text-brand-yellow hover:text-brand-aqua transition-colors font-semibold"
            >
              {t("navbar.live")}
            </Link>

            <Link
              to="/charts"
              className="text-lg px-1 text-brand-success hover:text-brand-aqua transition-colors font-semibold"
            >
              {t("navbar.charts")}
            </Link>

            <Link
              to="/today-players"
              className="text-lg px-1 text-brand-aqualight hover:text-brand-aqua transition-colors font-semibold"
            >
              {t("navbar.today_players")}
            </Link>

            <Link
              to="/matches"
              className="text-lg px-1 hover:text-brand-bluelight transition-colors"
            >
              {t("navbar.matches")}
            </Link>

            <Link
              to="/leaguesall"
              className="text-lg px-1 hover:text-brand-bluelight transition-colors"
            >
              {t("navbar.leagues")}
            </Link>

            <Link
              to="/about"
              className="text-lg px-1 hover:text-brand-bluelight transition-colors"
            >
              {t("navbar.about")}
            </Link>

            <Link
              to="/feedback"
              className="text-lg px-1 hover:text-brand-bluelight transition-colors"
            >
              {t("navbar.feedback")}
            </Link>
          </div>
        </div>

        <div className=" flex items-center gap-1 text-lg">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className={`px-2 py-0.5 rounded transition-colors ${
              i18n.language.includes("en")
                ? "bg-brand-yellowa text-black"
                : "text-white"
            }`}
          >
            EN
          </button>
          <span className="text-white">|</span>
          <button
            onClick={() => i18n.changeLanguage("es")}
            className={`px-2 py-0.5 rounded transition-colors ${
              i18n.language.includes("es")
                ? "bg-brand-yellowa text-black"
                : "text-white"
            }`}
          >
            ES
          </button>
        </div>
      </nav>

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-64 max-w-[85vw] h-full bg-brand-card transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-4 flex justify-between items-center border-b border-white/20">
          <h2 className="text-base font-bold text-white">Open Football Project</h2>
          <button className="text-sm text-white" onClick={closeSideBar}>
            ✕
          </button>
        </div>

        <SideNavMenu closeSideNavMenu={closeSideBar} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeSideBar}
        />
      )}
    </div>
  );
};

export default Navbar;
