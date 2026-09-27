import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchBlogPosts } from "../lib/api";
import SectionHeading from "../components/SectionHeading";

export default function BlogPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["blog"], queryFn: fetchBlogPosts, retry: false });
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <SectionHeading eyebrow="BLOG" title="Notes from the build." />
      {isLoading && <p className="text-white/50" aria-busy="true">Loading…</p>}
      {isError && <p className="text-white/60">The blog is unavailable right now.</p>}
      {!isLoading && !isError && (!data || data.length === 0) && (
        <p className="text-white/60">No posts yet. Articles will appear here once they are published.</p>
      )}
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
        {(data ?? []).map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`} data-cursor="view" className="block bg-ink p-8 transition hover:bg-navy">
              <p className="font-mono text-xs tracking-widest text-white/40">{new Date(post.publishedAt).toLocaleDateString()}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{post.title}</h2>
              <p className="mt-2 text-white/60">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
