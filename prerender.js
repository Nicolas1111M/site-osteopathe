/**
 * prerender.js — Génère le HTML statique de chaque article de blog
 * 
 * Tourne après `vite build`. Injecte le contenu textuel complet dans le HTML
 * pour que Googlebot voie tout sans exécuter de JavaScript.
 * React hydrate par-dessus côté client — aucun flash, aucun conflit.
 * 
 * Fonctionne sur Vercel sans Puppeteer.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const domain = "https://www.nicolas-mildner-osteopathe.fr";

// Read the built index.html as template
const template = readFileSync(join(DIST, "index.html"), "utf-8");

// Read posts index
const postsIndex = JSON.parse(readFileSync(join(__dirname, "src/posts-index.json"), "utf-8"));

// ── Helpers ──

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** Convert article content text to semantic HTML (same logic as Blog.jsx) */
function contentToHtml(content) {
  const lines = content.split("\n");
  const parts = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const prevEmpty = i === 0 || lines[i - 1].trim() === "";
    const nextEmpty = i === lines.length - 1 || (lines[i + 1]?.trim() === "");
    const isHeading = prevEmpty && nextEmpty && line.length < 120 && !line.endsWith(".");
    if (isHeading) {
      parts.push(`<h2>${escapeHtml(line)}</h2>`);
    } else {
      parts.push(`<p>${escapeHtml(line)}</p>`);
    }
  }
  return parts.join("\n");
}

/** Build FAQ HTML + FAQPage JSON-LD */
function faqHtml(faq) {
  if (!faq || faq.length === 0) return "";
  const items = faq.map(item =>
    `<details><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`
  ).join("\n");
  return `<section aria-label="Questions fréquentes"><h2>Questions fréquentes</h2>\n${items}\n</section>`;
}

function faqJsonLd(faq) {
  if (!faq || faq.length === 0) return "";
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

/** Build sources HTML */
function sourcesHtml(sources) {
  if (!sources || sources.length === 0) return "";
  const items = sources.map(s =>
    `<li><a href="${escapeHtml(s.url)}" rel="noopener">${escapeHtml(s.text)}</a></li>`
  ).join("\n");
  return `<section aria-label="Sources"><h3>Sources vérifiées</h3><ol>\n${items}\n</ol></section>`;
}

/** BlogPosting JSON-LD */
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
      "jobTitle": "Ostéopathe D.O., D.O.E., D.O.F.",
      "url": "https://nicolas-mildner-osteopathe.fr"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cabinet Nicolas Mildner — Ostéopathe D.O.",
      "url": "https://nicolas-mildner-osteopathe.fr"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${domain}/blog/${post.id}`
    },
    "keywords": Array.isArray(post.keywords) ? post.keywords.join(", ") : "",
    "wordCount": wordCount
  };
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

// ── Generate each article page ──

let count = 0;

for (const post of postsIndex) {
  const articlePath = join(DIST, "blog", `${post.id}.json`);
  if (!existsSync(articlePath)) {
    console.warn(`⚠️  Article JSON manquant : ${articlePath}`);
    continue;
  }
  const articleData = JSON.parse(readFileSync(articlePath, "utf-8"));
  const wordCount = articleData.content.split(/\s+/).length;

  // Build the pre-rendered article HTML
  const articleHtml = `
<article itemscope itemtype="https://schema.org/BlogPosting">
  <meta itemprop="author" content="Nicolas Mildner" />
  <meta itemprop="datePublished" content="${post.date}" />
  <header>
    <p>${escapeHtml(post.tag)} · ${escapeHtml(post.readTime)}</p>
    <h1 itemprop="headline">${escapeHtml(post.title)}</h1>
    <p>Publié le ${formatDate(post.date)} · Nicolas Mildner, Ostéopathe D.O.</p>
  </header>
  <div itemprop="articleBody">
    ${contentToHtml(articleData.content)}
  </div>
  <div>
    <p>Pour en discuter, Nicolas Mildner, ostéopathe D.O. à Paris 7ᵉ, est joignable au <a href="tel:0142021118">01 42 02 11 18</a> — rendez-vous uniquement par téléphone.</p>
  </div>
  ${faqHtml(articleData.faq)}
  ${sourcesHtml(articleData.sources)}
  <footer>
    <p><strong>Nicolas Mildner</strong> — Ostéopathe D.O. · D.O.E. · D.O.F. — Paris 7ᵉ</p>
    <p>22 ans de pratique clinique. Filiation Frymann · Paoletti · Caporossi · Wernham · Briend.</p>
    <p>72 avenue de la Bourdonnais, 75007 Paris</p>
    <p><a href="tel:0142021118">01 42 02 11 18</a> · <a href="tel:0668801442">06 68 80 14 42</a></p>
  </footer>
</article>`;

  // Inject into template
  const pageTitle = `${post.title} — Nicolas Mildner, Ostéopathe D.O. Paris 7ᵉ`;
  let html = template
    // Replace <title>
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`)
    // Replace meta description
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${escapeHtml(post.excerpt)}"`
    )
    // Replace og:title
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}"`
    )
    // Replace og:description
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${escapeHtml(post.excerpt)}"`
    )
    // Replace canonical
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${domain}/blog/${post.id}"`
    )
    // Inject structured data before </head>
    .replace(
      "</head>",
      `${blogPostingJsonLd(post, wordCount)}\n${faqJsonLd(articleData.faq)}\n</head>`
    )
    // Inject article HTML into <div id="root">
    .replace(
      '<div id="root"></div>',
      `<div id="root">${articleHtml}</div>`
    );

  // Write file
  const outDir = join(DIST, "blog", post.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  count++;
}

// ── Generate /blog listing page ──

const listingHtml = `
<div>
  <header>
    <h1>Le blog du cabinet — Nicolas Mildner, Ostéopathe D.O. Paris 7ᵉ</h1>
    <p>Articles fondés sur la recherche PubMed. Vulgarisés, sourcés, rigoureux.</p>
  </header>
  <nav aria-label="Articles du blog">
    ${postsIndex.map(p => `
    <article>
      <h2><a href="/blog/${p.id}">${escapeHtml(p.title)}</a></h2>
      <p>${escapeHtml(p.excerpt)}</p>
      <p>${escapeHtml(p.tag)} · ${escapeHtml(p.readTime)} · ${formatDate(p.date)}</p>
    </article>`).join("\n")}
  </nav>
</div>`;

let listingPage = template
  .replace(/<title>[^<]*<\/title>/, `<title>Blog — Nicolas Mildner, Ostéopathe D.O. Paris 7ᵉ</title>`)
  .replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="Articles fondés sur la recherche PubMed. Vulgarisés, sourcés, rigoureux. Par Nicolas Mildner, ostéopathe D.O. à Paris 7ᵉ."`
  )
  .replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${domain}/blog"`
  )
  .replace(
    '<div id="root"></div>',
    `<div id="root">${listingHtml}</div>`
  );

const blogDir = join(DIST, "blog");
mkdirSync(blogDir, { recursive: true });
// Don't overwrite dist/blog/ if index.html already exists from Vite
const blogIndexPath = join(blogDir, "index.html");
writeFileSync(blogIndexPath, listingPage);

console.log(`\n✅ Pré-rendu terminé — ${count} articles + 1 listing`);
postsIndex.forEach(p => console.log(`   /blog/${p.id}/`));
console.log(`   /blog/`);
