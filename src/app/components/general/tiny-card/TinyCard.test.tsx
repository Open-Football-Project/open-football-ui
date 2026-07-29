import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TinyCard from "./TinyCard";

describe("TinyCard", () => {
  it("renders the title when provided", () => {
    render(
      <TinyCard
        title="Card Title"
        sections={[{ label: "Section 1", component: <span>Content 1</span> }]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Card Title" })
    ).toBeInTheDocument();
  });

  it("does not render a heading when no title is passed", () => {
    render(
      <TinyCard
        sections={[{ label: "Section 1", component: <span>Content 1</span> }]}
      />
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders all section labels and components", () => {
    render(
      <TinyCard
        sections={[
          { label: "First Label", component: <div>First Content</div> },
          { label: "Second Label", component: <div>Second Content</div> },
        ]}
      />
    );

    expect(screen.getByText("First Label")).toBeInTheDocument();
    expect(screen.getByText("First Content")).toBeInTheDocument();
    expect(screen.getByText("Second Label")).toBeInTheDocument();
    expect(screen.getByText("Second Content")).toBeInTheDocument();
  });

  it("renders section component even if label is missing", () => {
    render(
      <TinyCard sections={[{ component: <span>No Label Content</span> }]} />
    );

    expect(screen.getByText("No Label Content")).toBeInTheDocument();
  });
});
