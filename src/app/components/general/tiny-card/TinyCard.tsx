interface TinyCardProps {
  title?: string;
  cardId?: string;
  sections: { label?: string; component: React.ReactNode }[];
}

const TinyCard = ({ title, sections, cardId }: TinyCardProps) => {
  return (
    <div
      data-testid={cardId || "tiny-card"}
      className="flex flex-col items-center justify-center bg-brand-card p-4 w-full max-w-sm mx-auto text-center rounded-xl border border-white/10"
    >
      {title && (
        <h4 className="text-base sm:text-sm font-semibold uppercase text-brand-success underline mb-3 p-2">
          {title}
        </h4>
      )}
      <div
        key={`cardId-${title}`}
        className="flex flex-col gap-4 w-full items-center"
      >
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col w-full items-center">
            {section.label && (
              <span className="text-xs sm:text-xs font-semibold uppercase text-brand-white mb-1">
                {section.label}
              </span>
            )}
            <div className="text-sm sm:text-base text-brand-white">
              {section.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TinyCard;
