import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'
import { CommonModule } from '@angular/common';
import { AyPageEvent } from './pagination.model'

@Component({
  selector: 'ay-pagination',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'ay-pagination',
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel',
  },
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class AyPaginationComponent {
  @Input({ required: true }) totalItems!: number
  @Input() pageSize: number = 10
  @Input() ariaLabel: string = 'Pagination'

  @Output() pageChange = new EventEmitter<AyPageEvent>()

  currentPage = 1

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize))
  }

  get rangeLabel(): string {
    const total = this.totalItems
    if (total === 0) return '0 résultat'
    const start = (this.currentPage - 1) * this.pageSize + 1
    const end = Math.min(this.currentPage * this.pageSize, total)
    return `${start}–${end} sur ${total}`
  }

  get visiblePages(): number[] {
    const total = this.totalPages
    const current = this.currentPage
    const pages: number[] = []

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i)
      return pages
    }

    const start = Math.max(1, current - 2)
    const end = Math.min(total, current + 2)

    if (start > 1) {
      pages.push(-1) // ellipsis gauche
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < total) {
      pages.push(-1) // ellipsis droite
    }

    return pages
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return
    this.currentPage = page
    this.pageChange.emit({
      page,
      pageSize: this.pageSize,
      totalItems: this.totalItems,
    })
  }
}
