import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs, CallActions, IconPhone, IconMessage, IconPlus } from "./Layout.jsx";
import { Newsletter } from "./Site.jsx";
import NotFound from "./NotFound.jsx";
import { PHONE, PHONE_TEL, MOBILE, MOBILE_SMS, formatDate } from "./site-config.js";
import localPagesData from "./local-pages-data.json";
import postsIndex from "./posts-index.json";

// Page de spécialité, entièrement pilotée par local-pages-data.json.

function shortName(h1) {
  return h1.split(/ — | : /)[0];
}

const NAV_LABELS = {
  "douleurs-dos-lombalgie-paris-7": "Lombalgie et mal de dos",
  "cervicalgie-torticolis-paris-7": "Cervicalgie et torticolis",
  "nourrisson-plagiocephalie-paris-7": "Nourrissons",
  "femme-enceinte-osteopathe-paris-7": "Grossesse",
  "bruxisme-atm-paris-7": "Bruxisme et ATM",
  "urgence-osteopathe-paris-7": "Urgence, douleur aiguë",
  "osteopathe-sans-craquement-paris-7": "Techniques douces, sans craquement",
};

export default function LocalSpecPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/|\/$/g, "");
  const page = localPagesData.find((p) => p.slug === slug);
  if (!page) return <NotFound />;

  const related = page.relatedBlogSlugs.map((s) => postsIndex.find((p) => p.id === s)).filter(Boolean);
  const [lead, ...intro] = page.introParagraphs;

  return (
    <main id="contenu">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: "Accueil", to: "/" },
              { label: "Ostéopathe Paris 7", to: "/osteopathe-paris-7" },
              { label: shortName(page.h1) },
            ]}
          />
          <div className="page-hero__grid page-hero__grid--spec">
            <div>
              <p className="t-kicker">{page.heroTag}</p>
              <h1 id="page-title" className="t-title page-hero__title">
                {page.h1}
              </h1>
              <p className="t-lede">{page.subtitle}</p>
              <CallActions hero />
              <p className="t-small page-hero__note">Pas de Doctolib, par choix. Rendez-vous par téléphone ou SMS.</p>
            </div>
            <aside className="practitioner" aria-label="Votre praticien">
              <img src="/img/nicolas-mildner-avatar.jpg" alt="Nicolas Mildner, ostéopathe D.O. à Paris 7 (75007)" width="400" height="400" decoding="async" />
              <div>
                <p className="practitioner__name">Nicolas Mildner</p>
                <p className="practitioner__role">Ostéopathe D.O., D.O.E., D.O.F.</p>
                <dl className="practitioner__facts">
                  <div>
                    <dt>Expérience</dt>
                    <dd>22 ans de pratique, 17 ans d'enseignement</dd>
                  </div>
                  <div>
                    <dt>Consultation</dt>
                    <dd>45 min à 1 h · 80 à 90 €</dd>
                  </div>
                  <div>
                    <dt>Cabinet</dt>
                    <dd>72 avenue de la Bourdonnais, Paris 7e</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {page.alert && (
        <section className="alert" aria-labelledby="alert-title">
          <div className="wrap alert__inner">
            <div>
              <h2 id="alert-title" className="alert__title">
                {page.alert.title}
              </h2>
              <p>{page.alert.text}</p>
              <p className="alert__flags">{page.alert.redflags}</p>
            </div>
            <ul className="alert__numbers">
              {page.alert.numbers.map((n) => (
                <li key={n.number}>
                  <a href={`tel:${n.number}`}>
                    <span className="alert__number">{n.number}</span>
                    <span className="alert__label">
                      {n.label}
                      <span>{n.desc}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="chapter spec-intro" aria-label="Présentation">
        <div className="wrap">
          <div className="prose prose--wide">
            <p className="t-lede">{lead}</p>
            {intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter chapter--linen" aria-labelledby="expertise-title">
        <div className="wrap split">
          <div className="split__aside">
            <div className="chapter__head" data-build>
              <p className="t-kicker">{page.expertiseLabel || "Prise en charge"}</p>
              <h2 id="expertise-title" className="t-title">
                {page.expertiseTitle || "Ce que je prends en charge"}
              </h2>
              <p className="t-lede">
                <Link className="link" to="/osteopathe-paris-7">
                  Voir toutes les spécialisations — Ostéopathe Paris 7e
                </Link>
              </p>
            </div>
          </div>
          <div className="rows">
            {page.expertise.map((e) => (
              <article className="row" key={e.title}>
                <h3 className="t-subtitle">{e.title}</h3>
                <p>{e.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band" aria-label="Votre praticien">
        <div className="wrap">
          <div className="bio">
            <img src="/img/nicolas-mildner-avatar.jpg" alt="" width="400" height="400" loading="lazy" decoding="async" />
            <div>
              <p className="bio__name">Nicolas Mildner, ostéopathe D.O.</p>
              <p>
                22 ans de pratique clinique. D.O. n°379, Collégiale Académique de France. Filiation directe : Frymann,
                Paoletti, Caporossi, Wernham, Briend. 17 ans d'enseignement à l'ESO Paris.
              </p>
              <a className="link" href="/#parcours">
                Mon parcours complet
              </a>
            </div>
          </div>
        </div>
      </section>

      {page.faq && page.faq.length > 0 && (
        <section className="chapter chapter--linen" aria-labelledby="faq-title">
          <div className="wrap split">
            <div className="split__aside">
              <div className="chapter__head" data-build>
                <p className="t-kicker">Questions fréquentes</p>
                <h2 id="faq-title" className="t-title t-title--compact">
                  Vos questions
                </h2>
              </div>
            </div>
            <div className="faq">
              {page.faq.map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q}
                    <IconPlus />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="chapter" aria-labelledby="related-title">
          <div className="wrap">
            <div className="chapter__head">
              <p className="t-kicker">Pour aller plus loin</p>
              <h2 id="related-title" className="t-title t-title--compact">
                Articles liés
              </h2>
            </div>
            <div className="reads reads--two">
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
          </div>
        </section>
      )}

      <section className="chapter chapter--linen cta" aria-labelledby="rdv-title" data-contact>
        <div className="wrap">
          <div data-build>
            <h2 id="rdv-title" className="t-title">
              Prendre rendez-vous
            </h2>
            <p className="t-lede cta__lede">
              Nicolas Mildner, ostéopathe D.O. à Paris 7e, 72 avenue de la Bourdonnais. Appelez ou envoyez un SMS.
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
        </div>
      </section>

      <nav className="spec-nav" aria-label="Autres consultations">
        <div className="wrap">
          <p className="t-small">Autres consultations</p>
          <ul>
            {localPagesData
              .filter((p) => p.slug !== page.slug)
              .map((p) => (
                <li key={p.slug}>
                  <Link className="link" to={`/${p.slug}`}>
                    {NAV_LABELS[p.slug] || shortName(p.h1)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>
      <Newsletter />
    </main>
  );
}
