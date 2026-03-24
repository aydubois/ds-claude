import {
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ay-slider',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AySliderComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-slider',
    '[class.ay-slider--disabled]': 'disabled()',
  },
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class AySliderComponent implements ControlValueAccessor {
  readonly min = input<number>(0)
  readonly max = input<number>(100)
  readonly step = input<number>(1)
  readonly disabled = input<boolean>(false)

  readonly valueChange = output<number>()

  readonly value = signal(0)

  readonly progress = computed(() => {
    const range = this.max() - this.min()
    if (range <= 0) return 0
    return ((this.value() - this.min()) / range) * 100
  })

  private onChange: (value: number) => void = () => {}
  private onTouched: () => void = () => {}

  onInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value)
    this.value.set(val)
    this.onChange(val)
    this.valueChange.emit(val)
  }

  onBlur(): void {
    this.onTouched()
  }

  // ControlValueAccessor
  writeValue(value: number): void {
    this.value.set(value ?? 0)
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    // disabled is managed via input binding
  }
}
