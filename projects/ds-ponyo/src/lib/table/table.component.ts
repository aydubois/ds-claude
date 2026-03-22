import {
  Component,
  ViewEncapsulation,
  input,
  output,
  signal,
  computed,
  contentChildren,
  TemplateRef,
  Directive,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface PonyoColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
}

export type PonyoSortDirection = 'asc' | 'desc' | null;

export interface PonyoSortEvent {
  column: string;
  direction: PonyoSortDirection;
}

@Directive({
  selector: '[ponyoCellDef]',
  standalone: true,
})
export class PonyoCellDefDirective {
  readonly column = input.required<string>({ alias: 'ponyoCellDef' });
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ponyo-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ponyo-table-wrapper',
  },
  template: `
    <div class="ponyo-table-scroll">
      <table class="ponyo-table" role="grid">
        <thead>
          <tr>
            @if (selectable()) {
              <th class="ponyo-table-th ponyo-table-th--check" style="width:2rem">
                <span
                  class="ponyo-table-check"
                  [class.ponyo-table-check--checked]="allSelected()"
                  [class.ponyo-table-check--indeterminate]="someSelected()"
                  role="checkbox"
                  [attr.aria-checked]="allSelected() ? 'true' : someSelected() ? 'mixed' : 'false'"
                  [tabindex]="0"
                  (click)="toggleAll()"
                  (keydown.space)="toggleAll(); $event.preventDefault()"
                ></span>
              </th>
            }
            @for (col of columns(); track col.key) {
              <th
                class="ponyo-table-th"
                [class.ponyo-table-th--sortable]="col.sortable"
                [class.ponyo-table-th--sorted]="sortColumn() === col.key"
                [attr.aria-sort]="getSortAria(col.key)"
                (click)="col.sortable ? toggleSort(col.key) : null"
                (keydown.enter)="col.sortable ? toggleSort(col.key) : null"
                [tabindex]="col.sortable ? 0 : -1"
              >
                {{ col.label }}
                @if (col.sortable) {
                  <span class="ponyo-table-sort-icon">
                    @if (sortColumn() === col.key && sortDirection() === 'asc') { &#9650; }
                    @else if (sortColumn() === col.key && sortDirection() === 'desc') { &#9660; }
                    @else { &#9650;&#9660; }
                  </span>
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track trackByFn()(row); let i = $index) {
            <tr
              class="ponyo-table-row"
              [class.ponyo-table-row--selected]="isRowSelected(row)"
            >
              @if (selectable()) {
                <td class="ponyo-table-td ponyo-table-td--check">
                  <span
                    class="ponyo-table-check"
                    [class.ponyo-table-check--checked]="isRowSelected(row)"
                    role="checkbox"
                    [attr.aria-checked]="isRowSelected(row)"
                    [tabindex]="0"
                    (click)="toggleRow(row)"
                    (keydown.space)="toggleRow(row); $event.preventDefault()"
                  ></span>
                </td>
              }
              @for (col of columns(); track col.key) {
                <td class="ponyo-table-td">
                  @if (getCellTemplate(col.key); as tmpl) {
                    <ng-container *ngTemplateOutlet="tmpl; context: { $implicit: row, index: i }" />
                  } @else {
                    {{ row[col.key] }}
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './table.component.scss',
})
export class PonyoTableComponent {
  readonly columns = input.required<PonyoColumnDef[]>();
  readonly data = input.required<Record<string, unknown>[]>();
  readonly selectable = input<boolean>(false);
  readonly trackByFn = input<(row: Record<string, unknown>) => unknown>(() => (row: Record<string, unknown>) => row);

  readonly sortChange = output<PonyoSortEvent>();
  readonly selectionChange = output<Record<string, unknown>[]>();

  readonly sortColumn = signal<string | null>(null);
  readonly sortDirection = signal<PonyoSortDirection>(null);
  readonly selectedRows = signal<Set<unknown>>(new Set());

  readonly cellDefs = contentChildren(PonyoCellDefDirective);

  readonly allSelected = computed(() => {
    const d = this.data();
    return d.length > 0 && this.selectedRows().size === d.length;
  });

  readonly someSelected = computed(() => {
    const s = this.selectedRows().size;
    return s > 0 && s < this.data().length;
  });

  getCellTemplate(columnKey: string): TemplateRef<unknown> | null {
    const def = this.cellDefs().find(d => d.column() === columnKey);
    return def?.templateRef ?? null;
  }

  getSortAria(columnKey: string): string | null {
    if (this.sortColumn() !== columnKey) return null;
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  toggleSort(columnKey: string): void {
    if (this.sortColumn() === columnKey) {
      const next: PonyoSortDirection =
        this.sortDirection() === 'asc' ? 'desc' :
        this.sortDirection() === 'desc' ? null : 'asc';
      this.sortDirection.set(next);
      if (next === null) this.sortColumn.set(null);
    } else {
      this.sortColumn.set(columnKey);
      this.sortDirection.set('asc');
    }
    this.sortChange.emit({
      column: this.sortColumn() ?? '',
      direction: this.sortDirection(),
    });
  }

  isRowSelected(row: Record<string, unknown>): boolean {
    return this.selectedRows().has(this.trackByFn()(row));
  }

  toggleRow(row: Record<string, unknown>): void {
    const key = this.trackByFn()(row);
    const next = new Set(this.selectedRows());
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.selectedRows.set(next);
    this.emitSelection();
  }

  toggleAll(): void {
    if (this.allSelected()) {
      this.selectedRows.set(new Set());
    } else {
      this.selectedRows.set(new Set(this.data().map(r => this.trackByFn()(r))));
    }
    this.emitSelection();
  }

  private emitSelection(): void {
    const selected = this.data().filter(r => this.selectedRows().has(this.trackByFn()(r)));
    this.selectionChange.emit(selected);
  }
}
