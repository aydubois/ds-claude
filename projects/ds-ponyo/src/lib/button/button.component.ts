import { Component, input } from '@angular/core';

export type PonyoButtonVariant = 'filled' | 'outlined' | 'text';
export type PonyoButtonColor = 'primary' | 'danger';
export type PonyoButtonSize = 'sm' | 'md';

@Component({
  selector: 'ponyo-button, button[ponyo-button], a[ponyo-button]',
  standalone: true,
  host: {
    'class': 'ponyo-button',
    '[class.ponyo-button--filled]': 'variant() === "filled"',
    '[class.ponyo-button--outlined]': 'variant() === "outlined"',
    '[class.ponyo-button--text]': 'variant() === "text"',
    '[class.ponyo-button--primary]': 'color() === "primary"',
    '[class.ponyo-button--danger]': 'color() === "danger"',
    '[class.ponyo-button--sm]': 'size() === "sm"',
    '[class.ponyo-button--md]': 'size() === "md"',
    '[class.ponyo-button--disabled]': 'isDisabled()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[tabindex]': 'isDisabled() ? -1 : 0',
  },
  template: `<ng-content />`,
  styleUrl: './button.component.scss',
})
export class PonyoButtonComponent {
  readonly variant = input<PonyoButtonVariant>('filled');
  readonly color = input<PonyoButtonColor>('primary');
  readonly size = input<PonyoButtonSize>('md');
  readonly isDisabled = input(false, { alias: 'disabled' });
}
