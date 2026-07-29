import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useDownloadTrivia } from "./download-trivia";

const mockSvgToPng = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock("../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: mockSvgToPng,
}));

const mockSvgData = {
  svgString: "<svg><text>test</text></svg>",
  width: 800,
  height: 400,
  filename: "test.png",
};

describe("useDownloadTrivia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with downloading=false", () => {
    const getSvgData = vi.fn(() => mockSvgData);
    const { result } = renderHook(() => useDownloadTrivia(getSvgData));

    expect(result.current.downloading).toBe(false);
  });

  it("calls getSvgData and svgToPng on download", async () => {
    const getSvgData = vi.fn(() => mockSvgData);
    const { result } = renderHook(() => useDownloadTrivia(getSvgData));

    await act(async () => {
      await result.current.download();
    });

    expect(getSvgData).toHaveBeenCalledTimes(1);
    expect(mockSvgToPng).toHaveBeenCalledWith(
      expect.anything(),
      mockSvgData.filename,
      mockSvgData.width,
      mockSvgData.height,
    );
  });

  it("sets downloading=true during download, false after", async () => {
    let resolveDownload!: () => void;
    mockSvgToPng.mockReturnValueOnce(
      new Promise<void>((res) => {
        resolveDownload = res;
      }),
    );

    const getSvgData = vi.fn(() => mockSvgData);
    const { result } = renderHook(() => useDownloadTrivia(getSvgData));

    act(() => {
      result.current.download();
    });

    expect(result.current.downloading).toBe(true);

    await act(async () => {
      resolveDownload();
    });

    expect(result.current.downloading).toBe(false);
  });

  it("resets downloading to false even when svgToPng throws", async () => {
    mockSvgToPng.mockRejectedValueOnce(new Error("canvas error"));

    const getSvgData = vi.fn(() => mockSvgData);
    const { result } = renderHook(() => useDownloadTrivia(getSvgData));

    await act(async () => {
      await result.current.download().catch(() => {});
    });

    expect(result.current.downloading).toBe(false);
  });
});
