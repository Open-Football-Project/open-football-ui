import { getLocalISODate, DayTimeRange } from "@matchinsights/core";

interface SelectOption {
  id: string;
  value: string;
}

interface ControlsProps {
  useDrop0?: boolean;
  drop0Label?: string;
  isDrop0LabelRow?: boolean;
  selectedDrop0?: string;
  setDrop0?: (status: string) => void;
  drop0Options?: SelectOption[];

  useDrop1?: boolean;
  drop1Label?: string;
  isDrop1LabelRow?: boolean;
  selectedDrop1?: string;
  setDrop1?: (status: string) => void;
  drop1Options?: SelectOption[];

  useInputControl?: boolean;
  inputControlLabel?: string;
  useInputControlLabel?: boolean;
  inputControlLabelRow?: boolean;
  inputControlValue?: string;
  inputControlPlaceholder?: string;
  setInputControlValue?: (status: string) => void;

  useDatePicker?: boolean;
  datePickerLabel?: string;
  datePickerLabelRow?: boolean;
  selectedDate?: string;
  setSelectedDate?: (date: string) => void;

  useTimeRange?: boolean;
  timeRangeLabel?: string;
  timeRangeLabelRow?: boolean;
  selectedTimeRangeIndex?: number;
  setSelectedTimeRangeIndex?: (index: number) => void;
  timeRangeOptions?: DayTimeRange[];

  alwaysColumn?: boolean;
}

const Controls = ({
  useDrop0 = false,
  drop0Label = "Select Option",
  isDrop0LabelRow = false,
  selectedDrop0 = "",
  setDrop0 = () => {},
  drop0Options = [],
  useDrop1 = false,
  drop1Label = "Select Option",
  isDrop1LabelRow = false,
  selectedDrop1 = "",
  setDrop1 = () => {},
  drop1Options = [],
  useInputControl = false,
  inputControlLabel = "Input Control",
  inputControlLabelRow = false,
  inputControlValue = "",
  inputControlPlaceholder = "Type here...",
  setInputControlValue = () => {},

  useDatePicker = false,
  datePickerLabel = "Select Date",
  datePickerLabelRow = false,
  selectedDate = "",
  setSelectedDate = () => {},

  useTimeRange = false,
  timeRangeLabel = "Select Time Range",
  timeRangeLabelRow = false,
  selectedTimeRangeIndex = 0,
  setSelectedTimeRangeIndex = () => {},
  timeRangeOptions,
  alwaysColumn = false,
}: ControlsProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localDate = e.target.value;
    if (!localDate) return setSelectedDate(getLocalISODate());
    setSelectedDate(localDate);
  };

  const renderControl = (
    label: string,
    isLabelRow: boolean,
    control: JSX.Element,
  ) => (
    <div
      className={`flex ${
        isLabelRow ? "flex-row items-center gap-2" : "flex-col"
      } flex-1`}
    >
      <label
        data-testid="control-label"
        className={`text-sm font-semibold py-2 px-4 mb-4 text-center bg-black/40 rounded-t-lg ${
          isLabelRow ? "w-32" : "mb-2"
        } text-brand-cream`}
      >
        {label}
      </label>

      {control}
    </div>
  );

  return (
    <div
      className={`flex flex-col gap-4 mt-4 mb-8 ${alwaysColumn ? "" : "lg:flex-row lg:items-end"}`}
    >
      {useDatePicker &&
        renderControl(
          datePickerLabel,
          datePickerLabelRow,
          <div data-testid="date-picker" className="relative w-full">
            <input
              type="date"
              value={selectedDate ?? ""}
              onChange={handleDateChange}
              className="truncate text-xs rounded-lg bg-brand-card text-white p-3 w-full ring-1 ring-gray-500 focus:ring-2 focus:ring-brand-orange focus:bg-brand-grayint focus:outline-none appearance-none"
            />
          </div>,
        )}

      {useTimeRange &&
        renderControl(
          timeRangeLabel,
          timeRangeLabelRow,
          <div data-testid="time-range" className="relative w-full">
            <select
              value={selectedTimeRangeIndex}
              onChange={(e) =>
                setSelectedTimeRangeIndex(Number(e.target.value))
              }
              className="truncate text-xs rounded-lg bg-brand-card text-white p-3 w-full ring-1 ring-gray-500 focus:ring-2 focus:ring-brand-orange focus:bg-brand-grayint focus:text-white focus:outline-none appearance-none"
            >
              {timeRangeOptions?.map((opt, idx) => (
                <option key={opt.name} value={idx}>
                  {opt.name}
                </option>
              ))}
            </select>
            <span className="text-sm absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-yellow pointer-events-none">
              ▼
            </span>
          </div>,
        )}

      {useDrop0 &&
        renderControl(
          drop0Label,
          isDrop0LabelRow,
          <div data-testid="drop-0" className="relative w-full">
            <select
              value={selectedDrop0 ?? ""}
              onChange={(e) => setDrop0(e.target.value)}
              className="truncate text-xs rounded-lg bg-brand-card text-white p-3 w-full ring-1 ring-gray-500 focus:ring-2 focus:ring-brand-orange focus:bg-brand-grayint focus:outline-none appearance-none"
            >
              {drop0Options.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.value}
                </option>
              ))}
            </select>
            <span className="text-sm absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-yellow pointer-events-none">
              ▼
            </span>
          </div>,
        )}

      {useDrop1 &&
        renderControl(
          drop1Label,
          isDrop1LabelRow,
          <div data-testid="drop-1" className="relative w-full">
            <select
              value={selectedDrop1 ?? ""}
              onChange={(e) => setDrop1(e.target.value)}
              className="truncate text-xs rounded-lg bg-brand-card text-white p-3 w-full ring-1 ring-gray-500 focus:ring-2 focus:ring-brand-orange focus:bg-brand-grayint focus:outline-none appearance-none"
            >
              {drop1Options.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.value}
                </option>
              ))}
            </select>
            <span className="text-sm absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-yellow pointer-events-none">
              ▼
            </span>
          </div>,
        )}

      {useInputControl &&
        renderControl(
          inputControlLabel,
          inputControlLabelRow,
          <div data-testid="drop-1" className="relative w-full">
            <input
              data-testid="input-control"
              type="text"
              placeholder={inputControlPlaceholder}
              value={inputControlValue}
              onChange={(e) => setInputControlValue(e.target.value)}
              className="truncate text-xs bg-brand-card text-white p-3 w-full ring-1 ring-gray-500 focus:ring-2 focus:ring-brand-orange focus:bg-brand-grayint focus:outline-none appearance-none"
            />
          </div>,
        )}
    </div>
  );
};

export default Controls;
