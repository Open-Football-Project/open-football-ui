import { render, screen, fireEvent } from "@testing-library/react";
import Controls from "./Controls";
import { describe, it, expect, vi } from "vitest";
import { getLocalISODate } from "@matchinsights/core";

describe("Controls component", () => {
  const drop0Options = [
    { id: "1", value: "Option 1" },
    { id: "2", value: "Option 2" },
  ];

  const drop1Options = [
    { id: "A", value: "Alpha" },
    { id: "B", value: "Beta" },
  ];

  it("renders nothing if all use flags are false", () => {
    const { container } = render(<Controls />);
    expect(container.querySelector("select")).toBeNull();
    expect(container.querySelector("input")).toBeNull();
  });

  it("renders drop0 select when useDrop0 is true", () => {
    render(
      <Controls
        useDrop0={true}
        drop0Label="Choose something"
        drop0Options={drop0Options}
      />
    );

    expect(screen.getByTestId("drop-0")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("renders drop1 select when useDrop1 is true", () => {
    render(
      <Controls useDrop1 drop1Label="Pick one" drop1Options={drop1Options} />
    );

    expect(screen.getByTestId("drop-1")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("calls setDrop0 when drop0 selection changes", () => {
    const mockSetDrop0 = vi.fn();

    render(
      <Controls
        useDrop0
        drop0Options={drop0Options}
        selectedDrop0="1"
        setDrop0={mockSetDrop0}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });

    expect(mockSetDrop0).toHaveBeenCalledWith("2");
  });

  it("calls setDrop1 when drop1 selection changes", () => {
    const mockSetDrop1 = vi.fn();

    render(
      <Controls
        useDrop1
        drop1Options={drop1Options}
        selectedDrop1="A"
        setDrop1={mockSetDrop1}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "B" } });

    expect(mockSetDrop1).toHaveBeenCalledWith("B");
  });

  it("renders input control with label and placeholder", () => {
    render(
      <Controls
        useInputControl
        inputControlLabel="Search"
        inputControlPlaceholder="Type here..."
      />
    );

    const input = screen.getByPlaceholderText("Type here...");
    expect(input).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("calls setInputControlValue when typing", () => {
    const mockSetInput = vi.fn();

    render(
      <Controls
        useInputControl
        setInputControlValue={mockSetInput}
        inputControlValue=""
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });

    expect(mockSetInput).toHaveBeenCalledWith("Hello");
  });

  it("renders date picker when useDatePicker is true and updates selected date", () => {
    const mockSetDate = vi.fn();

    render(
      <Controls
        useDatePicker
        datePickerLabel="Match Day"
        selectedDate="2025-10-11"
        setSelectedDate={mockSetDate}
      />
    );

    const datePicker = screen.getByTestId("date-picker");
    expect(datePicker).toBeInTheDocument();

    const input = datePicker.querySelector(
      "input[type='date']"
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("2025-10-11");

    fireEvent.change(input, { target: { value: "2025-10-12" } });

    expect(mockSetDate).toHaveBeenCalledWith("2025-10-12");
  });

  it("sets current date if cleared date input is empty", () => {
    const mockSetDate = vi.fn();
    const today = getLocalISODate();
    render(
      <Controls
        useDatePicker
        selectedDate="2025-10-10"
        setSelectedDate={mockSetDate}
      />
    );
    const datePicker = screen.getByTestId("date-picker");
    const input = datePicker.querySelector(
      "input[type='date']"
    ) as HTMLInputElement;

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "" } });

    expect(mockSetDate).toHaveBeenCalledWith(today);
  });

  it("renders time range select when useTimeRange is true and calls set time range on change", () => {
    const mockSetTimeRange = vi.fn();

    const timeRangeOptions = [
      { from: 8, to: 12, name: "Morning" },
      { from: 12, to: 18, name: "Afternoon" },
      { from: 18, to: 22, name: "Evening" },
      { from: 22, to: 6, name: "Night" },
    ];

    render(
      <Controls
        useTimeRange
        timeRangeLabel="Select Time Range"
        selectedTimeRangeIndex={0}
        setSelectedTimeRangeIndex={mockSetTimeRange}
        timeRangeOptions={timeRangeOptions}
      />
    );

    const select = screen.getByTestId("time-range").querySelector("select");
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options[0].textContent).toBe("Morning");

    fireEvent.change(select!, { target: { value: "1" } });

    expect(mockSetTimeRange).toHaveBeenCalledWith(1);
  });
});
