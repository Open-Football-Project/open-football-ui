import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGtag = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (window as any).gtag = mockGtag;
});

import { trackEvent, AnalyticsEvent } from "./analytics";

describe("trackEvent", () => {
  it("fires gtag with the given event and params", () => {
    trackEvent(AnalyticsEvent.MATCH_OPENED, { match_id: "123" });
    expect(mockGtag).toHaveBeenCalledWith("event", "match_opened", { match_id: "123" });
  });

  it("fires gtag with empty params when none provided", () => {
    trackEvent(AnalyticsEvent.LIVE_OPENED);
    expect(mockGtag).toHaveBeenCalledWith("event", "live_opened", {});
  });

  it("does not throw when gtag is unavailable", () => {
    (window as any).gtag = undefined;
    expect(() => trackEvent(AnalyticsEvent.MATCH_OPENED, { match_id: "1" })).not.toThrow();
  });

  it.each([
    [AnalyticsEvent.PAGE_VIEW, "page_view"],
    [AnalyticsEvent.MATCH_OPENED, "match_opened"],
    [AnalyticsEvent.LEAGUE_OPENED, "league_opened"],
    [AnalyticsEvent.TEAM_OPENED, "team_opened"],
    [AnalyticsEvent.LIVE_OPENED, "live_opened"],
    [AnalyticsEvent.PLAYER_OPENED, "player_opened"],
    [AnalyticsEvent.DOWNLOAD_IMAGE, "download_image"],
    [AnalyticsEvent.QUIZ_STARTED, "quiz_started"],
    [AnalyticsEvent.SHARE_CONTENT, "share_content"],
  ])("enum value %s maps to event name %s", (enumVal, expectedName) => {
    expect(enumVal).toBe(expectedName);
  });
});
