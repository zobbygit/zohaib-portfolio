import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("shows the system error copy and a way back", () => {
    render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
    expect(screen.getByText(/system error/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return to system/i })).toHaveAttribute("href", "/");
  });
});
