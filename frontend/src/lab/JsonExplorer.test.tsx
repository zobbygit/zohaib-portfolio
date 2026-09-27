import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JsonExplorer from "./JsonExplorer";

describe("JsonExplorer", () => {
  it("renders parsed keys from the default sample", () => {
    render(<JsonExplorer />);
    expect(screen.getByText("project:")).toBeInTheDocument();
  });

  it("shows an error for invalid JSON", () => {
    render(<JsonExplorer />);
    fireEvent.change(screen.getByLabelText(/input/i), { target: { value: "{bad" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
