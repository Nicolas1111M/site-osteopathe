import { Link } from "react-router-dom";
import { CallActions } from "./Layout.jsx";

export default function NotFound() {
  return (
    <main id="contenu">
      <section className="page-hero notfound" aria-labelledby="page-title">
        <div className="wrap">
          <h1 id="page-title" className="t-title">
            Cette page n'existe pas.
          </h1>
          <p className="t-lede">
            L'adresse a peut-être changé. Retrouvez le cabinet depuis l'accueil, ou appelez directement pour prendre
            rendez-vous.
          </p>
          <p className="notfound__links">
            <Link className="link" to="/">
              Retour à l'accueil
            </Link>
            <Link className="link" to="/blog">
              Le blog du cabinet
            </Link>
          </p>
          <CallActions />
        </div>
      </section>
    </main>
  );
}
