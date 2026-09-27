import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RequireAdmin from "./RequireAdmin";

vi.mock("../lib/api", () => ({ auth: { isAdmin: vi.fn().mockResolvedValue(false) } }));

describe("RequireAdmin", () => {
  it("redirects to the login page when not authenticated", async () => {
    const { AuthProvider } = await import("./AuthContext");
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AuthProvider>
          <Routes>
            <Route path="/admin/login" element={<p>LOGIN PAGE</p>} />
            <Route path="/admin" element={<RequireAdmin><p>SECRET</p></RequireAdmin>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText("LOGIN PAGE")).toBeInTheDocument();
    expect(screen.queryByText("SECRET")).not.toBeInTheDocument();
  });
});
