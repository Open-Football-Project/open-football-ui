import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { toast } from "sonner";
import { showSuccess, showError, showInfo } from "./toast";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("toast utils", () => {
  it("showSuccess delegates to sonner toast.success", () => {
    showSuccess("Saved!");
    expect(toast.success).toHaveBeenCalledWith("Saved!");
  });

  it("showError delegates to sonner toast.error", () => {
    showError("Something went wrong");
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });

  it("showInfo delegates to sonner toast.info", () => {
    showInfo("Did you know?");
    expect(toast.info).toHaveBeenCalledWith("Did you know?");
  });
});
