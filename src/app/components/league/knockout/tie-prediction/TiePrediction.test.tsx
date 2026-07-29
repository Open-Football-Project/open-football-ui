import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TiePrediction from "./TiePrediction";

vi.mock("../../../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="logo" src={src} alt="team-logo" />
  ),
}));

describe("TiePrediction", () => {
  const renderPrediction = (onPredict = vi.fn()) => {
    render(
      <TiePrediction
        t1="Palmeiras"
        t1logo="/palmeiras.png"
        t2="Flamengo"
        t2logo="/flamengo.png"
        onPredict={onPredict}
      />,
    );
    return onPredict;
  };

  it("renders both team names and logos", () => {
    renderPrediction();
    expect(screen.getByText("Palmeiras")).toBeInTheDocument();
    expect(screen.getByText("Flamengo")).toBeInTheDocument();
    const logos = screen.getAllByTestId("logo");
    expect(logos[0]).toHaveAttribute("src", "/palmeiras.png");
    expect(logos[1]).toHaveAttribute("src", "/flamengo.png");
  });

  it("renders a score input for each team", () => {
    renderPrediction();
    expect(screen.getByTestId("tie-prediction-input-t1")).toBeInTheDocument();
    expect(screen.getByTestId("tie-prediction-input-t2")).toBeInTheDocument();
  });

  it("does not report a winner while only one score has been entered", () => {
    const onPredict = renderPrediction();
    fireEvent.change(screen.getByTestId("tie-prediction-input-t1"), { target: { value: "2" } });
    expect(onPredict).toHaveBeenLastCalledWith(null);
  });

  it("reports team 1 as the winner once both scores are entered and team 1 scored more", () => {
    const onPredict = renderPrediction();
    fireEvent.change(screen.getByTestId("tie-prediction-input-t1"), { target: { value: "3" } });
    fireEvent.change(screen.getByTestId("tie-prediction-input-t2"), { target: { value: "1" } });
    expect(onPredict).toHaveBeenLastCalledWith("Palmeiras");
    expect(screen.getByTestId("tie-prediction-winner")).toHaveTextContent("Palmeiras");
  });

  it("reports team 2 as the winner once both scores are entered and team 2 scored more", () => {
    const onPredict = renderPrediction();
    fireEvent.change(screen.getByTestId("tie-prediction-input-t1"), { target: { value: "0" } });
    fireEvent.change(screen.getByTestId("tie-prediction-input-t2"), { target: { value: "2" } });
    expect(onPredict).toHaveBeenLastCalledWith("Flamengo");
    expect(screen.getByTestId("tie-prediction-winner")).toHaveTextContent("Flamengo");
  });

  it("reports no winner when the predicted scores are level, since a knockout tie cannot end in a draw", () => {
    const onPredict = renderPrediction();
    fireEvent.change(screen.getByTestId("tie-prediction-input-t1"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("tie-prediction-input-t2"), { target: { value: "1" } });
    expect(onPredict).toHaveBeenLastCalledWith(null);
    expect(screen.queryByTestId("tie-prediction-winner")).not.toBeInTheDocument();
  });

  it("withdraws the winner when a previously decisive score is cleared", () => {
    const onPredict = renderPrediction();
    const t1Input = screen.getByTestId("tie-prediction-input-t1");
    const t2Input = screen.getByTestId("tie-prediction-input-t2");
    fireEvent.change(t1Input, { target: { value: "3" } });
    fireEvent.change(t2Input, { target: { value: "1" } });
    fireEvent.change(t1Input, { target: { value: "" } });
    expect(onPredict).toHaveBeenLastCalledWith(null);
    expect(screen.queryByTestId("tie-prediction-winner")).not.toBeInTheDocument();
  });
});
