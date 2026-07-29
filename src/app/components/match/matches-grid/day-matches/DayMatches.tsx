import { useRef } from "react";
import { ApiService, OnDayMatch } from "open-football-project-core";
import MatchCard from "../../match-card/MatchCard";
import { useRovingTabIndex } from "../../../../special-hooks/roving-tabindex/roving-tabindex";

interface DayMatchesProps {
  matches: OnDayMatch[];
  apiService: ApiService;
}

export const DayMatchesList = ({ matches, apiService }: DayMatchesProps) => {
  const allFocusable = useRef<(HTMLElement | null)[]>([]);
  const { onFocus, handleKeyDown } = useRovingTabIndex(allFocusable);

  if (allFocusable.current.length > 0) allFocusable.current = [];

  return (
    <div
      tabIndex={0}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      className="w-full flex flex-col items-center roving-container"
    >
      <ul className="w-full max-w-3xl flex flex-col gap-2 sm:gap-3 md:gap-4">
        {matches.map((match) => (
          <MatchCard
            key={match.fixtureId}
            match={match}
            apiService={apiService}
            ref={(el) => { if (el) allFocusable.current.push(el); }}
            tabIndex={-1}
            className="roving-item"
          />
        ))}
      </ul>
    </div>
  );
};
