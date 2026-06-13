# Référencement Blog — Migration & Workflow

## Ce qui change (et pourquoi)

### Problème actuel
Googlebot visite `nicolas-mildner-osteopathe.fr/blog/lombalgie-mal-de-dos-recherche` et voit :
```html
<div id="root"></div>
```
**Zéro contenu.** Tes 4 000 mots d'article sont invisibles. Google ne peut pas indexer ce qu'il ne voit pas.

### Solution : pré-rendu au build
Après `vite build`, un script Node injecte le texte complet de chaque article dans le HTML statique. Googlebot voit :
```html
<div id="root">
  <article>
    <h1>Lombalgie et mal de dos : ce que la recherche récente nous apprend</h1>
    <p>Le mal de dos touche une personne sur deux...</p>
    <!-- 4 000 mots, FAQ, sources, structured data -->
  </article>
</div>
```
React prend le relais côté client — le visiteur ne voit aucune différence.

### Architecture : posts.json éclaté
Avec 130 articles, un seul `posts.json` de 1.5 Mo serait chargé sur chaque page. On sépare :

| Fichier | Contenu | Taille à 130 articles |
|---|---|---|
| `src/posts-index.json` | Métadonnées (titre, date, tag, excerpt, keywords) | ~50 Ko |
| `public/blog/{slug}.json` | Contenu complet, FAQ, sources | ~15 Ko chacun, chargé à la demande |

---

## Fichiers à modifier sur GitHub

### 1. Remplacer `src/posts.json` → `src/posts-index.json`

Supprimer `src/posts.json`. Le remplacer par `src/posts-index.json` (métadonnées seules, sans `content`/`faq`/`sources`).

### 2. Ajouter les fichiers article dans `public/blog/`

Un fichier JSON par article :
- `public/blog/lombalgie-mal-de-dos-recherche.json`
- `public/blog/22-ans-exercice-pratique-forgee-avant-la-loi.json`

### 3. Remplacer `src/Blog.jsx`

Le nouveau `Blog.jsx` charge le contenu à la demande via `fetch("/blog/{slug}.json")`.

### 4. Modifier une ligne dans `src/Site.jsx`

Ligne 56, remplacer :
```js
import posts from "./posts.json";
```
par :
```js
import posts from "./posts-index.json";
```
C'est la seule modification dans Site.jsx.

### 5. Ajouter `prerender.js` à la racine

Le script de pré-rendu. Tourne automatiquement après chaque build.

### 6. Remplacer `generate-sitemap.js`

Mis à jour pour lire `posts-index.json` au lieu de `posts.json`.

### 7. Remplacer `package.json`

Le script `build` passe de `"vite build"` à `"vite build && node prerender.js"`.

---

## Nouveau workflow de publication (130 articles)

### Publier un article

1. **Demande à Claude** :
   > « Écris-moi un article de blog pour mon site sur le sujet : [sujet]. Donne-moi :
   > - L'entrée à ajouter dans posts-index.json
   > - Le fichier {slug}.json pour public/blog/
   > - Le sitemap.xml mis à jour »

2. **Sur GitHub** :
   - `src/posts-index.json` → crayon → ajouter l'entrée dans le tableau → Commit
   - Créer `public/blog/{slug}.json` → Add file → Create new file → coller → Commit
   - `public/sitemap.xml` → crayon → coller → Commit

3. **C'est terminé.** Vercel redéploie, le prerender génère le HTML statique, Google voit le contenu.

### Vérifier que ça marche

Après déploiement, tester dans le navigateur :
```
view-source:https://www.nicolas-mildner-osteopathe.fr/blog/{slug}
```
Tu dois voir le texte complet de l'article dans le code source HTML.

Ou via curl :
```bash
curl -s https://www.nicolas-mildner-osteopathe.fr/blog/{slug} | grep "<h1>"
```

---

## Structure finale du projet

```
site-osteopathe/
├── package.json                    ← build = vite build + prerender
├── prerender.js                    ← génère le HTML statique (NOUVEAU)
├── generate-sitemap.js             ← lit posts-index.json
├── vercel.json                     ← inchangé
├── public/
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── favicon.svg
│   └── blog/
│       ├── lombalgie-mal-de-dos-recherche.json
│       ├── 22-ans-exercice-pratique-forgee-avant-la-loi.json
│       └── ... (130 fichiers article)
├── src/
│   ├── main.jsx                    ← inchangé
│   ├── App.jsx                     ← inchangé
│   ├── ScrollToTop.jsx             ← inchangé
│   ├── Site.jsx                    ← 1 ligne modifiée (import)
│   ├── Blog.jsx                    ← refactoré (lazy-load)
│   └── posts-index.json            ← métadonnées seules (REMPLACE posts.json)
└── api/
    └── subscribe.js                ← inchangé
```
