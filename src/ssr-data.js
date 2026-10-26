import { createContext } from "react";

// Données chargées au pré-rendu (ex. contenu d'un article), transmises au navigateur
// pour que la page hydratée soit identique au HTML servi.
export const SsrData = createContext(null);

export function readClientSsrData() {
  if (typeof document === "undefined") return null;
  const el = document.getElementById("__SSR_DATA__");
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

// Sérialisation sûre dans une balise <script>.
export function serializeSsrData(data) {
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  return JSON.stringify(data).replace(/</g, "\\u003c").split(LS).join("\\u2028").split(PS).join("\\u2029");
}
