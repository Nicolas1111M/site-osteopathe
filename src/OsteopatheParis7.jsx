import { Link } from "react-router-dom";
import { Breadcrumbs, CallActions, IconArrow } from "./Layout.jsx";
import { FactSheet, MapFrame, Newsletter } from "./Site.jsx";
import { PHONE, PHONE_TEL, MOBILE, MOBILE_SMS, REVIEW_URL, formatDate, sortByDateDesc } from "./site-config.js";
import { IconPhone, IconMessage } from "./Layout.jsx";
import posts from "./posts-index.json";

// Page locale — cible : ostéopathe 75007, ostéopathe Paris 7.

const MOTIFS = [
  { t: "Mal de dos, lombalgie, sciatique", d: "Prise en charge systémique des douleurs vertébrales aiguës et chroniques. Approche fondée sur la recherche (Cochrane, Lancet).", link: "/douleurs-dos-lombalgie-paris-7" },
  { t: "Cervicalgie et torticolis", d: "Douleurs cervicales, céphalées cervicogènes, raideur de nuque. Approche crânio-sacrée et fasciale douce.", link: "/cervicalgie-torticolis-paris-7" },
  { t: "Bruxisme, migraines, ATM", d: "Troubles de l'articulation temporo-mandibulaire, bruxisme, céphalées, vertiges. Approche crânio-sacrée et neurovégétative.", link: "/bruxisme-atm-paris-7" },
  { t: "Grossesse et périnatalité", d: "Suivi périnatal complet, douleurs de grossesse, préparation à l'accouchement, post-partum, fertilité.", link: "/femme-enceinte-osteopathe-paris-7" },
  { t: "Nourrissons", d: "Plagiocéphalie, coliques, torticolis congénital, reflux. CES Ostéopathie pédiatrique. Filiation Viola Frymann.", link: "/nourrisson-plagiocephalie-paris-7" },
  { t: "Techniques douces, sans craquement", d: "Ostéopathie douce exclusivement : un choix clinique informé, pas une limite technique. Ancien enseignant en manipulations vertébrales.", link: "/osteopathe-sans-craquement-paris-7" },
  { t: "Stress, burn-out, somatisations", d: "Rééquilibrage du système nerveux autonome. Troubles du sommeil, anxiété, douleurs sans cause apparente." },
  { t: "Sport et récupération", d: "Entretien du sportif, prévention des blessures, optimisation biomécanique. Yoga, arts martiaux, Pilates." },
  { t: "Musiciens et chanteurs", d: "Instrumentistes, chanteurs lyriques, troubles de la voix. Ancien élève de conservatoire." },
];

const CREDENTIALS = [
  { l: "D.O. n°00379", d: "Collégiale Académique de France, 2004" },
  { l: "D.O.E. — Faculté de Médecine de Genève", d: "European Council of Osteopathic Schools" },
  { l: "17 ans d'enseignement", d: "ESO Paris · 5 matières · commissions recherche et pédagogie" },
  { l: "18 spécialisations", d: "Du nourrisson au chanteur lyrique" },
  { l: "Note Google 5,0 sur 5", d: "Bouche-à-oreille depuis 2004" },
  { l: "Pas de Doctolib", d: "Par choix : une relation directe avec chaque patient" },
];

const QUARTIER = ["Gros-Caillou", "École Militaire", "Champ-de-Mars", "Invalides", "La Tour-Maubourg", "Tour Eiffel", "Rue Cler", "Avenue Bosquet"];

export default function OsteopatheParis7() {
  const related = sortByDateDesc(posts).slice(0, 3);
  return (
    <main id="contenu">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="wrap">
          <Breadcrumbs items={[{ label: "Accueil", to: "/" }, { label: "Ostéopathe Paris 7" }]} />
          <div className="page-hero__grid">
            <div>
              <p className="t-kicker">Ostéopathe Paris 7e · 75007</p>
              <h1 id="page-title" className="t-title page-hero__title">
                Ostéopathe Paris 7 — 75007
                <span className="sr-only"> — </span>
                <span className="page-hero__sub">Nicolas Mildner D.O., 72 avenue de la Bourdonnais</span>
              </h1>
              <p className="t-lede">
                Nicolas Mildner, ostéopathe D.O. n°379, exerce au cœur du 7e arrondissement depuis 2004. 22 ans de
                pratique clinique, 17 ans d'enseignement, 18 spécialisations. Le cabinet est à deux pas de l'École
                Militaire, du Champ-de-Mars et des Invalides.
              </p>
              <CallActions hero />
              <p className="t-small page-hero__note">Pas de Doctolib, par choix. Rendez-vous par téléphone ou SMS uniquement.</p>
            </div>
            <figure className="page-hero__figure">
              <img
                src="/img/nicolas-mildner-portrait.webp"
                alt="Nicolas Mildner, ostéopathe D.O. au cabinet du 72 avenue de la Bourdonnais, Paris 7 (75007)"
                width="638"
                height="798"
                fetchpriority="high"
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="facts" aria-labelledby="practical-title">
        <div className="wrap practical">
          <h2 id="practical-title" className="sr-only">
            Informations pratiques
          </h2>
          <div>
            <h3 className="practical__title">Localisation</h3>
            <p>72 avenue de la Bourdonnais, 75007 Paris</p>
            <p className="t-small">Métro École Militaire ou La Tour-Maubourg (ligne 8) · quartier Gros-Caillou</p>
          </div>
          <div>
            <h3 className="practical__title">Horaires</h3>
            <p>Lundi, mardi, jeudi, vendredi : 9h–21h</p>
            <p className="t-small">Mercredi : 12h–21h · sur rendez-vous uniquement</p>
          </div>
          <div>
            <h3 className="practical__title">Consultation</h3>
            <p>80 à 90 € · 45 min à 1 h</p>
            <p className="t-small">Chèque ou espèces · remboursement mutuelle selon contrat · pas de tiers payant</p>
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="motifs-title">
        <div className="wrap">
          <div className="chapter__head" data-build>
            <p className="t-kicker">Motifs de consultation</p>
            <h2 id="motifs-title" className="t-title">
              Pourquoi consulter un ostéopathe à Paris 7e ?
            </h2>
          </div>
          <ul className="motifs">
            {MOTIFS.map((m) => (
              <li className="motif" key={m.t}>
                {m.link ? (
                  <Link to={m.link} className="motif__link">
                    <h3>{m.t}</h3>
                    <p>{m.d}</p>
                    <span className="motif__more">
                      En savoir plus <IconArrow />
                    </span>
                  </Link>
                ) : (
                  <>
                    <h3>{m.t}</h3>
                    <p>{m.d}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
          <p className="also">
            <a className="link" href="/#expertise">
              Voir les 18 champs d'expertise
            </a>
          </p>
        </div>
      </section>

      <section className="urgent" aria-labelledby="urgent-title">
        <div className="wrap urgent__inner">
          <div>
            <h2 id="urgent-title" className="t-subtitle">
              Douleur aiguë ?
            </h2>
            <p>Dos bloqué, lumbago, torticolis : consultation rapide sur rendez-vous téléphonique, disponibilité souvent dans la journée.</p>
          </div>
          <Link className="btn btn--light" to="/urgence-osteopathe-paris-7">
            Urgence ostéopathe <IconArrow />
          </Link>
        </div>
      </section>

      <section className="chapter chapter--linen" aria-labelledby="praticien-title">
        <div className="wrap split">
          <div className="split__aside">
            <div className="chapter__head" data-build>
              <p className="t-kicker">Votre praticien</p>
              <h2 id="praticien-title" className="t-title">
                Nicolas Mildner, ostéopathe D.O.
              </h2>
              <p className="t-lede">22 ans de pratique clinique au service des patients du 7e arrondissement.</p>
            </div>
            <ul className="credentials">
              {CREDENTIALS.map((c) => (
                <li key={c.l}>
                  <strong>{c.l}</strong>
                  <span>{c.d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="prose">
            <p>
              Diplômé D.O. en 2004 par la Collégiale Académique de France (n°379), j'ai validé mon diplôme européen devant
              la Faculté de Médecine de Genève. J'appartiens à la génération charnière, celle qui a reçu son diplôme
              pendant la structuration historique de la profession, avant les décrets de 2007.
            </p>
            <p>
              Enseignant pendant 17 ans à l'École Supérieure d'Ostéopathie de Paris (campus Descartes), j'ai formé de
              nombreux ostéopathes aujourd'hui en exercice. Ma filiation est directe : Viola Frymann, Wernham, Paoletti,
              Caporossi, Briend.
            </p>
            <p>
              Mon approche est systémique et neurovégétative, fondée sur la neurophysiologie, jamais sur les thérapies
              énergétiques. L'ostéopathie telle que je la pratique est une technique réflexe : je dialogue avec votre
              système nerveux pour restaurer les conditions de votre vitalité.
            </p>
            <p>
              <a className="link" href="/#parcours">
                Découvrir mon parcours complet
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="chapter" aria-labelledby="quartier-title">
        <div className="wrap split">
          <div className="split__aside">
            <div className="chapter__head" data-build>
              <p className="t-kicker">Votre quartier</p>
              <h2 id="quartier-title" className="t-title">
                Un cabinet au cœur du 7e arrondissement
              </h2>
            </div>
            <div className="prose">
              <p>
                Le cabinet est situé au 72 avenue de la Bourdonnais, dans le quartier du Gros-Caillou, à quelques minutes
                à pied de l'École Militaire, du Champ-de-Mars et de la Tour Eiffel.
              </p>
              <p>
                Facilement accessible en métro (ligne 8, stations École Militaire et La Tour-Maubourg), le cabinet
                accueille les habitants du 7e arrondissement ainsi que des patients venus de tout Paris, de province et de
                l'étranger.
              </p>
              <p>Consultations à domicile possibles pour les patients à mobilité réduite (Paris 7e et arrondissements limitrophes).</p>
            </div>
            <ul className="tags" aria-label="Lieux proches du cabinet">
              {QUARTIER.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
          <div className="quartier__aside">
            <MapFrame />
            <FactSheet />
          </div>
        </div>
      </section>

      <section className="chapter chapter--linen" aria-labelledby="articles-title">
        <div className="wrap">
          <div className="chapter__head" data-build>
            <p className="t-kicker">Recherche et conseils</p>
            <h2 id="articles-title" className="t-title">
              Articles de votre ostéopathe à Paris 7e
            </h2>
          </div>
          <div className="reads">
            {related.map((p) => (
              <Link className="read" key={p.id} to={`/blog/${p.id}`}>
                <span className="read__meta">
                  <span className="read__cat">{p.tag}</span>
                  <span>{p.readTime}</span>
                </span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="read__date">{formatDate(p.date)}</span>
              </Link>
            ))}
          </div>
          <p className="reads__more">
            <Link className="link" to="/blog">
              Tous les articles du blog
            </Link>
          </p>
        </div>
      </section>

      <section className="chapter cta" aria-labelledby="rdv-title" data-contact>
        <div className="wrap">
          <div data-build>
            <h2 id="rdv-title" className="t-title">
              Prendre rendez-vous avec votre ostéopathe à Paris 7e
            </h2>
            <p className="t-lede cta__lede">
              Appelez directement ou envoyez un SMS, je vous réponds personnellement. Pas de Doctolib, par choix :
              l'ostéopathie est une relation, pas une prestation.
            </p>
          </div>
          <a className="contact__phone" href={PHONE_TEL} aria-label={`Appeler le cabinet au ${PHONE}`}>
            {PHONE}
          </a>
          <div className="actions">
            <a className="btn btn--primary" href={PHONE_TEL}>
              <IconPhone /> Appeler le cabinet
            </a>
            <a className="btn btn--ghost" href={MOBILE_SMS}>
              <IconMessage /> SMS ou appel <span className="btn__meta">{MOBILE}</span>
            </a>
          </div>
          <p className="t-small cta__note">
            72 avenue de la Bourdonnais, 75007 Paris ·{" "}
            <a className="link" href={REVIEW_URL} target="_blank" rel="noopener noreferrer">
              Laisser un avis sur Google
            </a>
          </p>
        </div>
      </section>
      <Newsletter />
    </main>
  );
}
