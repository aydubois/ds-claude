import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  TemplateRef,
  Directive,
} from '@angular/core'
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { AyColumnDef, AySortDirection, AySortEvent } from './table.model'

@Directive({
  selector: '[ayCellDef]',
  standalone: true,
})
export class AyCellDefDirective {
  @Input({ required: true, alias: 'ayCellDef' }) column!: string
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ay-table',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  host: {
    'class': 'ay-table-wrapper',
  },
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class AyTableComponent {
  @Input({ required: true }) columns!: AyColumnDef[]
  @Input({ required: true }) data!: Record<string, unknown>[]
  @Input() selectable: boolean = false
  @Input() trackByFn: (index: number, row: Record<string, unknown>) => unknown = (index: number, row: Record<string, unknown>) => row

  @Output() sortChange = new EventEmitter<AySortEvent>()
  @Output() selectionChange = new EventEmitter<Record<string, unknown>[]>()

  sortColumn: string | null = null
  sortDirection: AySortDirection = null
  selectedRows: Set<unknown> = new Set()

  @ContentChildren(AyCellDefDirective) cellDefs!: QueryList<AyCellDefDirective>

  get allSelected(): boolean {
    const d = this.data
    return d.length > 0 && this.selectedRows.size === d.length
  }

  get someSelected(): boolean {
    const s = this.selectedRows.size
    return s > 0 && s < this.data.length
  }

  getCellTemplate(columnKey: string): TemplateRef<unknown> | null {
    const def = this.cellDefs.toArray().find(d => d.column === columnKey)
    return def?.templateRef ?? null
  }

  getSortAria(columnKey: string): string | null {
    if (this.sortColumn !== columnKey) return null
    return this.sortDirection === 'asc' ? 'ascending' : 'descending'
  }

  toggleSort(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      const next: AySortDirection =
        this.sortDirection === 'asc' ? 'desc' :
        this.sortDirection === 'desc' ? null : 'asc'
      this.sortDirection = next
      if (next === null) this.sortColumn = null
    } else {
      this.sortColumn = columnKey
      this.sortDirection = 'asc'
    }
    this.sortChange.emit({
      column: this.sortColumn ?? '',
      direction: this.sortDirection,
    })
  }

  isRowSelected(row: Record<string, unknown>): boolean {
    return this.selectedRows.has(this.trackByFn(0, row))
  }

  toggleRow(row: Record<string, unknown>): void {
    const key = this.trackByFn(0, row)
    const next = new Set(this.selectedRows)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    this.selectedRows = next
    this.emitSelection()
  }

  toggleAll(): void {
    if (this.allSelected) {
      this.selectedRows = new Set()
    } else {
      this.selectedRows = new Set(this.data.map(r => this.trackByFn(0, r)))
    }
    this.emitSelection()
  }

  private emitSelection(): void {
    const selected = this.data.filter(r => this.selectedRows.has(this.trackByFn(0, r)))
    this.selectionChange.emit(selected)
  }
}
