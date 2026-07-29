interface StatusTileProps {
  isUp: boolean;
  isFlat: boolean;
  status: string;
}
const ArrowStatusTile = ({ isUp, isFlat, status }: StatusTileProps) => {
  const arrowStyle =
    isUp && !isFlat
      ? "bg-brand-success text-black"
      : !isUp && !isFlat
      ? "bg-brand-danger text-black"
      : "bg-brand-yellow text-black";

  const ArrowIcon = () => {
    if (isUp && !isFlat) {
      return (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
           <path d="M12 4l8 14H4L12 4z" />
        </svg>
      );
    }
    if (!isUp && !isFlat) {
      return (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
           <path d="M12 20L4 6h16L12 20z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
       <rect x="5" y="11" width="14" height="2" rx="1" />
      </svg>
    );
  };

  return (
    <div className="flex space-x-2">
      <div
        data-testid="arrow-icon"
        className={`flex items-center justify-center h-4 w-4  ${arrowStyle}`}
      >
        <ArrowIcon />
      </div>
      <span className="text-xs font-semibold uppercase text-brand-cream">{status}</span>
    </div>
  );
};

export default ArrowStatusTile;
