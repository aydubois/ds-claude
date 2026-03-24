import {
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AyDatePickerDay } from './date-picker.model'

let nextId = 0

const DAYS_IN_WEEK = 7
const WEEK_DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

@Component({
  selector: 'ay-date-picker',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AyDatePickerComponent),
      multi: true,
    },
  ],
  host: {
    'class': 'ay-date-picker',
    '[class.ay-date-picker--open]': 'open()',
    '[class.ay-date-picker--focused]': 'focused()',
    '[class.ay-date-picker--filled]': '!!value()',
    '[class.ay-date-picker--error]': '!!error()',
    '[class.ay-date-picker--disabled]': 'disabled()',
  },
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class AyDatePickerComponent implements ControlValueAccessor {
  private readonly uid = nextId++
  private readonly elRef = inject(ElementRef)

  readonly label = input.required<string>()
  readonly min = input<string>('')
  readonly max = input<string>('')
  readonly disabled = input<boolean>(false)
  readonly required = input<boolean>(false)
  readonly error = input<string>('')
  readonly helper = input<string>('')

  readonly valueChange = output<string>()

  readonly value = signal<string>('')
  readonly open = signal(false)
  readonly focused = signal(false)
  readonly viewYear = signal(new Date().getFullYear())
  readonly viewMonth = signal(new Date().getMonth())
  readonly focusedDayIndex = signal(-1)

  readonly inputId = computed(() => `ay-date-picker-${this.uid}`)
  readonly errorId = computed(() => `ay-date-picker-error-${this.uid}`)
  readonly helperId = computed(() => `ay-date-picker-helper-${this.uid}`)

  readonly weekDays = WEEK_DAYS

  readonly displayValue = computed(() => {
    const v = this.value()
    if (!v) return ''
    const d = new Date(v + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  })

  readonly monthLabel = computed(() =>
    `${MONTH_NAMES[this.viewMonth()]} ${this.viewYear()}`
  )

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId()
    if (this.helper()) return this.helperId()
    return null
  })

  readonly calendarDays = computed<AyDatePickerDay[]>(() => {
    const year = this.viewYear()
    const month = this.viewMonth()
    const today = new Date()
    const selected = this.value() ? new Date(this.value() + 'T00:00:00') : null
    const minDate = this.min() ? new Date(this.min() + 'T00:00:00') : null
    const maxDate = this.max() ? new Date(this.max() + 'T00:00:00') : null

    const firstDay = new Date(year, month, 1)
    // Monday = 0 based offset
    let startOffset = firstDay.getDay() - 1
    if (startOffset < 0) startOffset = 6

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days: AyDatePickerDay[] = []

    // Previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = new Date(year, month - 1, day)
      days.push(this.buildDay(date, day, false, today, selected, minDate, maxDate))
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      days.push(this.buildDay(date, d, true, today, selected, minDate, maxDate))
    }

    // Next month padding
    const remaining = DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK)
    if (remaining < DAYS_IN_WEEK) {
      for (let d = 1; d <= remaining; d++) {
        const date = new Date(year, month + 1, d)
        days.push(this.buildDay(date, d, false, today, selected, minDate, maxDate))
      }
    }

    return days
  })

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  toggleOpen(): void {
    if (this.disabled()) return
    if (!this.open()) {
      const v = this.value()
      if (v) {
        const d = new Date(v + 'T00:00:00')
        this.viewYear.set(d.getFullYear())
        this.viewMonth.set(d.getMonth())
      } else {
        const now = new Date()
        this.viewYear.set(now.getFullYear())
        this.viewMonth.set(now.getMonth())
      }
    }
    this.open.update(o => !o)
  }

  prevMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11)
      this.viewYear.update(y => y - 1)
    } else {
      this.viewMonth.update(m => m - 1)
    }
  }

  nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0)
      this.viewYear.update(y => y + 1)
    } else {
      this.viewMonth.update(m => m + 1)
    }
  }

  selectDay(day: AyDatePickerDay): void {
    if (day.disabled) return
    const iso = this.toIso(day.date)
    this.value.set(iso)
    this.onChange(iso)
    this.valueChange.emit(iso)
    this.open.set(false)
  }

  onCalendarKeydown(event: KeyboardEvent): void {
    const days = this.calendarDays()
    let idx = this.focusedDayIndex()

    if (idx < 0) {
      // Find selected or first current-month day
      idx = days.findIndex(d => d.selected)
      if (idx < 0) idx = days.findIndex(d => d.currentMonth)
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        idx = Math.min(idx + 1, days.length - 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        idx = Math.max(idx - 1, 0)
        break
      case 'ArrowDown':
        event.preventDefault()
        idx = Math.min(idx + 7, days.length - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        idx = Math.max(idx - 7, 0)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (idx >= 0 && !days[idx].disabled) {
          this.selectDay(days[idx])
        }
        return
      case 'Escape':
        event.preventDefault()
        this.open.set(false)
        return
      default:
        return
    }

    this.focusedDayIndex.set(idx)
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.open.set(false)
    }
  }

  onFocus(): void {
    this.focused.set(true)
  }

  onBlur(): void {
    this.focused.set(false)
    this.onTouched()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.open.set(false)
    }
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value.set(value ?? '')
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

  private buildDay(
    date: Date,
    day: number,
    currentMonth: boolean,
    today: Date,
    selected: Date | null,
    minDate: Date | null,
    maxDate: Date | null,
  ): AyDatePickerDay {
    const isToday = currentMonth
      && date.getDate() === today.getDate()
      && date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear()

    const isSelected = selected !== null
      && date.getDate() === selected.getDate()
      && date.getMonth() === selected.getMonth()
      && date.getFullYear() === selected.getFullYear()

    let disabled = false
    if (minDate && date < minDate) disabled = true
    if (maxDate && date > maxDate) disabled = true

    return { date, day, currentMonth, today: isToday, selected: isSelected, disabled }
  }

  private toIso(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
}
