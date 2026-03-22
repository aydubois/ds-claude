import {
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
  ElementRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
  selector: 'ponyo-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PonyoInputComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ponyo-input-field',
    '[class.ponyo-input-field--focused]': 'focused()',
    '[class.ponyo-input-field--filled]': '!!value()',
    '[class.ponyo-input-field--error]': '!!error()',
    '[class.ponyo-input-field--disabled]': 'disabled()',
  },
  template: `
    <div class="ponyo-input-wrapper">
      <input
        #inputEl
        class="ponyo-input"
        [id]="inputId()"
        [type]="type()"
        [value]="value()"
        [disabled]="disabled()"
        [required]="required()"
        [attr.aria-describedby]="describedBy()"
        [attr.aria-invalid]="!!error()"
        [attr.placeholder]="' '"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />
      <label class="ponyo-input-label" [attr.for]="inputId()">
        {{ label() }}
        @if (required()) {
          <span class="ponyo-input-required" aria-hidden="true">*</span>
        }
      </label>
    </div>
    @if (error()) {
      <span class="ponyo-input-error" [id]="errorId()">{{ error() }}</span>
    } @else if (helper()) {
      <span class="ponyo-input-helper" [id]="helperId()">{{ helper() }}</span>
    }
  `,
  styleUrl: './input.component.scss',
})
export class PonyoInputComponent implements ControlValueAccessor {
  private readonly uid = nextId++;

  readonly label = input.required<string>();
  readonly type = input<string>('text');
  readonly helper = input<string>('');
  readonly error = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly valueChange = output<string>();

  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  readonly value = signal('');
  readonly focused = signal(false);

  readonly inputId = computed(() => `ponyo-input-${this.uid}`);
  readonly errorId = computed(() => `ponyo-input-error-${this.uid}`);
  readonly helperId = computed(() => `ponyo-input-helper-${this.uid}`);

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId();
    if (this.helper()) return this.helperId();
    return null;
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // disabled is managed via input binding
  }
}
