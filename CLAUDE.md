# ds-ponyo — Design System Angular

## Projet

Design system maison Angular **sans Angular Material**, compact et accessible, pensé pour des interfaces admin.

- **Nom de la lib** : `ds-ponyo`
- **Workspace** : Angular 19 (branches prévues pour v16, v19, v21)
- **Couleur primaire** : `#147a79`
- **Maquettes** : `maquettes.html` (ouvrir dans un navigateur)

## Structure

```
projects/
  ds-ponyo/        ← bibliothèque Angular (ng-packagr)
    src/lib/
      tokens/      ← design tokens SCSS (couleurs, typo, spacing)
      button/      ← composants...
      input/
      select/
      multi-select/
      checkbox/
      radio/
      table/
      dialog/
      toast/
  demo/            ← application de démo
```

## Commandes

```bash
ng build ds-ponyo          # Build la lib
ng serve demo              # Lance l'app de démo
ng test ds-ponyo           # Tests unitaires
```

## Règles

Voir `RULES.md` pour les conventions de développement.
