import {
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0

@Component({
  selector: 'ay-radio',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyRadioComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-radio',
    '[class.ay-radio--selected]': 'isSelected()',
    '[class.ay-radio--disabled]': 'disabled()',
  },
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
})
export class AyRadioComponent implements ControlValueAccessor {
  private readonly uid = nextId++

  readonly value = input.required<string>()
  readonly name = input<string>('')
  readonly disabled = input<boolean>(false)

  readonly selectedChange = output<string>()

  readonly selectedValue = signal<string | null>(null)
  readonly inputId = computed(() => `ay-radio-${this.uid}`)
  readonly isSelected = computed(() => this.selectedValue() === this.value())

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  onInputChange(): void {
    this.selectedValue.set(this.value())
    this.onChange(this.value())
    this.onTouched()
    this.selectedChange.emit(this.value())
  }

  writeValue(value: string): void {
    this.selectedValue.set(value)
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
