// Source unique des titres, descriptions et URL canoniques.
// Utilisée par le pré-rendu (HTML servi aux moteurs) ET par le navigateur
// lors des navigations internes, pour que les deux disent toujours la même chose.
import postsIndex from "./posts-index.json";
import localPages from "./local-pages-data.json";
import { DOMAIN } from "./site-config.js";

export const HOME_META = {
  title: "Ostéopathe Paris 7 (75007) — Nicolas Mildner D.O.",
  description:
    "Nicolas Mildner, ostéopathe D.O. à Paris 7 — 72 avenue de la Bourdonnais, 75007 Paris. 22 ans d'expérience, pratique douce sans craquement. Tél. 01 42 02 11 18.",
  ogDescription:
    "Ostéopathe D.O. à Paris 7 depuis 2004. 72 avenue de la Bourdonnais, 75007 Paris. 22 ans d'expérience, pratique douce sans craquement.",
  canonical: `${DOMAIN}/`,
};

export const PARIS7_META = {
  title: "Ostéopathe Paris 7 (75007) — Nicolas Mildner D.O. | Bourdonnais",
  description:
    "Ostéopathe à Paris 7, 75007 : Nicolas Mildner D.O. n°379, 22 ans d'expérience. 72 avenue de la Bourdonnais, métro École Militaire. Tél. 01 42 02 11 18.",
  canonical: `${DOMAIN}/osteopathe-paris-7`,
};

export const BLOG_META = {
  title: "Blog — Nicolas Mildner, Ostéopathe D.O. Paris 7 (75007)",
  description:
    "Articles fondés sur la recherche PubMed. Vulgarisés, sourcés, rigoureux. Par Nicolas Mildner, ostéopathe D.O. à Paris 7, 75007.",
  canonical: `${DOMAIN}/blog`,
};

export function postMeta(post) {
  // Suffixe de marque court, supprimé si le titre sature déjà l'affichage (~60 car.)
  const base = post.metaTitle || post.title;
  const SUFFIX = " | Ostéopathe Paris 7";
  return {
    title: base.length + SUFFIX.length <= 65 ? base + SUFFIX : base,
    description: post.metaDescription || post.excerpt,
    canonical: `${DOMAIN}/blog/${post.id}`,
  };
}

export function localPageMeta(page) {
  return { title: page.metaTitle, description: page.metaDescription, canonical: `${DOMAIN}/${page.slug}` };
}

export function metaForPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return HOME_META;
  if (path === "/osteopathe-paris-7") return PARIS7_META;
  if (path === "/blog") return BLOG_META;
  if (path.startsWith("/blog/")) {
    const post = postsIndex.find((p) => p.id === path.slice(6));
    return post ? postMeta(post) : null;
  }
  const page = localPages.find((p) => `/${p.slug}` === path);
  return page ? localPageMeta(page) : null;
}
