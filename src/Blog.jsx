import { useState } from "react";
import posts from "./posts.json";

const F = { h:"'Playfair Display','Georgia',serif", b:"'DM Sans','Helvetica Neue',sans-serif" };
const C = { navy:"#1A2B4A", cream:"#FAF7F2", gold:"#B8956A", sage:"#F4F1EC", text:"#3A3A3A", muted:"#7A7A7A" };

export default function Blog({ onBack }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterTag, setFilterTag] = useState("all");

  const tags = ["all", ...new Set(posts.map(p => p.tag))];
  const filtered = filterTag === "all" ? posts : posts.filter(p => p.tag === filterTag);

  if (selectedPost) {
    const post = posts.find(p => p.id === selectedPost);
    return (
      <div style={{ fontFamily: F.b, background: C.cream, minHeight: "100vh", padding: "40px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <button onClick={() => setSelectedPost(null)} style={{
            background: "none", border: "none", color: C.gold, fontSize: 14,
            cursor: "pointer", fontFamily: F.b, marginBottom: 32, padding: 0,
          }}>← Retour aux articles</button>

          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>{post.tag} · {post.readTime}</p>
          <h1 style={{ fontFamily: F.h, fontSize: 36, color: C.navy, lineHeight: 1.3, marginBottom: 16 }}>{post.title}</h1>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>Publié le {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · Nicolas Mildner, Ostéopathe D.O.</p>

          <div style={{ fontSize: 16, lineHeight: 1.9, color: C.text }}>
            {post.content.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} style={{ marginBottom: 16 }}>{p}</p>
            ))}
          </div>

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
              <p style={{ fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>22 ans de pratique clinique. Filiation Frymann · Barral · Paoletti · Wernham. Approche systémique et neurovégétative.</p>
              <p style={{ fontSize: 13, color: C.navy, fontWeight: 500, marginTop: 6 }}>01 42 02 11 18</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F.b, background: C.cream, minHeight: "100vh", padding: "40px 24px" }}>
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
            <article key={p.id} onClick={() => setSelectedPost(p.id)} style={{
              background: "#fff", borderRadius: 12, overflow: "hidden",
              border: "1px solid rgba(184,149,106,0.06)", cursor: "pointer",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,43,74,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ height: 140, background: `linear-gradient(135deg, ${C.sage}, ${C.cream})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Image</span>
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
