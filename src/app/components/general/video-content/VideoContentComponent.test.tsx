import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VideoContent from "./VideoContentComponent";


describe("VideoContentComponent", () => {
  it("renders the label when videos are provided", () => {
    render(<VideoContent videos={[{ url: "https://www.youtube.com/watch?v=abc123", esLabel: "Resumen del Partido", enLabel: "Match Highlights", uploadDate: "22/06/1990" }]} />);
    expect(screen.getByText("Match Highlights")).toBeInTheDocument();
  });

  it("renders a link for a single video", () => {
    render(<VideoContent videos={[{ url: "https://www.youtube.com/watch?v=abc123", esLabel: "Resumen del Partido", enLabel: "Match Highlights", uploadDate: "22/06/1990" }]} />);
    const link = screen.getByRole("link", { name: /Match Highlights/ });
    expect(link).toHaveAttribute("href", "https://www.youtube.com/watch?v=abc123");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders one link per video when multiple videos are provided", () => {
    render(
      <VideoContent
        videos={[
          { url: "https://www.youtube.com/watch?v=abc123", esLabel: "Resumen del Partido", enLabel: "Match Highlights", uploadDate: "22/06/1990" },
          { url: "https://kick.com/video/xyz789", esLabel: "Análisis Post Partido", enLabel: "Post Match Analysis", uploadDate: "22/06/1990" },
        ]}
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "https://www.youtube.com/watch?v=abc123");
    expect(links[1]).toHaveAttribute("href", "https://kick.com/video/xyz789");
  });

  it("wraps content in a card container", () => {
    const { container } = render(
      <VideoContent videos={[{ url: "https://www.youtube.com/watch?v=abc123", esLabel: "Resumen del Partido", enLabel: "Match Highlights", uploadDate: "22/06/1990" }]} />,
    );
    expect(container.firstChild).toHaveClass("rounded-lg");
  });
});
