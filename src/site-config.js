// Coordonnées et constantes partagées par toutes les pages.

export const DOMAIN = "https://www.nicolas-mildner-osteopathe.fr";

export const PHONE = "01 42 02 11 18";
export const PHONE_TEL = "tel:+33142021118";
export const MOBILE = "06 68 80 14 42";
export const MOBILE_TEL = "tel:+33668801442";
export const MOBILE_SMS = "sms:+33668801442";

export const ADDRESS = "72 avenue de la Bourdonnais, 75007 Paris";
export const MAPS_URL = "https://www.google.com/maps/place/?q=place_id:ChIJ8SKn3CBw5kcRAxZkc56Vsuw";
export const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.3!2d2.3003!3d48.8563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6702025a72291%3A0xecb595739e641603!2s72%20Av.%20de%20la%20Bourdonnais%2C%2075007%20Paris!5e0!3m2!1sfr!2sfr!4v1717700000000";
export const REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ8SKn3CBw5kcRAxZkc56Vsuw";

// Fiche pratique : faits atomiques repris par les moteurs et les assistants IA.
export const FACTS = [
  ["Adresse", "72 avenue de la Bourdonnais, 75007 Paris"],
  ["Arrondissement", "Paris 7e — quartier Gros-Caillou"],
  ["Accès", "Métro École Militaire (ligne 8) et La Tour-Maubourg (ligne 8)"],
  ["Prise de rendez-vous", "Par téléphone ou SMS uniquement. Pas de réservation en ligne, pas de Doctolib."],
  ["Horaires", "Lundi, mardi, jeudi, vendredi 9h–21h. Mercredi 12h–21h."],
  ["Tarif", "80 à 90 € la consultation"],
  ["Durée", "45 minutes à 1 heure"],
  ["Paiement", "Chèque ou espèces · remboursement mutuelle selon contrat"],
  ["Exercice depuis", "2004 — 22 ans de pratique clinique"],
  ["Enseignement", "17 ans à l'École Supérieure d'Ostéopathie de Paris (2004–2020)"],
  ["Diplôme", "D.O. n°00379, Collégiale Académique de France"],
  ["Particularité", "Pratique exclusivement douce, sans aucun craquement"],
];

// Les dates sont formatées en UTC : identiques au pré-rendu et dans le navigateur,
// quel que soit le fuseau horaire du lecteur.
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function sortByDateDesc(list) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
