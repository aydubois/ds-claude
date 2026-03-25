import {
  Component,
  input,
  output,
  signal,
  ElementRef,
  viewChild,
  afterNextRender,
  HostListener,
} from '@angular/core'
import { AyButtonComponent } from '../button/button.component'

let nextId = 0

@Component({
  selector: 'ay-dialog',
  standalone: true,
  imports: [AyButtonComponent],
  host: {
    'class': 'ay-dialog-wrapper',
  },
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class AyDialogComponent {
  private readonly uid = nextId++
  private previouslyFocused: HTMLElement | null = null

  readonly confirmLabel = input<string>('Confirmer')
  readonly cancelLabel = input<string>('Annuler')
  readonly confirmColor = input<'primary' | 'danger'>('primary')
  readonly showConfirm = input<boolean>(true)
  readonly showCancel = input<boolean>(true)

  readonly open = signal(false)
  readonly closed = output<void>()
  readonly confirmed = output<void>()
  readonly cancelled = output<void>()

  readonly dialogEl = viewChild<ElementRef<HTMLElement>>('dialogEl')

  readonly titleId = () => `ay-dialog-title-${this.uid}`

  constructor() {
    afterNextRender(() => {
      // Focus trap setup handled in show()
    })
  }

  show(): void {
    this.previouslyFocused = document.activeElement as HTMLElement
    this.open.set(true)
    setTimeout(() => {
      const el = this.dialogEl()?.nativeElement
      if (el) {
        const firstFocusable = el.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        firstFocusable?.focus()
      }
    })
  }

  close(): void {
    this.open.set(false)
    this.closed.emit()
    this.previouslyFocused?.focus()
  }

  onConfirm(): void {
    this.confirmed.emit()
    this.close()
  }

  onCancel(): void {
    this.cancelled.emit()
    this.close()
  }

  onBackdropClick(): void {
    this.close()
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open() || event.key !== 'Tab') return

    const el = this.dialogEl()?.nativeElement
    if (!el) return

    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusables.length) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}
