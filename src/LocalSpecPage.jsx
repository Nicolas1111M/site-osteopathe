import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import localPagesData from "./local-pages-data.json";
import postsIndex from "./posts-index.json";

// ═══════════════════════════════════════════════════
// PAGE LOCALE DE CONVERSION — Composant data-driven
// Chaque spécialité a sa page locale SEO
// ═══════════════════════════════════════════════════

const PHONE = "01 42 02 11 18";
const MOBILE = "06 68 80 14 42";
const ADDR = "72 avenue de la Bourdonnais, 75007 Paris";
const REVIEW = "https://search.google.com/local/writereview?placeid=ChIJ8SKn3CBw5kcRAxZkc56Vsuw";
const domain = "https://www.nicolas-mildner-osteopathe.fr";

const F = { h:"'Playfair Display','Georgia',serif", b:"'DM Sans','Helvetica Neue',sans-serif" };
const C = { navy:"#1A2B4A", cream:"#FAF7F2", gold:"#B8956A", sage:"#F4F1EC", warm:"#EDE8E0", text:"#3A3A3A", muted:"#7A7A7A", dark:"#111926" };

function useM(){const[m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return m;}
function useR(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){setV(true);o.disconnect();}},{threshold:0.07});o.observe(e);return()=>o.disconnect();},[]);return[r,v];}
function S({children,bg}){const[r,v]=useR();const m=typeof window!=="undefined"&&window.innerWidth<768;return<section ref={r} style={{background:bg||"transparent",padding:m?"48px 16px":"84px 24px",opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:"opacity 0.75s,transform 0.75s"}}><div style={{maxWidth:1100,margin:"0 auto"}}>{children}</div></section>;}
function Btn({href,children,v:vr="primary",style:s={}}){const[h,setH]=useState(false);const b=vr==="primary"?{background:h?C.gold:C.navy,color:"#fff",border:"none",boxShadow:h?"0 6px 20px rgba(184,149,106,0.2)":"0 3px 12px rgba(26,43,74,0.1)"}:{background:"transparent",color:h?C.gold:C.navy,border:`1.5px solid ${h?C.gold:C.navy}`};return<a href={href} target={href?.startsWith("http")?"_blank":undefined} rel="noopener" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-block",padding:"14px 30px",borderRadius:8,fontSize:14,textDecoration:"none",fontWeight:500,transition:"all 0.3s",transform:h?"translateY(-2px)":"none",...b,...s}}>{children}</a>;}

function useDocumentMeta(page) {
  useEffect(() => {
    if (!page) return;
    document.title = page.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", page.metaDescription);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `${domain}/${page.slug}`);
    return () => {
      document.title = "Nicolas Mildner — Ostéopathe D.O. Paris 7\u1d49 | La Loi du Cas Unique";
      if (metaDesc) metaDesc.setAttribute("content", "Nicolas Mildner, ostéopathe D.O./D.O.E./D.O.F. à Paris 7\u1d49. 22 ans d\u2019expérience, 18 spécialisations. Approche systémique et neurovégétative. Tél. 01 42 02 11 18 · 06 68 80 14 42.");
      if (canonical) canonical.setAttribute("href", domain);
    };
  }, [page]);
}

export default function LocalSpecPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/|\/$/g, "");
  const mob = useM();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);

  const page = localPagesData.find(p => p.slug === slug);
  useDocumentMeta(page);

  if (!page) {
    return (
      <div style={{fontFamily:F.b,background:C.cream,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
        <p style={{fontFamily:F.h,fontSize:24,color:C.navy}}>Page non trouvée</p>
        <Link to="/" style={{color:C.gold,fontSize:14,textDecoration:"none"}}>← Retour à l'accueil</Link>
      </div>
    );
  }

  const relatedPosts = page.relatedBlogSlugs
    .map(s => postsIndex.find(p => p.id === s))
    .filter(Boolean);

  return (
    <div style={{fontFamily:F.b,color:C.text,background:C.cream,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      {/* JSON-LD FAQPage */}
      {page.faq && page.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
          "@context":"https://schema.org",
          "@type":"FAQPage",
          "mainEntity": page.faq.map(f => ({
            "@type":"Question","name":f.q,
            "acceptedAnswer":{"@type":"Answer","text":f.a}
          }))
        })}} />
      )}

      {/* ═══ NAV ═══ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(250,247,242,0.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(184,149,106,0.08)",padding:"10px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Link to="/" style={{textDecoration:"none",display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontFamily:F.h,fontSize:mob?15:18,color:C.navy,fontWeight:600}}>Nicolas Mildner</span>
            {!mob&&<span style={{fontSize:9,color:C.gold,letterSpacing:2.5,fontWeight:500}}>D.O. · D.O.E. · D.O.F.</span>}
          </Link>
          <div style={{display:"flex",gap:mob?10:22,alignItems:"center"}}>
            <Link to="/" style={{textDecoration:"none",color:C.navy,fontSize:mob?11:12.5}}>Accueil</Link>
            <Link to="/osteopathe-paris-7" style={{textDecoration:"none",color:C.navy,fontSize:mob?11:12.5}}>Paris 7ᵉ</Link>
            <Link to="/blog" style={{textDecoration:"none",color:C.navy,fontSize:mob?11:12.5}}>Blog</Link>
            <Btn href={`tel:${PHONE.replace(/\s/g,"")}`} style={{padding:"9px 18px",fontSize:12.5}}>Appeler</Btn>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{background:`linear-gradient(155deg,${C.cream} 0%,${C.warm} 40%,#E2DCD2 100%)`,padding:mob?"100px 20px 48px":"120px 32px 72px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"inline-block",background:"rgba(26,43,74,0.06)",borderRadius:20,padding:"6px 16px",marginBottom:20}}>
            <span style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:C.navy,fontWeight:500}}>{page.heroTag}</span>
          </div>
          <h1 style={{fontFamily:F.h,fontSize:mob?26:40,fontWeight:500,color:C.navy,lineHeight:1.2,marginBottom:12}}>{page.h1}</h1>
          <p style={{fontSize:mob?14:17,lineHeight:1.8,color:"#555",marginBottom:28,maxWidth:700}}>{page.subtitle}</p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12}}>
            <Btn href={`tel:${PHONE.replace(/\s/g,"")}`}>{PHONE} — Prendre rendez-vous</Btn>
            <Btn href={`tel:${MOBILE.replace(/\s/g,"")}`} v="outline">{MOBILE} — Appel ou SMS</Btn>
          </div>
          <p style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>Pas de Doctolib — par choix. Rendez-vous par téléphone ou SMS.</p>
        </div>
      </section>

      {/* ═══ ALERTE MÉDICALE (si présente) ═══ */}
      {page.alert && (
        <section style={{background:"#FFF8F6",borderBottom:"3px solid #C0392B",padding:mob?"32px 16px":"48px 24px"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:20}}>
              <span style={{fontSize:28,flexShrink:0}}>⚠️</span>
              <div>
                <h2 style={{fontFamily:F.h,fontSize:mob?18:22,color:"#922",fontWeight:600,marginBottom:10,lineHeight:1.3}}>{page.alert.title}</h2>
                <p style={{fontSize:15,lineHeight:1.85,color:C.text,marginBottom:16}}>{page.alert.text}</p>
                <div style={{background:"#FCEDEC",borderLeft:"4px solid #C0392B",borderRadius:8,padding:"16px 20px",marginBottom:20}}>
                  <p style={{fontSize:14,color:"#7a2018",lineHeight:1.75,marginBottom:12,fontWeight:500}}>{page.alert.redflags}</p>
                  <div style={{display:"flex",gap:mob?12:24,flexWrap:"wrap"}}>
                    {page.alert.numbers.map(n=>(
                      <a key={n.number} href={`tel:${n.number}`} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:10,padding:"12px 18px",border:"1px solid rgba(192,57,43,0.15)",textDecoration:"none",transition:"all 0.2s",minWidth:mob?140:160}}
                        onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(192,57,43,0.1)";}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
                        <div>
                          <div style={{fontFamily:F.h,fontSize:24,fontWeight:700,color:"#C0392B",lineHeight:1}}>{n.number}</div>
                          <div style={{fontSize:11,color:"#922",fontWeight:600,marginTop:2}}>{n.label}</div>
                          <div style={{fontSize:10,color:C.muted}}>{n.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONTENU PRINCIPAL ═══ */}
      <S bg={C.cream}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          {page.introParagraphs.map((p,i)=>(
            <p key={i} style={{fontSize:16,lineHeight:1.9,color:C.text,marginBottom:20}}>{p}</p>
          ))}
        </div>
      </S>

      {/* ═══ EXPERTISES ═══ */}
      <S bg={C.sage}>
        <div style={{textAlign:"center",marginBottom:mob?32:48}}>
          <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>{page.expertiseLabel||"Prise en charge"}</p>
          <h2 style={{fontFamily:F.h,fontSize:mob?22:30,color:C.navy,fontWeight:500}}>{page.expertiseTitle||"Ce que je prends en charge"}</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2,1fr)",gap:20}}>
          {page.expertise.map(e=>(
            <div key={e.title} style={{background:"#fff",borderRadius:12,padding:"24px 22px",border:"1px solid rgba(184,149,106,0.06)"}}>
              <h3 style={{fontFamily:F.h,fontSize:16,color:C.navy,fontWeight:500,marginBottom:8}}>{e.title}</h3>
              <p style={{fontSize:13.5,lineHeight:1.8,color:C.muted}}>{e.text}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:28}}>
          <Link to="/osteopathe-paris-7" style={{color:C.gold,fontSize:13,textDecoration:"none",borderBottom:`1px solid ${C.gold}`,paddingBottom:2}}>
            Voir toutes les spécialisations — Ostéopathe Paris 7ᵉ →
          </Link>
        </div>
      </S>

      {/* ═══ PRATICIEN ENCART ═══ */}
      <section style={{background:C.navy,padding:mob?"36px 16px":"56px 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"grid",gridTemplateColumns:mob?"1fr":"auto 1fr",gap:24,alignItems:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(184,149,106,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#fff",fontFamily:F.h,fontWeight:300,flexShrink:0,margin:mob?"0 auto":"0"}}>NM</div>
          <div style={{textAlign:mob?"center":"left"}}>
            <p style={{fontFamily:F.h,fontSize:18,color:"#fff",fontWeight:500}}>Nicolas Mildner</p>
            <p style={{fontSize:11,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",marginTop:2}}>Ostéopathe D.O. · D.O.E. · D.O.F. — Paris 7ᵉ</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:8,lineHeight:1.7}}>
              22 ans de pratique clinique. D.O. n°379, Collégiale Académique de France. Filiation directe : Frymann · Paoletti · Caporossi · Wernham · Briend. 17 ans d'enseignement à l'ESO Paris.
            </p>
            <div style={{marginTop:12}}>
              <Link to="/#parcours" style={{color:C.gold,fontSize:12,textDecoration:"none",borderBottom:`1px solid rgba(184,149,106,0.3)`,paddingBottom:2}}>Mon parcours complet →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      {page.faq && page.faq.length > 0 && (
        <S bg={C.cream}>
          <div style={{textAlign:"center",marginBottom:mob?32:48}}>
            <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>Questions fréquentes</p>
            <h2 style={{fontFamily:F.h,fontSize:mob?22:30,color:C.navy,fontWeight:500}}>Vos questions</h2>
          </div>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            {page.faq.map((f,i)=>(
              <div key={i} style={{background:C.sage,borderRadius:10,border:"1px solid rgba(184,149,106,0.08)",marginBottom:10,overflow:"hidden"}}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",padding:"16px 20px",cursor:"pointer",fontFamily:F.b,fontSize:15,color:C.navy,fontWeight:500,lineHeight:1.4,background:"none",border:"none",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{f.q}</span>
                  <span style={{fontSize:18,color:C.gold,flexShrink:0,marginLeft:12}}>{openFaq===i?"−":"+"}</span>
                </button>
                {openFaq===i&&<p style={{padding:"0 20px 16px",fontSize:14,color:C.muted,lineHeight:1.8,margin:0}}>{f.a}</p>}
              </div>
            ))}
          </div>
        </S>
      )}

      {/* ═══ ARTICLES LIÉS ═══ */}
      {relatedPosts.length > 0 && (
        <S bg={C.sage}>
          <div style={{textAlign:"center",marginBottom:mob?28:40}}>
            <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>Pour aller plus loin</p>
            <h2 style={{fontFamily:F.h,fontSize:mob?22:28,color:C.navy,fontWeight:500}}>Articles liés</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18}}>
            {relatedPosts.map(p=>(
              <Link key={p.id} to={`/blog/${p.id}`} style={{textDecoration:"none",color:"inherit"}}>
                <article style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid rgba(184,149,106,0.05)",transition:"all 0.3s",height:"100%"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(26,43,74,0.04)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{height:100,background:`linear-gradient(135deg,${C.cream},${C.warm})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>{p.tag}</span>
                  </div>
                  <div style={{padding:"18px 20px"}}>
                    <h3 style={{fontFamily:F.h,fontSize:15,color:C.navy,marginBottom:6,fontWeight:500,lineHeight:1.35}}>{p.title}</h3>
                    <p style={{fontSize:12,color:C.muted,lineHeight:1.7}}>{p.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </S>
      )}

      {/* ═══ MOTS-CLÉS ═══ */}
      <section style={{background:C.cream,padding:"24px 16px",textAlign:"center"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:700,margin:"0 auto"}}>
          {page.keywords.map(k=>(
            <span key={k} style={{background:"rgba(184,149,106,0.08)",color:C.muted,padding:"4px 12px",borderRadius:16,fontSize:11}}>{k}</span>
          ))}
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section style={{background:`linear-gradient(135deg,${C.navy},#243B5C)`,padding:mob?"48px 20px":"72px 24px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <h2 style={{fontFamily:F.h,fontSize:mob?22:30,color:"#fff",fontWeight:500,marginBottom:16,lineHeight:1.3}}>
            Prendre rendez-vous
          </h2>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.5)",lineHeight:1.8,marginBottom:28}}>
            Nicolas Mildner, ostéopathe D.O. à Paris 7ᵉ — 72 avenue de la Bourdonnais.
            Appelez ou envoyez un SMS.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",marginBottom:12}}>
            <Btn href={`tel:${PHONE.replace(/\s/g,"")}`} style={{background:C.gold}}>{PHONE} — Cabinet</Btn>
            <Btn href={`tel:${MOBILE.replace(/\s/g,"")}`} v="outline" style={{color:"#fff",borderColor:"rgba(255,255,255,0.3)"}}>{MOBILE} — Mobile</Btn>
          </div>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:6}}>{ADDR}</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{background:C.dark,padding:mob?"32px 20px 20px":"40px 32px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          <div>
            <Link to="/" style={{textDecoration:"none"}}>
              <span style={{fontFamily:F.h,fontSize:16,color:"#fff",fontWeight:500}}>Nicolas Mildner</span>
              <span style={{fontSize:9,color:C.gold,marginLeft:8,letterSpacing:2}}>D.O. · D.O.E. · D.O.F.</span>
            </Link>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:8,lineHeight:1.6}}>{ADDR}<br/>Tél. {PHONE} · Mobile {MOBILE}</p>
          </div>
          <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
            <div>
              <p style={{fontSize:9,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Navigation</p>
              <Link to="/" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Accueil</Link>
              <Link to="/osteopathe-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Ostéopathe Paris 7</Link>
              <Link to="/urgence-osteopathe-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Urgence ostéopathe</Link>
              <Link to="/blog" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Blog</Link>
            </div>
            <div>
              <p style={{fontSize:9,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Spécialisations</p>
              <Link to="/douleurs-dos-lombalgie-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Lombalgie et mal de dos</Link>
              <Link to="/cervicalgie-torticolis-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Cervicalgie et torticolis</Link>
              <Link to="/nourrisson-plagiocephalie-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Nourrissons</Link>
              <Link to="/femme-enceinte-osteopathe-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Grossesse</Link>
              <Link to="/bruxisme-atm-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Bruxisme et ATM</Link>
              <Link to="/osteopathe-sans-craquement-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Ostéopathe sans craquement</Link>
            </div>
            <div>
              <p style={{fontSize:9,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Contact</p>
              <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Appeler</a>
              <a href={`tel:${MOBILE.replace(/\s/g,"")}`} style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>SMS / Mobile</a>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:"24px auto 0",borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:14,textAlign:"center"}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>© 2026 Nicolas Mildner — Ostéopathe D.O. — Paris 7ᵉ — La Loi du Cas Unique</p>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.08)",marginTop:6}}>Annuaire ostéopathes : <a href="https://www.proxiosteo.fr" target="_blank" rel="noopener" style={{color:"rgba(255,255,255,0.08)",textDecoration:"none"}}>proxiosteo.fr</a></p>
        </div>
      </footer>

      <style>{`*{scroll-behavior:smooth}::selection{background:rgba(184,149,106,0.3)}@media print{body{display:none}}`}</style>
    </div>
  );
}
