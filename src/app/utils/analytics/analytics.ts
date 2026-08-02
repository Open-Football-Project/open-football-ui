export enum AnalyticsEvent {
  PAGE_VIEW = "page_view",
  MATCH_OPENED = "match_opened",
  LEAGUE_OPENED = "league_opened",
  TEAM_OPENED = "team_opened",
  LIVE_OPENED = "live_opened",
  PLAYER_OPENED = "player_opened",
  DOWNLOAD_IMAGE = "download_image",
  QUIZ_STARTED = "quiz_started",
  QUIZ_ANSWERED = "quiz_answered",
  SHARE_CONTENT = "share_content",
  VALUE_BET_MARKET = "value_bet_market",
  FILTER_APPLIED = "filter_applied",
  POLL_VOTED = "poll_voted",
  FEEDBACK_SUBMITTED = "feedback_submitted",
  TAB_SWITCHED = "tab_switched",
  KNOCKOUT_NAVIGATED = "knockout_navigated",
  MENU_TOGGLED = "menu_toggled",
  BTC_ADDRESS_COPIED = "btc_address_copied",
}

export const trackEvent = (event: AnalyticsEvent, params: Record<string, string> = {}) => {
  (window as any).gtag?.("event", event, params);
};
