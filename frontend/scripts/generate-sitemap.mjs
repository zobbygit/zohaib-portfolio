// Writes public/sitemap.xml from the static route list. Run automatically before `npm run build`.
// Dynamic routes (/work/:slug, /blog/:slug) need server-side generation; add them when that exists.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = (process.env.VITE_SITE_URL ?? "https://example.com").replace(/\/$/, "");
const ROUTES = ["/", "/about", "/skills", "/education", "/work", "/engineering", "/journey", "/lab", "/blog", "/resume", "/contact"];

const urls = ROUTES.map((r) => `  <url><loc>${SITE}${r}</loc></url>`).join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, "..", "public", "sitemap.xml"), xml);
console.log(`sitemap.xml written with ${ROUTES.length} routes`);
