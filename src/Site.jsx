import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════
// NICOLAS MILDNER — OSTÉOPATHE D.O. · D.O.E. · D.O.F.
// La Loi du Cas Unique — Version définitive V5
// ═══════════════════════════════════════════════════

const PHONE = "01 42 02 11 18";
const MOBILE = "06 68 80 14 42";
const ADDR = "72 avenue de la Bourdonnais, 75007 Paris";
const REVIEW = "https://search.google.com/local/writereview?placeid=ChIJ8SKn3CBw5kcRAxZkc56Vsuw";

const F = { h:"'Playfair Display','Georgia',serif", b:"'DM Sans','Helvetica Neue',sans-serif" };
const C = { navy:"#1A2B4A", cream:"#FAF7F2", gold:"#B8956A", sage:"#F4F1EC", warm:"#EDE8E0", text:"#3A3A3A", muted:"#7A7A7A", dark:"#111926" };

// ── DATA ──

const lineage = [
  { name:"Andrew Taylor Still", role:"Fondateur de l'ostéopathie — 1874", era:"Origine" },
  { name:"W.G. Sutherland · J.M. Littlejohn", role:"Pionniers du crânien et de l'ostéopathie européenne", era:"Transmission" },
  { name:"Viola Frymann · John Wernham", role:"Bâtisseurs de l'ostéopathie internationale — assistant et filiation directe", era:"Maîtres" },
  { name:"J.-P. Barral · S. Paoletti · R. Caporossi", role:"Pionniers mondiaux — manipulation viscérale, approche fasciale, philosophie ostéopathique crânienne et neurovégétative", era:"Pionniers" },
  { name:"R. Briend · P. Tricot · D. Lehougre · GLEM Lyon · Latour · Foissy", role:"Architectes de l'ostéopathie française — R. Briend, pionnier de la biodynamique, a proposé à N. Mildner d'intégrer son équipe pédagogique de succession — décliné par exigence envers soi-même", era:"Héritage français" },
  { name:"Nicolas Mildner — D.O. n°379", role:"Collégiale Académique de France · Diplômé 2004 · Enseignant ESO 2004–2020", era:"Aujourd'hui" },
];

const specs = [
  { icon:"🦴", t:"Douleurs & Gestion de la douleur", d:"Dorsalgies, cervicalgies, lombalgies, sciatiques, névralgies. Approche systémique et neurovégétative de la douleur aiguë et chronique.", k:["mal de dos","sciatique","cervicales","lumbago","douleur chronique"], cat:"d" },
  { icon:"🌱", t:"Fertilité & Fécondation", d:"Accompagnement des parcours de conception naturelle et assistée (PMA, FIV). Optimisation du terrain physiologique et neurovégétatif.", k:["PMA","FIV","infertilité","conception"], cat:"f" },
  { icon:"🤰", t:"Périnatalité & Projet de naissance", d:"Suivi complet de grossesse, préparation corporelle, projet de naissance, post-partum. Certificat d'études spécialisées en ostéopathie pédiatrique.", k:["grossesse","accouchement","post-partum","naissance"], cat:"f" },
  { icon:"👶", t:"Nourrissons", d:"Évaluation psychomotrice, mobilité et micro-mobilité clinique avant toute correction. Torticolis, plagiocéphalie, coliques, reflux. Réseau de référents en lactation.", k:["bébé","nourrisson","coliques","plagiocéphalie"], cat:"f" },
  { icon:"🧒", t:"Pédiatrie & Adolescents", d:"Scoliose, troubles posturaux de croissance, troubles neurologiques de l'enfant. Formation directe avec Viola Frymann sur ce sujet.", k:["scoliose","croissance","adolescent","enfant","neurologique"], cat:"f" },
  { icon:"🧠", t:"Crânio-sacré & Biodynamique", d:"Migraines fonctionnelles, vertiges fonctionnels, troubles de l'ATM, tensions profondes. Écoute fine des rythmes du système nerveux central et autonome.", k:["migraines","vertiges","ATM","crânien"], cat:"s" },
  { icon:"🫁", t:"Ostéopathie viscérale", d:"Troubles digestifs, reflux, ballonnements, colopathie fonctionnelle. Enseignant en ostéopathie viscérale pendant 17 ans à l'ESO Paris.", k:["digestion","reflux","ballonnements","intestin"], cat:"s" },
  { icon:"🏃", t:"Sport & Entretien corporel", d:"Entretien du sportif, optimisation, prévention des blessures, récupération. Approche systémique du geste et de la performance.", k:["sportif","tendinite","performance","récupération"], cat:"d" },
  { icon:"🥋", t:"Arts martiaux, Yoga & Pilates", d:"Prise en charge des professeurs et élèves pratiquant les arts martiaux, le yoga et le pilates. Biomécanique spécifique du geste, prévention et récupération. Depuis 2004.", k:["aikido","yoga","pilates","arts martiaux","judo","karaté"], cat:"d" },
  { icon:"🎵", t:"Musiciens & Chant lyrique", d:"Instrumentistes, chanteurs lyriques, troubles de la voix. Ancien élève de conservatoire à Paris — compréhension directe des exigences corporelles du musicien professionnel.", k:["musicien","chanteur","voix","instrumentiste","lyrique"], cat:"s" },
  { icon:"🦷", t:"Orthodontie & Enfants", d:"Accompagnement ostéopathique des traitements orthodontiques chez l'enfant et l'adolescent. Interactions crâniennes, posturales et occlusales.", k:["orthodontie","appareil dentaire","mâchoire","occlusion","enfant"], cat:"f" },
  { icon:"🔬", t:"Bilans complémentaires", d:"Accompagnement dans le cadre de bilans d'allergies alimentaires (tests Zamaria), tests ImuPro (intolérances), bilans des neurotransmetteurs. Sensibilisé à l'homéopathie et aux avancées sur le microbiote.", k:["allergie","ImuPro","Zamaria","microbiote","neurotransmetteurs","intolérance"], cat:"s" },
  { icon:"🏥", t:"Post-opératoire", d:"Récupération après chirurgie orthopédique, abdominale, gynécologique. Adhérences, cicatrices, restauration de la mobilité.", k:["chirurgie","cicatrice","adhérences","post-op"], cat:"s" },
  { icon:"🧍", t:"Posturologie", d:"Analyse et rééquilibrage postural global. Troubles de la statique, interactions podales, occlusales et oculaires. Coordination avec l'équipe de praticiens spécialisés.", k:["posture","statique","déséquilibre","podal"], cat:"d" },
  { icon:"😰", t:"Stress, Burn-out & Somatisations", d:"Anxiété, troubles du sommeil, épuisement, douleurs sans cause apparente. Rééquilibrage du terrain neurovégétatif.", k:["stress","burn-out","insomnie","anxiété","somatisation"], cat:"s" },
  { icon:"👴", t:"Seniors & Gériatrie", d:"Maintien de l'autonomie, prévention des chutes, gestion de l'arthrose, accompagnement du vieillissement.", k:["arthrose","mobilité","chutes","gériatrie"], cat:"s" },
  { icon:"🧩", t:"Problèmes complexes", d:"Patients en errance thérapeutique, cas résistants, douleurs chroniques multi-factorielles. La Loi du Cas Unique : chaque situation mérite une analyse neuve.", k:["douleur chronique","errance","complexe","résistant"], cat:"d" },
  { icon:"🏠", t:"Urgences & Domicile", d:"Décompensations post-traumatiques, crises aiguës. Consultations à domicile pour patients à mobilité réduite. Paris 7ᵉ et limitrophes.", k:["urgence","domicile","trauma","décompensation"], cat:"d" },
];

const testimonials = [
  { t:"Consulté depuis des années, un excellent ostéopathe qui analyse, diagnostique, explique et soulage sur le long terme.", a:"Patient fidèle depuis 15 ans" },
  { t:"De loin le meilleur, j'en suis très fidèle. Il prend le temps de diagnostiquer avant de pratiquer.", a:"Patient régulier" },
  { t:"Approche très pédagogique. Prend le temps de soigner même si cela décale le planning. Hautement recommandé.", a:"Patient orienté par son médecin" },
  { t:"Il a su très bien expliquer même aux petits. Mon fils va beaucoup mieux depuis.", a:"Parent reconnaissant" },
  { t:"Je n'ai jamais senti cela. Personne ne m'avait jamais expliqué ce qui se passait dans mon corps de cette façon.", a:"Nouvelle patiente" },
];

const blogs = [
  { title:"Torticolis : que faire en attendant votre ostéopathe ?", ex:"Le torticolis touche 70 % des adultes. Premiers réflexes, postures à éviter, et quand consulter.", tag:"Douleurs", t:"4 min" },
  { title:"Ostéopathie et fertilité : un accompagnement méconnu", ex:"Comment l'ostéopathie peut optimiser le terrain physiologique de la conception.", tag:"Fertilité", t:"5 min" },
  { title:"Musiciens : quand le corps ne suit plus l'instrument", ex:"Troubles musculo-squelettiques du musicien, dystonie focale, et approche ostéopathique.", tag:"Musiciens", t:"5 min" },
  { title:"Le stress se loge dans le corps : comprendre la somatisation", ex:"Comment le système nerveux autonome transforme le stress en douleurs physiques.", tag:"Neurovégétatif", t:"6 min" },
];

const techniques = [
  "Fasciale","Tissulaire","Crânio-sacrée","Biodynamique","Viscérale",
  "Posturale","Myofasciale thoraco-abdominale","Auriculothérapie réflexe",
  "Pouls de Paul Nogier (RAC/VAS)","Intégrative","Étiothérapie",
  "Désengrammation",
];

// ── UTILS ──
function useR(){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){setV(true);o.disconnect();}},{threshold:0.07});o.observe(e);return()=>o.disconnect();},[]);return[r,v];}
function useM(){const[m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return m;}
function S({children,bg,id}){const[r,v]=useR();const m=typeof window!=="undefined"&&window.innerWidth<768;return<section ref={r} id={id} style={{background:bg||"transparent",padding:m?"48px 16px":"84px 24px",opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:"opacity 0.75s,transform 0.75s"}}><div style={{maxWidth:1100,margin:"0 auto"}}>{children}</div></section>;}
function T({tag,title,sub,light}){const m=typeof window!=="undefined"&&window.innerWidth<768;return<div style={{textAlign:"center",marginBottom:m?32:48}}>{tag&&<p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:14,fontWeight:500}}>{tag}</p>}<h2 style={{fontFamily:F.h,fontSize:m?24:34,color:light?"#fff":C.navy,fontWeight:500,lineHeight:1.3}}>{title}</h2>{sub&&<p style={{color:light?"rgba(255,255,255,0.5)":C.muted,marginTop:14,fontSize:m?13:15,maxWidth:580,margin:"14px auto 0",lineHeight:1.75}}>{sub}</p>}</div>;}
function Btn({href,children,v:vr="primary",style:s={}}){const[h,setH]=useState(false);const b=vr==="primary"?{background:h?C.gold:C.navy,color:"#fff",border:"none",boxShadow:h?"0 6px 20px rgba(184,149,106,0.2)":"0 3px 12px rgba(26,43,74,0.1)"}:{background:"transparent",color:h?C.gold:C.navy,border:`1.5px solid ${h?C.gold:C.navy}`};return<a href={href} target={href?.startsWith("http")?"_blank":undefined} rel="noopener" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-block",padding:"14px 30px",borderRadius:8,fontSize:14,textDecoration:"none",fontWeight:500,transition:"all 0.3s",transform:h?"translateY(-2px)":"none",...b,...s}}>{children}</a>;}

// ── MAIN ──
export default function Site({ onBlog }){
  const mob=useM();
  const[scrolled,setScrolled]=useState(false);
  const[tIdx,setTIdx]=useState(0);
  const[cat,setCat]=useState("all");
  const[openCard,setOpenCard]=useState(null);
  const[menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  useEffect(()=>{const t=setInterval(()=>setTIdx(p=>(p+1)%testimonials.length),6000);return()=>clearInterval(t);},[]);
  const filtered=cat==="all"?specs:specs.filter(s=>s.cat===cat);
  const navLinks=[{l:"Approche",h:"#approche"},{l:"Héritage",h:"#heritage"},{l:"Spécialisations",h:"#specs"},{l:"Parcours",h:"#parcours"},{l:"Contact",h:"#contact"}];
  const cats=[{k:"all",l:"Tout voir (18)"},{k:"d",l:"Douleurs & Mouvement"},{k:"f",l:"Femme & Enfant"},{k:"s",l:"Spécialisé"}];

  return(
    <div style={{fontFamily:F.b,color:C.text,background:C.cream,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      {/* ═══ NAV ═══ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(250,247,242,0.97)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?"1px solid rgba(184,149,106,0.08)":"none",transition:"all 0.4s",padding:scrolled?"10px 24px":"20px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <a href="#hero" style={{textDecoration:"none",display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontFamily:F.h,fontSize:mob?15:18,color:C.navy,fontWeight:600}}>Nicolas Mildner</span>
            {!mob&&<span style={{fontSize:9,color:C.gold,letterSpacing:2.5,fontWeight:500}}>D.O. · D.O.E. · D.O.F.</span>}
          </a>
          {mob?(
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"none",border:"none",cursor:"pointer",padding:8,fontSize:24,color:C.navy,lineHeight:1}}>{menuOpen?"✕":"☰"}</button>
          ):(
            <div style={{display:"flex",gap:22,alignItems:"center"}}>
              {navLinks.map(n=><a key={n.l} href={n.h} style={{textDecoration:"none",color:C.navy,fontSize:12.5,fontWeight:400}}>{n.l}</a>)}
              <Btn href={`tel:${PHONE.replace(/\s/g,"")}`} style={{padding:"9px 18px",fontSize:12.5}}>Appeler le cabinet</Btn>
            </div>
          )}
        </div>
        {mob&&menuOpen&&(
          <div style={{background:"rgba(250,247,242,0.98)",backdropFilter:"blur(16px)",padding:"16px 24px 20px",borderTop:"1px solid rgba(184,149,106,0.08)",display:"flex",flexDirection:"column",gap:14}}>
            {navLinks.map(n=><a key={n.l} href={n.h} onClick={()=>setMenuOpen(false)} style={{textDecoration:"none",color:C.navy,fontSize:15,fontWeight:400,padding:"4px 0"}}>{n.l}</a>)}
            <Btn href={`tel:${PHONE.replace(/\s/g,"")}`} style={{padding:"12px 18px",fontSize:14,textAlign:"center",marginTop:4}}>01 42 02 11 18 — Appeler</Btn>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" style={{minHeight:mob?"auto":"100vh",display:"flex",alignItems:"center",background:`linear-gradient(155deg,${C.cream} 0%,${C.warm} 40%,#E2DCD2 100%)`,padding:mob?"90px 20px 40px":"100px 32px 60px",position:"relative",overflow:"hidden"}}>
        {!mob&&<div style={{position:"absolute",top:"8%",right:"-6%",width:550,height:550,borderRadius:"50%",border:"1px solid rgba(212,197,169,0.12)"}}/>}
        {!mob&&<div style={{position:"absolute",bottom:"5%",right:"10%",width:320,height:320,borderRadius:"50%",border:"1px solid rgba(212,197,169,0.08)"}}/>}
        <div style={{maxWidth:1100,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 380px",gap:mob?32:60,alignItems:"center"}}>
            <div>
              <div style={{display:"inline-block",background:"rgba(26,43,74,0.06)",borderRadius:20,padding:"6px 16px",marginBottom:24}}>
                <span style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:C.navy,fontWeight:500}}>
                  Génération charnière · D.O. n°379 · Depuis 1998
                </span>
              </div>
              <h1 style={{fontFamily:F.h,fontSize:mob?34:50,fontWeight:500,color:C.navy,lineHeight:1.15,marginBottom:6}}>Nicolas Mildner</h1>
              <p style={{fontFamily:F.h,fontSize:22,fontWeight:400,fontStyle:"italic",color:C.gold,marginBottom:28}}>Ostéopathe D.O. · D.O.E. · D.O.F.</p>
              <div style={{borderLeft:`3px solid ${C.gold}`,paddingLeft:20,marginBottom:32}}>
                <p style={{fontFamily:F.h,fontSize:21,color:C.navy,fontStyle:"italic",lineHeight:1.5,marginBottom:6}}>« La Loi du Cas Unique »</p>
                <p style={{fontSize:14,color:C.muted,lineHeight:1.7}}>
                  Chaque patient est un cas jamais vu. Pas de protocole. Pas de recette.
                  L'ostéopathie n'est pas un produit — c'est une relation.
                </p>
              </div>
              <p style={{fontSize:15,lineHeight:1.85,color:"#666",marginBottom:36,maxWidth:560}}>
                Généraliste hyperspécialiste. 18 champs d'expertise. Approche systémique
                et neurovégétative fondée sur la neurophysiologie — jamais énergétique.
                Filiation directe avec les fondateurs de l'ostéopathie mondiale.
                Patientèle internationale. Praticien de confiance de médecins et chirurgiens.
              </p>
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                <Btn href={`tel:${PHONE.replace(/\s/g,"")}`}>{PHONE} — Prendre rendez-vous</Btn>
                <Btn href={`tel:${MOBILE.replace(/\s/g,"")}`} v="outline">{MOBILE} — Appel ou SMS</Btn>
              </div>
              <p style={{fontSize:12,color:C.muted,marginTop:12,fontStyle:"italic"}}>
                Pas de Doctolib — par choix. Rendez-vous par téléphone ou SMS.
              </p>
            </div>

            {/* Stats card */}
            <div style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)",borderRadius:16,padding:"32px 28px",border:"1px solid rgba(184,149,106,0.1)"}}>
              {[
                {n:"D.O. n°379",l:"Collégiale Académique de France",sub:"Parmi les premières générations de D.O. structurés"},
                {n:"22+",l:"ans de pratique clinique",sub:"Consultations depuis 2004 · Clinique dès les études"},
                {n:"17",l:"ans d'enseignement à l'ESO",sub:"5 matières · Commissions recherche et pédagogie"},
                {n:"18",l:"champs de spécialisation",sub:"Du nourrisson au chanteur lyrique"},
                {n:"5.0★",l:"note Google",sub:"100 % par le bouche-à-oreille depuis 22 ans"},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:i<4?20:0,paddingBottom:i<4?20:0,borderBottom:i<4?"1px solid rgba(184,149,106,0.07)":"none"}}>
                  <div style={{fontFamily:F.h,fontSize:22,fontWeight:600,color:C.navy,minWidth:70,lineHeight:1.1}}>{s.n}</div>
                  <div>
                    <div style={{fontSize:13,color:C.navy,fontWeight:500}}>{s.l}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BANDEAU ═══ */}
      <section style={{background:C.navy,padding:mob?"16px 16px":"24px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"center",gap:mob?12:24,flexWrap:"wrap"}}>
          {["Agréé Ministère de la Santé","Participant aux standards de la profession","Faculté de Médecine de Genève","Diagnostic différentiel","CES Ostéopathie Pédiatrique","Article Le Monde / SFDO"].map((t,i)=>
            <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.gold}}/>
              <span style={{color:"rgba(255,255,255,0.7)",fontSize:mob?10:11,letterSpacing:0.3}}>{t}</span>
            </div>
          )}
        </div>
      </section>

      {/* ═══ APPROCHE ═══ */}
      <S id="approche" bg={C.cream}>
        <T tag="Mon approche" title={<>Systémique · Neurovégétatif · <em style={{fontStyle:"italic",color:C.gold}}>Vitalité</em></>} sub="L'ostéopathie est avant tout une technique réflexe. Je ne « remets pas en place » — je dialogue avec votre système nerveux pour restaurer les conditions de votre vitalité."/>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:22,marginBottom:40}}>
          {[
            {icon:"🔬",t:"Systémique",txt:"Votre corps est un tout. Une douleur d'épaule peut naître du bassin, de la mâchoire ou d'une cicatrice. Je prends en compte l'ensemble de votre terrain — structurel, viscéral, crânien — pour comprendre le contexte global de vos symptômes."},
            {icon:"🧬",t:"Neurovégétatif",txt:"Je travaille avec votre système nerveux autonome — l'équilibre sympathique et parasympathique qui régit la douleur, le stress, la digestion, le sommeil. Le RAC de Paul Nogier, que je pratique depuis 26 ans, me donne un biofeedback en temps réel de votre système autonome."},
            {icon:"✦",t:"Vitalité",txt:"Quand le système est rééquilibré, le corps se répare. Je ne promets pas un résultat — parce que la guérison dépend aussi de votre vitalité. Je restaure les conditions. Le reste appartient à la vie."},
          ].map(p=>(
            <div key={p.t} style={{background:C.sage,borderRadius:14,padding:"34px 26px",border:"1px solid rgba(184,149,106,0.06)"}}>
              <div style={{fontSize:30,marginBottom:14}}>{p.icon}</div>
              <h3 style={{fontFamily:F.h,fontSize:19,color:C.navy,marginBottom:10,fontWeight:500}}>{p.t}</h3>
              <p style={{fontSize:13.5,lineHeight:1.8,color:C.muted}}>{p.txt}</p>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:20}}>
          <div style={{background:C.navy,borderRadius:14,padding:"30px 26px"}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <span style={{fontSize:26}}>⚕️</span>
              <div>
                <h3 style={{fontFamily:F.h,fontSize:16,color:"#fff",marginBottom:8,fontWeight:500}}>Médicale, pas folklorique</h3>
                <p style={{fontSize:13,lineHeight:1.85,color:"rgba(255,255,255,0.55)"}}>
                  Anatomie, neurophysiologie, physiopathologie et recherche clinique. Pas d'hypnose, pas d'énergie, pas de magnétisme, pas de « mémoire cellulaire ». Exclusivement de l'ostéopathie. Diagnostic différentiel systématique et orientation vers le spécialiste adapté quand l'ostéopathie ne suffit pas.
                </p>
              </div>
            </div>
          </div>
          <div style={{background:C.navy,borderRadius:14,padding:"30px 26px"}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <span style={{fontSize:26}}>🤝</span>
              <div>
                <h3 style={{fontFamily:F.h,fontSize:16,color:"#fff",marginBottom:8,fontWeight:500}}>Une relation, pas un produit</h3>
                <p style={{fontSize:13,lineHeight:1.85,color:"rgba(255,255,255,0.55)"}}>
                  Je ne suis pas sur Doctolib — par choix. L'ostéopathie est une relation humaine, pas une prestation de service. Appelez-moi ou envoyez un SMS — je vous répondrai personnellement. Certains de mes patients me consultent depuis plus de 20 ans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </S>

      {/* ═══ CONSULTATION ═══ */}
      <section style={{background:C.sage,padding:mob?"36px 16px":"56px 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:20,fontWeight:500}}>L'expérience patient</p>
          <h2 style={{fontFamily:F.h,fontSize:28,color:C.navy,fontWeight:500,marginBottom:32}}>Ce n'est pas une consultation ordinaire</h2>
          <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:18}}>
            {[
              {n:"45–60",u:"min",d:"Le temps nécessaire. Jamais de patient pressé."},
              {n:"Anamnèse",u:"approfondie",d:"Votre histoire complète, pas juste vos symptômes."},
              {n:"Explication",u:"systématique",d:"Vous comprenez. Vous percevez. Vous participez."},
              {n:"Suivi",u:"au long cours",d:"Certains patients me consultent depuis 2004."},
            ].map((s,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:12,padding:"26px 16px",border:"1px solid rgba(184,149,106,0.05)"}}>
                <div style={{fontFamily:F.h,fontSize:22,fontWeight:600,color:C.navy,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:10,color:C.gold,marginTop:4,letterSpacing:1.2,textTransform:"uppercase",fontWeight:500}}>{s.u}</div>
                <p style={{fontSize:11.5,color:C.muted,marginTop:8,lineHeight:1.6}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HÉRITAGE ═══ */}
      <S id="heritage" bg={C.cream}>
        <T tag="Héritage · Filiation directe" title={<>La pure tradition ostéopathique mondiale<br/><em style={{fontStyle:"italic",color:C.gold}}>aujourd'hui révolue</em></>} sub="L'ostéopathie se transmet de maître à élève, par les mains. Cette chaîne remonte à 1874. J'ai eu le privilège de la recevoir directement — comme assistant de Viola Frymann et élève de Wernham, Briend, Paoletti, Caporossi. Une formation que les écoles d'aujourd'hui ne transmettent plus."/>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          {lineage.map((l,i)=>(
            <div key={i} style={{display:"flex",gap:20,alignItems:"flex-start"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:40}}>
                <div style={{width:i===lineage.length-1?20:12,height:i===lineage.length-1?20:12,borderRadius:"50%",background:i===lineage.length-1?C.gold:i===0?"rgba(26,43,74,0.7)":"rgba(184,149,106,0.35)",border:i===lineage.length-1?`3px solid rgba(184,149,106,0.25)`:"none",flexShrink:0}}/>
                {i<lineage.length-1&&<div style={{width:2,height:44,background:"linear-gradient(to bottom,rgba(184,149,106,0.3),rgba(184,149,106,0.08))"}}/>}
              </div>
              <div style={{paddingBottom:i<lineage.length-1?24:0}}>
                <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.gold,marginBottom:4,fontWeight:500}}>{l.era}</div>
                <div style={{fontFamily:F.h,fontSize:i===lineage.length-1?19:16,color:C.navy,fontWeight:i===lineage.length-1?600:500,marginBottom:2}}>{l.name}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{l.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── DIAGRAMME DE FILIATION ── */}
        <div style={{marginTop:56,maxWidth:mob?360:680,margin:"56px auto 0"}}>
          <p style={{textAlign:"center",fontFamily:F.h,fontSize:mob?16:19,color:C.navy,fontWeight:500,marginBottom:mob?24:32,letterSpacing:0.5}}>
            Deux branches de Sutherland — un praticien
          </p>

          {/* Still */}
          <div style={{textAlign:"center"}}>
            <div style={{display:"inline-block",background:"rgba(26,43,74,0.05)",border:"1px solid rgba(26,43,74,0.12)",borderRadius:8,padding:mob?"10px 14px":"12px 22px"}}>
              <div style={{fontFamily:F.h,fontSize:mob?12:14,fontWeight:600,color:C.navy}}>A.T. Still (1828–1917)</div>
            </div>
          </div>
          <div style={{width:2,height:mob?16:22,background:"rgba(184,149,106,0.3)",margin:"0 auto"}}/>

          {/* Sutherland */}
          <div style={{textAlign:"center"}}>
            <div style={{display:"inline-block",background:"rgba(26,43,74,0.05)",border:"1px solid rgba(26,43,74,0.12)",borderRadius:8,padding:mob?"10px 14px":"12px 22px"}}>
              <div style={{fontFamily:F.h,fontSize:mob?12:14,fontWeight:600,color:C.navy}}>W.G. Sutherland (1873–1954)</div>
              <div style={{fontSize:mob?10:11,color:C.muted,marginTop:2}}>Concept crânien</div>
            </div>
          </div>

          {/* Split connector */}
          <div style={{position:"relative",height:mob?52:62,maxWidth:mob?320:540,margin:"0 auto"}}>
            <div style={{position:"absolute",left:"50%",top:0,width:2,height:12,background:"rgba(184,149,106,0.3)",transform:"translateX(-50%)"}}/>
            <div style={{position:"absolute",top:12,left:mob?"12%":"20%",right:mob?"12%":"20%",height:2,background:"rgba(184,149,106,0.3)"}}/>
            <div style={{position:"absolute",left:mob?"12%":"20%",top:12,width:2,height:mob?40:50,background:"rgba(184,149,106,0.3)"}}/>
            <div style={{position:"absolute",right:mob?"12%":"20%",top:12,width:2,height:mob?40:50,background:"rgba(184,149,106,0.3)"}}/>
            <div style={{position:"absolute",left:0,bottom:mob?2:4,width:"48%",textAlign:"center",fontSize:mob?8:10,color:C.gold,letterSpacing:mob?0.3:1.2,fontWeight:500,lineHeight:1.5}}>
              Formation initiale<br/>Tradition crânienne
            </div>
            <div style={{position:"absolute",right:0,bottom:mob?2:4,width:"48%",textAlign:"center",fontSize:mob?8:10,color:C.gold,letterSpacing:mob?0.3:1.2,fontWeight:500,lineHeight:1.5}}>
              Approfondissement<br/>Biodynamique fluidique
            </div>
          </div>

          {/* Two branches */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:mob?8:28,maxWidth:mob?320:540,margin:"0 auto"}}>
            {/* Left branch — tradition crânienne */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              {[
                {n:"V. Frymann (1921–2016)",s:"Magoun, Schooley"},
                {n:"F. Peyralade (1928–2013)",s:"SERETO — 1978"},
                {n:"R. Caporossi",s:"Fonde l'ESO — 1990"},
                {n:"ESO Paris",s:"1998–2004 puis 17 ans"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
                  <div style={{background:i===3?"rgba(180,210,175,0.15)":"rgba(200,218,195,0.18)",border:`1px solid rgba(180,200,170,${0.45-i*0.05})`,borderRadius:8,padding:mob?"9px 8px":"11px 16px",textAlign:"center",width:"100%",maxWidth:mob?160:230}}>
                    <div style={{fontFamily:F.h,fontSize:mob?11:13,fontWeight:600,color:C.navy}}>{item.n}</div>
                    <div style={{fontSize:mob?9:11,color:C.muted,marginTop:1}}>{item.s}</div>
                  </div>
                  {i<3&&<div style={{width:2,height:mob?12:18,background:"rgba(184,149,106,0.25)"}}/>}
                </div>
              ))}
            </div>
            {/* Right branch — biodynamique */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              {[
                {n:"R.E. Becker (1910–1996)",s:"Travaux tardifs de Sutherland"},
                {n:"J.A. Duval",s:"Élève direct de Becker"},
                {n:"R. Briend",s:"Modèle fluidique — 1999"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
                  <div style={{background:`rgba(185,195,215,${0.2-i*0.03})`,border:`1px solid rgba(175,190,210,${0.5-i*0.05})`,borderRadius:8,padding:mob?"9px 8px":"11px 16px",textAlign:"center",width:"100%",maxWidth:mob?160:230}}>
                    <div style={{fontFamily:F.h,fontSize:mob?11:13,fontWeight:600,color:C.navy}}>{item.n}</div>
                    <div style={{fontSize:mob?9:11,color:C.muted,marginTop:1}}>{item.s}</div>
                  </div>
                  {i<2&&<div style={{width:2,height:mob?12:18,background:"rgba(184,149,106,0.25)"}}/>}
                </div>
              ))}
              {/* Extending line to match left column height */}
              <div style={{width:2,height:mob?53:69,background:"rgba(184,149,106,0.18)"}}/>
            </div>
          </div>

          {/* Convergence connector */}
          <svg viewBox="0 0 200 35" style={{width:"100%",maxWidth:mob?320:540,height:mob?30:42,display:"block",margin:"0 auto",overflow:"visible"}}>
            <line x1="50" y1="0" x2="100" y2="35" stroke="rgba(184,149,106,0.3)" strokeWidth="0.7"/>
            <line x1="150" y1="0" x2="100" y2="35" stroke="rgba(184,149,106,0.3)" strokeWidth="0.7"/>
          </svg>

          {/* Nicolas Mildner */}
          <div style={{textAlign:"center"}}>
            <div style={{display:"inline-block",background:"rgba(184,149,106,0.07)",border:"1px solid rgba(184,149,106,0.22)",borderRadius:10,padding:mob?"13px 18px":"16px 32px",boxShadow:"0 2px 12px rgba(184,149,106,0.06)"}}>
              <div style={{fontFamily:F.h,fontSize:mob?14:18,fontWeight:600,color:C.navy}}>Nicolas Mildner D.O.</div>
              <div style={{fontSize:mob?10:12,color:C.muted,marginTop:3}}>Ostéopathe exclusif — depuis 2004</div>
            </div>
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:40}}>
          <p style={{fontSize:13.5,color:C.muted,fontStyle:"italic",maxWidth:600,margin:"0 auto",lineHeight:1.7}}>
            « Lorsque j'ai commencé en 1998, le Registre des Ostéopathes de France ne comptait que quelques centaines de D.O.
            Aujourd'hui, ils sont plus de 47 000. La formation que j'ai reçue appartient à un autre monde. »
          </p>
        </div>
      </S>

      {/* ═══ TECHNIQUES ═══ */}
      <section style={{background:C.sage,padding:mob?"36px 16px":"48px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <p style={{textAlign:"center",fontSize:11,letterSpacing:5,textTransform:"uppercase",color:C.gold,marginBottom:18,fontWeight:500}}>Techniques pratiquées</p>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8}}>
            {techniques.map(t=><span key={t} style={{background:"rgba(184,149,106,0.1)",color:C.navy,padding:"6px 15px",borderRadius:20,fontSize:12,fontWeight:500}}>{t}</span>)}
          </div>
          <p style={{textAlign:"center",fontSize:12,color:C.muted,marginTop:16,fontStyle:"italic"}}>Techniques douces exclusivement. Modèles personnels. Plus de cracking.</p>
        </div>
      </section>

      {/* ═══ SPÉCIALISATIONS ═══ */}
      <S id="specs" bg={C.cream}>
        <T tag="18 champs d'expertise" title="Généraliste Hyperspécialiste" sub="Là où d'autres orientent, je prends en charge. La Loi du Cas Unique : chaque patient est un cas jamais vu. Je m'adapte. J'apprends. Depuis 22 ans."/>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {cats.map(f=><button key={f.k} onClick={()=>{setCat(f.k);setOpenCard(null);}} style={{padding:"7px 18px",borderRadius:20,border:`1px solid ${cat===f.k?C.gold:"rgba(184,149,106,0.2)"}`,background:cat===f.k?C.gold:"transparent",color:cat===f.k?"#fff":C.navy,fontSize:12,fontWeight:500,cursor:"pointer",transition:"all 0.3s",fontFamily:F.b}}>{f.l}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:16}}>
          {filtered.map(s=>{const open=openCard===s.t;return<div key={s.t} onClick={()=>setOpenCard(open?null:s.t)} style={{background:C.sage,borderRadius:12,padding:"22px 20px",cursor:"pointer",transition:"all 0.3s",border:`1px solid ${open?C.gold:"rgba(184,149,106,0.04)"}`,boxShadow:open?"0 8px 28px rgba(26,43,74,0.06)":"none",transform:open?"translateY(-3px)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:20}}>{s.icon}</span>
              <h3 style={{fontFamily:F.h,fontSize:15,color:C.navy,fontWeight:500,lineHeight:1.3}}>{s.t}</h3>
            </div>
            <p style={{fontSize:12.5,lineHeight:1.75,color:C.muted}}>{s.d}</p>
            {open&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(184,149,106,0.08)"}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{s.k.map(k=><span key={k} style={{background:"rgba(184,149,106,0.1)",color:C.navy,padding:"3px 9px",borderRadius:10,fontSize:10.5}}>{k}</span>)}</div>
              <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{display:"inline-block",marginTop:12,fontSize:12,color:C.gold,textDecoration:"none",fontWeight:500}}>Appeler pour un rendez-vous →</a>
            </div>}
          </div>;})}
        </div>
      </S>

      {/* ═══ PARCOURS ═══ */}
      <S id="parcours" bg={C.sage}>
        <T tag="Parcours" title={<>L'une des premières générations<br/><em style={{fontStyle:"italic",color:C.gold}}>d'ostéopathes D.O. en France</em></>} sub="Diplômé D.O. en 2004 par la Collégiale Académique de France, j'appartiens à la génération charnière — celle qui a reçu un diplôme dans la période de structuration historique de la profession, avant les décrets de 2007."/>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?28:48,alignItems:"start"}}>
          <div style={{textAlign:"left"}}>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:16}}>
              Diplômé D.O. et D.O.E. en 2004, j'ai validé mon diplôme européen devant la Faculté de Médecine de Genève — un diplôme que très peu d'ostéopathes ont passé. Mon D.O.F. a été obtenu par Validation des Acquis de l'Expérience, alors que j'enseignais déjà aux futurs diplômés à l'ESO, prestigieuse école d'ostéopathie située sur le campus universitaire Descartes.
            </p>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:16}}>
              Ma formation est celle d'un autre temps : assistant de Viola Frymann lors de son séminaire sur les troubles neurologiques de l'enfant, élève de Serge Paoletti (pionnier de l'approche fasciale), de Roger Caporossi (approche fasciale, philosophie ostéopathique crânienne et neurovégétative), de René Briend (pionnier de l'ostéopathie biodynamique, qui m'a proposé d'intégrer son équipe pédagogique de succession — j'ai décliné, convaincu qu'il me fallait davantage de maturité clinique), de Didier Lehougre, du GLEM de Lyon et de l'Étiothérapie de Latour. Formé au pouls de Paul Nogier (RAC) depuis l'an 2000. De nombreuses formations diplômantes complètent ce parcours.
            </p>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:16}}>
              Durant mes études, j'ai effectué de nombreux stages en milieu hospitalier — chirurgie de la main, pédiatrie, maternité — qui m'ont forgé un regard clinique affûté et une capacité de diagnostic différentiel que la pratique en cabinet seule ne permet pas d'acquérir. J'ai également réalisé de nombreuses séances de dissection à la Faculté de Médecine de l'Université Paris Descartes, rue des Saints-Pères, notamment sur les nerfs crâniens — une connaissance anatomique directe, irremplaçable.
            </p>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:16}}>
              À l'ESO — prestigieuse école d'ostéopathie située sur le campus universitaire Descartes — j'ai enseigné cinq matières pendant 17 ans : clinique, générale, myofasciale thoraco-abdominale, viscérale et structurelle. J'ai participé à la formation de nombreux ostéopathes aujourd'hui en exercice. J'ai intégré les Commissions de Recherche, Pédagogie et Évaluation, et participé aux travaux d'élaboration des standards de la profession. Titulaire du Certificat d'Études Spécialisées en Ostéopathie Pédiatrique.
            </p>
            <p style={{fontSize:15,lineHeight:1.9,color:C.text,marginBottom:16}}>
              Dès 2004, j'ai débuté mes consultations et intégré une équipe spécialisée en urgences ostéopathiques. En 2005, j'ai créé un second cabinet au sein d'une équipe médicale pluridisciplinaire, et contribué à un article du SFDO publié dans Le Monde. Depuis 2004, je prends en charge des professeurs et élèves de Yoga et d'Aikido. Sensibilisé à l'homéopathie et aux avancées sur le microbiote, je propose également un accompagnement dans le cadre de bilans complémentaires (tests Zamaria, ImuPro, neurotransmetteurs).
            </p>
            <p style={{fontSize:15,lineHeight:1.9,color:"#888",fontStyle:"italic"}}>
              En 22 ans de pratique, je n'ai jamais fait de publicité. Chaque patient est venu par le bouche-à-oreille — de Paris, de province, d'Europe et des États-Unis. Parmi eux, des médecins, des chirurgiens, des personnalités, des musiciens, des sportifs et des familles fidèles depuis deux décennies.
            </p>
          </div>
          <div>
            <div style={{background:C.navy,borderRadius:14,padding:"34px 28px",marginBottom:20,textAlign:"center"}}>
              <p style={{fontFamily:F.h,fontSize:26,color:"#fff",fontStyle:"italic",lineHeight:1.45,marginBottom:12}}>« C'est la Vie. »</p>
              <div style={{width:40,height:1,background:C.gold,margin:"0 auto 14px"}}/>
              <p style={{fontSize:13.5,color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>
                Je ne promets pas un résultat. La guérison dépend de ma pratique et de votre vitalité.
                Ce que je vous offre : 22 ans d'écoute, de mains et d'intelligence clinique au service de votre système vivant.
              </p>
              <p style={{fontSize:13.5,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginTop:10}}>
                Chaque consultation est une rencontre unique. Pas un protocole. La vie.
              </p>
            </div>
            <div style={{background:"#fff",borderRadius:14,padding:"28px 24px",border:"1px solid rgba(184,149,106,0.06)"}}>
              {[
                {l:"D.O. · D.O.E. · D.O.F.",d:"Triple diplôme — Faculté de Médecine de Genève"},
                {l:"D.O. n°379 — Collégiale Académique",d:"Génération charnière, avant les décrets de 2007"},
                {l:"CES Ostéopathie Pédiatrique",d:"Certificat d'études spécialisées — 2011"},
                {l:"Stages hospitaliers & dissections",d:"Chirurgie, pédiatrie, maternité · Fac. Médecine Paris Descartes"},
                {l:"Standards de la profession",d:"Participant aux travaux d'élaboration du référentiel métier et à la sélection des premiers Masters 2"},
                {l:"Enseignant ESO · 5 matières · 17 ans",d:"Commissions recherche, pédagogie, évaluation"},
                {l:"Filiation directe",d:"Frymann · Paoletti · Caporossi · Wernham · Briend"},
                {l:"Publication Le Monde / SFDO",d:"Article national — décembre 2005"},
                {l:"Patientèle internationale",d:"Paris · Province · Europe · États-Unis"},
              ].map((c,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:i<7?14:0,paddingBottom:i<7?14:0,borderBottom:i<7?"1px solid rgba(184,149,106,0.05)":"none"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,marginTop:6,flexShrink:0}}/>
                  <div>
                    <p style={{fontSize:13,color:C.navy,fontWeight:600}}>{c.l}</p>
                    <p style={{fontSize:11.5,color:C.muted}}>{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </S>

      {/* ═══ POURQUOI MOI ═══ */}
      <section style={{background:`linear-gradient(135deg,#1C2E48,${C.navy})`,padding:mob?"48px 16px":"72px 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <T tag="La différence" title={<>Ce que 22 ans de mains<br/><em style={{fontStyle:"italic",color:C.gold}}>changent réellement</em></>} light/>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:20,marginBottom:36}}>
            {[
              {i:"🎯",t:"Le diagnostic",d:"22 ans de palpation clinique, RAC de Paul Nogier depuis 26 ans, dissections à la Faculté de Médecine, diagnostic différentiel. Mes mains perçoivent ce que les appareils ne montrent pas."},
              {i:"🔗",t:"La vision intégrée",d:"18 spécialisations dans un cadre unique. Un vertige peut venir des cervicales. Une infertilité, du bassin. Un trouble de la voix, du thorax. Tout est connecté."},
              {i:"⏱️",t:"La durabilité",d:"45 min à 1 h de consultation. La cause, jamais le symptôme seul. Des patients fidèles depuis 2004 en témoignent. Le bouche-à-oreille a fait le reste."},
            ].map(d=>(
              <div key={d.t} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"30px 24px",border:"1px solid rgba(184,149,106,0.06)"}}>
                <div style={{fontSize:26,marginBottom:12}}>{d.i}</div>
                <h3 style={{fontFamily:F.h,fontSize:17,color:"#fff",marginBottom:8,fontWeight:500}}>{d.t}</h3>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>{d.d}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",background:"rgba(184,149,106,0.06)",borderRadius:12,padding:"28px 36px",maxWidth:720,margin:"0 auto"}}>
            <p style={{fontFamily:F.h,fontSize:16,color:"rgba(255,255,255,0.75)",fontStyle:"italic",lineHeight:1.65}}>
              « En 22 ans, je n'ai jamais fait de publicité. 100 % de mes patients sont venus par le bouche-à-oreille.
              Quand des médecins, des chirurgiens et des patients qui prennent l'avion vous choisissent — c'est la meilleure preuve qui existe. »
            </p>
          </div>
        </div>
      </section>

      {/* ═══ TÉMOIGNAGES ═══ */}
      <S id="temoignages" bg={C.cream}>
        <T tag="Témoignages" title="Ce que disent nos patients" sub="Note Google : 5.0 / 5 — Exclusivement par le bouche-à-oreille depuis 2004"/>
        <div style={{maxWidth:600,margin:"0 auto",textAlign:"center",minHeight:170}}>
          {testimonials.map((t,i)=><div key={i} style={{display:i===tIdx?"block":"none",animation:"fadeIn 0.5s ease"}}>
            <p style={{color:C.gold,fontSize:14,letterSpacing:3}}>★★★★★</p>
            <p style={{fontFamily:F.h,fontSize:18,fontStyle:"italic",color:C.navy,lineHeight:1.85,margin:"16px 0"}}>« {t.t} »</p>
            <p style={{color:C.gold,fontSize:13,fontWeight:500}}>— {t.a}</p>
          </div>)}
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:24}}>
            {testimonials.map((_,i)=><button key={i} onClick={()=>setTIdx(i)} style={{width:i===tIdx?22:8,height:8,borderRadius:4,border:"none",background:i===tIdx?C.gold:"rgba(184,149,106,0.2)",cursor:"pointer",transition:"all 0.3s"}}/>)}
          </div>
          <a href={REVIEW} target="_blank" rel="noopener" style={{display:"inline-block",marginTop:24,color:C.gold,fontSize:13,textDecoration:"none",borderBottom:`1px solid ${C.gold}`,paddingBottom:2}}>Laisser un avis sur Google →</a>
        </div>
      </S>

      {/* ═══ BLOG ═══ */}
      <S id="blog" bg={C.sage}>
        <T tag="Conseils & Recherche" title="Le blog du cabinet"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:18}}>
          {blogs.map(p=><article key={p.title} style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid rgba(184,149,106,0.05)",transition:"all 0.3s",cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(26,43,74,0.04)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{height:130,background:`linear-gradient(135deg,${C.cream},${C.warm})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>Image</span>
            </div>
            <div style={{padding:"18px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{background:"rgba(184,149,106,0.1)",color:C.navy,padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:500}}>{p.tag}</span>
                <span style={{fontSize:10,color:C.muted}}>{p.t}</span>
              </div>
              <h3 style={{fontFamily:F.h,fontSize:15,color:C.navy,marginBottom:6,fontWeight:500,lineHeight:1.35}}>{p.title}</h3>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.7}}>{p.ex}</p>
            </div>
          </article>)}
        </div>
      </S>

      {/* ═══ CONTACT ═══ */}
      <S id="contact" bg={C.cream}>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?28:52}}>
          <div>
            <T tag="Contact" title="Prendre rendez-vous"/>
            <div style={{textAlign:"left"}}>
              <div style={{background:C.sage,borderRadius:12,padding:"20px 22px",marginBottom:24,border:"1px solid rgba(184,149,106,0.06)"}}>
                <p style={{fontSize:13,color:C.navy,fontWeight:500,marginBottom:6}}>Pourquoi pas de Doctolib ?</p>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.7}}>
                  L'ostéopathie n'est pas un produit à réserver en ligne. C'est une relation. Appelez-moi ou envoyez un SMS — je vous répondrai personnellement.
                </p>
              </div>
              {[
                {t:"Adresse",c:ADDR,sub:"Métro École Militaire (8) · La Tour-Maubourg (8)"},
                {t:"Téléphone cabinet",c:PHONE,link:`tel:${PHONE.replace(/\s/g,"")}`,big:true},
                {t:"Mobile",c:MOBILE,link:`tel:${MOBILE.replace(/\s/g,"")}`,big:true,sub:"Appel ou SMS pour prendre rendez-vous"},
              ].map(d=><div key={d.t} style={{marginBottom:22}}>
                <h4 style={{fontSize:10.5,color:C.navy,fontWeight:600,marginBottom:5,letterSpacing:2,textTransform:"uppercase"}}>{d.t}</h4>
                {d.link?<a href={d.link} style={{fontSize:d.big?(mob?18:22):15,color:C.navy,textDecoration:"none",fontFamily:d.big?F.h:F.b,fontWeight:500}}>{d.c}</a>:<p style={{fontSize:15,color:C.text}}>{d.c}</p>}
                {d.sub&&<p style={{fontSize:12,color:C.muted,marginTop:3}}>{d.sub}</p>}
              </div>)}
              <div style={{marginBottom:22}}>
                <h4 style={{fontSize:10.5,color:C.navy,fontWeight:600,marginBottom:5,letterSpacing:2,textTransform:"uppercase"}}>Horaires</h4>
                <p style={{fontSize:14,color:C.text,lineHeight:1.8}}>Lundi, Mardi, Jeudi, Vendredi : 9h — 21h<br/>Mercredi : 12h — 21h</p>
              </div>
              <div style={{marginBottom:28}}>
                <h4 style={{fontSize:10.5,color:C.navy,fontWeight:600,marginBottom:5,letterSpacing:2,textTransform:"uppercase"}}>Consultation</h4>
                <p style={{fontSize:16,color:C.text}}><strong>80 — 90 €</strong> · 45 min à 1 h</p>
                <p style={{fontSize:12,color:C.muted,marginTop:3}}>Chèque ou espèces · Remboursement mutuelle selon contrat</p>
              </div>
              <div style={{display:"flex",flexDirection:mob?"column":"row",gap:10}}>
                <Btn href={`tel:${PHONE.replace(/\s/g,"")}`}>{PHONE} — Appeler</Btn>
                <Btn href={`tel:${MOBILE.replace(/\s/g,"")}`} v="outline">Appel / SMS — {MOBILE}</Btn>
              </div>
            </div>
          </div>
          <div style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(184,149,106,0.08)",minHeight:mob?300:420}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.3!2d2.3003!3d48.8563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6702025a72291%3A0xecb595739e641603!2s72%20Av.%20de%20la%20Bourdonnais%2C%2075007%20Paris!5e0!3m2!1sfr!2sfr!4v1717700000000"
              width="100%" height="100%" style={{border:0,minHeight:mob?300:420}}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Cabinet Nicolas Mildner — 72 avenue de la Bourdonnais, Paris 7ᵉ"
            />
          </div>
        </div>
      </S>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{background:`linear-gradient(135deg,${C.navy},#243B5C)`,padding:mob?"36px 20px":"48px 24px",textAlign:"center"}}>
        <div style={{maxWidth:460,margin:"0 auto"}}>
          <h3 style={{fontFamily:F.h,fontSize:mob?17:20,color:"#fff",marginBottom:8,fontWeight:500}}>Conseils ostéo, chaque mois</h3>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20}}>Un conseil clinique pratique. Pas de spam. Jamais.</p>
          <div style={{display:"flex",flexDirection:mob?"column":"row",gap:10,maxWidth:380,margin:"0 auto"}}>
            <input type="email" placeholder="votre@email.com" style={{flex:1,padding:"12px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:14,outline:"none",fontFamily:F.b}}/>
            <button style={{background:C.gold,color:"#fff",border:"none",padding:"12px 20px",borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:F.b}}>S'inscrire</button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{background:C.dark,padding:mob?"32px 20px 20px":"40px 32px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          <div>
            <span style={{fontFamily:F.h,fontSize:16,color:"#fff",fontWeight:500}}>Nicolas Mildner</span>
            <span style={{fontSize:9,color:C.gold,marginLeft:8,letterSpacing:2}}>D.O. · D.O.E. · D.O.F.</span>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:8,lineHeight:1.6}}>{ADDR}<br/>Tél. {PHONE}</p>
          </div>
          <div style={{display:"flex",gap:32}}>
            {[{t:"Navigation",ls:[{l:"Approche",h:"#approche"},{l:"Héritage",h:"#heritage"},{l:"Spécialisations",h:"#specs"},{l:"Parcours",h:"#parcours"}]},
              {t:"Infos",ls:[{l:"Mentions légales",h:"#"},{l:"Confidentialité",h:"#"},{l:"Laisser un avis",h:REVIEW},{l:"Appeler",h:`tel:${PHONE.replace(/\s/g,"")}`}]}
            ].map(col=><div key={col.t}>
              <p style={{fontSize:9,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{col.t}</p>
              {col.ls.map(lnk=><a key={lnk.l} href={lnk.h} style={{display:"block",color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",marginBottom:5}}>{lnk.l}</a>)}
            </div>)}
          </div>
        </div>
        <div style={{maxWidth:1100,margin:"24px auto 0",borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:14,textAlign:"center"}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>© 2026 Nicolas Mildner — Ostéopathe D.O. — Paris 7ᵉ — La Loi du Cas Unique</p>
        </div>
      </footer>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}*{scroll-behavior:smooth}::selection{background:rgba(184,149,106,0.3)}input::placeholder{color:rgba(255,255,255,0.3)}@media print{body{display:none}}`}</style>
    </div>
  );
}
