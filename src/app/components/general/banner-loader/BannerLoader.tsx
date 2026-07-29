import { useEffect, useRef } from "react";

interface BannerLoaderProps {
  scriptSrc: string;
}

const BannerLoader = ({ scriptSrc }: BannerLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;

    containerRef.current.appendChild(script);
  }, [scriptSrc]);

  return (
    <div
      ref={containerRef}
      data-testid="banner-container"
      className="w-full h-auto flex justify-center items-center"
    />
  );
};

export default BannerLoader;
