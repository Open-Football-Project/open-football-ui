import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import MatchPollComponent from "./MatchPollComponent";
import { useMatchPollsState } from "@matchinsights/core";
import { showSuccess, showError } from "../../../utils/toast/toast";

vi.mock("../poll-card/PollsCard", () => ({
  default: ({ pollTitle, onVote }: { pollTitle: string; onVote: (opt: string) => void }) => (
    <div data-testid="polls-card">
      {pollTitle}
      <button onClick={() => onVote("option-a")}>Vote</button>
    </div>
  ),
}));

vi.mock("../../../utils/toast/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../result/PollResult", () => ({
  default: ({ poll }: { poll: { pollTitle: string } }) => (
    <div data-testid="poll-result">{poll.pollTitle}</div>
  ),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useMatchPollsState: vi.fn(() => ({
      hasVotedState: false,
      votePoll: vi.fn(),
    })),
  };
});

const baseProps = {
  apiService: {} as any,
  fixtureId: 123,
  availablePoll: { pollKey: "match-winner", pollTitle: "Match Winner?", pollOptions: [] },
  polls: [{ fixtureId: 123, pollKey: "match-winner", pollTitle: "Match Winner?", pollVotingOptions: [] }],
};

describe("MatchPollComponent", () => {
  const apiServiceMock = {} as any;
  const fixtureId = 123;
  const availablePoll = {
    pollKey: "match-winner",
    pollTitle: "Match Winner?",
    pollOptions: [],
  };
  const basePoll = {
    fixtureId,
    pollKey: "match-winner",
    pollTitle: "Match Winner?",
    pollVotingOptions: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders PollsCard when user has not voted", () => {
    (useMatchPollsState as any).mockReturnValue({
      hasVotedState: false,
      votePoll: vi.fn(),
    });

    render(
      <MatchPollComponent
        apiService={apiServiceMock}
        fixtureId={fixtureId}
        availablePoll={availablePoll}
        polls={[basePoll]}
      />
    );

    expect(screen.getByTestId("polls-card")).toHaveTextContent("Match Winner?");
    expect(screen.queryByTestId("poll-result")).not.toBeInTheDocument();
  });

  it("renders PollResult when user has already voted", () => {
    (useMatchPollsState as any).mockReturnValue({
      hasVotedState: true,
      votePoll: vi.fn(),
    });

    render(
      <MatchPollComponent
        apiService={apiServiceMock}
        fixtureId={fixtureId}
        availablePoll={availablePoll}
        polls={[basePoll]}
      />
    );

    expect(screen.getByTestId("poll-result")).toHaveTextContent(
      "Match Winner?"
    );
    expect(screen.queryByTestId("polls-card")).not.toBeInTheDocument();
  });

  it("renders PollResult with empty poll if not found in polls", () => {
    (useMatchPollsState as any).mockReturnValue({
      hasVotedState: true,
      votePoll: vi.fn(),
    });

    render(
      <MatchPollComponent
        apiService={apiServiceMock}
        fixtureId={fixtureId}
        availablePoll={availablePoll}
        polls={[]}
      />
    );

    expect(screen.getByTestId("poll-result")).toHaveTextContent(
      "Match Winner?"
    );
  });
});

describe("MatchPollComponent — vote toasts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows success toast after vote is submitted", async () => {
    const votePoll = vi.fn().mockResolvedValue(undefined);
    (useMatchPollsState as any).mockReturnValue({ hasVotedState: false, votePoll });

    render(<MatchPollComponent {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: /vote/i }));
    expect(showSuccess).toHaveBeenCalledWith("toast.voteSubmitted");
  });

  it("shows error toast when vote fails", async () => {
    const votePoll = vi.fn().mockRejectedValue(new Error("network error"));
    (useMatchPollsState as any).mockReturnValue({ hasVotedState: false, votePoll });

    render(<MatchPollComponent {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: /vote/i }));
    expect(showError).toHaveBeenCalledWith("toast.voteFailed");
  });
});
