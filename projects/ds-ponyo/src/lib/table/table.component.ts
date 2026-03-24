import {
  Component,
  input,
  output,
  signal,
  computed,
  contentChildren,
  TemplateRef,
  Directive,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common';
import { AyColumnDef, AySortDirection, AySortEvent } from './table.model'

@Directive({
  selector: '[ayCellDef]',
  standalone: true,
})
export class AyCellDefDirective {
  readonly column = input.required<string>({ alias: 'ayCellDef' })
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ay-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  host: {
    'class': 'ay-table-wrapper',
  },
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class AyTableComponent {
  readonly columns = input.required<AyColumnDef[]>()
  readonly data = input.required<Record<string, unknown>[]>()
  readonly selectable = input<boolean>(false)
  readonly trackByFn = input<(row: Record<string, unknown>) => unknown>(() => (row: Record<string, unknown>) => row)

  readonly sortChange = output<AySortEvent>()
  readonly selectionChange = output<Record<string, unknown>[]>()

  readonly sortColumn = signal<string | null>(null)
  readonly sortDirection = signal<AySortDirection>(null)
  readonly selectedRows = signal<Set<unknown>>(new Set())

  readonly cellDefs = contentChildren(AyCellDefDirective)

  readonly allSelected = computed(() => {
    const d = this.data()
    return d.length > 0 && this.selectedRows().size === d.length
  })

  readonly someSelected = computed(() => {
    const s = this.selectedRows().size
    return s > 0 && s < this.data().length
  })

  getCellTemplate(columnKey: string): TemplateRef<unknown> | null {
    const def = this.cellDefs().find(d => d.column() === columnKey)
    return def?.templateRef ?? null
  }

  getSortAria(columnKey: string): string | null {
    if (this.sortColumn() !== columnKey) return null
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending'
  }

  toggleSort(columnKey: string): void {
    if (this.sortColumn() === columnKey) {
      const next: AySortDirection =
        this.sortDirection() === 'asc' ? 'desc' :
        this.sortDirection() === 'desc' ? null : 'asc'
      this.sortDirection.set(next)
      if (next === null) this.sortColumn.set(null)
    } else {
      this.sortColumn.set(columnKey)
      this.sortDirection.set('asc')
    }
    this.sortChange.emit({
      column: this.sortColumn() ?? '',
      direction: this.sortDirection(),
    })
  }

  isRowSelected(row: Record<string, unknown>): boolean {
    return this.selectedRows().has(this.trackByFn()(row))
  }

  toggleRow(row: Record<string, unknown>): void {
    const key = this.trackByFn()(row)
    const next = new Set(this.selectedRows())
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    this.selectedRows.set(next)
    this.emitSelection()
  }

  toggleAll(): void {
    if (this.allSelected()) {
      this.selectedRows.set(new Set())
    } else {
      this.selectedRows.set(new Set(this.data().map(r => this.trackByFn()(r))))
    }
    this.emitSelection()
  }

  private emitSelection(): void {
    const selected = this.data().filter(r => this.selectedRows().has(this.trackByFn()(r)))
    this.selectionChange.emit(selected)
  }
}
