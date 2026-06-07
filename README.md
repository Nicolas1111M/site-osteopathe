# Site Nicolas Mildner — Ostéopathe D.O. Paris 7ᵉ

Site vitrine professionnel avec blog intégré, SEO optimisé, données structurées Google, et design mobile-first.

## Déploiement sur Vercel (5 minutes)

### Étape 1 — GitHub

1. Va sur **github.com** → Crée un compte si nécessaire
2. Clique le bouton vert **"New"** (nouveau repository)
3. Nom : `site-osteopathe` — Visibilité : **Public** — Clique **"Create repository"**
4. Sur la page du repository vide, clique **"uploading an existing file"**
5. Décompresse ce ZIP sur ton bureau, puis **glisse TOUS les fichiers et dossiers** du contenu dans la zone de dépôt GitHub
6. En bas de page, clique **"Commit changes"**

### Étape 2 — Vercel

1. Va sur **vercel.com** → Clique **"Sign Up"** → Choisis **"Continue with GitHub"**
2. Autorise Vercel à accéder à ton GitHub
3. Tu arrives sur le dashboard → Clique **"Add New..." → "Project"**
4. Tu vois ton repository `site-osteopathe` → Clique **"Import"**
5. Vercel détecte automatiquement **Vite** comme framework
6. Clique **"Deploy"** — en ~60 secondes, ton site est en ligne
7. Tu reçois une URL type `site-osteopathe.vercel.app` — c'est ton site !

### Étape 3 — Nom de domaine (10 minutes)

1. Achète ton domaine sur **ovh.com** (8-12 €/an). Suggestion : `nicolas-mildner-osteopathe.fr`
2. Dans Vercel → **Settings** → **Domains** → **"Add"** → Tape ton domaine
3. Vercel te donne un enregistrement DNS à ajouter :
   - Type : **CNAME**
   - Nom : `@` ou vide
   - Valeur : `cname.vercel-dns.com`
4. Va dans ton espace OVH → **Zone DNS** → Ajoute cet enregistrement
5. Attends 24-48h — le domaine sera connecté avec HTTPS automatique

### Étape 4 — Google

1. Ajoute l'URL du site dans ta **fiche Google Business Profile**
2. Va sur **search.google.com/search-console** → Ajoute ton domaine → Vérifie via DNS
3. Dans Search Console, soumets le **sitemap** : `https://ton-domaine.fr/sitemap.xml`

## Ajouter un article de blog

1. Ouvre le fichier `src/posts.json`
2. Ajoute un nouvel objet dans le tableau avec : id, title, date, tag, readTime, excerpt, content, keywords
3. Commit sur GitHub → Vercel redéploie automatiquement

## Structure du projet

```
├── index.html          ← SEO meta tags + Schema.org
├── package.json        ← Dépendances
├── vite.config.js      ← Configuration Vite
├── public/
│   ├── favicon.svg     ← Favicon NM
│   ├── robots.txt      ← Instructions crawlers
│   └── sitemap.xml     ← Plan du site pour Google
└── src/
    ├── main.jsx        ← Point d'entrée React
    ├── App.jsx          ← Routeur (site/blog)
    ├── Site.jsx         ← Site principal
    ├── Blog.jsx         ← Système de blog
    └── posts.json       ← Articles de blog
```

## Technologies

- Vite 5 + React 18
- Design responsive mobile-first
- Données structurées Schema.org (MedicalBusiness + FAQPage)
- Google Maps intégré
- Animations au scroll (IntersectionObserver)
- Aucune dépendance externe (pas de framework CSS)

---

*Opération Bourdonnais — La Loi du Cas Unique · C'est la Vie*
