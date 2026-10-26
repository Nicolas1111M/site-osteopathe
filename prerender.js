/**
 * prerender.js — génère le HTML statique complet de chaque page.
 *
 * Tourne après `vite build` (client) et `vite build --ssr` (rendu serveur).
 * Chaque page est rendue avec les vrais composants React : le HTML servi à
 * Google, aux assistants IA et aux visiteurs sans JavaScript est exactement
 * la page finale, déjà mise en forme. Dans le navigateur, React « hydrate »
 * ce HTML sans le remplacer : aucun clignotement, aucun saut de mise en page.
 *
 * Les titres, descriptions, URL canoniques et données structurées (JSON-LD)
 * sont identiques à la version précédente du site.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const domain = "https://www.nicolas-mildner-osteopathe.fr";

const ssr = await import(pathToFileURL(join(__dirname, "dist-ssr", "entry-server.js")).href);
const { render, serializeSsrData, HOME_META, PARIS7_META, BLOG_META, postMeta, localPageMeta } = ssr;

const template = readFileSync(join(DIST, "index.html"), "utf-8");
const postsIndex = JSON.parse(readFileSync(join(__dirname, "src/posts-index.json"), "utf-8"));
const homeFaq = JSON.parse(readFileSync(join(__dirname, "src/home-faq.json"), "utf-8"));
const localPagesData = JSON.parse(readFileSync(join(__dirname, "src/local-pages-data.json"), "utf-8"));

// ── Helpers ──

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function faqJsonLd(faq) {
  if (!faq || faq.length === 0) return "";
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((item) => ({ "@type": "Question", "name": item.q, "acceptedAnswer": { "@type": "Answer", "text": item.a } })),
  };
  return `<script type="application/ld+json" id="ld-faq">${JSON.stringify(ld)}</script>`;
}

function breadcrumbJsonLd(items) {
  if (!items || items.length === 0) return "";
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({ "@type": "ListItem", "position": i + 1, "name": it.name, ...(it.url ? { "item": it.url } : {}) })),
  };
  return `<script type="application/ld+json" id="ld-breadcrumb">${JSON.stringify(ld)}</script>`;
}

function homeFaqJsonLd(items) {
  if (!items || items.length === 0) return "";
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items };
  return `<script type="application/ld+json" id="ld-faq-home">${JSON.stringify(ld)}</script>`;
}

function blogPostingJsonLd(post, wordCount) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": "Nicolas Mildner",
      "image": `${domain}/img/nicolas-mildner-osteopathe.jpg`,
      "jobTitle": "Ostéopathe D.O., D.O.E., D.O.F.",
      "url": domain,
    },
    "publisher": { "@type": "Organization", "name": "Cabinet Nicolas Mildner — Ostéopathe D.O.", "url": domain },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${domain}/blog/${post.id}` },
    "keywords": Array.isArray(post.keywords) ? post.keywords.join(", ") : "",
    "wordCount": wordCount,
  };
  return `<script type="application/ld+json" id="ld-blogposting">${JSON.stringify(ld)}</script>`;
}

/** Réécrit les balises head propres à chaque page. */
function rewriteHead(html, { title, description, canonical, image }) {
  let h = html;
  if (title) {
    h = h
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapeHtml(title)}"`)
      .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escapeHtml(title)}"`);
  }
  if (description) {
    h = h
      .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeHtml(description)}"`)
      .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapeHtml(description)}"`)
      .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escapeHtml(description)}"`);
  }
  if (canonical) {
    h = h
      .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`)
      .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`);
  }
  if (image) {
    h = h
      .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${image}"`)
      .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${image}"`);
  }
  return h;
}

/** Insère le rendu React (et ses données éventuelles) dans la racine. */
function injectApp(html, path, data = null) {
  const app = render(path, data);
  const dataScript = data ? `<script id="__SSR_DATA__" type="application/json">${serializeSsrData(data)}</script>` : "";
  if (!html.includes('<div id="root"></div>')) throw new Error("Racine #root introuvable dans le gabarit");
  return html.replace('<div id="root"></div>', () => `<div id="root" data-ssr-path="${path}">${app}</div>${dataScript}`);
}

function writePage(path, html) {
  const dir = path === "/" ? DIST : join(DIST, path.slice(1));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  console.log(`   ${path}`);
}

console.log("\n✅ Pré-rendu");

// ── Articles ──
for (const post of postsIndex) {
  const articlePath = join(DIST, "blog", `${post.id}.json`);
  if (!existsSync(articlePath)) {
    console.warn(`⚠️  Article JSON manquant : ${articlePath}`);
    continue;
  }
  const articleData = JSON.parse(readFileSync(articlePath, "utf-8"));
  const wordCount = articleData.content.split(/\s+/).length;
  const path = `/blog/${post.id}`;
  const head = rewriteHead(template, postMeta(post)).replace(
    "</head>",
    `${blogPostingJsonLd(post, wordCount)}\n${faqJsonLd(articleData.faq)}\n${breadcrumbJsonLd([
      { name: "Accueil", url: `${domain}/` },
      { name: "Blog", url: `${domain}/blog` },
      { name: post.title },
    ])}\n</head>`
  );
  writePage(path, injectApp(head, path, { article: { id: post.id, data: articleData } }));
}

// ── Liste du blog ──
{
  const head = rewriteHead(template, BLOG_META).replace(
    "</head>",
    `${breadcrumbJsonLd([{ name: "Accueil", url: `${domain}/` }, { name: "Blog" }])}\n</head>`
  );
  writePage("/blog", injectApp(head, "/blog"));
}

// ── Page locale Paris 7 ──
{
  const head = rewriteHead(template, PARIS7_META).replace(
    "</head>",
    `${breadcrumbJsonLd([{ name: "Accueil", url: `${domain}/` }, { name: "Ostéopathe Paris 7" }])}\n</head>`
  );
  writePage("/osteopathe-paris-7", injectApp(head, "/osteopathe-paris-7"));
}

// ── Pages de spécialité ──
for (const lp of localPagesData) {
  const faqLd =
    lp.faq && lp.faq.length > 0
      ? `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": lp.faq.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
        })}</script>`
      : "";
  const head = rewriteHead(template, localPageMeta(lp)).replace(
    "</head>",
    `${faqLd}\n${breadcrumbJsonLd([
      { name: "Accueil", url: `${domain}/` },
      { name: "Ostéopathe Paris 7", url: `${domain}/osteopathe-paris-7` },
      { name: lp.h1.split(/ — | : /)[0] },
    ])}\n</head>`
  );
  writePage(`/${lp.slug}`, injectApp(head, `/${lp.slug}`));
}

// ── Accueil (en dernier : dist/index.html sert aussi de gabarit ci-dessus) ──
{
  const head = rewriteHead(template, { canonical: HOME_META.canonical }).replace("</head>", `${homeFaqJsonLd(homeFaq.questions)}\n</head>`);
  writePage("/", injectApp(head, "/"));
}
