import { Helmet } from "react-helmet-async";

const SITE_NAME = "ZOHAIB";
const DEFAULT_IMAGE = "/projects/agentforge.jpg"; // replace with a dedicated 1200x630 social image

export const siteUrl = (import.meta.env.VITE_SITE_URL ?? "http://localhost:5173").replace(/\/$/, "");

export const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": { title: "PORFOLIO", description: "Building scalable web products, interactive experiences, and full-stack systems." },
  "/about": { title: "About", description: "The story, thinking, and direction behind the work." },
  "/skills": { title: "Skills", description: "How the tools and technologies connect." },
  "/education": { title: "Education", description: "Academic path from ICSE and ISC to a B.Tech in Information Technology." },
  "/work": { title: "Work", description: "Selected projects, case studies, and live links." },
  "/engineering": { title: "Engineering", description: "How I design, test, secure, and deploy software." },
  "/journey": { title: "Journey", description: "A scroll-driven timeline of learning and building." },
  "/lab": { title: "Lab", description: "Interactive experiments in frontend and API engineering." },
  "/blog": { title: "Blog", description: "Notes from the build." },
  "/contact": { title: "Contact", description: "Tell me about the product, the problem, and the timeline." },
};

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

/** Per-page title, description, canonical URL, and Open Graph / Twitter tags. */
export function Seo({ title, description, path, image }: SeoProps) {
  const url = `${siteUrl}${path}`;
  const img = image ? `${siteUrl}${image}` : `${siteUrl}${DEFAULT_IMAGE}`;
  const fullTitle = path === "/" ? `${SITE_NAME} — ${title}` : `${title} | ${SITE_NAME}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}

/** Metadata for a static route, or null when the page supplies its own (dynamic routes). */
export function metaForPath(path: string): { title: string; description: string } | null {
  return ROUTE_META[path] ?? null;
}
