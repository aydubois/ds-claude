import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core'
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AySegmentOption } from './segmented-menu.model'

@Component({
  selector: 'ay-segmented-menu',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AySegmentedMenuComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-segmented-menu',
    '[class.ay-segmented-menu--disabled]': 'disabled',
    'role': 'radiogroup',
  },
  templateUrl: './segmented-menu.component.html',
  styleUrls: ['./segmented-menu.component.scss'],
})
export class AySegmentedMenuComponent implements ControlValueAccessor {
  @Input({ required: true }) options!: AySegmentOption[]
  @Input() disabled: boolean = false

  @Output() valueChange = new EventEmitter<string>()

  value: string = ''

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  select(option: AySegmentOption): void {
    if (this.disabled || option.disabled) return
    this.value = option.value
    this.onChange(option.value)
    this.valueChange.emit(option.value)
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const opts = this.options
    let nextIndex = -1

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      nextIndex = this.findNextEnabled(index, 1, opts)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      nextIndex = this.findNextEnabled(index, -1, opts)
    }

    if (nextIndex >= 0) {
      this.select(opts[nextIndex])
      const buttons = (event.target as HTMLElement)
        .parentElement?.querySelectorAll<HTMLElement>('[role="radio"]')
      buttons?.[nextIndex]?.focus()
    }
  }

  private findNextEnabled(current: number, direction: number, opts: AySegmentOption[]): number {
    const len = opts.length
    let idx = (current + direction + len) % len
    let attempts = 0
    while (opts[idx].disabled && attempts < len) {
      idx = (idx + direction + len) % len
      attempts++
    }
    return opts[idx].disabled ? -1 : idx
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value = value ?? ''
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    // disabled is managed via input binding
  }
}
