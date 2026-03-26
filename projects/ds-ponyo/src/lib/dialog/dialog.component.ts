import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core'
import { CommonModule } from '@angular/common';
import { AyButtonComponent } from '../button/button.component'

let nextId = 0

@Component({
  selector: 'ay-dialog',
  standalone: true,
  imports: [CommonModule, AyButtonComponent],
  host: {
    'class': 'ay-dialog-wrapper',
  },
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class AyDialogComponent {
  private readonly uid = nextId++
  private previouslyFocused: HTMLElement | null = null

  @Input() confirmLabel: string = 'Confirmer'
  @Input() cancelLabel: string = 'Annuler'
  @Input() confirmColor: 'primary' | 'danger' = 'primary'
  @Input() showConfirm: boolean = true
  @Input() showCancel: boolean = true

  open = false
  @Output() closed = new EventEmitter<void>()
  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  @ViewChild('dialogEl') dialogEl?: ElementRef<HTMLElement>

  readonly titleId = () => `ay-dialog-title-${this.uid}`

  show(): void {
    this.previouslyFocused = document.activeElement as HTMLElement
    this.open = true
    setTimeout(() => {
      const el = this.dialogEl?.nativeElement
      if (el) {
        const firstFocusable = el.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        firstFocusable?.focus()
      }
    })
  }

  close(): void {
    this.open = false
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
    if (!this.open || event.key !== 'Tab') return

    const el = this.dialogEl?.nativeElement
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
