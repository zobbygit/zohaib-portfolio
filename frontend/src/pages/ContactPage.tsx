import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <p className="font-mono text-xs tracking-[0.25em] text-accent">// CONTACT</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tight">LET&apos;S BUILD SOMETHING.</h1>
      <p className="mt-6 mb-12 max-w-xl text-white/70">Tell me about the product, the problem, and the timeline. Messages are sent through EmailJS and validated on both the client and the server.</p>
      <ContactForm />
    </div>
  );
}
