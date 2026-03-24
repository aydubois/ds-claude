import {
  Component,
  input,
  output,
  signal,
  computed,
} from '@angular/core'

export interface AyPageEvent {
  page: number
  pageSize: number
  totalItems: number
}

@Component({
  selector: 'ay-pagination',
  standalone: true,
  host: {
    'class': 'ay-pagination',
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class AyPaginationComponent {
  readonly totalItems = input.required<number>()
  readonly pageSize = input<number>(10)
  readonly ariaLabel = input<string>('Pagination')

  readonly pageChange = output<AyPageEvent>()

  readonly currentPage = signal(1)

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  )

  readonly rangeLabel = computed(() => {
    const total = this.totalItems()
    if (total === 0) return '0 résultat'
    const start = (this.currentPage() - 1) * this.pageSize() + 1
    const end = Math.min(this.currentPage() * this.pageSize(), total)
    return `${start}–${end} sur ${total}`
  })

  readonly visiblePages = computed(() => {
    const total = this.totalPages()
    const current = this.currentPage()
    const pages: number[] = []

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
      return pages
    }

    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push(-1); // ellipsis
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push(-1); // ellipsis
    }

    // Always show last page
    pages.push(total)

    return pages
  })

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return
    this.currentPage.set(page)
    this.pageChange.emit({
      page,
      pageSize: this.pageSize(),
      totalItems: this.totalItems(),
    })
  }
}
