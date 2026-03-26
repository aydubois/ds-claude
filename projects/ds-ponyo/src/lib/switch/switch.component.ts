import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ay-switch',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AySwitchComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-switch',
    '[class.ay-switch--checked]': 'checked',
    '[class.ay-switch--disabled]': 'disabled',
    '(click)': 'toggle()',
    '(keydown.space)': 'toggle(); $event.preventDefault()',
  },
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class AySwitchComponent implements ControlValueAccessor {
  @Input() disabled: boolean = false

  @Output() checkedChange = new EventEmitter<boolean>()

  checked = false

  private onChange: (value: boolean) => void = () => {}
  private onTouched: () => void = () => {}

  toggle(): void {
    if (this.disabled) return
    const next = !this.checked
    this.checked = next
    this.onChange(next)
    this.onTouched()
    this.checkedChange.emit(next)
  }

  writeValue(value: boolean): void {
    this.checked = !!value
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
