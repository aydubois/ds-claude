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
import { AyIconComponent } from '../icon/icon.component'
import { AyMultiSelectOption } from './multi-select.model'

let nextId = 0

@Component({
  selector: 'ay-multi-select',
  standalone: true,
  imports: [AyIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyMultiSelectComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-multi-select',
    '[class.ay-multi-select--open]': 'isOpen()',
    '[class.ay-multi-select--error]': '!!error()',
    '[class.ay-multi-select--disabled]': 'disabled()',
  },
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
})
export class AyMultiSelectComponent implements ControlValueAccessor {
  private readonly uid = nextId++
  private readonly elRef = inject(ElementRef)

  readonly label = input.required<string>()
  readonly options = input.required<AyMultiSelectOption[]>()
  readonly placeholder = input<string>('Aucune sélection')
  readonly helper = input<string>('')
  readonly error = input<string>('')
  readonly required = input<boolean>(false)
  readonly disabled = input<boolean>(false)
  readonly maxChips = input<number>(2)

  readonly selectionChange = output<string[]>()

  readonly values = signal<string[]>([])
  readonly isOpen = signal(false)
  readonly highlightedIndex = signal(-1)

  readonly labelId = computed(() => `ay-multi-select-label-${this.uid}`)
  readonly errorId = computed(() => `ay-multi-select-error-${this.uid}`)
  readonly helperId = computed(() => `ay-multi-select-helper-${this.uid}`)

  readonly selectedOptions = computed(() =>
    this.options().filter(o => this.values().includes(o.value))
  )

  readonly displayMode = computed<'chips' | 'summary' | 'empty'>(() => {
    const count = this.selectedOptions().length
    if (count === 0) return 'empty'
    if (count > this.maxChips()) return 'summary'
    return 'chips'
  })

  readonly summaryText = computed(() =>
    `${this.selectedOptions().length} valeurs sélectionnées`
  )

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId()
    if (this.helper()) return this.helperId()
    return null
  })

  private onChange: (value: string[]) => void = () => {}
  private onTouched: () => void = () => {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false)
    }
  }

  isSelected(value: string): boolean {
    return this.values().includes(value)
  }

  toggleDropdown(): void {
    if (this.disabled()) return
    this.isOpen.update(v => !v)
  }

  toggleOption(value: string): void {
    const current = this.values()
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    this.updateValues(next)
  }

  removeValue(value: string): void {
    this.updateValues(this.values().filter(v => v !== value))
  }

  selectAll(): void {
    this.updateValues(this.options().map(o => o.value))
  }

  deselectAll(): void {
    this.updateValues([])
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.options()
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (this.isOpen() && this.highlightedIndex() >= 0) {
          this.toggleOption(opts[this.highlightedIndex()].value)
        } else {
          this.toggleDropdown()
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!this.isOpen()) this.isOpen.set(true)
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

  private updateValues(values: string[]): void {
    this.values.set(values)
    this.onChange(values)
    this.onTouched()
    this.selectionChange.emit(values)
  }

  writeValue(value: string[]): void {
    this.values.set(value ?? [])
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
