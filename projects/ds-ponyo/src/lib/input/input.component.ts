import {
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
  ElementRef,
  viewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AyIconComponent } from '../icon/icon.component'
import { AyInputType } from './input.model'

let nextId = 0

@Component({
  selector: 'ay-input',
  standalone: true,
  imports: [AyIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyInputComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-input-field',
    '[class.ay-input-field--focused]': 'focused()',
    '[class.ay-input-field--filled]': '!!value()',
    '[class.ay-input-field--error]': '!!error()',
    '[class.ay-input-field--disabled]': 'disabled()',
    '[class.ay-input-field--clearable]': 'showClear()',
    '[class.ay-input-field--has-prefix]': '!!prefixIcon()',
    '[class.ay-input-field--has-suffix]': 'hasSuffix()',
  },
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class AyInputComponent implements ControlValueAccessor {
  private readonly uid = nextId++

  readonly label = input.required<string>()
  readonly type = input<AyInputType>('text')
  readonly helper = input<string>('')
  readonly error = input<string>('')
  readonly required = input<boolean>(false)
  readonly disabled = input<boolean>(false)
  readonly clearable = input<boolean>(false)
  readonly prefixIcon = input<string>('')
  readonly suffixIcon = input<string>('')

  readonly valueChange = output<string>()
  readonly suffixClick = output<void>()

  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl')

  readonly value = signal('')
  readonly focused = signal(false)

  readonly inputId = computed(() => `ay-input-${this.uid}`)
  readonly errorId = computed(() => `ay-input-error-${this.uid}`)
  readonly helperId = computed(() => `ay-input-helper-${this.uid}`)

  readonly showClear = computed(() =>
    this.clearable() && !!this.value() && !this.disabled()
  )

  readonly hasSuffix = computed(() =>
    !!this.suffixIcon() || this.showClear()
  )

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId()
    if (this.helper()) return this.helperId()
    return null
  })

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value
    this.value.set(val)
    this.onChange(val)
    this.valueChange.emit(val)
  }

  onFocus(): void {
    this.focused.set(true)
  }

  onBlur(): void {
    this.focused.set(false)
    this.onTouched()
  }

  onSuffixClick(event: MouseEvent): void {
    event.preventDefault()
    this.suffixClick.emit()
    this.inputEl()?.nativeElement.focus()
  }

  onClear(event: MouseEvent): void {
    event.preventDefault(); // Prevent blur on input
    this.value.set('')
    this.onChange('')
    this.valueChange.emit('')
    this.inputEl()?.nativeElement.focus()
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value.set(value ?? '')
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
