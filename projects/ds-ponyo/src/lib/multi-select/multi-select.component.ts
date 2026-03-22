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

export interface PonyoMultiSelectOption {
  value: string;
  label: string;
}

let nextId = 0;

@Component({
  selector: 'ponyo-multi-select',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PonyoMultiSelectComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ponyo-multi-select',
    '[class.ponyo-multi-select--open]': 'isOpen()',
    '[class.ponyo-multi-select--error]': '!!error()',
    '[class.ponyo-multi-select--disabled]': 'disabled()',
  },
  template: `
    <div
      class="ponyo-multi-select-box"
      [tabindex]="disabled() ? -1 : 0"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-labelledby]="labelId()"
      [attr.aria-describedby]="describedBy()"
      [attr.aria-invalid]="!!error()"
      (click)="toggleDropdown()"
      (keydown)="onKeydown($event)"
    >
      @if (selectedOptions().length) {
        @for (opt of selectedOptions(); track opt.value) {
          <span class="ponyo-chip">
            {{ opt.label }}
            <span
              class="ponyo-chip-remove"
              role="button"
              [attr.aria-label]="'Retirer ' + opt.label"
              (click)="removeValue(opt.value); $event.stopPropagation()"
            >&times;</span>
          </span>
        }
      } @else {
        <span class="ponyo-multi-select-placeholder">{{ placeholder() }}</span>
      }
    </div>
    <span class="ponyo-multi-select-label" [id]="labelId()">
      {{ label() }}
      @if (required()) {
        <span class="ponyo-multi-select-required" aria-hidden="true">*</span>
      }
    </span>
    <span class="ponyo-multi-select-arrow"></span>
    @if (isOpen()) {
      <div class="ponyo-multi-select-dropdown" role="listbox" [attr.aria-multiselectable]="true">
        <div class="ponyo-multi-select-toolbar">
          <button
            class="ponyo-multi-select-toolbar-btn"
            type="button"
            (click)="selectAll(); $event.stopPropagation()"
          >Tout sélectionner</button>
          <button
            class="ponyo-multi-select-toolbar-btn"
            type="button"
            (click)="deselectAll(); $event.stopPropagation()"
          >Tout désélectionner</button>
        </div>
        @for (option of options(); track option.value; let i = $index) {
          <div
            class="ponyo-multi-select-option"
            [class.ponyo-multi-select-option--highlighted]="i === highlightedIndex()"
            role="option"
            [attr.aria-selected]="isSelected(option.value)"
            (click)="toggleOption(option.value); $event.stopPropagation()"
            (mouseenter)="highlightedIndex.set(i)"
          >
            <span
              class="ponyo-multi-select-check"
              [class.ponyo-multi-select-check--checked]="isSelected(option.value)"
            ></span>
            {{ option.label }}
          </div>
        }
      </div>
    }
    @if (error()) {
      <span class="ponyo-multi-select-error" [id]="errorId()">{{ error() }}</span>
    } @else if (helper()) {
      <span class="ponyo-multi-select-helper" [id]="helperId()">{{ helper() }}</span>
    }
  `,
  styleUrl: './multi-select.component.scss',
})
export class PonyoMultiSelectComponent implements ControlValueAccessor {
  private readonly uid = nextId++;
  private readonly elRef = inject(ElementRef);

  readonly label = input.required<string>();
  readonly options = input.required<PonyoMultiSelectOption[]>();
  readonly placeholder = input<string>('Aucune sélection');
  readonly helper = input<string>('');
  readonly error = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly selectionChange = output<string[]>();

  readonly values = signal<string[]>([]);
  readonly isOpen = signal(false);
  readonly highlightedIndex = signal(-1);

  readonly labelId = computed(() => `ponyo-multi-select-label-${this.uid}`);
  readonly errorId = computed(() => `ponyo-multi-select-error-${this.uid}`);
  readonly helperId = computed(() => `ponyo-multi-select-helper-${this.uid}`);

  readonly selectedOptions = computed(() =>
    this.options().filter(o => this.values().includes(o.value))
  );

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId();
    if (this.helper()) return this.helperId();
    return null;
  });

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  isSelected(value: string): boolean {
    return this.values().includes(value);
  }

  toggleDropdown(): void {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
  }

  toggleOption(value: string): void {
    const current = this.values();
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    this.updateValues(next);
  }

  removeValue(value: string): void {
    this.updateValues(this.values().filter(v => v !== value));
  }

  selectAll(): void {
    this.updateValues(this.options().map(o => o.value));
  }

  deselectAll(): void {
    this.updateValues([]);
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.options();
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen() && this.highlightedIndex() >= 0) {
          this.toggleOption(opts[this.highlightedIndex()].value);
        } else {
          this.toggleDropdown();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) this.isOpen.set(true);
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

  private updateValues(values: string[]): void {
    this.values.set(values);
    this.onChange(values);
    this.onTouched();
    this.selectionChange.emit(values);
  }

  writeValue(value: string[]): void {
    this.values.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
