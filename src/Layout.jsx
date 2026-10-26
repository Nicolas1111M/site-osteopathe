import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { initEditorialMotion } from "./editorialMotion.js";
import { metaForPath } from "./seo.js";
import { PHONE, PHONE_TEL, MOBILE, MOBILE_TEL, MOBILE_SMS, ADDRESS, REVIEW_URL } from "./site-config.js";

/* ---------- Icônes : un seul trait fin, cohérent sur tout le site ---------- */
export const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const IconMessage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </svg>
);
export const IconArrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
export const IconBack = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M13 8H3M7 4 3 8l4 4" />
  </svg>
);
export const IconPlus = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" focusable="false">
    <path d="M10 4v12M4 10h12" />
  </svg>
);

/* ---------- Boutons d'appel, identiques partout ---------- */
export function CallActions({ hero = false, smsLabel = "SMS", showNumbers = true }) {
  return (
    <div className="actions" {...(hero ? { "data-hero-actions": "" } : {})}>
      <a className="btn btn--primary" href={PHONE_TEL}>
        <IconPhone /> Appeler le cabinet {showNumbers && <span className="btn__meta">{PHONE}</span>}
      </a>
      <a className="btn btn--ghost" href={MOBILE_SMS}>
        <IconMessage /> {smsLabel} {showNumbers && <span className="btn__meta">{MOBILE}</span>}
      </a>
    </div>
  );
}

/* ---------- Fil d'Ariane visible (miroir du BreadcrumbList du pré-rendu) ---------- */
export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Fil d'Ariane">
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>
            {it.to && i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Comportements globaux liés à la navigation ---------- */
export function RouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  // Défilement : en haut à chaque nouvelle page, ou sur l'ancre demandée.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  // Titre, description et URL canonique : les mêmes valeurs que le pré-rendu.
  useEffect(() => {
    const meta = metaForPath(pathname);
    const set = (selector, attr, value) => {
      const el = document.head.querySelector(selector);
      if (el && value) el.setAttribute(attr, value);
    };
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!meta) {
      document.title = "Page introuvable — Nicolas Mildner, Ostéopathe D.O. Paris 7";
      if (robots) robots.setAttribute("content", "noindex, follow");
      return;
    }
    if (robots) robots.setAttribute("content", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    document.title = meta.title;
    set('meta[name="description"]', "content", meta.description);
    set('meta[property="og:title"]', "content", meta.title);
    set('meta[name="twitter:title"]', "content", meta.title);
    set('meta[property="og:description"]', "content", meta.ogDescription || meta.description);
    set('meta[name="twitter:description"]', "content", meta.ogDescription || meta.description);
    set('link[rel="canonical"]', "href", meta.canonical);
    set('meta[property="og:url"]', "content", meta.canonical);
  }, [pathname]);

  // Mouvement éditorial, réinitialisé pour chaque page.
  useEffect(() => {
    let dispose = () => {};
    const id = requestAnimationFrame(() => {
      dispose = initEditorialMotion();
    });
    return () => {
      cancelAnimationFrame(id);
      dispose();
    };
  }, [pathname]);

  return null;
}

/* ---------- En-tête ---------- */
const NAV = [
  { href: "/#approche", label: "Approche" },
  { href: "/#expertise", label: "Expertise" },
  { href: "/#filiation", label: "Filiation" },
  { href: "/#parcours", label: "Parcours" },
  { to: "/osteopathe-paris-7", label: "Paris 7e" },
  { to: "/blog", label: "Blog" },
];

function NavItem({ item, onNavigate }) {
  const { pathname } = useLocation();
  if (item.to) {
    const current = pathname === item.to || pathname.startsWith(`${item.to}/`);
    return (
      <Link to={item.to} onClick={onNavigate} aria-current={current ? "page" : undefined}>
        {item.label}
      </Link>
    );
  }
  // Sur l'accueil, l'ancre suffit ; ailleurs, on rejoint l'accueil à la bonne section.
  const href = pathname === "/" ? item.href.slice(1) : item.href;
  return (
    <a href={href} onClick={onNavigate}>
      {item.label}
    </a>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        if (toggleRef.current) toggleRef.current.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap site-header__inner">
          <Link to="/" className="brand" aria-label="Nicolas Mildner, ostéopathe D.O. — accueil">
            <span className="brand__name">Nicolas Mildner</span>
            <span className="brand__title">Ostéopathe D.O.</span>
          </Link>
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </nav>
          <a className="btn btn--primary header-call" href={PHONE_TEL}>
            <IconPhone />
            {PHONE}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </header>
      <div id="menu-sheet" className="menu-sheet" hidden={!open}>
        <nav aria-label="Navigation mobile">
          {NAV.map((item) => (
            <NavItem key={item.label} item={item} onNavigate={close} />
          ))}
          <a href={contactHref} onClick={close}>
            Prendre rendez-vous
          </a>
        </nav>
        <div className="menu-sheet__actions">
          <a className="btn btn--primary" href={PHONE_TEL}>
            <IconPhone /> Appeler le cabinet <span className="btn__meta">{PHONE}</span>
          </a>
          <a className="btn btn--ghost" href={MOBILE_SMS}>
            <IconMessage /> SMS <span className="btn__meta">{MOBILE}</span>
          </a>
        </div>
      </div>
    </>
  );
}

/* ---------- Barre d'appel mobile ----------
 * Apparaît quand les boutons d'appel du haut de page ont quitté l'écran,
 * s'efface quand la section de prise de rendez-vous est visible. */
export function CallBar() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const hero = document.querySelector("[data-hero-actions]");
    const contact = document.querySelector("[data-contact]");
    const state = { heroVisible: Boolean(hero), contactVisible: false };
    const update = () => setVisible(!state.heroVisible && !state.contactVisible);
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) state.heroVisible = e.isIntersecting;
        if (e.target === contact) state.contactVisible = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    update();
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div className={`callbar${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <a className="callbar__call" href={PHONE_TEL} tabIndex={visible ? 0 : -1}>
        <IconPhone /> Appeler
      </a>
      <a className="callbar__sms" href={MOBILE_SMS} tabIndex={visible ? 0 : -1}>
        <IconMessage /> SMS
      </a>
    </div>
  );
}

/* ---------- Pied de page ---------- */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__lead">
            <p className="footer__brand">Nicolas Mildner</p>
            <p className="footer__meta">Ostéopathe D.O., D.O.E., D.O.F.</p>
            <p className="footer__contact">
              {ADDRESS}
              <br />
              <a href={PHONE_TEL}>{PHONE}</a> · <a href={MOBILE_TEL}>{MOBILE}</a>
            </p>
          </div>
          <div className="footer__col">
            <h2>Le cabinet</h2>
            <ul>
              <li><a href="/#approche">Approche</a></li>
              <li><a href="/#filiation">Filiation</a></li>
              <li><a href="/#parcours">Parcours</a></li>
              <li><Link to="/osteopathe-paris-7">Ostéopathe Paris 7</Link></li>
              <li><Link to="/urgence-osteopathe-paris-7">Urgence ostéopathe</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h2>Consultations</h2>
            <ul>
              <li><Link to="/douleurs-dos-lombalgie-paris-7">Lombalgie et mal de dos</Link></li>
              <li><Link to="/cervicalgie-torticolis-paris-7">Cervicalgie et torticolis</Link></li>
              <li><Link to="/nourrisson-plagiocephalie-paris-7">Nourrissons</Link></li>
              <li><Link to="/femme-enceinte-osteopathe-paris-7">Grossesse</Link></li>
              <li><Link to="/bruxisme-atm-paris-7">Bruxisme et ATM</Link></li>
              <li><Link to="/osteopathe-sans-craquement-paris-7">Techniques douces</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h2>Contact</h2>
            <ul>
              <li><a href={PHONE_TEL}>Appeler le cabinet</a></li>
              <li><a href={MOBILE_SMS}>Envoyer un SMS</a></li>
              <li><a href={REVIEW_URL} target="_blank" rel="noopener noreferrer">Laisser un avis Google</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Nicolas Mildner — Ostéopathe D.O. — Paris 7e — La Loi du Cas Unique</span>
          <span>
            Annuaire ostéopathes : <a href="https://www.proxiosteo.fr" target="_blank" rel="noopener">proxiosteo.fr</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
