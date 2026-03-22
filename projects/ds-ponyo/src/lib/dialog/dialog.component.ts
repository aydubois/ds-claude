import {
  Component,
  ViewEncapsulation,
  input,
  output,
  signal,
  ElementRef,
  viewChild,
  afterNextRender,
  HostListener,
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'ponyo-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ponyo-dialog-wrapper',
  },
  template: `
    @if (open()) {
      <div class="ponyo-dialog-backdrop" (click)="onBackdropClick()">
        <div
          #dialogEl
          class="ponyo-dialog"
          role="dialog"
          [attr.aria-modal]="true"
          [attr.aria-labelledby]="titleId()"
          (click)="$event.stopPropagation()"
          (keydown.escape)="close()"
        >
          <div class="ponyo-dialog-header">
            <span [id]="titleId()">
              <ng-content select="[ponyo-dialog-title]" />
            </span>
            <button
              class="ponyo-dialog-close"
              type="button"
              aria-label="Fermer"
              (click)="close()"
            >&times;</button>
          </div>
          <div class="ponyo-dialog-body">
            <ng-content />
          </div>
          <div class="ponyo-dialog-footer">
            <ng-content select="[ponyo-dialog-actions]" />
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './dialog.component.scss',
})
export class PonyoDialogComponent {
  private readonly uid = nextId++;
  private previouslyFocused: HTMLElement | null = null;

  readonly open = signal(false);
  readonly closed = output<void>();

  readonly dialogEl = viewChild<ElementRef<HTMLElement>>('dialogEl');

  readonly titleId = () => `ponyo-dialog-title-${this.uid}`;

  constructor() {
    afterNextRender(() => {
      // Focus trap setup handled in show()
    });
  }

  show(): void {
    this.previouslyFocused = document.activeElement as HTMLElement;
    this.open.set(true);
    // Focus the dialog after render
    setTimeout(() => {
      const el = this.dialogEl()?.nativeElement;
      if (el) {
        const firstFocusable = el.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    });
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
    this.previouslyFocused?.focus();
  }

  onBackdropClick(): void {
    this.close();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open() || event.key !== 'Tab') return;

    const el = this.dialogEl()?.nativeElement;
    if (!el) return;

    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
