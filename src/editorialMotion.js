/*
 * Mouvement éditorial lié au défilement.
 *
 * Un bloc « titre + paragraphe » (attribut data-build) monte légèrement en
 * gagnant en opacité pendant qu'il traverse la zone 88 % → 66 % de la hauteur
 * visible. Le suivi est amorti (approche exponentielle, indépendante de la
 * fréquence d'affichage) et réversible.
 *
 * Garanties :
 * - rien n'est masqué sans JavaScript (les styles ne s'appliquent que sous
 *   html.motion-ready) ;
 * - prefers-reduced-motion : aucun effet, y compris si la préférence change ;
 * - un bloc déjà visible au chargement s'affiche immédiatement ;
 * - un bloc qui reçoit le focus clavier devient immédiatement opaque ;
 * - seules opacity et transform sont animées.
 */

const SETTINGS = {
  distance: 40, // translation verticale maximale, en px
  start: 0.88, // le bloc commence à apparaître quand son haut atteint 88 % de la hauteur
  end: 0.66, // et il est entièrement posé à 66 %
  tau: 120, // constante d'amortissement, en ms
};

export function initEditorialMotion(root = document) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  if ((media && media.matches) || !window.requestAnimationFrame) return () => {};

  const elements = Array.from(root.querySelectorAll("[data-build]"));
  if (!elements.length) return () => {};

  const html = document.documentElement;
  let frame = 0;
  let last = 0;
  let disposed = false;

  const viewport = () => window.innerHeight || html.clientHeight;

  const progressFor = (el) => {
    const vh = viewport();
    const top = el.getBoundingClientRect().top;
    const start = vh * SETTINGS.start;
    const end = vh * SETTINGS.end;
    return Math.max(0, Math.min(1, (start - top) / (start - end)));
  };

  const records = elements.map((el) => {
    // Visible dès le chargement : aucun délai, aucune animation.
    const initial = el.getBoundingClientRect().top < viewport() * SETTINGS.start ? 1 : 0;
    return { el, current: initial, target: initial, forced: false };
  });

  const paint = (r) => {
    const p = r.current;
    r.el.style.setProperty("--build-o", p.toFixed(4));
    r.el.style.setProperty("--build-y", `${((1 - p) * SETTINGS.distance).toFixed(2)}px`);
  };

  const tick = (now) => {
    frame = 0;
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    const k = 1 - Math.exp(-dt / SETTINGS.tau);
    let moving = false;
    for (const r of records) {
      const delta = r.target - r.current;
      if (Math.abs(delta) < 0.002) {
        if (r.current !== r.target) {
          r.current = r.target;
          paint(r);
        }
        r.el.classList.remove("is-building");
        continue;
      }
      r.current += delta * k;
      r.el.classList.add("is-building");
      paint(r);
      moving = true;
    }
    if (moving && !disposed) frame = requestAnimationFrame(tick);
    else last = 0;
  };

  const schedule = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(tick);
  };

  const refresh = () => {
    // En bas de page, un bloc visible qui ne peut plus monter jusqu'à 66 % est posé.
    const vh = viewport();
    const atBottom = window.scrollY + vh >= html.scrollHeight - 2;
    for (const r of records) {
      if (r.forced) r.target = 1;
      else if (atBottom && r.el.getBoundingClientRect().top < vh) r.target = 1;
      else r.target = progressFor(r.el);
    }
    schedule();
  };

  const onFocus = (event) => {
    const group = event.target && event.target.closest ? event.target.closest("[data-build]") : null;
    if (!group) return;
    const r = records.find((item) => item.el === group);
    if (!r) return;
    r.forced = true;
    r.target = 1;
    r.current = 1;
    paint(r);
  };

  const dispose = () => {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("scroll", refresh);
    window.removeEventListener("resize", refresh);
    document.removeEventListener("focusin", onFocus);
    if (media && media.removeEventListener) media.removeEventListener("change", onMotionChange);
    html.classList.remove("motion-ready");
    for (const r of records) {
      r.el.style.removeProperty("--build-o");
      r.el.style.removeProperty("--build-y");
      r.el.classList.remove("is-building");
    }
  };

  function onMotionChange(event) {
    if (event.matches) dispose();
  }

  records.forEach(paint);
  html.classList.add("motion-ready");
  window.addEventListener("scroll", refresh, { passive: true });
  window.addEventListener("resize", refresh);
  document.addEventListener("focusin", onFocus);
  if (media && media.addEventListener) media.addEventListener("change", onMotionChange);
  refresh();

  return dispose;
}
