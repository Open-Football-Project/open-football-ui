import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { svgToPng } from "./svg-png-converter";

function makeSvg(innerHTML = ""): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
  svg.setAttribute("width", "100");
  svg.setAttribute("height", "100");
  if (innerHTML) svg.innerHTML = innerHTML;
  return svg;
}

describe("svgToPng", () => {
  let capturedImg: any;
  let createdLinks: { click: ReturnType<typeof vi.fn>; download: string; href: string }[];
  let mockCanvas: any;

  beforeEach(() => {
    capturedImg = null;
    createdLinks = [];

    // jsdom doesn't implement these — assign directly as mocks
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    URL.revokeObjectURL = vi.fn();

    vi.stubGlobal(
      "FileReader",
      class {
        result = "data:image/png;base64,filereadermock";
        onloadend: (() => void) | null = null;
        onerror: ((e: unknown) => void) | null = null;
        readAsDataURL() { this.onloadend?.(); }
      }
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        blob: vi.fn().mockResolvedValue(new Blob(["img"], { type: "image/png" })),
      })
    );

    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toDataURL: vi.fn().mockReturnValue("data:image/png;base64,canvasdata"),
    };

    vi.stubGlobal(
      "Image",
      class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src = "";
        constructor() { capturedImg = this; }
      }
    );

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return mockCanvas as unknown as HTMLElement;
      if (tag === "a") {
        const link = { click: vi.fn(), download: "", href: "" };
        createdLinks.push(link);
        return link as unknown as HTMLElement;
      }
      return origCreateElement(tag);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("downloads a PNG on successful image load", async () => {
    const promise = svgToPng(makeSvg(), "bracket.png", 800, 600);

    await Promise.resolve();
    capturedImg.onload();
    await promise;

    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
    expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
    expect(createdLinks[0].download).toBe("bracket.png");
    expect(createdLinks[0].href).toBe("data:image/png;base64,canvasdata");
    expect(createdLinks[0].click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("falls back to SVG download when canvas is tainted", async () => {
    mockCanvas.toDataURL.mockImplementation(() => {
      throw new Error("Tainted canvas");
    });

    const promise = svgToPng(makeSvg(), "bracket.png", 800, 600);

    await Promise.resolve();
    capturedImg.onload();
    await promise;

    expect(createdLinks).toHaveLength(2);
    expect(createdLinks[0].click).not.toHaveBeenCalled();
    expect(createdLinks[1].download).toBe("bracket.svg");
    expect(createdLinks[1].click).toHaveBeenCalled();
  });

  it("falls back to SVG download when the image fails to load", async () => {
    const promise = svgToPng(makeSvg(), "bracket.png", 800, 600);

    await Promise.resolve();
    capturedImg.onerror();
    await promise;

    expect(createdLinks).toHaveLength(1);
    expect(createdLinks[0].download).toBe("bracket.svg");
    expect(createdLinks[0].href).toBe("blob:mock-url");
    expect(createdLinks[0].click).toHaveBeenCalled();
  });

  it("always resolves — never rejects", async () => {
    const promise = svgToPng(makeSvg(), "test.png", 100, 100);

    await Promise.resolve();
    capturedImg.onerror();

    await expect(promise).resolves.toBeUndefined();
  });

  it("fetches external image hrefs found in the SVG", async () => {
    const promise = svgToPng(
      makeSvg('<image href="https://example.com/logo.png"/>'),
      "bracket.png",
      100,
      100,
    );

    // fetch().then(r => r.blob()) is two chained promises — needs more than one tick
    await new Promise((r) => setTimeout(r, 0));
    capturedImg.onload();
    await promise;

    expect(fetch).toHaveBeenCalledWith("https://example.com/logo.png");
  });

  it("replaces the external href with the base64 data URI before rendering", async () => {
    const serializeSpy = vi.spyOn(XMLSerializer.prototype, "serializeToString");

    const promise = svgToPng(
      makeSvg('<image href="https://example.com/logo.png"/>'),
      "bracket.png",
      100,
      100,
    );
    await new Promise((r) => setTimeout(r, 0));
    capturedImg.onload();
    await promise;

    // The serialized SVG should contain the base64 data URI, not the original URL
    const svgStr = serializeSpy.mock.results[0].value as string;
    expect(svgStr).toContain("data:image/png;base64,filereadermock");
    expect(svgStr).not.toContain("https://example.com/logo.png");
  });

  it("skips images whose href already starts with data:", async () => {
    const promise = svgToPng(
      makeSvg('<image href="data:image/png;base64,alreadyencoded"/>'),
      "bracket.png",
      100,
      100,
    );

    await new Promise((r) => setTimeout(r, 0));
    capturedImg.onload();
    await promise;

    expect(fetch).not.toHaveBeenCalled();
  });

  it("skips images with no href attribute", async () => {
    const promise = svgToPng(makeSvg("<image/>"), "bracket.png", 100, 100);

    await new Promise((r) => setTimeout(r, 0));
    capturedImg.onload();
    await promise;

    expect(fetch).not.toHaveBeenCalled();
  });

  it("silently continues when fetching a logo fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const promise = svgToPng(
      makeSvg('<image href="https://example.com/logo.png"/>'),
      "bracket.png",
      100,
      100,
    );

    // A rejected fetch propagates through the async catch block across several
    // microtask ticks before svgToPng resumes and calls `new Image()`.
    await new Promise((r) => setTimeout(r, 0));
    capturedImg.onload();
    await promise;

    expect(createdLinks[0].click).toHaveBeenCalled();
  });
});
