import {
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AySelectOption } from './select.model'

let nextId = 0

@Component({
  selector: 'ay-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AySelectComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-select',
    '[class.ay-select--open]': 'isOpen()',
    '[class.ay-select--error]': '!!error()',
    '[class.ay-select--disabled]': 'disabled()',
    '[class.ay-select--filled]': '!!selectedOption()',
  },
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class AySelectComponent implements ControlValueAccessor {
  private readonly uid = nextId++
  private readonly elRef = inject(ElementRef)

  readonly label = input.required<string>()
  readonly options = input.required<AySelectOption[]>()
  readonly placeholder = input<string>('— Sélectionner —')
  readonly helper = input<string>('')
  readonly error = input<string>('')
  readonly required = input<boolean>(false)
  readonly disabled = input<boolean>(false)

  readonly selectionChange = output<string>()

  readonly value = signal<string>('')
  readonly isOpen = signal(false)
  readonly highlightedIndex = signal(-1)

  readonly labelId = computed(() => `ay-select-label-${this.uid}`)
  readonly errorId = computed(() => `ay-select-error-${this.uid}`)
  readonly helperId = computed(() => `ay-select-helper-${this.uid}`)

  readonly selectedOption = computed(() =>
    this.options().find(o => o.value === this.value()) ?? null
  )

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId()
    if (this.helper()) return this.helperId()
    return null
  })

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false)
    }
  }

  toggleDropdown(): void {
    if (this.disabled()) return
    this.isOpen.update(v => !v)
    if (this.isOpen()) {
      const idx = this.options().findIndex(o => o.value === this.value())
      this.highlightedIndex.set(idx >= 0 ? idx : 0)
    }
  }

  selectOption(option: AySelectOption): void {
    this.value.set(option.value)
    this.isOpen.set(false)
    this.onChange(option.value)
    this.onTouched()
    this.selectionChange.emit(option.value)
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.options()

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (this.isOpen() && this.highlightedIndex() >= 0) {
          this.selectOption(opts[this.highlightedIndex()])
        } else {
          this.toggleDropdown()
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!this.isOpen()) {
          this.isOpen.set(true)
        }
        this.highlightedIndex.update(i => Math.min(i + 1, opts.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        this.highlightedIndex.update(i => Math.max(i - 1, 0))
        break
      case 'Escape':
        this.isOpen.set(false)
        break
    }
  }

  writeValue(value: string): void {
    this.value.set(value ?? '')
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
