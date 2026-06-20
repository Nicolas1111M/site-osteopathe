import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import posts from "./posts-index.json";

// ═══════════════════════════════════════════════════
// PAGE LOCALE SEO — OSTÉOPATHE PARIS 7
// Cible : ostéopathe 75007, ostéopathe Paris 7, etc.
// ═══════════════════════════════════════════════════

const PHONE = "01 42 02 11 18";
const MOBILE = "06 68 80 14 42";
const ADDR = "72 avenue de la Bourdonnais, 75007 Paris";
const REVIEW = "https://search.google.com/local/writereview?placeid=ChIJ8SKn3CBw5kcRAxZkc56Vsuw";

const F = { h:"'Playfair Display','Georgia',serif", b:"'DM Sans','Helvetica Neue',sans-serif" };
const C = { navy:"#1A2B4A", cream:"#FAF7F2", gold:"#B8956A", sage:"#F4F1EC", warm:"#EDE8E0", text:"#3A3A3A", muted:"#7A7A7A", dark:"#111926" };

function useM(){const[m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return m;}
function useR(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){setV(true);o.disconnect();}},{threshold:0.07});o.observe(e);return()=>o.disconnect();},[]);return[r,v];}
function S({children,bg,id}){const[r,v]=useR();const m=typeof window!=="undefined"&&window.innerWidth<768;return<section ref={r} id={id} style={{background:bg||"transparent",padding:m?"48px 16px":"84px 24px",opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:"opacity 0.75s,transform 0.75s"}}><div style={{maxWidth:1100,margin:"0 auto"}}>{children}</div></section>;}
function Btn({href,children,v:vr="primary",style:s={},onClick,...rest}){const[h,setH]=useState(false);const b=vr==="primary"?{background:h?C.gold:C.navy,color:"#fff",border:"none",boxShadow:h?"0 6px 20px rgba(184,149,106,0.2)":"0 3px 12px rgba(26,43,74,0.1)"}:{background:"transparent",color:h?C.gold:C.navy,border:`1.5px solid ${h?C.gold:C.navy}`};return<a href={href} target={href?.startsWith("http")?"_blank":undefined} rel="noopener" onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-block",padding:"14px 30px",borderRadius:8,fontSize:14,textDecoration:"none",fontWeight:500,transition:"all 0.3s",transform:h?"translateY(-2px)":"none",...b,...s}} {...rest}>{children}</a>;}

/* ── SEO meta ── */
function useDocumentMeta() {
  useEffect(() => {
    document.title = "Ostéopathe Paris 7ᵉ — Nicolas Mildner D.O. | 72 av. de la Bourdonnais, 75007";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content",
      "Ostéopathe à Paris 7ᵉ (75007). Nicolas Mildner, D.O. n°379, 22 ans d'expérience. Cabinet au 72 avenue de la Bourdonnais, métro École Militaire. 18 spécialisations. Tél. 01 42 02 11 18."
    );
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://www.nicolas-mildner-osteopathe.fr/osteopathe-paris-7");
    return () => {
      document.title = "Nicolas Mildner — Ostéopathe D.O. Paris 7\u1d49 | La Loi du Cas Unique";
      if (metaDesc) metaDesc.setAttribute("content", "Nicolas Mildner, ostéopathe D.O./D.O.E./D.O.F. à Paris 7\u1d49. 22 ans d\u2019expérience, 18 spécialisations. Approche systémique et neurovégétative. Tél. 01 42 02 11 18 · 06 68 80 14 42.");
      if (canonical) canonical.setAttribute("href", "https://www.nicolas-mildner-osteopathe.fr");
    };
  }, []);
}

const relatedPosts = posts.sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);

const motifs = [
  { icon:"🦴", t:"Mal de dos, lombalgie, sciatique", d:"Prise en charge systémique des douleurs vertébrales aiguës et chroniques. Approche fondée sur la recherche (Cochrane, Lancet).", link:"/douleurs-dos-lombalgie-paris-7" },
  { icon:"🔵", t:"Cervicalgie et torticolis", d:"Douleurs cervicales, céphalées cervicogènes, raideur de nuque. Approche crânio-sacrée et fasciale douce.", link:"/cervicalgie-torticolis-paris-7" },
  { icon:"🧠", t:"Bruxisme, migraines, ATM", d:"Troubles de l'articulation temporo-mandibulaire, bruxisme, céphalées, vertiges. Approche crânio-sacrée et neurovégétative.", link:"/bruxisme-atm-paris-7" },
  { icon:"🤰", t:"Grossesse et périnatalité", d:"Suivi périnatal complet, douleurs de grossesse, préparation à l'accouchement, post-partum, fertilité.", link:"/femme-enceinte-osteopathe-paris-7" },
  { icon:"👶", t:"Nourrissons", d:"Plagiocéphalie, coliques, torticolis congénital, reflux. CES Ostéopathie Pédiatrique. Filiation Viola Frymann.", link:"/nourrisson-plagiocephalie-paris-7" },
  { icon:"🤲", t:"Techniques douces — sans craquement", d:"Ostéopathie douce exclusivement — un choix clinique informé, pas une limite technique. Ancien enseignant en manipulations vertébrales. Fondé sur l'anatomie et la neurophysiologie.", link:"/osteopathe-sans-craquement-paris-7" },
  { icon:"😰", t:"Stress, burn-out, somatisations", d:"Rééquilibrage du système nerveux autonome. Troubles du sommeil, anxiété, douleurs sans cause apparente." },
  { icon:"🏃", t:"Sport et récupération", d:"Entretien du sportif, prévention des blessures, optimisation biomécanique. Yoga, arts martiaux, Pilates." },
  { icon:"🎵", t:"Musiciens et chanteurs", d:"Instrumentistes, chanteurs lyriques, troubles de la voix. Ancien élève de conservatoire — compréhension directe." },
];

export default function OsteopatheParis7() {
  const mob = useM();
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  useDocumentMeta();

  return (
    <div style={{fontFamily:F.b,color:C.text,background:C.cream,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      {/* ── LocalBusiness JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
        "@context":"https://schema.org",
        "@type":"MedicalBusiness",
        "name":"Nicolas Mildner — Ostéopathe D.O. Paris 7ᵉ",
        "description":"Cabinet d'ostéopathie à Paris 7ᵉ (75007). Nicolas Mildner, D.O. n°379, 22 ans d'expérience clinique, 17 ans d'enseignement. 18 spécialisations. Approche systémique et neurovégétative.",
        "url":"https://www.nicolas-mildner-osteopathe.fr/osteopathe-paris-7",
        "telephone":"+33142021118",
        "address":{"@type":"PostalAddress","streetAddress":"72 avenue de la Bourdonnais","addressLocality":"Paris","postalCode":"75007","addressRegion":"Île-de-France","addressCountry":"FR"},
        "geo":{"@type":"GeoCoordinates","latitude":48.8563,"longitude":2.3025},
        "contactPoint":{"@type":"ContactPoint","telephone":"+33668801442","contactType":"reservations"},
        "openingHours":["Mo 09:00-21:00","Tu 09:00-21:00","We 12:00-21:00","Th 09:00-21:00","Fr 09:00-21:00"],
        "priceRange":"80-90€",
        "aggregateRating":{"@type":"AggregateRating","ratingValue":"5.0","reviewCount":"20","bestRating":"5"},
        "areaServed":[
          {"@type":"City","name":"Paris"},
          {"@type":"AdministrativeArea","name":"Paris 7ᵉ arrondissement"},
          {"@type":"AdministrativeArea","name":"75007"}
        ],
        "founder":{"@type":"Person","name":"Nicolas Mildner","jobTitle":"Ostéopathe D.O., D.O.E., D.O.F.","alumniOf":"École Supérieure d'Ostéopathie de Paris"}
      })}} />

      {/* ═══ NAV ═══ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(250,247,242,0.97)":"rgba(250,247,242,0.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(184,149,106,0.08)",transition:"all 0.4s",padding:"10px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Link to="/" style={{textDecoration:"none",display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontFamily:F.h,fontSize:mob?15:18,color:C.navy,fontWeight:600}}>Nicolas Mildner</span>
            {!mob&&<span style={{fontSize:9,color:C.gold,letterSpacing:2.5,fontWeight:500}}>D.O. · D.O.E. · D.O.F.</span>}
          </Link>
          <div style={{display:"flex",gap:mob?10:22,alignItems:"center"}}>
            <Link to="/" style={{textDecoration:"none",color:C.navy,fontSize:mob?11:12.5,fontWeight:400}}>Accueil</Link>
            <Link to="/blog" style={{textDecoration:"none",color:C.navy,fontSize:mob?11:12.5,fontWeight:400}}>Blog</Link>
            <Btn href={`tel:${PHONE.replace(/\s/g,"")}`} style={{padding:"9px 18px",fontSize:12.5}}>Appeler</Btn>
          </div>
        </div>
      </nav>

      {/* ═══ HERO LOCAL ═══ */}
      <section style={{background:`linear-gradient(155deg,${C.cream} 0%,${C.warm} 40%,#E2DCD2 100%)`,padding:mob?"100px 20px 48px":"120px 32px 72px",position:"relative",overflow:"hidden"}}>
        {!mob&&<div style={{position:"absolute",top:"8%",right:"-6%",width:550,height:550,borderRadius:"50%",border:"1px solid rgba(212,197,169,0.12)"}}/>}
        <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{display:"inline-block",background:"rgba(26,43,74,0.06)",borderRadius:20,padding:"6px 16px",marginBottom:20}}>
            <span style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:C.navy,fontWeight:500}}>
              Ostéopathe Paris 7ᵉ · 75007
            </span>
          </div>
          <h1 style={{fontFamily:F.h,fontSize:mob?28:44,fontWeight:500,color:C.navy,lineHeight:1.2,marginBottom:12}}>
            Votre ostéopathe à Paris&nbsp;7<sup>e</sup>
            <br/><span style={{color:C.gold,fontSize:mob?22:34}}>72 avenue de la Bourdonnais</span>
          </h1>
          <p style={{fontSize:mob?15:18,lineHeight:1.85,color:"#555",marginBottom:28,maxWidth:700}}>
            Nicolas Mildner, ostéopathe D.O. n°379, exerce au cœur du 7ᵉ arrondissement depuis 2004.
            22 ans de pratique clinique, 17 ans d'enseignement, 18 spécialisations.
            Cabinet à deux pas de l'École Militaire, du Champ-de-Mars et des Invalides.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:16}}>
            <Btn href={`tel:${PHONE.replace(/\s/g,"")}`}>{PHONE} — Prendre rendez-vous</Btn>
            <Btn href={`tel:${MOBILE.replace(/\s/g,"")}`} v="outline">{MOBILE} — Appel ou SMS</Btn>
          </div>
          <p style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>
            Pas de Doctolib — par choix. Rendez-vous par téléphone ou SMS uniquement.
          </p>
        </div>
      </section>

      {/* ═══ INFOS PRATIQUES ═══ */}
      <S bg={C.sage}>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:22}}>
          {[
            {icon:"📍",t:"Localisation",lines:[ADDR,"Métro École Militaire (ligne 8)","La Tour-Maubourg (ligne 8)","Quartier Gros-Caillou"]},
            {icon:"🕘",t:"Horaires",lines:["Lundi, Mardi, Jeudi, Vendredi : 9h – 21h","Mercredi : 12h – 21h","Sur rendez-vous uniquement"]},
            {icon:"💶",t:"Consultation",lines:["80 – 90 € · 45 min à 1 h","Chèque ou espèces","Remboursement mutuelle selon contrat","Pas de tiers payant"]},
          ].map(card=>(
            <div key={card.t} style={{background:"#fff",borderRadius:14,padding:"28px 24px",border:"1px solid rgba(184,149,106,0.06)"}}>
              <div style={{fontSize:26,marginBottom:10}}>{card.icon}</div>
              <h2 style={{fontFamily:F.h,fontSize:18,color:C.navy,marginBottom:12,fontWeight:500}}>{card.t}</h2>
              {card.lines.map((l,i)=><p key={i} style={{fontSize:13.5,color:C.text,lineHeight:1.8,marginBottom:2}}>{l}</p>)}
            </div>
          ))}
        </div>
      </S>

      {/* ═══ POURQUOI CONSULTER ═══ */}
      <S bg={C.cream}>
        <div style={{textAlign:"center",marginBottom:mob?32:48}}>
          <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>Motifs de consultation</p>
          <h2 style={{fontFamily:F.h,fontSize:mob?24:34,color:C.navy,fontWeight:500,lineHeight:1.3}}>
            Pourquoi consulter un ostéopathe à Paris 7<sup>e</sup> ?
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:18}}>
          {motifs.map(m=>{
            const card = (
              <div style={{background:C.sage,borderRadius:12,padding:"24px 22px",border:"1px solid rgba(184,149,106,0.04)",transition:"all 0.3s",height:"100%"}}
                onMouseEnter={m.link?e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(26,43,74,0.04)";}:undefined}
                onMouseLeave={m.link?e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}:undefined}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:22}}>{m.icon}</span>
                  <h3 style={{fontFamily:F.h,fontSize:15,color:C.navy,fontWeight:500,lineHeight:1.3}}>{m.t}</h3>
                </div>
                <p style={{fontSize:13,lineHeight:1.8,color:C.muted}}>{m.d}</p>
                {m.link&&<p style={{fontSize:12,color:C.gold,marginTop:10,fontWeight:500}}>En savoir plus →</p>}
              </div>
            );
            return m.link
              ? <Link key={m.t} to={m.link} style={{textDecoration:"none",color:"inherit"}}>{card}</Link>
              : <div key={m.t}>{card}</div>;
          })}
        </div>
        <div style={{textAlign:"center",marginTop:32}}>
          <Link to="/#specs" style={{color:C.gold,fontSize:14,fontWeight:500,textDecoration:"none",borderBottom:`1px solid ${C.gold}`,paddingBottom:2}}>
            Voir les 18 spécialisations →
          </Link>
        </div>
      </S>

      {/* ═══ URGENCE CTA ═══ */}
      <section style={{background:"#FFF8F6",padding:mob?"28px 16px":"36px 24px",borderTop:"3px solid #C0392B",borderBottom:"1px solid rgba(192,57,43,0.1)"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:mob?"flex-start":"center",gap:mob?14:24,flexDirection:mob?"column":"row"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <span style={{fontSize:28}}>🚨</span>
            <div>
              <p style={{fontFamily:F.h,fontSize:mob?16:18,color:"#922",fontWeight:600}}>Douleur aiguë ?</p>
              <p style={{fontSize:12,color:C.muted}}>Dos bloqué, lumbago, torticolis</p>
            </div>
          </div>
          <p style={{fontSize:13.5,color:C.text,lineHeight:1.7,flex:1}}>
            Consultation rapide sur rendez-vous téléphonique. Disponibilité souvent dans la journée.
          </p>
          <Link to="/urgence-osteopathe-paris-7" style={{display:"inline-block",background:"#C0392B",color:"#fff",padding:"12px 22px",borderRadius:8,fontSize:13,fontWeight:500,textDecoration:"none",flexShrink:0,textAlign:"center",transition:"all 0.3s"}}>
            Urgence ostéopathe →
          </Link>
        </div>
      </section>

      {/* ═══ QUI SUIS-JE ═══ */}
      <section style={{background:`linear-gradient(135deg,#1C2E48,${C.navy})`,padding:mob?"48px 16px":"72px 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:mob?32:48}}>
            <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>Votre praticien</p>
            <h2 style={{fontFamily:F.h,fontSize:mob?24:34,color:"#fff",fontWeight:500,lineHeight:1.3}}>Nicolas Mildner, ostéopathe D.O.</h2>
            <p style={{color:"rgba(255,255,255,0.5)",marginTop:14,fontSize:mob?13:15,maxWidth:580,margin:"14px auto 0",lineHeight:1.75}}>
              22 ans de pratique clinique au service de vos patients du 7ᵉ arrondissement.
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:28}}>
            <div>
              <p style={{fontSize:15,lineHeight:1.9,color:"rgba(255,255,255,0.65)",marginBottom:16}}>
                Diplômé D.O. en 2004 par la Collégiale Académique de France (n°379), j'ai validé mon diplôme européen devant la Faculté de Médecine de Genève. J'appartiens à la génération charnière — celle qui a reçu un diplôme dans la période de structuration historique de la profession, avant les décrets de 2007.
              </p>
              <p style={{fontSize:15,lineHeight:1.9,color:"rgba(255,255,255,0.65)",marginBottom:16}}>
                Enseignant pendant 17 ans à l'École Supérieure d'Ostéopathie de Paris (campus Descartes), j'ai formé de nombreux ostéopathes aujourd'hui en exercice. Ma filiation est directe : Viola Frymann, Wernham, Paoletti, Caporossi, Briend.
              </p>
              <p style={{fontSize:15,lineHeight:1.9,color:"rgba(255,255,255,0.65)"}}>
                Mon approche est systémique et neurovégétative — fondée sur la neurophysiologie, jamais sur les thérapies énergétiques. L'ostéopathie telle que je la pratique est une technique réflexe : je dialogue avec votre système nerveux pour restaurer les conditions de votre vitalité.
              </p>
            </div>
            <div>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,padding:"28px 24px",border:"1px solid rgba(184,149,106,0.06)"}}>
                {[
                  {l:"D.O. n°00379",d:"Collégiale Académique de France — 2004"},
                  {l:"D.O.E. — Faculté de Médecine de Genève",d:"European Council of Osteopathic Schools"},
                  {l:"17 ans d'enseignement — ESO Paris",d:"5 matières · Commissions recherche et pédagogie"},
                  {l:"18 spécialisations",d:"Du nourrisson au chanteur lyrique"},
                  {l:"Note Google : 5.0/5",d:"Bouche-à-oreille depuis 2004"},
                  {l:"Pas de Doctolib",d:"Par choix — relation directe avec chaque patient"},
                ].map((c,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:i<5?14:0,paddingBottom:i<5?14:0,borderBottom:i<5?"1px solid rgba(184,149,106,0.06)":"none"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,marginTop:6,flexShrink:0}}/>
                    <div>
                      <p style={{fontSize:13,color:"#fff",fontWeight:600}}>{c.l}</p>
                      <p style={{fontSize:11.5,color:"rgba(255,255,255,0.4)"}}>{c.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center",marginTop:20}}>
                <Link to="/#parcours" style={{color:C.gold,fontSize:13,textDecoration:"none",borderBottom:`1px solid ${C.gold}`,paddingBottom:2}}>
                  Découvrir mon parcours complet →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUARTIER ═══ */}
      <S bg={C.cream}>
        <div style={{textAlign:"center",marginBottom:mob?32:48}}>
          <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>Votre quartier</p>
          <h2 style={{fontFamily:F.h,fontSize:mob?24:34,color:C.navy,fontWeight:500,lineHeight:1.3}}>
            Un cabinet au cœur du 7<sup>e</sup> arrondissement
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?24:48,alignItems:"center"}}>
          <div>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:16}}>
              Le cabinet est situé au 72 avenue de la Bourdonnais, dans le quartier du Gros-Caillou, à quelques minutes à pied de l'École Militaire, du Champ-de-Mars et de la Tour Eiffel.
            </p>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:16}}>
              Facilement accessible en métro (ligne 8, stations École Militaire et La Tour-Maubourg), le cabinet accueille les habitants du 7ᵉ arrondissement ainsi que les patients venant de tout Paris, de province et de l'étranger.
            </p>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:24}}>
              Consultations à domicile possibles pour les patients à mobilité réduite (Paris 7ᵉ et arrondissements limitrophes).
            </p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["Gros-Caillou","École Militaire","Champ-de-Mars","Invalides","La Tour-Maubourg","Tour Eiffel","Rue Cler","Avenue Bosquet"].map(q=>(
                <span key={q} style={{background:"rgba(184,149,106,0.1)",color:C.navy,padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:500}}>{q}</span>
              ))}
            </div>
          </div>
          <div style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(184,149,106,0.08)",minHeight:mob?280:380}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.3!2d2.3003!3d48.8563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6702025a72291%3A0xecb595739e641603!2s72%20Av.%20de%20la%20Bourdonnais%2C%2075007%20Paris!5e0!3m2!1sfr!2sfr!4v1717700000000"
              width="100%" height="100%" style={{border:0,minHeight:mob?280:380}}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Cabinet Nicolas Mildner — Ostéopathe Paris 7ᵉ — 72 avenue de la Bourdonnais"
            />
          </div>
        </div>
      </S>

      {/* ═══ ARTICLES LIÉS ═══ */}
      <S bg={C.sage}>
        <div style={{textAlign:"center",marginBottom:mob?32:48}}>
          <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>Recherche & Conseils</p>
          <h2 style={{fontFamily:F.h,fontSize:mob?24:34,color:C.navy,fontWeight:500,lineHeight:1.3}}>Articles de votre ostéopathe à Paris 7<sup>e</sup></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:18}}>
          {relatedPosts.map(p=>(
            <Link key={p.id} to={`/blog/${p.id}`} style={{textDecoration:"none",color:"inherit"}}>
              <article style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid rgba(184,149,106,0.05)",transition:"all 0.3s",cursor:"pointer",height:"100%"}}
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
        <div style={{textAlign:"center",marginTop:28}}>
          <Link to="/blog" style={{color:C.gold,fontSize:14,fontWeight:500,textDecoration:"none",borderBottom:`1px solid ${C.gold}`,paddingBottom:2}}>
            Tous les articles du blog →
          </Link>
        </div>
      </S>

      {/* ═══ CTA FINAL ═══ */}
      <section style={{background:`linear-gradient(135deg,${C.navy},#243B5C)`,padding:mob?"48px 20px":"72px 24px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <h2 style={{fontFamily:F.h,fontSize:mob?22:32,color:"#fff",fontWeight:500,marginBottom:16,lineHeight:1.3}}>
            Prendre rendez-vous avec votre ostéopathe à Paris 7<sup>e</sup>
          </h2>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.5)",lineHeight:1.8,marginBottom:28}}>
            Appelez directement ou envoyez un SMS. Je vous répondrai personnellement.
            Pas de Doctolib — par choix. L'ostéopathie est une relation, pas une prestation.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",marginBottom:12}}>
            <Btn href={`tel:${PHONE.replace(/\s/g,"")}`} style={{background:C.gold}}>{PHONE} — Cabinet</Btn>
            <Btn href={`tel:${MOBILE.replace(/\s/g,"")}`} v="outline" style={{color:"#fff",borderColor:"rgba(255,255,255,0.3)"}}>{MOBILE} — Mobile / SMS</Btn>
          </div>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:6}}>{ADDR}</p>
          <a href={REVIEW} target="_blank" rel="noopener" style={{display:"inline-block",marginTop:20,color:C.gold,fontSize:13,textDecoration:"none",borderBottom:`1px solid ${C.gold}`,paddingBottom:2}}>Laisser un avis sur Google →</a>
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
              <Link to="/osteopathe-sans-craquement-paris-7" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Techniques douces</Link>
            </div>
            <div>
              <p style={{fontSize:9,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Contact</p>
              <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Appeler</a>
              <a href={`tel:${MOBILE.replace(/\s/g,"")}`} style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>SMS / Mobile</a>
              <a href={REVIEW} target="_blank" rel="noopener" style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>Laisser un avis</a>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:"24px auto 0",borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:14,textAlign:"center"}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>© 2026 Nicolas Mildner — Ostéopathe D.O. — Paris 7ᵉ — La Loi du Cas Unique</p>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.08)",marginTop:6}}>
            Annuaire ostéopathes : <a href="https://www.proxiosteo.fr" target="_blank" rel="noopener" style={{color:"rgba(255,255,255,0.08)",textDecoration:"none"}}>proxiosteo.fr</a>
          </p>
        </div>
      </footer>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}*{scroll-behavior:smooth}::selection{background:rgba(184,149,106,0.3)}@media print{body{display:none}}`}</style>
    </div>
  );
}
