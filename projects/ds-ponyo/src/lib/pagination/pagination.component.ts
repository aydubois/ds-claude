import {
  Component,
  ViewEncapsulation,
  input,
  output,
  signal,
  computed,
} from '@angular/core';

export interface PonyoPageEvent {
  page: number;
  pageSize: number;
  totalItems: number;
}

@Component({
  selector: 'ponyo-pagination',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ponyo-pagination',
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    <span class="ponyo-pagination-info">
      {{ rangeLabel() }}
    </span>
    <div class="ponyo-pagination-controls">
      <button
        class="ponyo-pagination-btn"
        type="button"
        [disabled]="currentPage() === 1"
        aria-label="Première page"
        (click)="goToPage(1)"
      >&#171;</button>
      <button
        class="ponyo-pagination-btn"
        type="button"
        [disabled]="currentPage() === 1"
        aria-label="Page précédente"
        (click)="goToPage(currentPage() - 1)"
      >&#8249;</button>

      @for (p of visiblePages(); track p) {
        @if (p === -1) {
          <span class="ponyo-pagination-ellipsis">…</span>
        } @else {
          <button
            class="ponyo-pagination-btn"
            [class.ponyo-pagination-btn--active]="p === currentPage()"
            type="button"
            [attr.aria-label]="'Page ' + p"
            [attr.aria-current]="p === currentPage() ? 'page' : null"
            (click)="goToPage(p)"
          >{{ p }}</button>
        }
      }

      <button
        class="ponyo-pagination-btn"
        type="button"
        [disabled]="currentPage() === totalPages()"
        aria-label="Page suivante"
        (click)="goToPage(currentPage() + 1)"
      >&#8250;</button>
      <button
        class="ponyo-pagination-btn"
        type="button"
        [disabled]="currentPage() === totalPages()"
        aria-label="Dernière page"
        (click)="goToPage(totalPages())"
      >&#187;</button>
    </div>
  `,
  styleUrl: './pagination.component.scss',
})
export class PonyoPaginationComponent {
  readonly totalItems = input.required<number>();
  readonly pageSize = input<number>(10);
  readonly ariaLabel = input<string>('Pagination');

  readonly pageChange = output<PonyoPageEvent>();

  readonly currentPage = signal(1);

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  );

  readonly rangeLabel = computed(() => {
    const total = this.totalItems();
    if (total === 0) return '0 résultat';
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    return `${start}–${end} sur ${total}`;
  });

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push(-1); // ellipsis
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push(-1); // ellipsis
    }

    // Always show last page
    pages.push(total);

    return pages;
  });

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.pageChange.emit({
      page,
      pageSize: this.pageSize(),
      totalItems: this.totalItems(),
    });
  }
}
