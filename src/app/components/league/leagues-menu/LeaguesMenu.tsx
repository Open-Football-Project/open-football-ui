import { useState } from "react";
import { LeaguesMenuGrid } from "./leagues-menu-grid/LeaguesMenuGrid";
import { LeaguesGroups } from "@matchinsights/core";
import { FaCaretLeft } from "react-icons/fa6";
import { LeaguesMenuOptions } from "./leagues-menu-options/LeaguesMenuOptions";
import NoData from "../../general/no-data/NoData";
import { GenericContentSkeleton } from "../../general/skeleton/Skeleton";
import Controls from "../../general/controls/Controls";
import { useTranslation } from "react-i18next";
import { translateCountry } from "@matchinsights/core";

export interface LeagueMenuSelectionOption {
  id: number;
  country: string;
}

interface LeaguesMenuProps {
  leaguesGroups: LeaguesGroups;
  loading: boolean;
  isAnyLeagueAvailable: boolean;
}

export const LeaguesMenu = ({
  leaguesGroups,
  loading,
  isAnyLeagueAvailable,
}: LeaguesMenuProps) => {
  const [selectedoption, setSelectedOption] =
    useState<LeagueMenuSelectionOption | null>(null);
  const [selectionOptionSearch, setSelectionOptionSearch] = useState("");

  const { t } = useTranslation();

  const selectOption = (option: LeagueMenuSelectionOption) => {
    setSelectedOption(option);
  };

  const selectionOptions: LeagueMenuSelectionOption[] = [
    { id: -1, country: "International" },
    ...(leaguesGroups?.countryLeagues.map((it, idx) => ({
      id: idx,
      country: it.country,
    })) ?? []),
  ];

  const filteredSelectionOptions = selectionOptions.filter((it) =>
    translateCountry(it.country, t)
      .toLowerCase()
      .includes(selectionOptionSearch.toLowerCase())
  );

  const leagues = () => {
    if (selectedoption?.id === -1) {
      return leaguesGroups?.internationals || [];
    }
    return (
      leaguesGroups?.countryLeagues[selectedoption?.id ?? 0]?.leagues || []
    );
  };

  const cleanUpSelection = () => {
    setSelectedOption(null);
    setSelectionOptionSearch("");
  };

  if (loading) return <NoData loading={loading} skeleton={<GenericContentSkeleton />} />;

  if (!loading && !isAnyLeagueAvailable) {
    return <NoData />;
  }

  return (
    <div className="w-full justify-between px-2 py-1">
      <div className="flex items-center mb-4 flex-wrap">
        {selectedoption && (
          <h1 className="text-2xl font-bold text-brand-white">
            {translateCountry(selectedoption.country, t)}
          </h1>
        )}
        {!selectedoption && (
          <Controls
            useInputControl={true}
            inputControlLabel={t("common.leaguesmenu")}
            inputControlValue={selectionOptionSearch}
            setInputControlValue={setSelectionOptionSearch}
            inputControlPlaceholder={t("common.countrysearch")}
          />
        )}

        {selectedoption && (
          <button
            onClick={() => cleanUpSelection()}
            className="p-2 flex items-center justify-center rounded-full hover:bg-brand-bluelight hover:text-brand-card ml-auto"
            title="Go back"
          >
            <FaCaretLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {isAnyLeagueAvailable && !selectedoption && (
        <LeaguesMenuOptions
          items={filteredSelectionOptions}
          selectItem={selectOption}
        />
      )}

      {isAnyLeagueAvailable && selectedoption && (
        <LeaguesMenuGrid leagues={leagues()} />
      )}
    </div>
  );
};
