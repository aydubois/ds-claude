import {
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
  selector: 'ay-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-checkbox',
    '[class.ay-checkbox--checked]': 'checked()',
    '[class.ay-checkbox--indeterminate]': 'indeterminate()',
    '[class.ay-checkbox--disabled]': 'disabled()',
    '(click)': 'toggle()',
    '(keydown.space)': 'toggle(); $event.preventDefault()',
  },
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class AyCheckboxComponent implements ControlValueAccessor {
  private readonly uid = nextId++;

  readonly disabled = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);

  readonly checkedChange = output<boolean>();

  readonly checked = signal(false);
  readonly labelId = computed(() => `ay-checkbox-label-${this.uid}`);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
    this.checkedChange.emit(next);
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
