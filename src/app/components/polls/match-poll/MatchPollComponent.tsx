import {
  ApiService,
  useMatchPollsState,
  webStorage,
  AvailablePoll,
  Poll,
} from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import PollsCard from "../poll-card/PollsCard";
import PollResult from "../result/PollResult";
import { showSuccess, showError } from "../../../utils/toast/toast";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

interface MatchPollProps {
  apiService: ApiService;
  fixtureId: number;
  polls: Poll[];
  availablePoll: AvailablePoll;
}

const MatchPollComponent = ({
  apiService,
  fixtureId,
  polls,
  availablePoll,
}: MatchPollProps) => {
  const { t } = useTranslation();
  const { hasVotedState, votePoll } = useMatchPollsState(
    webStorage,
    apiService,
    fixtureId,
    availablePoll.pollKey
  );

  const handleVote = async (option: string) => {
    try {
      await votePoll(option);
      trackEvent(AnalyticsEvent.POLL_VOTED, { poll_key: availablePoll.pollKey });
      showSuccess(t("toast.voteSubmitted"));
    } catch {
      showError(t("toast.voteFailed"));
    }
  };

  const pollResultsData: Poll | undefined = polls.find(
    (it) => it.pollKey === availablePoll.pollKey
  );

  return (
    <>
      {!hasVotedState ? (
        <PollsCard
          pollTitle={availablePoll.pollTitle}
          options={availablePoll.pollOptions}
          onVote={handleVote}
        />
      ) : (
        <PollResult
          poll={
            pollResultsData ?? {
              fixtureId: fixtureId,
              pollKey: availablePoll.pollKey,
              pollTitle: availablePoll.pollTitle,
              pollVotingOptions: [],
            }
          }
        />
      )}
    </>
  );
};

export default MatchPollComponent;
