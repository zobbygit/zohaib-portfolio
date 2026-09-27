import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProjectPage from "./ProjectPage";

describe("ProjectPage", () => {
  it("renders the AgentForge case study with live and GitHub links", () => {
    render(
      <MemoryRouter initialEntries={["/work/agentforge"]}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "AgentForge" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /live demo/i })).toHaveAttribute("href", "https://agent-forge-ai-six.vercel.app/");
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/zobbygit/AgentForge-Agentic-Ai");
  });
});
