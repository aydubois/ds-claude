import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AyButtonComponent,
  AyInputComponent,
  AySelectComponent,
  AyMultiSelectComponent,
  AyCheckboxComponent,
  AyRadioComponent,
  AyTableComponent,
  AyCellDefDirective,
  AyDialogComponent,
  AyToastContainerComponent,
  AyToastService,
  AyPaginationComponent,
  AyAccordionComponent,
  AyAccordionPanelComponent,
  AyIconComponent,
  AY_ICONS,
  AySpinnerComponent,
  AySkeletonComponent,
  AySwitchComponent,
  AySliderComponent,
  AySnackbarContainerComponent,
  AySnackbarService,
  AyTabsComponent,
  AyTabComponent,
  AySegmentedMenuComponent,
  AyDatePickerComponent,
  AyNavigationRailComponent,
  AyCardComponent,
} from 'ds-ponyo';
import type { AySelectOption, AyMultiSelectOption, AyColumnDef, AySegmentOption, AyNavRailItem } from 'ds-ponyo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    AyButtonComponent,
    AyInputComponent,
    AySelectComponent,
    AyMultiSelectComponent,
    AyCheckboxComponent,
    AyRadioComponent,
    AyTableComponent,
    AyCellDefDirective,
    AyDialogComponent,
    AyToastContainerComponent,
    AyPaginationComponent,
    AyAccordionComponent,
    AyAccordionPanelComponent,
    AyIconComponent,
    AySpinnerComponent,
    AySkeletonComponent,
    AySwitchComponent,
    AySliderComponent,
    AySnackbarContainerComponent,
    AyTabsComponent,
    AyTabComponent,
    AySegmentedMenuComponent,
    AyDatePickerComponent,
    AyNavigationRailComponent,
    AyCardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // ─── Theming ───
  primaryColor = signal('#147a79')
  iconNames = Object.keys(AY_ICONS).sort()
  dangerColor = signal('#c2412b')
  surfaceColor = signal('#f4f5f7')
  bgColor = signal('#ffffff')

  onColorChange(): void {
    const root = document.documentElement
    const p = this.primaryColor()
    const d = this.dangerColor()

    root.style.setProperty('--ay-color-primary', p)
    root.style.setProperty('--ay-color-primary-hover', this.darken(p, 0.18))
    root.style.setProperty('--ay-color-primary-active', this.darken(p, 0.32))
    root.style.setProperty('--ay-color-focus', p)
    root.style.setProperty('--ay-color-focus-ring', `0 0 0 3px ${this.alpha(p, 0.4)}`)

    root.style.setProperty('--ay-color-danger', d)
    root.style.setProperty('--ay-color-danger-hover', this.darken(d, 0.18))
    root.style.setProperty('--ay-color-danger-active', this.darken(d, 0.32))

    root.style.setProperty('--ay-color-surface', this.surfaceColor())
    root.style.setProperty('--ay-color-background', this.bgColor())
  }

  private darken(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const nr = Math.round(r * (1 - amount))
    const ng = Math.round(g * (1 - amount))
    const nb = Math.round(b * (1 - amount))
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
  }

  private alpha(hex: string, a: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  // ─── Select ───
  roleOptions: AySelectOption[] = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'editor', label: 'Éditeur' },
    { value: 'viewer', label: 'Lecteur' },
  ]

  // ─── Multi-select ───
  countryOptions: AyMultiSelectOption[] = [
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Allemagne' },
    { value: 'es', label: 'Espagne' },
    { value: 'it', label: 'Italie' },
    { value: 'pt', label: 'Portugal' },
  ]

  // ─── Table ───
  tableColumns: AyColumnDef[] = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Rôle', sortable: true },
    { key: 'status', label: 'Statut' },
  ]

  tableData = [
    { name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', status: 'Actif' },
    { name: 'Bob Dupont', email: 'bob@example.com', role: 'Éditeur', status: 'Actif' },
    { name: 'Claire Moreau', email: 'claire@example.com', role: 'Lecteur', status: 'Inactif' },
    { name: 'David Leroy', email: 'david@example.com', role: 'Éditeur', status: 'En attente' },
    { name: 'Emma Bernard', email: 'emma@example.com', role: 'Admin', status: 'Actif' },
  ]

  trackByName = (row: Record<string, unknown>) => row['name']

  // ─── Dialog ───
  openDialog(dialogRef: AyDialogComponent): void {
    dialogRef.show()
  }

  // ─── Toast / Snackbar ───
  constructor(
    public toastService: AyToastService,
    public snackbarService: AySnackbarService,
  ) {}

  // ─── Accordion ───
  onAccordionReorder(ids: string[]): void {
    this.toastService.info(`Nouvel ordre : ${ids.join(', ')}`)
  }

  // ─── Segmented Menu ───
  viewOptions: AySegmentOption[] = [
    { value: 'list', label: 'Liste' },
    { value: 'grid', label: 'Grille' },
    { value: 'kanban', label: 'Kanban' },
  ]

  // ─── Navigation Rail ───
  navItems: AyNavRailItem[] = [
    { value: 'home', label: 'Accueil', icon: 'home', href: '/home' },
    { value: 'users', label: 'Utilisateurs', icon: 'users', href: '/users' },
    { value: 'settings', label: 'Paramètres', icon: 'settings', href: '/settings' },
    { value: 'mail', label: 'Messages', icon: 'mail', href: '/mail' },
  ]
  navCollapsed = signal(false)
}
