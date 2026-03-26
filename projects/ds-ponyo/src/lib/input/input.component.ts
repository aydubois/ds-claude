import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AyIconComponent } from '../icon/icon.component'
import { AyInputType } from './input.model'

let nextId = 0

@Component({
  selector: 'ay-input',
  standalone: true,
  imports: [CommonModule, AyIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyInputComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-input-field',
    '[class.ay-input-field--focused]': 'focused',
    '[class.ay-input-field--filled]': '!!value',
    '[class.ay-input-field--error]': '!!error',
    '[class.ay-input-field--disabled]': 'disabled',
    '[class.ay-input-field--clearable]': 'showClear',
    '[class.ay-input-field--has-prefix]': '!!prefixIcon',
    '[class.ay-input-field--has-suffix]': 'hasSuffix',
  },
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class AyInputComponent implements ControlValueAccessor {
  private readonly uid = nextId++

  @Input({ required: true }) label!: string
  @Input() type: AyInputType = 'text'
  @Input() helper: string = ''
  @Input() error: string = ''
  @Input() required: boolean = false
  @Input() disabled: boolean = false
  @Input() clearable: boolean = false
  @Input() prefixIcon: string = ''
  @Input() suffixIcon: string = ''

  @Output() valueChange = new EventEmitter<string>()
  @Output() suffixClick = new EventEmitter<void>()

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>

  value = ''
  focused = false

  get inputId(): string { return `ay-input-${this.uid}` }
  get errorId(): string { return `ay-input-error-${this.uid}` }
  get helperId(): string { return `ay-input-helper-${this.uid}` }

  get showClear(): boolean {
    return this.clearable && !!this.value && !this.disabled
  }

  get hasSuffix(): boolean {
    return !!this.suffixIcon || this.showClear
  }

  get describedBy(): string | null {
    if (this.error) return this.errorId
    if (this.helper) return this.helperId
    return null
  }

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value
    this.value = val
    this.onChange(val)
    this.valueChange.emit(val)
  }

  onFocus(): void {
    this.focused = true
  }

  onBlur(): void {
    this.focused = false
    this.onTouched()
  }

  onSuffixClick(event: MouseEvent): void {
    event.preventDefault()
    this.suffixClick.emit()
    this.inputEl?.nativeElement.focus()
  }

  onClear(event: MouseEvent): void {
    event.preventDefault(); // Prevent blur on input
    this.value = ''
    this.onChange('')
    this.valueChange.emit('')
    this.inputEl?.nativeElement.focus()
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value = value ?? ''
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    // disabled is managed via input binding
  }
}
