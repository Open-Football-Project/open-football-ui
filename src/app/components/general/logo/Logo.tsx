import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";

interface LogoProps {
  src?: string;
  customIconClass?: string;
  customImageClass?: string;
  customIconWrapperClass?: string;
  name?: string;
}

const Logo = ({
  src,
  customIconWrapperClass,
  customIconClass,
  customImageClass,
  name,
}: LogoProps) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        data-testid="shield-fallback"
        className={
          customIconWrapperClass ??
          `w-5 h-5 bg-transparent flex items-center justify-center mx-2`
        }
      >
        <FaShieldAlt
          className={customIconClass ?? "text-brand-lightGray text-md"}
        />
      </div>
    );
  }

  return (
    <img
      data-testid="team-logo"
      src={src}
      alt={name ?? "futballero image"}
      loading="lazy"
      className={customImageClass ?? `w-7 h-7 object-contain mx-2 bg-white`}
      onError={() => setError(true)}
    />
  );
};

export default Logo;
