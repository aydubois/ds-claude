import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PonyoButtonComponent,
  PonyoInputComponent,
  PonyoSelectComponent,
  PonyoMultiSelectComponent,
  PonyoCheckboxComponent,
  PonyoRadioComponent,
  PonyoTableComponent,
  PonyoCellDefDirective,
  PonyoDialogComponent,
  PonyoToastContainerComponent,
  PonyoToastService,
  PonyoPaginationComponent,
  PonyoAccordionComponent,
  PonyoAccordionPanelComponent,
} from 'ds-ponyo';
import type { PonyoSelectOption, PonyoMultiSelectOption, PonyoColumnDef } from 'ds-ponyo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    PonyoButtonComponent,
    PonyoInputComponent,
    PonyoSelectComponent,
    PonyoMultiSelectComponent,
    PonyoCheckboxComponent,
    PonyoRadioComponent,
    PonyoTableComponent,
    PonyoCellDefDirective,
    PonyoDialogComponent,
    PonyoToastContainerComponent,
    PonyoPaginationComponent,
    PonyoAccordionComponent,
    PonyoAccordionPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // ─── Theming ───
  primaryColor = signal('#147a79');
  dangerColor = signal('#c2412b');
  surfaceColor = signal('#f4f5f7');
  bgColor = signal('#ffffff');

  onColorChange(): void {
    const root = document.documentElement;
    const p = this.primaryColor();
    const d = this.dangerColor();

    root.style.setProperty('--ponyo-color-primary', p);
    root.style.setProperty('--ponyo-color-primary-hover', this.darken(p, 0.18));
    root.style.setProperty('--ponyo-color-primary-active', this.darken(p, 0.32));
    root.style.setProperty('--ponyo-color-focus', p);
    root.style.setProperty('--ponyo-color-focus-ring', `0 0 0 3px ${this.alpha(p, 0.4)}`);

    root.style.setProperty('--ponyo-color-danger', d);
    root.style.setProperty('--ponyo-color-danger-hover', this.darken(d, 0.18));
    root.style.setProperty('--ponyo-color-danger-active', this.darken(d, 0.32));

    root.style.setProperty('--ponyo-color-surface', this.surfaceColor());
    root.style.setProperty('--ponyo-color-background', this.bgColor());
  }

  private darken(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const nr = Math.round(r * (1 - amount));
    const ng = Math.round(g * (1 - amount));
    const nb = Math.round(b * (1 - amount));
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  }

  private alpha(hex: string, a: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // ─── Select ───
  roleOptions: PonyoSelectOption[] = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'editor', label: 'Éditeur' },
    { value: 'viewer', label: 'Lecteur' },
  ];

  // ─── Multi-select ───
  countryOptions: PonyoMultiSelectOption[] = [
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Allemagne' },
    { value: 'es', label: 'Espagne' },
    { value: 'it', label: 'Italie' },
    { value: 'pt', label: 'Portugal' },
  ];

  // ─── Table ───
  tableColumns: PonyoColumnDef[] = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Rôle', sortable: true },
    { key: 'status', label: 'Statut' },
  ];

  tableData = [
    { name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', status: 'Actif' },
    { name: 'Bob Dupont', email: 'bob@example.com', role: 'Éditeur', status: 'Actif' },
    { name: 'Claire Moreau', email: 'claire@example.com', role: 'Lecteur', status: 'Inactif' },
    { name: 'David Leroy', email: 'david@example.com', role: 'Éditeur', status: 'En attente' },
    { name: 'Emma Bernard', email: 'emma@example.com', role: 'Admin', status: 'Actif' },
  ];

  trackByName = (row: Record<string, unknown>) => row['name'];

  // ─── Dialog ───
  dialog = signal<PonyoDialogComponent | null>(null);

  openDialog(dialogRef: PonyoDialogComponent): void {
    dialogRef.show();
  }

  // ─── Toast ───
  constructor(public toastService: PonyoToastService) {}

  // ─── Accordion ───
  onAccordionReorder(ids: string[]): void {
    this.toastService.info(`Nouvel ordre : ${ids.join(', ')}`);
  }
}
