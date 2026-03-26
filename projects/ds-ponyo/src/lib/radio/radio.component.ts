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
    '[class.ay-radio--selected]': 'isSelected',
    '[class.ay-radio--disabled]': 'disabled',
  },
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class AyRadioComponent implements ControlValueAccessor {
  private readonly uid = nextId++

  @Input({ required: true }) value!: string
  @Input() name: string = ''
  @Input() disabled: boolean = false

  @Output() selectedChange = new EventEmitter<string>()

  selectedValue: string | null = null
  get inputId(): string { return `ay-radio-${this.uid}` }
  get isSelected(): boolean { return this.selectedValue === this.value }

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  onInputChange(): void {
    this.selectedValue = this.value
    this.onChange(this.value)
    this.onTouched()
    this.selectedChange.emit(this.value)
  }

  writeValue(value: string): void {
    this.selectedValue = value
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
