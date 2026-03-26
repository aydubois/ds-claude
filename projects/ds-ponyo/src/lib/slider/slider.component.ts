import {
  Component,
  Input,
  Output,
  EventEmitter,
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
    '[class.ay-slider--disabled]': 'disabled',
  },
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class AySliderComponent implements ControlValueAccessor {
  @Input() min: number = 0
  @Input() max: number = 100
  @Input() step: number = 1
  @Input() disabled: boolean = false

  @Output() valueChange = new EventEmitter<number>()

  value = 0

  get progress(): number {
    const range = this.max - this.min
    if (range <= 0) return 0
    return ((this.value - this.min) / range) * 100
  }

  private onChange: (value: number) => void = () => {}
  private onTouched: () => void = () => {}

  onInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value)
    this.value = val
    this.onChange(val)
    this.valueChange.emit(val)
  }

  onBlur(): void {
    this.onTouched()
  }

  // ControlValueAccessor
  writeValue(value: number): void {
    this.value = value ?? 0
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
