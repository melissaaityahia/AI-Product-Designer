# Portfolio — Melissa Ait Yahia

Site statique (HTML, CSS, JavaScript) : aucune installation ni compilation nécessaire.

## Mettre en ligne avec GitHub Pages

1. Créez un dépôt sur GitHub (par exemple `portfolio`).
2. Envoyez **le contenu** de ce dossier à la racine du dépôt (`index.html` doit être à la racine) :
   - soit par glisser-déposer : *Add file → Upload files* ;
   - soit en ligne de commande :
     ```
     git init
     git add .
     git commit -m "Portfolio"
     git branch -M main
     git remote add origin https://github.com/<votre-compte>/portfolio.git
     git push -u origin main
     ```
3. Dans le dépôt : *Settings → Pages → Build and deployment*, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis *Save*.
4. Après une à deux minutes, le site est disponible sur `https://<votre-compte>.github.io/portfolio/`.

Le fichier `.nojekyll` évite que GitHub retraite les fichiers : gardez-le.

## Structure

- `index.html` : accueil
- `design-system.html`, `filtres.html`, `hexplo.html`, `page-details-transport.html`, `ratp.html`, `spotify-netflix.html` : études de cas
- `a-propos.html`, `autres-projets.html`
- `assets/style.css` : styles (couleurs modifiables dans `:root`)
- `assets/site.js` : menu mobile, diaporamas, carrousels, stepper fixe
- `assets/img/` : images (WebP, une version `-sm` pour mobile)
- `assets/cv/` : CV en PDF

## Tester en local

Ouvrez un terminal dans ce dossier et lancez `python3 -m http.server`, puis allez sur http://localhost:8000.
