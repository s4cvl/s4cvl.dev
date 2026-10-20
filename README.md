# s4cvl.dev

Le hub personnel servi à l'apex de `s4cvl.dev` : plateformes et projets.
Site 100 % statique, sans build step : HTML + CSS + JS vanilla.

## Structure

```
.
├── index.html          # page unique (intro, barre du haut + plateformes, projets, footer)
├── css/style.css       # tous les styles, tokens de couleurs en tête de fichier
├── js/main.js          # intro terminal, copie du pseudo Discord, année du footer
├── favicon.svg
├── og-image.png        # image Open Graph / Twitter Card (1200×630)
├── site.webmanifest
├── README.md
└── .gitignore
```

Seule dépendance externe : Google Fonts (Syne, DM Sans, JetBrains Mono). Sans réseau, les
polices de repli système prennent le relais.

## Développement local

Ouvrir `index.html` directement dans un navigateur, rien d'autre à faire.

## Intro terminal

Une fenêtre de terminal centrée (~2/3 de l'écran) tape `ping s4cvl.dev`, affiche la réponse jusqu'au
« pong. Bienvenue chez moi. », puis disparaît en fondu sur le site.
`js/main.js` est chargé de façon synchrone dans le `<head>` pour poser la classe `.intro` avant le
premier rendu. L'intro :

- dure ~6 s, fondu compris, dont ~2 s de pause sur l'écran final (délais réglables en tête de la section intro de `main.js`) ;
- se passe au clic, à la molette, au toucher ou au clavier ;
- n'est pas jouée si l'URL contient une ancre ;
- avec `prefers-reduced-motion: reduce`, est jouée sans fondu de sortie ni curseur clignotant ;
- disparaît de force au bout de 8 s si quelque chose se passe mal ;
- sans JS, l'écran d'intro n'existe pas : le site s'affiche directement.

## Ajouter un projet

Copier un bloc `<li><article class="project-card">…</article></li>` dans `.project-grid`.

- **Projet public** : mettre le titre dans un `<a class="project-card__link">` (toute la carte devient
  cliquable) et terminer par `<span class="project-card__cta">→ …</span>` (voir la carte Roblox).
- **Projet privé** : titre en texte simple, terminer par le badge `.project-card__private`
  (« repo privé »). La carte n'est pas cliquable et ne réagit pas au survol.

## Déploiement sur Cloudflare Pages

1. Pousser le repo sur GitHub.
2. Dashboard Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**,
   choisir le repo.
3. Paramètres de build :
   | Paramètre | Valeur |
   |---|---|
   | Framework preset | **None** |
   | Build command | *(vide)* |
   | Build output directory | `/` |
   | Root directory | *(vide)* |
4. **Save and Deploy**. Chaque push sur `main` redéploie, chaque autre branche obtient une URL de
   preview.
5. Domaine : dans le projet Pages → **Custom domains** → ajouter `s4cvl.dev` (la zone étant chez
   Cloudflare, l'enregistrement DNS est créé automatiquement). Ajouter aussi `www.s4cvl.dev`
   puis une redirection vers l'apex si besoin.
