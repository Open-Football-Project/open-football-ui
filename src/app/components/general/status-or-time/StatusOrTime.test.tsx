import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusOrTime from "./StatusOrTime";

const mocks = vi.hoisted(() => ({
  getFormattedTime: vi.fn(),
  getFormattedDate: vi.fn(),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual<typeof import("@matchinsights/core")>(
    "@matchinsights/core"
  );

  return {
    ...actual,
    getFormattedTime: mocks.getFormattedTime,
    getFormattedDate: mocks.getFormattedDate,
  };
});

describe("StatusOrTime", () => {
  it("renders formatted time when match is not finished and utcDate is provided", () => {
    mocks.getFormattedTime.mockReturnValue("12:30 PM");
    mocks.getFormattedDate.mockReturnValue("October 30, 2025");

    render(
      <StatusOrTime
        isFinished={false}
        statusShort="FT"
        utcDate="2025-10-30T12:30:00Z"
      />
    );

    expect(screen.getByTestId("match-day")).toBeInTheDocument();
    expect(screen.getByTestId("match-time")).toBeInTheDocument();
    expect(mocks.getFormattedTime).toHaveBeenCalled();
    expect(mocks.getFormattedDate).toHaveBeenCalled();
  });

  it("renders statusShort when match is finished", () => {
    render(
      <StatusOrTime
        isFinished={true}
        statusShort="FT"
        utcDate="2025-10-30T12:30:00Z"
      />
    );

    expect(screen.getByText("matchstatus.FT")).toBeInTheDocument();
  });
});
