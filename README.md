# Cookie & Guyllaume — Notre petit monde

Une chambre illustrée interactive, en thaï, offerte à Cookie. Site statique, sans compte, collecte, cookies de suivi, backend, son ou service payant. Les illustrations SVG sont originales, aucune photo personnelle n’est incluse.

## Personnalisation

Modifier `config.js` : textes, lettres, mots du bocal, `reunionDate` au format `YYYY-MM-DD`, et éventuellement `photo` vers une image ajoutée dans `assets/`. Ne publier que des images consenties. La date prévue est le **15 décembre 2026 en France** : le compteur utilise les jours calendaires `Europe/Paris`, jamais une heure de vol. À partir de cette date, il affiche un mot doux sans affirmer une arrivée effective.

## Développement et vérification

Chrome installé, Node.js et Python 3 requis pour les outils locaux seulement.

```sh
npm ci
npm run build
npm test
```

Ouvrir `dist/` avec un serveur statique, pas en `file://` (modules ES).

## Publication GitHub Pages

Dépôt personnel **GuyllaumeMorreau/cookie-guyllaume**, GitHub Pages depuis `main` à la racine, comme les sites personnels existants. Les fichiers racine constituent déjà le site publiable ; `build` vérifie et assemble une copie dans `dist`. Un push vers `main` republie automatiquement par GitHub Pages. Aucun secret ni nouvelle clé.

## Accessibilité et design

Police Noto Sans Thai incluse localement (licence SIL OFL dans `assets/OFL.txt`), interactions tactiles ≥ 44px, clavier, focus contenu dans le dialogue, retour navigateur, retour à la chambre et `prefers-reduced-motion`. Sans dépendance externe à l’exécution.
