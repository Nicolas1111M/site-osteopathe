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

// Read homepage FAQ (miroir de la FAQ de Site.jsx — source de vérité pour le pré-rendu)
const homeFaq = JSON.parse(readFileSync(join(__dirname, "src/home-faq.json"), "utf-8"));

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
  return `<script type="application/ld+json" id="ld-faq">${JSON.stringify(ld)}</script>`;
}

/** BreadcrumbList JSON-LD — items: [{name, url}] (dernier item sans url = page courante) */
function breadcrumbJsonLd(items) {
  if (!items || items.length === 0) return "";
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": it.name,
      ...(it.url ? { "item": it.url } : {})
    }))
  };
  return `<script type="application/ld+json" id="ld-breadcrumb">${JSON.stringify(ld)}</script>`;
}

/** FAQPage JSON-LD pour la home (items déjà au format mainEntity) */
function homeFaqJsonLd(items) {
  if (!items || items.length === 0) return "";
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items };
  return `<script type="application/ld+json" id="ld-faq-home">${JSON.stringify(ld)}</script>`;
}

/** FAQ visible (home) à partir des items mainEntity */
function homeFaqHtml(items) {
  if (!items || items.length === 0) return "";
  const li = items.map(q => `<details><summary>${escapeHtml(q.name)}</summary><p>${escapeHtml(q.acceptedAnswer.text)}</p></details>`).join("\n");
  return `<section aria-label="Questions fréquentes"><h2>Questions fréquentes — Ostéopathe Paris 7e</h2>\n${li}\n</section>`;
}

/** Build sources HTML */
function sourcesHtml(sources) {
  if (!sources || sources.length === 0) return "";
  const items = sources.map(s =>
    `<li><a href="${escapeHtml(s.url)}" rel="noopener">${escapeHtml(s.text)}</a></li>`
  ).join("\n");
  return `<section aria-label="Sources"><h3>Sources</h3><ol>\n${items}\n</ol></section>`;
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
      "image": `${domain}/img/nicolas-mildner-osteopathe.jpg`,
      "jobTitle": "Ostéopathe D.O., D.O.E., D.O.F.",
      "url": domain
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cabinet Nicolas Mildner — Ostéopathe D.O.",
      "url": domain
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${domain}/blog/${post.id}`
    },
    "keywords": Array.isArray(post.keywords) ? post.keywords.join(", ") : "",
    "wordCount": wordCount
  };
  return `<script type="application/ld+json" id="ld-blogposting">${JSON.stringify(ld)}</script>`;
}


/** M5 — Réécrit les balises head propres à chaque page (og:url, og:image, twitter). */
function rewriteHead(html, { title, description, canonical, image }) {
  let h = html;
  if (title) {
    h = h.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
         .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapeHtml(title)}"`)
         .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escapeHtml(title)}"`);
  }
  if (description) {
    h = h.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeHtml(description)}"`)
         .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapeHtml(description)}"`)
         .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escapeHtml(description)}"`);
  }
  if (canonical) {
    h = h.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`)
         .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`);
  }
  if (image) {
    h = h.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${image}"`)
         .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${image}"`);
  }
  return h;
}

/** GEO — fiche de faits atomiques, réutilisée par la home et la page locale. */
function factSheet() {
  const rows = [
    ["Praticien", "Nicolas Mildner, ostéopathe D.O., D.O.E., D.O.F."],
    ["Adresse", "72 avenue de la Bourdonnais, 75007 Paris"],
    ["Arrondissement", "Paris 7e — quartier Gros-Caillou"],
    ["Accès", "Métro École Militaire (ligne 8) et La Tour-Maubourg (ligne 8)"],
    ["Téléphone", "01 42 02 11 18"],
    ["Mobile (appel ou SMS)", "06 68 80 14 42"],
    ["Prise de rendez-vous", "Par téléphone ou SMS uniquement. Pas de réservation en ligne, pas de Doctolib."],
    ["Horaires", "Lundi, mardi, jeudi, vendredi 9h–21h. Mercredi 12h–21h."],
    ["Tarif", "80 à 90 € la consultation"],
    ["Durée", "45 minutes à 1 heure"],
    ["Paiement", "Chèque ou espèces"],
    ["Exercice depuis", "2004 — 22 ans de pratique clinique"],
    ["Enseignement", "17 ans à l'École Supérieure d'Ostéopathie de Paris (2004–2020)"],
    ["Diplôme", "D.O. n°00379, Collégiale Académique de France"],
    ["Particularité", "Pratique exclusivement douce, sans aucun craquement"]
  ];
  return `<section aria-label="Fiche pratique du cabinet">
  <h2>Cabinet d'ostéopathie à Paris 7 (75007) — fiche pratique</h2>
  <dl>
${rows.map(([k, v]) => `    <dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join("\n")}
  </dl>
</section>`;
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
    <p>Pour en discuter, Nicolas Mildner, ostéopathe D.O. à Paris 7e, est joignable au <a href="tel:0142021118">01 42 02 11 18</a> — rendez-vous uniquement par téléphone.</p>
  </div>
  ${faqHtml(articleData.faq)}
  ${sourcesHtml(articleData.sources)}
  <footer>
    <p><strong>Nicolas Mildner</strong> — Ostéopathe D.O. · D.O.E. · D.O.F. — Paris 7e</p>
    <p>22 ans de pratique clinique. Filiation Frymann · Paoletti · Caporossi · Wernham · Briend.</p>
    <p>72 avenue de la Bourdonnais, 75007 Paris</p>
    <p><a href="tel:0142021118">01 42 02 11 18</a> · <a href="tel:0668801442">06 68 80 14 42</a></p>
  </footer>
</article>`;

  // Inject into template
  // m2 — suffixe de marque court, et supprimé si le titre d'article sature déjà l'affichage (~60 car.)
  const baseTitle = post.metaTitle || post.title;
  const SUFFIX = " | Ostéopathe Paris 7";
  const pageTitle = (baseTitle.length + SUFFIX.length) <= 65 ? baseTitle + SUFFIX : baseTitle;
  const pageDesc = post.metaDescription || post.excerpt;
  let html = rewriteHead(template, {
      title: pageTitle,
      description: pageDesc,
      canonical: `${domain}/blog/${post.id}`,
    })
    // Inject structured data before </head>
    .replace(
      "</head>",
      `${blogPostingJsonLd(post, wordCount)}\n${faqJsonLd(articleData.faq)}\n${breadcrumbJsonLd([{name:"Accueil",url:`${domain}/`},{name:"Blog",url:`${domain}/blog`},{name:post.title}])}\n</head>`
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
    <h1>Le blog du cabinet — Nicolas Mildner, Ostéopathe D.O. Paris 7e</h1>
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

let listingPage = rewriteHead(template, {
    title: "Blog — Nicolas Mildner, Ostéopathe D.O. Paris 7 (75007)",
    description: "Articles fondés sur la recherche PubMed. Vulgarisés, sourcés, rigoureux. Par Nicolas Mildner, ostéopathe D.O. à Paris 7, 75007.",
    canonical: `${domain}/blog`,
  })
  .replace(
    "</head>",
    `${breadcrumbJsonLd([{name:"Accueil",url:`${domain}/`},{name:"Blog"}])}\n</head>`
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

// ── Pre-render homepage (/) ──
// Inject key SEO content into the root div so Google sees real HTML

const homepageHtml = `
<div>
  <header>
    <img src="/img/nicolas-mildner-osteopathe.jpg" alt="Nicolas Mildner — Ostéopathe D.O. à Paris 7e — Cabinet Bourdonnais, 72 avenue de la Bourdonnais" width="600" height="399" />
    <h1>Nicolas Mildner — Ostéopathe D.O. à Paris 7 — 75007</h1>
    <p>72 avenue de la Bourdonnais, 75007 Paris. Métro École Militaire (ligne 8). Quartier Gros-Caillou, 7e arrondissement.</p>
    <p>Ostéopathe D.O. · D.O.E. · D.O.F. — La Loi du Cas Unique</p>
    <p>Chaque patient est un cas jamais vu. Pas de protocole. Pas de recette. L'ostéopathie n'est pas un produit — c'est une relation.</p>
    <p>Généraliste hyperspécialiste. 18 champs d'expertise. Approche systémique et neurovégétative fondée sur la neurophysiologie. Filiation directe avec les fondateurs de l'ostéopathie mondiale. Patientèle internationale.</p>
  </header>
  <section aria-label="En résumé">
    <p>${escapeHtml(homeFaq.aiSummary)}</p>
  </section>
  ${factSheet()}
  <nav aria-label="Sections du site">
    <a href="/osteopathe-paris-7">Ostéopathe Paris 7</a>
    <a href="/blog">Blog</a>
    <a href="#approche">Approche</a>
    <a href="#heritage">Héritage</a>
    <a href="#specs">Spécialisations</a>
    <a href="#parcours">Parcours</a>
    <a href="#contact">Contact</a>
  </nav>
  <section aria-label="Approche">
    <h2>Mon approche — Systémique · Neurovégétatif · Vitalité</h2>
    <p>L'ostéopathie est avant tout une technique réflexe. Je ne « remets pas en place » — je dialogue avec votre système nerveux pour restaurer les conditions de votre vitalité.</p>
  </section>
  <section aria-label="Spécialisations">
    <h2>18 champs d'expertise — Généraliste Hyperspécialiste</h2>
    <p><a href="/douleurs-dos-lombalgie-paris-7">Douleurs et gestion de la douleur</a>. Fertilité et fécondation. <a href="/femme-enceinte-osteopathe-paris-7">Périnatalité et projet de naissance</a>. <a href="/nourrisson-plagiocephalie-paris-7">Nourrissons</a>. Pédiatrie et adolescents. Crânio-sacré et biodynamique. Ostéopathie viscérale. Sport et entretien corporel. Arts martiaux, yoga et pilates. Musiciens et chant lyrique. Orthodontie et enfants. Bilans complémentaires. Post-opératoire. Posturologie. Stress, burn-out et somatisations. Seniors et gériatrie. Problèmes complexes. Urgences et domicile.</p>
    <p><a href="/cervicalgie-torticolis-paris-7">Cervicalgie et torticolis</a> · <a href="/bruxisme-atm-paris-7">Bruxisme et ATM</a></p>
  </section>
  <section aria-label="Parcours">
    <h2>L'une des premières générations d'ostéopathes D.O. en France</h2>
    <p>Diplômé D.O. en 2004 par la Collégiale Académique de France (n°379). D.O.E. validé devant la Faculté de Médecine de Genève. 17 ans d'enseignement à l'ESO Paris. Filiation directe : Viola Frymann, John Wernham, Serge Paoletti, Roger Caporossi, René Briend.</p>
  </section>
  <section aria-label="Articles du blog">
    <h2>Le blog du cabinet</h2>
    ${postsIndex.map(p => `<article><h3><a href="/blog/${p.id}">${escapeHtml(p.title)}</a></h3><p>${escapeHtml(p.excerpt)}</p></article>`).join("\n")}
  </section>
  ${homeFaqHtml(homeFaq.questions)}
  <section aria-label="Contact">
    <h2>Prendre rendez-vous</h2>
    <p>72 avenue de la Bourdonnais, 75007 Paris. Métro École Militaire (8) · La Tour-Maubourg (8).</p>
    <p>Téléphone cabinet : <a href="tel:0142021118">01 42 02 11 18</a></p>
    <p>Mobile : <a href="tel:0668801442">06 68 80 14 42</a> — Appel ou SMS pour prendre rendez-vous.</p>
    <p>Horaires : Lundi, Mardi, Jeudi, Vendredi 9h–21h. Mercredi 12h–21h.</p>
    <p>Consultation : 80–90 € · 45 min à 1 h. Chèque ou espèces.</p>
    <p>Pas de Doctolib — par choix. Rendez-vous par téléphone ou SMS.</p>
  </section>
  <footer>
    <p>Nicolas Mildner — Ostéopathe D.O. · D.O.E. · D.O.F. — Paris 7e</p>
    <p><a href="/osteopathe-paris-7">Ostéopathe Paris 7</a> · <a href="/blog">Blog</a></p>
    <p>Annuaire ostéopathes : <a href="https://www.proxiosteo.fr" rel="noopener">proxiosteo.fr</a></p>
    <p>© 2026 Nicolas Mildner — Ostéopathe D.O. — Paris 7e — La Loi du Cas Unique</p>
  </footer>
</div>`;

let homePage = template
  .replace(
    "</head>",
    `${homeFaqJsonLd(homeFaq.questions)}\n</head>`
  )
  .replace(
    '<div id="root"></div>',
    `<div id="root">${homepageHtml}</div>`
  );

writeFileSync(join(DIST, "index.html"), homePage);
console.log(`   / (homepage pre-rendered)`);

// ── Pre-render /osteopathe-paris-7 ──

const localPageHtml = `
<div>
  <header>
    <h1>Ostéopathe Paris 7 — 75007 — Nicolas Mildner D.O., 72 avenue de la Bourdonnais</h1>
    <img src="/img/nicolas-mildner-osteopathe.jpg" alt="Nicolas Mildner — Ostéopathe D.O. au cabinet de Paris 7e, 72 avenue de la Bourdonnais" width="600" height="399" />
    <p>Nicolas Mildner, ostéopathe D.O. n°379, exerce au cœur du 7e arrondissement depuis 2004. 22 ans de pratique clinique, 17 ans d'enseignement, 18 spécialisations. Cabinet à deux pas de l'École Militaire, du Champ-de-Mars et des Invalides.</p>
    <p>Téléphone : <a href="tel:0142021118">01 42 02 11 18</a> · Mobile : <a href="tel:0668801442">06 68 80 14 42</a></p>
    <p>Pas de Doctolib — par choix. Rendez-vous par téléphone ou SMS uniquement.</p>
  </header>
  <nav aria-label="Navigation"><a href="/">Accueil</a> · <a href="/blog">Blog</a></nav>
  ${factSheet()}
  <section aria-label="Remboursement">
    <p>Remboursement par la mutuelle selon contrat. L’ostéopathie n’est pas prise en charge par l’Assurance Maladie.</p>
  </section>
  <section aria-label="Motifs de consultation">
    <h2>Pourquoi consulter un ostéopathe à Paris 7e ?</h2>
    <p><a href="/douleurs-dos-lombalgie-paris-7">Mal de dos, lombalgie, sciatique</a> — Prise en charge systémique des douleurs vertébrales aiguës et chroniques.</p>
    <p><a href="/bruxisme-atm-paris-7">Migraines, vertiges, ATM</a> — Approche crânio-sacrée et neurovégétative. Bruxisme, céphalées cervicogènes.</p>
    <p><a href="/femme-enceinte-osteopathe-paris-7">Grossesse</a> et <a href="/nourrisson-plagiocephalie-paris-7">nourrissons</a> — Suivi périnatal complet, plagiocéphalie, coliques. CES Ostéopathie Pédiatrique.</p>
    <p>Stress, burn-out, somatisations — Rééquilibrage du système nerveux autonome.</p>
    <p>Sport et récupération — Entretien du sportif, prévention des blessures. Yoga, arts martiaux, Pilates.</p>
    <p>Musiciens et chanteurs — Instrumentistes, chanteurs lyriques, troubles de la voix.</p>
    <p><a href="/cervicalgie-torticolis-paris-7">Cervicalgie et torticolis</a> — Douleurs cervicales, céphalées cervicogènes et raideur de nuque.</p>
    <a href="/#specs">Voir les 18 spécialisations</a>
  </section>
  <section aria-label="Urgence">
    <h2>Douleur aiguë ?</h2>
    <p>Dos bloqué, lumbago, torticolis : <a href="/urgence-osteopathe-paris-7">consultation rapide sur rendez-vous téléphonique</a>.</p>
  </section>
  <section aria-label="Votre praticien">
    <h2>Nicolas Mildner, ostéopathe D.O.</h2>
    <img src="/img/nicolas-mildner-osteopathe.jpg" alt="Nicolas Mildner — Ostéopathe D.O. au cabinet de Paris 7e" width="600" height="399" />
    <p>Diplômé D.O. en 2004 par la Collégiale Académique de France (n°379). D.O.E. validé devant la Faculté de Médecine de Genève. 17 ans d'enseignement à l'ESO Paris. Filiation directe : Viola Frymann, Wernham, Paoletti, Caporossi, Briend. Approche systémique et neurovégétative.</p>
    <a href="/#parcours">Découvrir mon parcours complet</a>
  </section>
  <section aria-label="Quartier">
    <h2>Un cabinet au cœur du 7e arrondissement</h2>
    <p>Le cabinet est situé au 72 avenue de la Bourdonnais, dans le quartier du Gros-Caillou, à quelques minutes à pied de l'École Militaire, du Champ-de-Mars et de la Tour Eiffel.</p>
    <p>Facilement accessible en métro (ligne 8, stations École Militaire et La Tour-Maubourg).</p>
    <p>Consultations à domicile possibles pour les patients à mobilité réduite (Paris 7e et arrondissements limitrophes).</p>
  </section>
  <section aria-label="Articles">
    <h2>Articles de votre ostéopathe à Paris 7e</h2>
    ${postsIndex.map(p => `<article><h3><a href="/blog/${p.id}">${escapeHtml(p.title)}</a></h3><p>${escapeHtml(p.excerpt)}</p></article>`).join("\n")}
    <a href="/blog">Tous les articles du blog</a>
  </section>
  <section aria-label="Rendez-vous">
    <h2>Prendre rendez-vous avec votre ostéopathe à Paris 7e</h2>
    <p>Appelez directement ou envoyez un SMS. Pas de Doctolib — par choix. L'ostéopathie est une relation, pas une prestation.</p>
    <p><a href="tel:0142021118">01 42 02 11 18</a> · <a href="tel:0668801442">06 68 80 14 42</a></p>
  </section>
  <footer>
    <p>© 2026 Nicolas Mildner — Ostéopathe D.O. — Paris 7e — La Loi du Cas Unique</p>
    <p>Annuaire ostéopathes : <a href="https://www.proxiosteo.fr" rel="noopener">proxiosteo.fr</a></p>
  </footer>
</div>`;

const localPageTitle = "Ostéopathe Paris 7 (75007) — Nicolas Mildner D.O. | Bourdonnais";
const localPageDesc = "Ostéopathe à Paris 7, 75007 : Nicolas Mildner D.O. n°379, 22 ans d'expérience. 72 avenue de la Bourdonnais, métro École Militaire. Tél. 01 42 02 11 18.";

let localPage = rewriteHead(template, {
    title: localPageTitle,
    description: localPageDesc,
    canonical: `${domain}/osteopathe-paris-7`,
  })
  .replace(
    "</head>",
    `${breadcrumbJsonLd([{name:"Accueil",url:`${domain}/`},{name:"Ostéopathe Paris 7"}])}\n</head>`
  )
  .replace(
    '<div id="root"></div>',
    `<div id="root">${localPageHtml}</div>`
  );

const localDir = join(DIST, "osteopathe-paris-7");
mkdirSync(localDir, { recursive: true });
writeFileSync(join(localDir, "index.html"), localPage);
console.log(`   /osteopathe-paris-7/ (local page pre-rendered)`);

// ── Pre-render local specialty pages ──

const localPagesData = JSON.parse(readFileSync(join(__dirname, "src/local-pages-data.json"), "utf-8"));

for (const lp of localPagesData) {
  const specHtml = `
<div>
  <header>
    <h1>${escapeHtml(lp.h1)}</h1>
    <p>${escapeHtml(lp.subtitle)}</p>
    <img src="/img/nicolas-mildner-osteopathe.jpg" alt="Nicolas Mildner — Ostéopathe D.O. Paris 7e" width="600" height="399" />
    <p>Téléphone : <a href="tel:0142021118">01 42 02 11 18</a> · Mobile : <a href="tel:0668801442">06 68 80 14 42</a></p>
  </header>
  <nav aria-label="Navigation"><a href="/">Accueil</a> · <a href="/osteopathe-paris-7">Ostéopathe Paris 7</a> · <a href="/blog">Blog</a></nav>
  ${lp.alert ? `<section aria-label="Avertissement médical" style="background:#FFF8F6;border-bottom:3px solid #C0392B;padding:24px">
    <h2>${escapeHtml(lp.alert.title)}</h2>
    <p>${escapeHtml(lp.alert.text)}</p>
    <p><strong>${escapeHtml(lp.alert.redflags)}</strong></p>
    ${lp.alert.numbers.map(n => `<p><a href="tel:${n.number}"><strong>${n.number}</strong> — ${escapeHtml(n.label)} (${escapeHtml(n.desc)})</a></p>`).join("\n")}
  </section>` : ""}
  <section>
    ${lp.introParagraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("\n")}
  </section>
  <section aria-label="Prise en charge">
    <h2>Ce que je prends en charge</h2>
    ${lp.expertise.map(e => `<h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.text)}</p>`).join("\n")}
    <a href="/osteopathe-paris-7">Voir toutes les spécialisations — Ostéopathe Paris 7e</a>
  </section>
  <section aria-label="Praticien">
    <h2>Nicolas Mildner, ostéopathe D.O.</h2>
    <p>22 ans de pratique clinique. D.O. n°379, Collégiale Académique de France. Filiation directe : Frymann · Paoletti · Caporossi · Wernham · Briend. 17 ans d'enseignement à l'ESO Paris.</p>
    <a href="/#parcours">Mon parcours complet</a>
  </section>
  ${lp.faq && lp.faq.length > 0 ? `<section aria-label="FAQ"><h2>Questions fréquentes</h2>${lp.faq.map(f => `<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`).join("\n")}</section>` : ""}
  ${lp.relatedBlogSlugs.length > 0 ? `<section aria-label="Articles liés"><h2>Articles liés</h2>${lp.relatedBlogSlugs.map(s => { const rp = postsIndex.find(p => p.id === s); return rp ? `<article><h3><a href="/blog/${rp.id}">${escapeHtml(rp.title)}</a></h3><p>${escapeHtml(rp.excerpt)}</p></article>` : ""; }).join("\n")}</section>` : ""}
  <section aria-label="Rendez-vous">
    <h2>Prendre rendez-vous</h2>
    <p>Nicolas Mildner, ostéopathe D.O. à Paris 7e — 72 avenue de la Bourdonnais, 75007 Paris.</p>
    <p><a href="tel:0142021118">01 42 02 11 18</a> · <a href="tel:0668801442">06 68 80 14 42</a></p>
  </section>
  <footer>
    <nav aria-label="Spécialisations">
      <a href="/douleurs-dos-lombalgie-paris-7">Lombalgie et mal de dos</a> ·
      <a href="/cervicalgie-torticolis-paris-7">Cervicalgie et torticolis</a> ·
      <a href="/nourrisson-plagiocephalie-paris-7">Nourrissons</a> ·
      <a href="/femme-enceinte-osteopathe-paris-7">Grossesse</a> ·
      <a href="/bruxisme-atm-paris-7">Bruxisme et ATM</a> ·
      <a href="/osteopathe-sans-craquement-paris-7">Sans craquement</a> ·
      <a href="/urgence-osteopathe-paris-7">Urgence ostéopathe</a>
    </nav>
    <p><a href="/">Accueil</a> · <a href="/osteopathe-paris-7">Ostéopathe Paris 7</a> · <a href="/blog">Blog</a></p>
    <p>© 2026 Nicolas Mildner — Ostéopathe D.O. — Paris 7e</p>
    <p>Annuaire ostéopathes : <a href="https://www.proxiosteo.fr" rel="noopener">proxiosteo.fr</a></p>
  </footer>
</div>`;

  const faqJsonLdSpec = (lp.faq && lp.faq.length > 0) ? `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": lp.faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
  })}</script>` : "";

  let specPage = rewriteHead(template, {
      title: lp.metaTitle,
      description: lp.metaDescription,
      canonical: `${domain}/${lp.slug}`,
    })
    .replace("</head>", `${faqJsonLdSpec}\n${breadcrumbJsonLd([{name:"Accueil",url:`${domain}/`},{name:"Ostéopathe Paris 7",url:`${domain}/osteopathe-paris-7`},{name:lp.h1.split(/ — | : /)[0]}])}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${specHtml}</div>`);

  const specDir = join(DIST, lp.slug);
  mkdirSync(specDir, { recursive: true });
  writeFileSync(join(specDir, "index.html"), specPage);
  console.log(`   /${lp.slug}/ (spec page pre-rendered)`);
}
