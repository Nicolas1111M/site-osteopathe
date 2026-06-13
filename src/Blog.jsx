import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postsIndex from "./posts-index.json";

const F = { h:"'Playfair Display','Georgia',serif", b:"'DM Sans','Helvetica Neue',sans-serif" };
const C = { navy:"#1A2B4A", cream:"#FAF7F2", gold:"#B8956A", sage:"#F4F1EC", text:"#3A3A3A", muted:"#7A7A7A" };

/* ── SEO: update document meta per article ── */
function useDocumentMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) metaDesc.setAttribute("content", description);
    return () => {
      document.title = "Nicolas Mildner — Ostéopathe D.O. Paris 7\u1d49 | La Loi du Cas Unique";
      if (metaDesc) metaDesc.setAttribute("content", "Nicolas Mildner, ostéopathe D.O./D.O.E./D.O.F. à Paris 7\u1d49. 22 ans d\u2019expérience, 18 spécialisations. Approche systémique et neurovégétative. Tél. 01 42 02 11 18 · 06 68 80 14 42.");
    };
  }, [title, description]);
}

/* ── BlogPosting structured data ── */
function BlogPostingLD({ post, articleData }) {
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
      "@id": `https://www.nicolas-mildner-osteopathe.fr/blog/${post.id}`
    },
    "keywords": Array.isArray(post.keywords) ? post.keywords.join(", ") : (post.keywords || ""),
    "wordCount": articleData?.content ? articleData.content.split(/\s+/).length : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}

export default function Blog({ onBack, initialPost }) {
  const navigate = useNavigate();
  const [filterTag, setFilterTag] = useState("all");
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(false);

  const post = initialPost ? postsIndex.find(p => p.id === initialPost) : null;

  /* ── Lazy-load article content ── */
  useEffect(() => {
    if (!post) { setArticleData(null); return; }
    setLoading(true);
    fetch(`/blog/${post.id}.json`)
      .then(r => r.json())
      .then(data => { setArticleData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [post?.id]);

  useDocumentMeta(
    post ? `${post.title} — Nicolas Mildner, Ostéopathe D.O. Paris 7\u1d49` : "Blog — Nicolas Mildner, Ostéopathe D.O. Paris 7\u1d49",
    post ? post.excerpt : "Articles fondés sur la recherche PubMed. Vulgarisés, sourcés, rigoureux. Par Nicolas Mildner, ostéopathe D.O. à Paris 7\u1d49."
  );

  const tags = ["all", ...new Set(postsIndex.map(p => p.tag))];
  const filtered = filterTag === "all" ? postsIndex : postsIndex.filter(p => p.tag === filterTag);

  /* ── Article view ── */
  if (post) {
    return (
      <div style={{ fontFamily: F.b, background: C.cream, minHeight: "100vh", padding: "40px 24px" }}>
        <BlogPostingLD post={post} articleData={articleData} />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <button onClick={() => navigate("/blog")} style={{
            background: "none", border: "none", color: C.gold, fontSize: 14,
            cursor: "pointer", fontFamily: F.b, marginBottom: 32, padding: 0,
          }}>← Retour aux articles</button>

          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>{post.tag} · {post.readTime}</p>
          <h1 style={{ fontFamily: F.h, fontSize: 36, color: C.navy, lineHeight: 1.3, marginBottom: 16 }}>{post.title}</h1>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>Publié le {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · Nicolas Mildner, Ostéopathe D.O.</p>

          {loading && <p style={{ color: C.muted, fontSize: 14 }}>Chargement…</p>}

          {articleData && (
            <>
              <div style={{ fontSize: 16, lineHeight: 1.9, color: C.text }}>
                {(() => {
                  const lines = articleData.content.split("\n");
                  const elements = [];
                  for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    const prevEmpty = i === 0 || lines[i-1].trim() === "";
                    const nextEmpty = i === lines.length-1 || lines[i+1]?.trim() === "";
                    const isHeading = prevEmpty && nextEmpty && line.length < 120 && !line.endsWith(".");
                    if (isHeading) {
                      elements.push(<h2 key={i} style={{ fontFamily: F.h, fontSize: 22, color: C.navy, fontWeight: 500, margin: "36px 0 16px", lineHeight: 1.35 }}>{line}</h2>);
                    } else {
                      elements.push(<p key={i} style={{ marginBottom: 16 }}>{line}</p>);
                    }
                  }
                  return elements;
                })()}
              </div>

              {/* Closing CTA */}
              <div style={{ marginTop: 36, padding: "20px 22px", background: "rgba(184,149,106,0.06)", borderRadius: 10, borderLeft: `3px solid ${C.gold}` }}>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8 }}>
                  Pour en discuter, Nicolas Mildner, ostéopathe D.O. à Paris 7ᵉ, est joignable au <a href="tel:0142021118" style={{ color: C.navy, fontWeight: 600, textDecoration: "none" }}>01 42 02 11 18</a> — rendez-vous uniquement par téléphone.
                </p>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 6, fontStyle: "italic" }}>— Nicolas Mildner, ostéopathe D.O.</p>
              </div>

              {/* FAQ */}
              {articleData.faq && articleData.faq.length > 0 && (
                <div style={{ marginTop: 48 }}>
                  <h2 style={{ fontFamily: F.h, fontSize: 22, color: C.navy, fontWeight: 500, marginBottom: 20 }}>Questions fréquentes</h2>
                  {articleData.faq.map((item, i) => (
                    <details key={i} style={{ marginBottom: 10, background: C.sage, borderRadius: 10, border: "1px solid rgba(184,149,106,0.08)", overflow: "hidden" }}>
                      <summary style={{ padding: "16px 20px", cursor: "pointer", fontFamily: F.b, fontSize: 15, color: C.navy, fontWeight: 500, lineHeight: 1.4 }}>{item.q}</summary>
                      <p style={{ padding: "0 20px 16px", fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>{item.a}</p>
                    </details>
                  ))}
                </div>
              )}

              {/* Sources */}
              {articleData.sources && articleData.sources.length > 0 && (
                <div style={{ marginTop: 40, padding: "24px 22px", background: C.sage, borderRadius: 12, border: "1px solid rgba(184,149,106,0.06)" }}>
                  <h3 style={{ fontFamily: F.h, fontSize: 17, color: C.navy, fontWeight: 500, marginBottom: 14 }}>Sources vérifiées</h3>
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    {articleData.sources.map((s, i) => (
                      <li key={i} style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, marginBottom: 6 }}>
                        <a href={s.url} target="_blank" rel="noopener" style={{ color: C.navy, textDecoration: "none", borderBottom: "1px solid rgba(184,149,106,0.2)" }}>{s.text}</a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}

          {/* Author signature */}
          <div style={{
            marginTop: 48, padding: "24px 28px", background: C.sage,
            borderRadius: 12, display: "flex", gap: 20, alignItems: "center",
            border: "1px solid rgba(184,149,106,0.08)",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: C.navy,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#fff", fontFamily: F.h, fontWeight: 300, flexShrink: 0,
            }}>NM</div>
            <div>
              <p style={{ fontFamily: F.h, fontSize: 16, color: C.navy, fontWeight: 500 }}>Nicolas Mildner</p>
              <p style={{ fontSize: 11, color: C.gold, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>Ostéopathe D.O. · D.O.E. · D.O.F. — Paris 7ᵉ</p>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>22 ans de pratique clinique. Filiation Frymann · Paoletti · Caporossi · Wernham · Briend. Approche systémique et neurovégétative.</p>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>72 avenue de la Bourdonnais, 75007 Paris</p>
              <p style={{ fontSize: 13, color: C.navy, fontWeight: 500, marginTop: 6 }}>
                <a href="tel:0142021118" style={{ color: C.navy, textDecoration: "none" }}>01 42 02 11 18</a> · <a href="tel:0668801442" style={{ color: C.navy, textDecoration: "none" }}>06 68 80 14 42</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Blog listing ── */
  return (
    <div style={{ fontFamily: F.b, background: C.cream, minHeight: "100vh", padding: "40px 24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: C.gold, fontSize: 14,
          cursor: "pointer", fontFamily: F.b, marginBottom: 32, padding: 0,
        }}>← Retour au site</button>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: C.gold, marginBottom: 14, fontWeight: 500 }}>Recherche & Conseils</p>
          <h1 style={{ fontFamily: F.h, fontSize: 38, color: C.navy, fontWeight: 500 }}>Le blog du cabinet</h1>
          <p style={{ color: C.muted, marginTop: 12, fontSize: 15, maxWidth: 500, margin: "12px auto 0", lineHeight: 1.7 }}>
            Articles fondés sur la recherche PubMed. Vulgarisés, sourcés, rigoureux.
          </p>
        </div>

        {/* Tag filter */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
          {tags.map(t => (
            <button key={t} onClick={() => setFilterTag(t)} style={{
              padding: "6px 16px", borderRadius: 16,
              border: `1px solid ${filterTag === t ? C.gold : "rgba(184,149,106,0.2)"}`,
              background: filterTag === t ? C.gold : "transparent",
              color: filterTag === t ? "#fff" : C.navy,
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: F.b,
            }}>{t === "all" ? "Tous" : t}</button>
          ))}
        </div>

        {/* Articles grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map(p => (
            <article key={p.id} onClick={() => navigate(`/blog/${p.id}`)} style={{
              background: "#fff", borderRadius: 12, overflow: "hidden",
              border: "1px solid rgba(184,149,106,0.06)", cursor: "pointer",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,43,74,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ height: 140, background: `linear-gradient(135deg, #F4F1EC, #FAF7F2)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>{p.tag}</span>
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ background: "rgba(184,149,106,0.1)", color: C.navy, padding: "3px 9px", borderRadius: 8, fontSize: 10.5, fontWeight: 500 }}>{p.tag}</span>
                  <span style={{ fontSize: 10.5, color: C.muted }}>{p.readTime}</span>
                </div>
                <h3 style={{ fontFamily: F.h, fontSize: 16, color: C.navy, marginBottom: 8, fontWeight: 500, lineHeight: 1.35 }}>{p.title}</h3>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>{p.excerpt}</p>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
                  {new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: C.muted, fontSize: 14, marginTop: 40 }}>Aucun article dans cette catégorie pour le moment.</p>
        )}
      </div>
    </div>
  );
}
