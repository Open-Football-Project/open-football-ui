import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PollResult from "./PollResult";
import { Poll, PollVotingOption } from "open-football-project-core";

const poll: Poll = {
  fixtureId: 1334,
  pollKey: "matchwinner",
  pollTitle: "matchwinner",
  pollVotingOptions: [],
};

describe("PollResult component", () => {
  it("renders the poll name", () => {
    const results = { "Home Win": 0, Draw: 0, "Away Win": 0 };
    render(<PollResult poll={poll} />);
    expect(screen.getByText(`polls.${poll.pollKey}`)).toBeInTheDocument();
  });

  it("shows a thank you message when there are no votes", () => {
    const results = { "Home Win": 0, Draw: 0, "Away Win": 0 };
    render(<PollResult poll={poll} />);
    expect(screen.getByText("polls.thanks")).toBeInTheDocument();
  });

  it("renders all options with percentages when votes exist", () => {
    const results: PollVotingOption[] = [
      {
        optionName: "A",
        optionTitle: "A",
        value: 10,
      },
      {
        optionName: "B",
        optionTitle: "B",
        value: 10,
      },
      {
        optionName: "C",
        optionTitle: "C",
        value: 10,
      },
    ];

    const pollWithOptions = {
      ...poll,
      pollVotingOptions: results,
    };

    render(<PollResult poll={pollWithOptions} />);

    expect(screen.getByText("polls.a")).toBeInTheDocument();
    expect(screen.getByText("polls.b")).toBeInTheDocument();
    expect(screen.getByText("polls.c")).toBeInTheDocument();
    expect(screen.getAllByText("33.3%").length).toEqual(3);
  });
});
