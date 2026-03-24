import { Component, input } from '@angular/core';

export type AyButtonVariant = 'filled' | 'outlined' | 'text'
export type AyButtonColor = 'primary' | 'danger'
export type AyButtonSize = 'sm' | 'md'

@Component({
  selector: 'ay-button, button[ay-button], a[ay-button]',
  standalone: true,
  host: {
    'class': 'ay-button',
    '[class.ay-button--filled]': 'variant() === "filled"',
    '[class.ay-button--outlined]': 'variant() === "outlined"',
    '[class.ay-button--text]': 'variant() === "text"',
    '[class.ay-button--primary]': 'color() === "primary"',
    '[class.ay-button--danger]': 'color() === "danger"',
    '[class.ay-button--sm]': 'size() === "sm"',
    '[class.ay-button--md]': 'size() === "md"',
    '[class.ay-button--disabled]': 'isDisabled()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[tabindex]': 'isDisabled() ? -1 : 0',
  },
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class AyButtonComponent {
  readonly variant = input<AyButtonVariant>('filled')
  readonly color = input<AyButtonColor>('primary')
  readonly size = input<AyButtonSize>('md')
  readonly isDisabled = input(false, { alias: 'disabled' })
}
