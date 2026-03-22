import {
  Component,
  ViewEncapsulation,
  input,
  output,
  signal,
  computed,
  forwardRef,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface PonyoSelectOption {
  value: string;
  label: string;
}

let nextId = 0;

@Component({
  selector: 'ponyo-select',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PonyoSelectComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ponyo-select',
    '[class.ponyo-select--open]': 'isOpen()',
    '[class.ponyo-select--error]': '!!error()',
    '[class.ponyo-select--disabled]': 'disabled()',
    '[class.ponyo-select--filled]': '!!selectedOption()',
  },
  template: `
    <div
      class="ponyo-select-box"
      [tabindex]="disabled() ? -1 : 0"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-labelledby]="labelId()"
      [attr.aria-describedby]="describedBy()"
      [attr.aria-invalid]="!!error()"
      [attr.aria-disabled]="disabled()"
      (click)="toggleDropdown()"
      (keydown)="onKeydown($event)"
    >
      {{ selectedOption()?.label || placeholder() }}
    </div>
    <span class="ponyo-select-label" [id]="labelId()">
      {{ label() }}
      @if (required()) {
        <span class="ponyo-select-required" aria-hidden="true">*</span>
      }
    </span>
    <span class="ponyo-select-arrow"></span>
    @if (isOpen()) {
      <div
        class="ponyo-select-dropdown"
        role="listbox"
        [attr.aria-labelledby]="labelId()"
      >
        @for (option of options(); track option.value; let i = $index) {
          <div
            class="ponyo-select-option"
            [class.ponyo-select-option--selected]="option.value === value()"
            [class.ponyo-select-option--highlighted]="i === highlightedIndex()"
            role="option"
            [attr.aria-selected]="option.value === value()"
            (click)="selectOption(option); $event.stopPropagation()"
            (mouseenter)="highlightedIndex.set(i)"
          >
            <span class="ponyo-select-option-check">
              @if (option.value === value()) { &#10003; }
            </span>
            {{ option.label }}
          </div>
        }
      </div>
    }
    @if (error()) {
      <span class="ponyo-select-error" [id]="errorId()">{{ error() }}</span>
    } @else if (helper()) {
      <span class="ponyo-select-helper" [id]="helperId()">{{ helper() }}</span>
    }
  `,
  styleUrl: './select.component.scss',
})
export class PonyoSelectComponent implements ControlValueAccessor {
  private readonly uid = nextId++;
  private readonly elRef = inject(ElementRef);

  readonly label = input.required<string>();
  readonly options = input.required<PonyoSelectOption[]>();
  readonly placeholder = input<string>('— Sélectionner —');
  readonly helper = input<string>('');
  readonly error = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly selectionChange = output<string>();

  readonly value = signal<string>('');
  readonly isOpen = signal(false);
  readonly highlightedIndex = signal(-1);

  readonly labelId = computed(() => `ponyo-select-label-${this.uid}`);
  readonly errorId = computed(() => `ponyo-select-error-${this.uid}`);
  readonly helperId = computed(() => `ponyo-select-helper-${this.uid}`);

  readonly selectedOption = computed(() =>
    this.options().find(o => o.value === this.value()) ?? null
  );

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId();
    if (this.helper()) return this.helperId();
    return null;
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown(): void {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      const idx = this.options().findIndex(o => o.value === this.value());
      this.highlightedIndex.set(idx >= 0 ? idx : 0);
    }
  }

  selectOption(option: PonyoSelectOption): void {
    this.value.set(option.value);
    this.isOpen.set(false);
    this.onChange(option.value);
    this.onTouched();
    this.selectionChange.emit(option.value);
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.options();

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen() && this.highlightedIndex() >= 0) {
          this.selectOption(opts[this.highlightedIndex()]);
        } else {
          this.toggleDropdown();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        }
        this.highlightedIndex.update(i => Math.min(i + 1, opts.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update(i => Math.max(i - 1, 0));
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
    }
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
