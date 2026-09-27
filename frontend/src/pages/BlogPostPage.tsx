import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchBlogPost } from "../lib/api";
import { Seo } from "../lib/seo";

/** Renders post body as plain text paragraphs. No HTML is injected. */
export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const { data, isLoading, isError } = useQuery({ queryKey: ["blog", slug], queryFn: () => fetchBlogPost(slug), retry: false, enabled: slug.length > 0 });

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link to="/blog" data-cursor="view" className="font-mono text-xs tracking-widest text-white/50 hover:text-accent">← BACK TO BLOG</Link>
      {data && <Seo title={data.title} description={data.excerpt || data.body.slice(0, 150)} path={`/blog/${data.slug}`} />}
      {isLoading && <p className="mt-8 text-white/50" aria-busy="true">Loading…</p>}
      {(isError || (!isLoading && !data)) && <p className="mt-8 text-white/60">This post could not be found.</p>}
      {data && (
        <>
          <p className="mt-8 font-mono text-xs tracking-widest text-white/40">{new Date(data.publishedAt).toLocaleDateString()}</p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] font-bold leading-tight">{data.title}</h1>
          <div className="mt-10 grid gap-6 text-lg leading-relaxed text-white/80">
            {data.body.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </>
      )}
    </article>
  );
}
