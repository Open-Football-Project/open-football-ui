import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PollsCard from "./PollsCard";
import { AvailablePoll, VotingPoll } from "open-football-project-core";

describe("PollsCard component", () => {
  const availablePoll: AvailablePoll = {
    pollKey: "matchwinner",
    pollTitle: "matchwinner",
    pollOptions: [{ optionName: "a", optionTitle: "a" }],
  };
  it("renders poll title", () => {
    render(
      <PollsCard
        options={availablePoll.pollOptions}
        pollTitle={availablePoll.pollTitle}
        onVote={vi.fn()}
      />
    );
    expect(
      screen.getByText(`polls.${availablePoll.pollKey}`)
    ).toBeInTheDocument();
  });

  it("renders all options as buttons", () => {
    render(
      <PollsCard
        options={availablePoll.pollOptions}
        pollTitle={availablePoll.pollTitle}
        onVote={vi.fn()}
      />
    );
    availablePoll.pollOptions.forEach((option) => {
      const button = screen.getByText(`polls.${option.optionName}`);
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });
  });

  it("calls onVote callback with correct option when a button is clicked", async () => {
    const onVoteMock = vi.fn();
    render(
      <PollsCard
        options={availablePoll.pollOptions}
        pollTitle={availablePoll.pollTitle}
        onVote={onVoteMock}
      />
    );

    for (const option of availablePoll.pollOptions) {
      const button = screen.getByText(`polls.${option.optionName}`);
      fireEvent.click(button);
      expect(onVoteMock).toHaveBeenCalled();
    }

    expect(onVoteMock).toHaveBeenCalledTimes(availablePoll.pollOptions.length);
  });
});
