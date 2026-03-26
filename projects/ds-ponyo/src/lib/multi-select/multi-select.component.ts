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
import { AyMultiSelectOption } from './multi-select.model'

let nextId = 0

@Component({
  selector: 'ay-multi-select',
  standalone: true,
  imports: [CommonModule, AyIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyMultiSelectComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-multi-select',
    '[class.ay-multi-select--open]': 'isOpen',
    '[class.ay-multi-select--error]': '!!error',
    '[class.ay-multi-select--disabled]': 'disabled',
  },
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class AyMultiSelectComponent implements ControlValueAccessor {
  private readonly uid = nextId++
  private readonly elRef = inject(ElementRef)

  @Input({ required: true }) label!: string
  @Input({ required: true }) options!: AyMultiSelectOption[]
  @Input() placeholder: string = 'Aucune sélection'
  @Input() helper: string = ''
  @Input() error: string = ''
  @Input() required: boolean = false
  @Input() disabled: boolean = false
  @Input() maxChips: number = 2
  @Input() searchable: boolean = false

  @Output() selectionChange = new EventEmitter<string[]>()

  values: string[] = []
  isOpen = false
  highlightedIndex = -1
  searchQuery = ''

  get labelId(): string { return `ay-multi-select-label-${this.uid}` }
  get errorId(): string { return `ay-multi-select-error-${this.uid}` }
  get helperId(): string { return `ay-multi-select-helper-${this.uid}` }

  get selectedOptions(): AyMultiSelectOption[] {
    return this.options.filter(o => this.values.includes(o.value))
  }

  get filteredOptions(): AyMultiSelectOption[] {
    const query = this.searchQuery.toLowerCase().trim()
    if (!query) return this.options
    return this.options.filter(o => o.label.toLowerCase().includes(query))
  }

  get displayMode(): 'chips' | 'summary' | 'empty' {
    const count = this.selectedOptions.length
    if (count === 0) return 'empty'
    if (count > this.maxChips) return 'summary'
    return 'chips'
  }

  get summaryText(): string {
    return `${this.selectedOptions.length} valeurs sélectionnées`
  }

  get describedBy(): string | null {
    if (this.error) return this.errorId
    if (this.helper) return this.helperId
    return null
  }

  private onChange: (value: string[]) => void = () => {}
  private onTouched: () => void = () => {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false
    }
  }

  isSelected(value: string): boolean {
    return this.values.includes(value)
  }

  toggleDropdown(): void {
    if (this.disabled) return
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.searchQuery = ''
    }
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value
    this.highlightedIndex = 0
  }

  toggleOption(value: string): void {
    const current = this.values
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    this.updateValues(next)
  }

  removeValue(value: string): void {
    this.updateValues(this.values.filter(v => v !== value))
  }

  selectAll(): void {
    this.updateValues(this.options.map(o => o.value))
  }

  deselectAll(): void {
    this.updateValues([])
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.filteredOptions
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (this.isOpen && this.highlightedIndex >= 0) {
          this.toggleOption(opts[this.highlightedIndex].value)
        } else {
          this.toggleDropdown()
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!this.isOpen) this.isOpen = true
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

  private updateValues(values: string[]): void {
    this.values = values
    this.onChange(values)
    this.onTouched()
    this.selectionChange.emit(values)
  }

  writeValue(value: string[]): void {
    this.values = value ?? []
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
