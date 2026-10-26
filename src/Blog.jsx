import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, CallActions, IconBack, IconPlus } from "./Layout.jsx";
import { Newsletter } from "./Site.jsx";
import NotFound from "./NotFound.jsx";
import { SsrData } from "./ssr-data.js";
import { PHONE, PHONE_TEL, MOBILE, MOBILE_TEL, formatDate, sortByDateDesc } from "./site-config.js";
import postsIndex from "./posts-index.json";

/* Découpe le texte d'un article en titres et paragraphes
 * (même règle que les versions précédentes du site). */
function parseContent(content) {
  const lines = content.split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const prevEmpty = i === 0 || lines[i - 1].trim() === "";
    const nextEmpty = i === lines.length - 1 || lines[i + 1]?.trim() === "";
    const isHeading = prevEmpty && nextEmpty && line.length < 120 && !line.endsWith(".");
    blocks.push({ type: isHeading ? "h2" : "p", text: line, key: i });
  }
  return blocks;
}

function ArticleBody({ data }) {
  const blocks = parseContent(data.content);
  const nodes = blocks.map((b) => (b.type === "h2" ? <h2 key={b.key}>{b.text}</h2> : <p key={b.key}>{b.text}</p>));
  if (data.redflags) {
    nodes.splice(
      1,
      0,
      <aside className="redflags" key="redflags" aria-label={data.redflags.title}>
        <p className="redflags__title">{data.redflags.title}</p>
        <p>{data.redflags.text}</p>
      </aside>
    );
  }
  return <div className="article__body">{nodes}</div>;
}

function Article({ post }) {
  const ssr = useContext(SsrData);
  const [article, setArticle] = useState(() =>
    ssr && ssr.article && ssr.article.id === post.id ? ssr.article : null
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (article && article.id === post.id) return undefined;
    let cancelled = false;
    setFailed(false);
    fetch(`/blog/${post.id}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setArticle({ id: post.id, data });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [post.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const data = article && article.id === post.id ? article.data : null;
  const others = sortByDateDesc(postsIndex)
    .filter((p) => p.id !== post.id)
    .slice(0, 2);

  return (
    <main id="contenu">
      <article className="article">
        <header className="article__head">
          <div className="wrap wrap--text">
            <Breadcrumbs items={[{ label: "Accueil", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.title }]} />
            <p className="t-kicker">
              {post.tag} · {post.readTime}
            </p>
            <h1 className="t-title article__title">{post.title}</h1>
            <div className="byline">
              <img src="/img/nicolas-mildner-avatar.jpg" alt="Nicolas Mildner, ostéopathe D.O. Paris 7" width="400" height="400" decoding="async" />
              <p>
                Publié le {formatDate(post.date)}
                <span>Nicolas Mildner, Ostéopathe D.O.</span>
              </p>
            </div>
          </div>
        </header>

        <div className="wrap wrap--text">
          {data ? (
            <>
              <ArticleBody data={data} />
              <p className="article__contact">
                Pour en discuter, Nicolas Mildner,{" "}
                <Link className="link" to="/osteopathe-paris-7">
                  ostéopathe D.O. à Paris 7e
                </Link>
                , est joignable au{" "}
                <a className="link" href={PHONE_TEL}>
                  {PHONE}
                </a>{" "}
                ; rendez-vous uniquement par téléphone ou SMS.
              </p>

              {data.faq && data.faq.length > 0 && (
                <section className="article__section" aria-labelledby="article-faq">
                  <h2 id="article-faq">Questions fréquentes</h2>
                  <div className="faq">
                    {data.faq.map((item) => (
                      <details key={item.q}>
                        <summary>
                          {item.q}
                          <IconPlus />
                        </summary>
                        <p>{item.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {data.sources && data.sources.length > 0 && (
                <section className="article__section sources" aria-labelledby="article-sources">
                  <h2 id="article-sources">Sources</h2>
                  <ol>
                    {data.sources.map((s) => (
                      <li key={s.url + s.text}>
                        <a href={s.url} target="_blank" rel="noopener">
                          {s.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </>
          ) : failed ? (
            <p className="article__status" role="status">
              L'article n'a pas pu être chargé. Vérifiez votre connexion, puis rechargez la page.
            </p>
          ) : (
            <p className="article__status" role="status">
              Chargement de l'article…
            </p>
          )}

          <footer className="author">
            <img src="/img/nicolas-mildner-avatar.jpg" alt="Nicolas Mildner — ostéopathe D.O. à Paris 7 (75007)" width="400" height="400" loading="lazy" decoding="async" />
            <div>
              <p className="author__name">Nicolas Mildner</p>
              <p className="author__role">Ostéopathe D.O., D.O.E., D.O.F. — Paris 7e</p>
              <p>
                22 ans de pratique clinique. Filiation Frymann, Paoletti, Caporossi, Wernham, Briend. Approche systémique
                et neurovégétative.
              </p>
              <p>
                72 avenue de la Bourdonnais, 75007 Paris ·{" "}
                <a className="link" href={PHONE_TEL}>
                  {PHONE}
                </a>{" "}
                ·{" "}
                <a className="link" href={MOBILE_TEL}>
                  {MOBILE}
                </a>
              </p>
            </div>
          </footer>
        </div>
      </article>

      <section className="chapter chapter--linen more-reads" aria-labelledby="more-title">
        <div className="wrap">
          <div className="more-reads__head">
            <h2 id="more-title" className="t-title t-title--compact">
              À lire aussi
            </h2>
            <Link className="link back-link" to="/blog">
              <IconBack /> Tous les articles
            </Link>
          </div>
          <div className="reads reads--two">
            {others.map((p) => (
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
      <section className="chapter cta" aria-labelledby="rdv-title" data-contact>
        <div className="wrap">
          <h2 id="rdv-title" className="t-title t-title--compact">
            Consulter au cabinet
          </h2>
          <p className="t-lede cta__lede">72 avenue de la Bourdonnais, Paris 7e. Rendez-vous par téléphone ou SMS.</p>
          <CallActions />
        </div>
      </section>
    </main>
  );
}

function Listing() {
  const [tag, setTag] = useState("all");
  const sorted = sortByDateDesc(postsIndex);
  const tags = ["all", ...new Set(sorted.map((p) => p.tag))];
  const list = tag === "all" ? sorted : sorted.filter((p) => p.tag === tag);

  return (
    <main id="contenu">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="wrap">
          <Breadcrumbs items={[{ label: "Accueil", to: "/" }, { label: "Blog" }]} />
          <h1 id="page-title" className="t-title page-hero__title">
            Le blog du cabinet
            <span className="sr-only"> — </span>
            <span className="page-hero__sub">Nicolas Mildner, Ostéopathe D.O. Paris 7e</span>
          </h1>
          <p className="t-lede">Articles fondés sur la recherche PubMed. Vulgarisés, sourcés, rigoureux.</p>
        </div>
      </section>
      <section className="chapter blog-list" aria-label="Articles">
        <div className="wrap">
          <div className="filters" role="group" aria-label="Filtrer par thème">
            {tags.map((t) => (
              <button key={t} type="button" className="filter" aria-pressed={tag === t} onClick={() => setTag(t)}>
                {t === "all" ? "Tous les articles" : t}
              </button>
            ))}
          </div>
          <ol className="posts">
            {list.map((p) => (
              <li key={p.id}>
                <Link className="post" to={`/blog/${p.id}`}>
                  <span className="post__meta">
                    <span className="read__cat">{p.tag}</span>
                    <span>{formatDate(p.date)}</span>
                    <span>{p.readTime}</span>
                  </span>
                  <span className="post__body">
                    <h2>{p.title}</h2>
                    <p>{p.excerpt}</p>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          {list.length === 0 && <p className="t-small">Aucun article dans ce thème pour le moment.</p>}
        </div>
      </section>
      <Newsletter />
    </main>
  );
}

export default function Blog({ initialPost }) {
  if (!initialPost) return <Listing />;
  const post = postsIndex.find((p) => p.id === initialPost);
  if (!post) return <NotFound />;
  return <Article post={post} key={post.id} />;
}
