import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "../lib/schemas";
import { submitContact } from "../lib/api";
import type { ContactStatus } from "../types";

const PROJECT_TYPES = ["Web application", "Interactive / 3D experience", "API or backend", "Other"];

/**
 * Same four states as before (IDLE / SENDING / SUCCESS / ERROR) and the same
 * fields — what changed is where the email actually gets sent. It used to be sent
 * from the browser directly to EmailJS using keys embedded in this bundle, which
 * meant anyone could read them in dev tools. Now this form makes one call to the
 * backend, which holds those keys server-side and sends from there instead.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", projectType: "", message: "" },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("sending");
    setError(null);
    try {
      const result = await submitContact(values);
      if (!result.emailSent) {
        setStatus("error");
        setError(result.reason === "not_configured" ? "Contact is not configured yet." : "Message could not be sent. Please try again.");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setError("Message could not be sent. Please try again.");
    }
  };

  const field = "w-full rounded-xl border border-white/15 bg-navy/60 px-4 py-3 text-white outline-none transition focus:border-accent";
  const label = "grid gap-2 font-mono text-xs tracking-widest text-white/60";
  const err = "text-red-400 normal-case tracking-normal";

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-accent/40 p-10 text-center" role="status">
        <p className="font-mono tracking-[0.3em] text-accent">MESSAGE TRANSMITTED</p>
        <p className="mt-4 text-white/60">Thank you. I will reply as soon as I can.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <label className={label}>NAME
        <input className={field} aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <span role="alert" className={err}>{errors.name.message}</span>}
      </label>
      <label className={label}>EMAIL
        <input type="email" className={field} aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <span role="alert" className={err}>{errors.email.message}</span>}
      </label>
      <label className={label}>PROJECT TYPE (OPTIONAL)
        <select className={field} {...register("projectType")}>
          <option value="">Choose one</option>
          {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className={label}>MESSAGE
        <textarea rows={5} className={field} aria-invalid={!!errors.message} {...register("message")} />
        {errors.message && <span role="alert" className={err}>{errors.message.message}</span>}
      </label>
      {error && <p role="alert" className="text-red-400">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="justify-self-start rounded-full bg-white px-8 py-3 font-mono text-xs tracking-widest text-ink transition hover:bg-accent disabled:opacity-50">
        {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
      </button>
    </form>
  );
}