import { useTranslation } from "react-i18next";

interface NoDataProps {
  loading?: boolean;
  message?: string;
  messageColor?: string;
  isBigMessage?: boolean;
  skeleton?: React.ReactNode;
  image?: string;
  imageAlt?: string;
}

export default function NoData({
  loading,
  message,
  messageColor,
  isBigMessage = false,
  skeleton,
  image,
  imageAlt,
}: NoDataProps) {
  const { t } = useTranslation();

  if (loading && skeleton) {
    return <>{skeleton}</>;
  }

  return (
    <div className="flex flex-col justify-center items-center text-center gap-1 mt-2">
      {loading && (
        <p className="text-xs font-medium text-brand-orange">
          {t("nodata.loading")}
        </p>
      )}
      {image && (
        <img
          src={image}
          alt={imageAlt ?? ""}
          className="w-32 h-32 object-contain mb-2"
        />
      )}
      {!loading && !isBigMessage && (
        <p className={`text-xs font-medium ${messageColor ?? "text-white"} mt-2`}>
          {message ?? t("nodata.default")}
        </p>
      )}
      {!loading && isBigMessage && (
        <p className={`text-xl my-4 font-medium ${messageColor ?? "text-white"}`}>
          {message ?? t("nodata.default")}
        </p>
      )}
    </div>
  );
}
