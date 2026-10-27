import { useState } from "react";
import { Link } from "react-router-dom";
import { CallActions, IconArrow, IconPlus, IconPhone, IconMessage } from "./Layout.jsx";
import { PHONE, PHONE_TEL, MOBILE, MOBILE_SMS, FACTS, MAP_EMBED, MAPS_URL, REVIEW_URL, formatDate, sortByDateDesc } from "./site-config.js";
import { PRINCIPLES, STEPS, TECHNIQUES, FIELD_GROUPS, CREDENTIALS, TESTIMONIALS, HERO_MARKERS } from "./homeContent.js";
import homeFaq from "./home-faq.json";
import posts from "./posts-index.json";

/* ═══ Ouverture ═══ */
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__text">
          <p className="t-kicker hero__kicker">Cabinet Bourdonnais, Paris 7e, depuis 2004</p>
          <h1 id="hero-title">
            <span className="hero__name t-display">Nicolas Mildner</span>
            <span className="sr-only"> — </span>
            <span className="hero__role">Ostéopathe D.O. à Paris 7 — 75007</span>
          </h1>
          <p className="t-lede hero__lede">
            Une ostéopathie exclusivement douce, sans aucun craquement, fondée sur l'anatomie et la neurophysiologie.
            Adultes, femmes enceintes, nourrissons, enfants, sportifs, musiciens.
          </p>
          <CallActions hero />
          <p className="t-small hero__note">
            Rendez-vous par téléphone ou SMS uniquement, pas de réservation en ligne : c'est un choix.
            <br />
            72 avenue de la Bourdonnais, 75007 Paris · Métro École Militaire (ligne 8)
          </p>
        </div>
        <div className="hero__aside">
          <figure className="hero__figure">
            <picture>
              <source media="(max-width: 860px)" srcSet="/img/nicolas-mildner-cabinet.webp" width="800" height="532" />
              <img
                className="hero__photo"
                src="/img/nicolas-mildner-portrait.webp"
                alt="Nicolas Mildner, ostéopathe D.O. à Paris 7 (75007) — Cabinet Bourdonnais, 72 avenue de la Bourdonnais"
                width="638"
                height="798"
                fetchpriority="high"
                decoding="async"
              />
            </picture>
          </figure>
          <dl className="hero__markers" aria-label="Repères">
            {HERO_MARKERS.map((m) => (
              <div key={m.value}>
                <dt>{m.value}</dt>
                <dd>{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ═══ En résumé : réponse directe pour les patients comme pour les moteurs ═══ */
function Summary() {
  return (
    <section className="facts" aria-labelledby="facts-title">
      <div className="wrap facts__grid">
        <div>
          <h2 id="facts-title" className="facts__title">En résumé</h2>
          <p className="facts__summary">{homeFaq.aiSummary}</p>
        </div>
        <dl className="facts__list">
          <div>
            <dt>Consultation</dt>
            <dd>
              80 à 90 €<span>45 minutes à 1 heure · chèque ou espèces</span>
            </dd>
          </div>
          <div>
            <dt>Horaires</dt>
            <dd>
              Lundi, mardi, jeudi, vendredi 9h–21h<span>Mercredi 12h–21h</span>
            </dd>
          </div>
          <div>
            <dt>Accès</dt>
            <dd>
              Métro École Militaire<span>ou La Tour-Maubourg, ligne 8 · quartier Gros-Caillou</span>
            </dd>
          </div>
          <div>
            <dt>Rendez-vous</dt>
            <dd>
              Par téléphone ou SMS<span>Pas de réservation en ligne, pas de Doctolib</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ═══ Manifeste ═══ */
function Manifesto() {
  return (
    <section className="chapter manifesto" aria-labelledby="manifesto-title">
      <div className="wrap">
        <div data-build>
          <h2 id="manifesto-title" className="t-statement">
            Chaque patient est un cas jamais vu.
          </h2>
          <div className="manifesto__body">
            <p className="manifesto__label">La Loi du Cas Unique</p>
            <div className="manifesto__text">
              <p>
                Pas de protocole. Pas de recette. L'ostéopathie n'est pas un produit, c'est une relation. Chaque
                consultation part de vous : votre histoire, votre terrain, votre manière de réagir.
              </p>
              <p>
                C'est ce qui fait de moi un généraliste hyperspécialiste : dix-huit champs d'expertise, une approche
                systémique et neurovégétative fondée sur la neurophysiologie, jamais énergétique, et une filiation
                directe avec les fondateurs de l'ostéopathie. Des patients venus de Paris, de province, d'Europe et des
                États-Unis, et des médecins comme des chirurgiens qui me font confiance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Approche ═══ */
function Approach() {
  return (
    <section className="chapter" id="approche" aria-labelledby="approche-title">
      <div className="wrap split">
        <div className="split__aside">
          <div className="chapter__head" data-build>
            <p className="t-kicker">Mon approche</p>
            <h2 id="approche-title" className="t-title">
              Systémique, neurovégétative, vivante.
            </h2>
            <p className="t-lede">
              L'ostéopathie est avant tout une technique réflexe. Je ne « remets pas en place » : je dialogue avec votre
              système nerveux pour restaurer les conditions de votre vitalité.
            </p>
          </div>
        </div>
        <div className="rows">
          {PRINCIPLES.map((p) => (
            <article className="row" key={p.title}>
              <h3 className="t-subtitle">{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Consultation : une vraie séquence, donc numérotée ═══ */
function Consultation() {
  return (
    <section className="chapter chapter--linen" id="consultation" aria-labelledby="consultation-title">
      <div className="wrap">
        <div className="chapter__head" data-build>
          <h2 id="consultation-title" className="t-title">
            Le temps d'une vraie consultation.
          </h2>
          <p className="t-lede">
            45 minutes à une heure, jamais de patient pressé. Vingt-deux ans de palpation clinique, le pouls de Paul
            Nogier et des dissections à la Faculté de Médecine : mes mains perçoivent ce que les appareils ne montrent
            pas.
          </p>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step__num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="t-subtitle">{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="techniques">
          <div>
            <h3 className="t-subtitle">Techniques pratiquées</h3>
            <p className="t-small techniques__note">
              Techniques douces exclusivement, modèles personnels.{" "}
              <Link className="link" to="/osteopathe-sans-craquement-paris-7">
                Pourquoi une ostéopathie sans craquement
              </Link>
            </p>
          </div>
          <ul className="techniques__list">
            {TECHNIQUES.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══ Champs d'expertise : un index, pas une grille de cartes ═══ */
function Expertise() {
  return (
    <section className="chapter" id="expertise" aria-labelledby="expertise-title">
      <span id="specs" className="anchor-alias" aria-hidden="true" />
      <div className="wrap">
        <div className="chapter__head" data-build>
          <p className="t-kicker">18 champs d'expertise</p>
          <h2 id="expertise-title" className="t-title">
            Généraliste hyperspécialiste.
          </h2>
          <p className="t-lede">
            Là où d'autres orientent, je prends en charge. Un vertige peut venir des cervicales, une infertilité du
            bassin, un trouble de la voix du thorax. Tout est connecté.
          </p>
        </div>
        {FIELD_GROUPS.map((group) => (
          <div className="field-group" key={group.title}>
            <h3 className="field-group__title">
              {group.title}
              <span className="field-group__count">{group.fields.length} champs</span>
            </h3>
            <ul className="field-list">
              {group.fields.map((f) => (
                <li className="field" key={f.title}>
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                  {f.href && (
                    <Link className="link field__link" to={f.href}>
                      {f.linkLabel} <IconArrow />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="also">
          <span className="also__label">Également</span>
          <Link className="link" to="/cervicalgie-torticolis-paris-7">
            Cervicalgie et torticolis
          </Link>
          <Link className="link" to="/urgence-osteopathe-paris-7">
            Douleur aiguë, dos bloqué
          </Link>
          <Link className="link" to="/osteopathe-paris-7">
            Votre ostéopathe à Paris 7
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ═══ Filiation : le chapitre sombre ═══ */
function Lineage() {
  return (
    <section className="chapter chapter--night" id="filiation" aria-labelledby="filiation-title">
      <span id="heritage" className="anchor-alias" aria-hidden="true" />
      <div className="wrap">
        <div className="chapter__head" data-build>
          <p className="t-kicker">Héritage</p>
          <h2 id="filiation-title" className="t-title">
            Une filiation directe, de main à main, depuis 1874.
          </h2>
          <p className="t-lede">
            L'ostéopathie se transmet de maître à élève, par les mains. J'ai reçu cette chaîne directement, auprès de
            Viola Frymann, John Wernham, René Briend, Serge Paoletti et Roger Caporossi. Une formation que les écoles
            d'aujourd'hui ne transmettent plus.
          </p>
        </div>

        <figure className="lineage">
          <figcaption className="sr-only">
            Deux branches issues de W.G. Sutherland, la tradition crânienne et la biodynamique fluidique, réunies dans la
            pratique de Nicolas Mildner.
          </figcaption>
          <div className="lineage__node">
            <span className="lineage__name">Andrew Taylor Still</span>
            <span className="lineage__meta">Fondateur de l'ostéopathie, 1874</span>
          </div>
          <div className="lineage__stem" aria-hidden="true" />
          <div className="lineage__node">
            <span className="lineage__name">W.G. Sutherland</span>
            <span className="lineage__meta">Concept crânien (1873–1954)</span>
          </div>
          <div className="lineage__stem" aria-hidden="true" />
          <div className="lineage__branches">
            <div className="lineage__branch">
              <p className="lineage__branch-title">Tradition crânienne</p>
              <p className="lineage__branch-role">Formation initiale</p>
              <ol>
                <li>
                  <span className="lineage__name">Viola Frymann</span>
                  <span className="lineage__meta">1921–2016 · Magoun, Schooley</span>
                </li>
                <li>
                  <span className="lineage__name">F. Peyralade</span>
                  <span className="lineage__meta">1928–2013 · SERETO, 1978</span>
                </li>
                <li>
                  <span className="lineage__name">Roger Caporossi</span>
                  <span className="lineage__meta">Fonde l'ESO, 1990</span>
                </li>
                <li>
                  <span className="lineage__name">ESO Paris</span>
                  <span className="lineage__meta">Formation 1998–2004, puis 17 ans d'enseignement</span>
                </li>
              </ol>
            </div>
            <div className="lineage__branch">
              <p className="lineage__branch-title">Biodynamique fluidique</p>
              <p className="lineage__branch-role">Approfondissement</p>
              <ol>
                <li>
                  <span className="lineage__name">R.E. Becker</span>
                  <span className="lineage__meta">1910–1996 · travaux tardifs de Sutherland</span>
                </li>
                <li>
                  <span className="lineage__name">J.A. Duval</span>
                  <span className="lineage__meta">Élève direct de Becker</span>
                </li>
                <li>
                  <span className="lineage__name">René Briend</span>
                  <span className="lineage__meta">Modèle fluidique, 1999</span>
                </li>
              </ol>
            </div>
          </div>
          <div className="lineage__join" aria-hidden="true" />
          <div className="lineage__node lineage__node--heir">
            <span className="lineage__name">Nicolas Mildner D.O.</span>
            <span className="lineage__meta">Ostéopathe exclusif depuis 2004</span>
          </div>
        </figure>

        <div className="masters">
          <h3 className="t-subtitle">Les autres maîtres</h3>
          <div>
            <p>
              <strong>J.M. Littlejohn</strong> et <strong>John Wernham</strong>, bâtisseurs de l'ostéopathie européenne ;{" "}
              <strong>Serge Paoletti</strong>, pionnier de l'approche fasciale ; <strong>Didier Lehougre</strong>, le{" "}
              <strong>GLEM de Lyon</strong>, <strong>Latour</strong> et <strong>Foissy</strong>, architectes de
              l'ostéopathie française. René Briend m'a proposé d'intégrer son équipe pédagogique de succession : j'ai
              décliné, par exigence envers moi-même.
            </p>
            <blockquote className="pullquote masters__quote">
              « Lorsque j'ai commencé en 1998, le Registre des Ostéopathes de France ne comptait que quelques centaines
              de D.O. Aujourd'hui, ils sont plus de 47 000. La formation que j'ai reçue appartient à un autre monde. »
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Parcours ═══ */
function Background() {
  return (
    <section className="chapter" id="parcours" aria-labelledby="parcours-title">
      <div className="wrap">
        <div className="chapter__head" data-build>
          <p className="t-kicker">Parcours</p>
          <h2 id="parcours-title" className="t-title">
            L'une des premières générations d'ostéopathes D.O. en France.
          </h2>
        </div>
      </div>
      <div className="wrap split">
        <div className="split__aside">
          <ul className="credentials">
            {CREDENTIALS.map((c) => (
              <li key={c.title}>
                <strong>{c.title}</strong>
                {c.text && <span>{c.text}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="prose">
            <p className="t-lede">
              Diplômé D.O. en 2004 par la Collégiale Académique de France, j'appartiens à la génération charnière, celle
              qui a reçu son diplôme pendant la structuration historique de la profession, avant les décrets de 2007.
            </p>
            <p>
              J'ai validé mon diplôme européen (D.O.E.) devant la Faculté de Médecine de Genève, un diplôme que très peu
              d'ostéopathes ont passé. Mon D.O.F. a été obtenu par Validation des Acquis de l'Expérience, alors que
              j'enseignais déjà aux futurs diplômés à l'ESO, école d'ostéopathie située sur le campus universitaire
              Descartes.
            </p>
            <p>
              À l'ESO, j'ai enseigné cinq matières pendant dix-sept ans : clinique, générale, myofasciale
              thoraco-abdominale, viscérale et structurelle. J'ai participé à la formation de nombreux ostéopathes
              aujourd'hui en exercice, intégré les commissions de recherche, de pédagogie et d'évaluation, et participé
              aux travaux d'élaboration des standards de la profession.
            </p>
          </div>

          <figure className="dedications">
            <div className="dedications__items">
              <div className="dedication">
                <img
                  src="/autographe_Wernham.png"
                  alt="Dédicace manuscrite de John Wernham à Nicolas Mildner, 1999"
                  width="654"
                  height="513"
                  loading="lazy"
                  decoding="async"
                />
                <p>John Wernham, 1999</p>
              </div>
              <div className="dedication">
                <img
                  src="/autographe_roger.png"
                  alt="Dédicace manuscrite de Roger Caporossi à Nicolas Mildner, 2017"
                  width="859"
                  height="690"
                  loading="lazy"
                  decoding="async"
                />
                <p>Roger Caporossi, 2017</p>
              </div>
            </div>
            <figcaption className="t-small">Deux dédicaces reçues de mes maîtres, à dix-huit ans d'écart.</figcaption>
          </figure>

          <details className="readmore">
            <summary>
              <IconPlus />
              <span className="readmore__open">Lire la suite du parcours</span>
              <span className="readmore__close">Réduire</span>
            </summary>
            <div className="prose">
              <p>
                Ma formation est celle d'un autre temps : Viola Frymann lors de son séminaire sur les troubles
                neurologiques de l'enfant, Serge Paoletti (pionnier de l'approche fasciale), Roger Caporossi (approche
                fasciale, philosophie ostéopathique crânienne et neurovégétative), René Briend (pionnier de
                l'ostéopathie biodynamique, qui m'a proposé d'intégrer son équipe pédagogique de succession ; j'ai
                décliné, convaincu qu'il me fallait davantage de maturité clinique), Didier Lehougre, le GLEM de Lyon et
                l'Étiothérapie de Latour. Formé au pouls de Paul Nogier (RAC) depuis l'an 2000. De nombreuses formations
                diplômantes complètent ce parcours.
              </p>
              <p>
                Durant mes études, j'ai effectué de nombreux stages en milieu hospitalier (chirurgie de la main,
                pédiatrie, maternité) qui m'ont forgé un regard clinique et une capacité de diagnostic différentiel que
                la pratique en cabinet seule ne permet pas d'acquérir. J'ai également réalisé de nombreuses séances de
                dissection à la Faculté de Médecine de l'Université Paris Descartes, rue des Saints-Pères, notamment sur
                les nerfs crâniens : une connaissance anatomique directe, irremplaçable.
              </p>
              <p>
                Dès 2004, j'ai débuté mes consultations et intégré une équipe spécialisée en urgences ostéopathiques. En
                2005, j'ai créé un second cabinet au sein d'une équipe médicale pluridisciplinaire et contribué à un
                article du SFDO publié dans Le Monde. Depuis 2004, je prends en charge des professeurs et élèves de yoga
                et d'aïkido. Sensibilisé à l'homéopathie et aux avancées sur le microbiote, je propose également un
                accompagnement dans le cadre de bilans complémentaires (tests Zamaria, ImuPro, neurotransmetteurs).
              </p>
              <p>
                En vingt-deux ans de pratique, je n'ai jamais fait de publicité. Chaque patient est venu par le
                bouche-à-oreille, de Paris, de province, d'Europe et des États-Unis : des médecins, des chirurgiens, des
                personnalités, des musiciens, des sportifs et des familles fidèles depuis deux décennies.
              </p>
            </div>
          </details>

          <div className="coda">
            <p className="pullquote">« C'est la Vie. »</p>
            <p>
              Je ne promets pas un résultat. La guérison dépend de ma pratique et de votre vitalité. Ce que je vous
              offre : vingt-deux ans d'écoute, de mains et d'intelligence clinique au service de votre système vivant.
              Chaque consultation est une rencontre unique. Pas un protocole. La vie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Preuve ═══ */
function Proof() {
  const [featured, ...others] = TESTIMONIALS;
  return (
    <section className="chapter chapter--linen" id="temoignages" aria-labelledby="temoignages-title">
      <div className="wrap">
        <div className="chapter__head" data-build>
          <p className="t-kicker">Témoignages</p>
          <h2 id="temoignages-title" className="t-title">
            Vingt-deux ans de bouche-à-oreille.
          </h2>
          <p className="t-lede">
            Aucune publicité depuis 2004. Quand des médecins, des chirurgiens et des patients qui prennent l'avion
            choisissent un praticien, c'est la meilleure preuve qui existe.
          </p>
        </div>
        <div className="quotes">
          <figure className="quote quote--featured">
            <p className="quote__stars" aria-label="5 étoiles sur 5">
              ★★★★★
            </p>
            <blockquote>« {featured.quote} »</blockquote>
            <figcaption>{featured.author}</figcaption>
          </figure>
          <div className="quotes__grid">
            {others.map((t) => (
              <figure className="quote" key={t.author}>
                <blockquote>« {t.quote} »</blockquote>
                <figcaption>{t.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <p className="quotes__more">
          <a className="link" href={REVIEW_URL} target="_blank" rel="noopener noreferrer">
            Laisser un avis sur Google
          </a>
        </p>
      </div>
    </section>
  );
}

/* ═══ Blog ═══ */
function Reads() {
  const sorted = sortByDateDesc(posts);
  const featured = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  return (
    <section className="chapter" id="blog" aria-labelledby="blog-title">
      <div className="wrap">
        <div className="chapter__head" data-build>
          <h2 id="blog-title" className="t-title">
            Le blog du cabinet.
          </h2>
          <p className="t-lede">
            Ce que dit réellement la recherche sur les motifs de consultation les plus fréquents : des articles fondés
            sur PubMed, vulgarisés et sourcés.
          </p>
        </div>
        <div className="reads">
          {featured.map((post) => (
            <Link className="read" key={post.id} to={`/blog/${post.id}`}>
              <span className="read__meta">
                <span className="read__cat">{post.tag}</span>
                <span>{post.readTime}</span>
              </span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="read__date">{formatDate(post.date)}</span>
            </Link>
          ))}
        </div>
        {rest.length > 0 && (
          <ul className="reads__list">
            {rest.map((post) => (
              <li key={post.id}>
                <Link to={`/blog/${post.id}`}>
                  <span className="reads__list-title">{post.title}</span>
                  <span className="reads__list-meta">
                    {post.tag} · {post.readTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="reads__more">
          <Link className="link" to="/blog">
            Tous les articles du blog
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ═══ Questions fréquentes ═══ */
function Faq() {
  return (
    <section className="chapter chapter--linen" id="faq" aria-labelledby="faq-title">
      <div className="wrap split">
        <div className="split__aside">
          <div className="chapter__head" data-build>
            <h2 id="faq-title" className="t-title t-title--compact">
              Questions fréquentes — Ostéopathe Paris 7e
            </h2>
            <p className="t-lede">
              Les réponses aux questions les plus courantes sur le cabinet, les motifs de consultation et la prise de
              rendez-vous.
            </p>
          </div>
        </div>
        <div className="faq">
          {homeFaq.questions.map((q) => (
            <details key={q.name}>
              <summary>
                {q.name}
                <IconPlus />
              </summary>
              <p>{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Prendre rendez-vous ═══ */
export function FactSheet({ title = "Cabinet d'ostéopathie à Paris 7 (75007) — fiche pratique" }) {
  return (
    <div className="factsheet">
      <h3 className="t-subtitle">{title}</h3>
      <dl>
        {FACTS.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function MapFrame() {
  return (
    <figure className="map">
      <iframe
        src={MAP_EMBED}
        title="Plan d'accès : cabinet de Nicolas Mildner, 72 avenue de la Bourdonnais, Paris 7e"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <figcaption>
        <a className="link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
          Ouvrir l'itinéraire dans Google Maps
        </a>
      </figcaption>
    </figure>
  );
}

function Contact() {
  return (
    <section className="chapter" id="contact" aria-labelledby="contact-title" data-contact>
      <div className="wrap contact__top">
        <div>
          <div data-build>
            <p className="t-kicker">Contact</p>
            <h2 id="contact-title" className="t-title">
              Prendre rendez-vous
            </h2>
            <p className="t-lede contact__lede">Par téléphone ou par SMS. Je vous réponds personnellement.</p>
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
        <div className="contact__why">
          <h3 className="t-subtitle">Pourquoi pas de Doctolib ?</h3>
          <p>
            L'ostéopathie n'est pas un produit à réserver en ligne. C'est une relation, et elle commence par un échange
            direct : vous m'appelez ou m'écrivez, je vous réponds moi-même.
          </p>
        </div>
      </div>
      <div className="wrap contact__details">
        <FactSheet />
        <MapFrame />
      </div>
    </section>
  );
}

/* ═══ Lettre mensuelle ═══ */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Cette adresse e-mail n'est pas valide. Vérifiez-la et réessayez.");
      return;
    }
    setStatus("loading");
    setMessage("Inscription en cours…");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const ct = r.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("bad-response");
      const d = await r.json();
      if (d.success) {
        setStatus("success");
        setEmail("");
        setMessage(d.already ? "Vous êtes déjà inscrit. Merci de votre fidélité." : "Inscription confirmée. Le prochain conseil arrive dans votre boîte.");
      } else {
        setStatus("error");
        setMessage(d.error || "L'inscription n'a pas abouti. Réessayez dans un instant.");
      }
    } catch {
      setStatus("error");
      setMessage("L'inscription n'a pas abouti : le service ne répond pas. Réessayez dans un instant.");
    }
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="wrap newsletter__grid">
        <div>
          <h2 id="newsletter-title" className="t-subtitle">
            Conseils ostéo, chaque mois
          </h2>
          <p className="t-small newsletter__note">Un conseil clinique pratique. Pas de spam, jamais.</p>
        </div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="newsletter-email">Adresse e-mail</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            aria-invalid={status === "error"}
            aria-describedby="newsletter-status"
          />
          <button className="btn btn--primary" type="submit" disabled={status === "loading"}>
            S'inscrire
          </button>
          <p id="newsletter-status" className={`newsletter__status is-${status}`} role="status" aria-live="polite">
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}

export default function Site() {
  return (
    <main id="contenu">
      <Hero />
      <Summary />
      <Manifesto />
      <Approach />
      <Consultation />
      <Expertise />
      <Lineage />
      <Background />
      <Proof />
      <Reads />
      <Faq />
      <Contact />
      <Newsletter />
    </main>
  );
}
