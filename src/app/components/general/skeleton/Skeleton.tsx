const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-secondary-dark rounded ${className}`} />
);

export const MatchCardSkeleton = () => (
  <div className="animate-pulse bg-brand-card rounded-lg p-4 space-y-2">
    <SkeletonBlock className="h-4 w-3/4" />
    <SkeletonBlock className="h-3 w-1/2" />
  </div>
);

export const MatchListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <MatchCardSkeleton key={i} />
    ))}
  </div>
);

export const MatchDetailSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <SkeletonBlock className="h-6 w-1/2 mx-auto" />
    <div className="flex justify-between gap-4">
      <SkeletonBlock className="h-12 w-1/3" />
      <SkeletonBlock className="h-12 w-1/6" />
      <SkeletonBlock className="h-12 w-1/3" />
    </div>
    <SkeletonBlock className="h-4 w-full" />
    <SkeletonBlock className="h-4 w-5/6" />
  </div>
);


export const FixtureListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="animate-pulse space-y-2 w-full">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-2 bg-brand-darkBg rounded-lg p-2 w-full"
      >
        <SkeletonBlock className="h-4 w-10 shrink-0" />
        <div className="flex items-center gap-1 flex-1 justify-end">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
        </div>
        <SkeletonBlock className="h-4 w-8 shrink-0" />
        <div className="flex items-center gap-1 flex-1 justify-start">
          <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
        <SkeletonBlock className="h-5 w-10 rounded shrink-0" />
      </div>
    ))}
  </div>
);


export const TableRowSkeleton = () => (
  <div className="animate-pulse flex items-center gap-3 px-2 py-2">
    <SkeletonBlock className="h-5 w-5 rounded-full shrink-0" />
    <SkeletonBlock className="h-4 flex-1" />
    <SkeletonBlock className="h-4 w-8" />
    <SkeletonBlock className="h-4 w-8" />
    <SkeletonBlock className="h-4 w-8" />
  </div>
);

export const LeagueStandingSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div className="space-y-1">
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} />
    ))}
  </div>
);

export const LeaguePageSkeleton = () => (
  <div className="w-full mx-auto mt-8 flex flex-col lg:flex-row gap-4">
    <div className="w-full lg:w-1/2 bg-brand-card rounded-lg p-4">
      <SkeletonBlock className="animate-pulse h-6 w-1/2 mx-auto mb-4" />
      <LeagueStandingSkeleton />
    </div>
    <div className="w-full lg:w-1/2 bg-brand-card rounded-lg p-4">
      <SkeletonBlock className="animate-pulse h-6 w-1/2 mx-auto mb-4" />
      <FixtureListSkeleton />
    </div>
  </div>
);

export const LeagueGroupGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-brand-card rounded-lg p-4 space-y-2">
        <SkeletonBlock className="h-4 w-1/3 mb-2" />
        <div className="space-y-1">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="flex items-center gap-3 px-2 py-1">
              <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
              <SkeletonBlock className="h-3 flex-1" />
              <SkeletonBlock className="h-3 w-6" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const TablePairSkeleton = () => (
  <div className="animate-pulse w-full mx-auto flex flex-col lg:flex-row gap-4">
    {[0, 1].map((n) => (
      <div key={n} className="w-full lg:w-1/2 bg-brand-card rounded-lg p-4">
        <SkeletonBlock className="h-5 w-1/2 mx-auto mb-4" />
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
              <SkeletonBlock className="h-3 flex-1" />
              <SkeletonBlock className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);



export const ArrowStatusTileSkeleton = () => (
  <div className="animate-pulse flex items-center gap-2 py-1">
    <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
    <SkeletonBlock className="h-3 w-24" />
  </div>
);

export const OddsFeelingSkeleton = () => (
  <div className="animate-pulse flex flex-col py-4 gap-3">
    {[0, 1, 2].map((n) => (
      <div key={n} className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
    ))}
  </div>
);

export const LastFiveMatchesSkeleton = () => (
  <div className="animate-pulse flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonBlock key={i} className="w-4 h-4" />
    ))}
  </div>
);

export const TinyCardSkeleton = () => (
  <div className="animate-pulse bg-brand-card rounded p-3 space-y-2 flex-1">
    <SkeletonBlock className="h-3 w-1/2" />
    <SkeletonBlock className="h-3 w-3/4" />
    <SkeletonBlock className="h-3 w-2/3" />
  </div>
);

export const TinyCardGroupSkeleton = () => (
  <div className="animate-pulse flex flex-col lg:flex-row gap-6 w-full px-4 py-2">
    {[0, 1, 2].map((n) => (
      <div key={n} className="bg-brand-card rounded p-3 space-y-2 flex-1">
        <SkeletonBlock className="h-3 w-1/2" />
        <SkeletonBlock className="h-3 w-3/4" />
        <SkeletonBlock className="h-3 w-2/3" />
      </div>
    ))}
  </div>
);


export const TeamDetailSkeleton = () => (
  <div className="animate-pulse w-full space-y-4 px-2 sm:px-12 py-6">
    <div className="flex items-center gap-4 bg-brand-card rounded-lg p-4">
      <SkeletonBlock className="h-16 w-16 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-5 w-1/3" />
        <SkeletonBlock className="h-4 w-1/4" />
      </div>
    </div>
    <div className="bg-brand-card rounded-lg p-4 space-y-2">
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-4 w-4/6" />
    </div>
  </div>
);

export const PlayerHeaderSkeleton = () => (
  <div className="animate-pulse flex flex-col sm:flex-row items-center gap-4 bg-brand-card rounded-lg p-4">
    <SkeletonBlock className="h-20 w-20 rounded-full shrink-0" />
    <div className="flex-1 space-y-2 w-full">
      <SkeletonBlock className="h-5 w-1/2" />
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-4 w-2/3" />
    </div>
  </div>
);


export const GenericContentSkeleton = () => (
  <div className="animate-pulse bg-brand-card rounded-lg p-4 space-y-3">
    <SkeletonBlock className="h-5 w-1/2 mx-auto" />
    <SkeletonBlock className="h-4 w-full" />
    <SkeletonBlock className="h-4 w-5/6" />
    <SkeletonBlock className="h-4 w-4/6" />
  </div>
);
