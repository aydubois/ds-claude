import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core'
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AyIconComponent } from '../icon/icon.component'
import { AySelectOption } from './select.model'

let nextId = 0

@Component({
  selector: 'ay-select',
  standalone: true,
  imports: [CommonModule, AyIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AySelectComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-select',
    '[class.ay-select--open]': 'isOpen',
    '[class.ay-select--error]': '!!error',
    '[class.ay-select--disabled]': 'disabled',
    '[class.ay-select--filled]': '!!selectedOption',
    '[class.ay-select--clearable]': 'showClear',
  },
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class AySelectComponent implements ControlValueAccessor {
  private readonly uid = nextId++
  private readonly elRef = inject(ElementRef)

  @Input({ required: true }) label!: string
  @Input({ required: true }) options!: AySelectOption[]
  @Input() placeholder: string = '— Sélectionner —'
  @Input() helper: string = ''
  @Input() error: string = ''
  @Input() required: boolean = false
  @Input() disabled: boolean = false
  @Input() clearable: boolean = false
  @Input() searchable: boolean = false

  @Output() selectionChange = new EventEmitter<string>()

  value: string = ''
  isOpen = false
  highlightedIndex = -1
  searchQuery = ''

  get labelId(): string { return `ay-select-label-${this.uid}` }
  get errorId(): string { return `ay-select-error-${this.uid}` }
  get helperId(): string { return `ay-select-helper-${this.uid}` }

  get selectedOption(): AySelectOption | null {
    return this.options.find(o => o.value === this.value) ?? null
  }

  get filteredOptions(): AySelectOption[] {
    const query = this.searchQuery.toLowerCase().trim()
    if (!query) return this.options
    return this.options.filter(o => o.label.toLowerCase().includes(query))
  }

  get showClear(): boolean {
    return this.clearable && !!this.value && !this.disabled
  }

  get describedBy(): string | null {
    if (this.error) return this.errorId
    if (this.helper) return this.helperId
    return null
  }

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false
    }
  }

  toggleDropdown(): void {
    if (this.disabled) return
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.searchQuery = ''
      const idx = this.options.findIndex(o => o.value === this.value)
      this.highlightedIndex = idx >= 0 ? idx : 0
    }
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value
    this.highlightedIndex = 0
  }

  clearValue(event: MouseEvent): void {
    event.stopPropagation()
    this.value = ''
    this.onChange('')
    this.onTouched()
    this.selectionChange.emit('')
  }

  onNativeChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value
    const option = this.options.find(o => o.value === val)
    if (option) {
      this.selectOption(option)
    } else {
      this.value = ''
      this.onChange('')
      this.onTouched()
      this.selectionChange.emit('')
    }
  }

  selectOption(option: AySelectOption): void {
    this.value = option.value
    this.isOpen = false
    this.onChange(option.value)
    this.onTouched()
    this.selectionChange.emit(option.value)
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.filteredOptions

    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        if (this.isOpen && this.highlightedIndex >= 0) {
          this.selectOption(opts[this.highlightedIndex])
        } else {
          this.toggleDropdown()
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!this.isOpen) {
          this.isOpen = true
        }
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, opts.length - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0)
        break
      case 'Escape':
        this.isOpen = false
        break
    }
  }

  writeValue(value: string): void {
    this.value = value ?? ''
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
