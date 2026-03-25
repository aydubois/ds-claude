import {
  Component,
  input,
  output,
  signal,
  computed,
} from '@angular/core'
import { AyPageEvent } from './pagination.model'

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

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i)
      return pages
    }

    const start = Math.max(1, current - 2)
    const end = Math.min(total, current + 2)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

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
