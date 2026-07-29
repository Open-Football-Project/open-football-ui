import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import KnockoutBracketSection from "./KnockoutBracketSection";
import { useLeagueFixtureBinaryTree, BracketNode, LeagueFixture } from "open-football-project-core";

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual<typeof import("open-football-project-core")>("open-football-project-core");
  return {
    ...actual,
    useLeagueFixtureBinaryTree: vi.fn(),
  };
});

vi.mock("./BracketTree", () => ({
  default: ({ root }: { root: BracketNode | null }) => (
    <div data-testid="bracket-tree">{root ? "tree" : "empty"}</div>
  ),
}));

vi.mock("../download-bracket-button/DownloadBracketButton", () => ({
  default: ({ leagueName }: { root: BracketNode | null; leagueName: string }) => (
    <button data-testid="download-button">{leagueName}</button>
  ),
}));

const fixtures = { rounds: [] } as unknown as LeagueFixture;
const fakeRoot = { roundKey: "final", tie: null, missingData: false } as BracketNode;

describe("KnockoutBracketSection", () => {
  it("computes the bracket tree from fixtures via useLeagueFixtureBinaryTree", () => {
    vi.mocked(useLeagueFixtureBinaryTree).mockReturnValue(fakeRoot);

    render(<KnockoutBracketSection fixtures={fixtures} leagueName="Champions League" />);

    expect(useLeagueFixtureBinaryTree).toHaveBeenCalledWith(fixtures);
    expect(screen.getByTestId("bracket-tree")).toHaveTextContent("tree");
  });

  it("passes the leagueName through to DownloadBracketButton", () => {
    vi.mocked(useLeagueFixtureBinaryTree).mockReturnValue(fakeRoot);

    render(<KnockoutBracketSection fixtures={fixtures} leagueName="Champions League" />);

    expect(screen.getByTestId("download-button")).toHaveTextContent("Champions League");
  });

  it("still renders BracketTree and DownloadBracketButton when there is no tree yet", () => {
    vi.mocked(useLeagueFixtureBinaryTree).mockReturnValue(null);

    render(<KnockoutBracketSection fixtures={fixtures} leagueName="Champions League" />);

    expect(screen.getByTestId("bracket-tree")).toHaveTextContent("empty");
    expect(screen.getByTestId("download-button")).toBeInTheDocument();
  });
});
