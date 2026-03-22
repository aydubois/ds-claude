# Règles de développement — ds-ponyo

## Composants

- **Standalone uniquement** : tous les composants doivent être `standalone: true`. Aucun NgModule.
- **Signals** : utiliser les signals Angular (`signal()`, `computed()`, `effect()`) pour la gestion d'état interne des composants. Pas de `BehaviorSubject` pour l'état local.
- **Inputs** : utiliser `input()` et `input.required()` (signal inputs) plutôt que le décorateur `@Input()`.
- **Outputs** : utiliser `output()` plutôt que le décorateur `@Output()`.
- **Préfixe** : tous les composants utilisent le préfixe `ponyo-` (selector: `ponyo-button`, `ponyo-input`, etc.).

## Accessibilité (WCAG 2.1 AA minimum)

- Chaque composant interactif doit être utilisable **au clavier** (Tab, Enter, Space, Escape, flèches).
- Utiliser les **rôles ARIA** appropriés (`role`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-selected`, etc.).
- Gérer le **focus** correctement : focus visible (focus-ring), focus trap (modales), restore focus.
- Les couleurs doivent respecter un **ratio de contraste minimum de 4.5:1** pour le texte.
- Les messages d'erreur doivent être liés au champ via `aria-describedby`.
- Les notifications/toasts utilisent `aria-live` (`polite` pour info/success, `assertive` pour erreurs).
- Taille minimum des cibles tactiles : **32px** (compact admin).

## Responsive

- Les composants doivent s'adapter à la largeur de leur conteneur.
- Utiliser des **unités relatives** (`rem`, `em`, `%`) plutôt que des `px` fixes pour les tailles de texte.
- Les composants complexes (table, dialog) doivent être utilisables sur écran **≥ 320px**.
- Pas de breakpoints fixes dans les composants — le responsive est géré par le conteneur parent.

## Styles

- Utiliser les **CSS custom properties** définies dans `tokens/` pour toutes les valeurs (couleurs, spacing, radius, etc.).
- Préfixer les custom properties avec `--ponyo-`.
- Les styles des composants utilisent `ViewEncapsulation.None` pour permettre la personnalisation, avec des classes préfixées `.ponyo-*`.
- Pas de dépendance externe pour le CSS (pas de Tailwind, Bootstrap, etc.).

## Tests

- Chaque composant doit avoir des tests unitaires couvrant :
  - Le rendu dans chaque état/variante
  - La navigation clavier
  - Les attributs ARIA
