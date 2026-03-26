import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core'
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0

@Component({
  selector: 'ay-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-checkbox',
    '[class.ay-checkbox--checked]': 'checked',
    '[class.ay-checkbox--indeterminate]': 'indeterminate',
    '[class.ay-checkbox--disabled]': 'disabled',
  },
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class AyCheckboxComponent implements ControlValueAccessor {
  private readonly uid = nextId++

  @Input() disabled: boolean = false
  @Input() indeterminate: boolean = false

  @Output() checkedChange = new EventEmitter<boolean>()

  checked = false
  get inputId(): string { return `ay-checkbox-${this.uid}` }

  private onChange: (value: boolean) => void = () => {}
  private onTouched: () => void = () => {}

  onInputChange(event: Event): void {
    const next = (event.target as HTMLInputElement).checked
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
