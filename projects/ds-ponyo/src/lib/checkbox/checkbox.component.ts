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
  selector: 'ponyo-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PonyoCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ponyo-checkbox',
    '[class.ponyo-checkbox--checked]': 'checked()',
    '[class.ponyo-checkbox--indeterminate]': 'indeterminate()',
    '[class.ponyo-checkbox--disabled]': 'disabled()',
    '(click)': 'toggle()',
    '(keydown.space)': 'toggle(); $event.preventDefault()',
  },
  template: `
    <span
      class="ponyo-checkbox-box"
      role="checkbox"
      [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
      [attr.aria-disabled]="disabled()"
      [attr.aria-labelledby]="labelId()"
      [tabindex]="disabled() ? -1 : 0"
    ></span>
    <span class="ponyo-checkbox-label" [id]="labelId()">
      <ng-content />
    </span>
  `,
  styleUrl: './checkbox.component.scss',
})
export class PonyoCheckboxComponent implements ControlValueAccessor {
  private readonly uid = nextId++;

  readonly disabled = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);

  readonly checkedChange = output<boolean>();

  readonly checked = signal(false);
  readonly labelId = computed(() => `ponyo-checkbox-label-${this.uid}`);

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
