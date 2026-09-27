import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

const submitContact = vi.fn();
vi.mock("../lib/api", () => ({ submitContact: (...args: unknown[]) => submitContact(...args) }));

describe("ContactForm", () => {
  it("shows validation errors and does not submit when fields are empty", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect((await screen.findAllByRole("alert")).length).toBeGreaterThan(0);
    expect(submitContact).not.toHaveBeenCalled();
  });

  it("reports a configuration error instead of faking a successful send", async () => {
    submitContact.mockResolvedValueOnce({ emailSent: false, stored: false, reason: "not_configured" });
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "A real message body." } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(screen.getByText(/not configured yet/i)).toBeInTheDocument());
    expect(screen.queryByText(/message transmitted/i)).not.toBeInTheDocument();
  });

  it("shows the transmitted state once the backend confirms the email sent", async () => {
    submitContact.mockResolvedValueOnce({ emailSent: true, stored: true });
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "A real message body." } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(screen.getByText(/message transmitted/i)).toBeInTheDocument());
  });
});