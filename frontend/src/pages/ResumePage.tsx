import { useState } from "react";
import { Seo } from "../lib/seo";
import { profile } from "../data/profile";

/** Views the resume in-browser (works on localhost and once deployed, since the path is relative)
 *  and offers a direct download. If the embedded viewer fails (some mobile browsers), the
 *  download link still works. */
export default function ResumePage() {
  const [embedFailed, setEmbedFailed] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <Seo title="Resume" description={`Download or view ${profile.name}'s resume.`} path="/resume" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-accent">// RESUME</p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-tight">
            {profile.name}&apos;s résumé.
          </h1>
        </div>
        <a
          href="/resume.pdf"
          download="Zohaib-Aslam-Resume.pdf"
          data-cursor="view"
          className="rounded-full bg-white px-6 py-3 font-mono text-xs tracking-widest text-ink transition hover:bg-accent"
        >
          DOWNLOAD PDF ↓
        </a>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-navy/30">
        {!embedFailed ? (
          <object data="/resume.pdf" type="application/pdf" className="h-[80vh] w-full" onError={() => setEmbedFailed(true)}>
            <p className="p-8 text-center text-white/70">
              Your browser can&apos;t preview the PDF inline.{" "}
              <a href="/resume.pdf" download className="text-accent underline">Download it instead</a>.
            </p>
          </object>
        ) : (
          <p className="p-8 text-center text-white/70">
            Preview unavailable in this browser.{" "}
            <a href="/resume.pdf" download className="text-accent underline">Download the PDF</a>.
          </p>
        )}
      </div>
    </div>
  );
}
