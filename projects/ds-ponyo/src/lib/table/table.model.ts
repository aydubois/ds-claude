export interface AyColumnDef {
  key: string
  label: string
  sortable?: boolean
}

export type AySortDirection = 'asc' | 'desc' | null

export interface AySortEvent {
  column: string
  direction: AySortDirection
}
