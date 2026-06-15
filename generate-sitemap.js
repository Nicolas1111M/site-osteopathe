import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const posts = JSON.parse(readFileSync(join(__dirname, "src/posts-index.json"), "utf-8"));
const domain = "https://www.nicolas-mildner-osteopathe.fr";
const today = new Date().toISOString().split("T")[0];

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/osteopathe-paris-7", priority: "0.9", changefreq: "weekly" },
  { loc: "/douleurs-dos-lombalgie-paris-7", priority: "0.8", changefreq: "monthly" },
  { loc: "/cervicalgie-torticolis-paris-7", priority: "0.8", changefreq: "monthly" },
  { loc: "/nourrisson-plagiocephalie-paris-7", priority: "0.8", changefreq: "monthly" },
  { loc: "/femme-enceinte-osteopathe-paris-7", priority: "0.8", changefreq: "monthly" },
  { loc: "/bruxisme-atm-paris-7", priority: "0.8", changefreq: "monthly" },
  { loc: "/urgence-osteopathe-paris-7", priority: "0.9", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
];
const blogPages = posts.map(p => ({
  loc: `/blog/${p.id}`,
  priority: "0.7",
  changefreq: "monthly",
  lastmod: p.date,
}));
const allPages = [...staticPages, ...blogPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${domain}${p.loc}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

writeFileSync(join(__dirname, "public/sitemap.xml"), xml);
console.log(`✅ sitemap.xml — ${allPages.length} URLs`);
allPages.forEach(p => console.log(`   ${domain}${p.loc}`));
