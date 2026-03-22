import { Component, ViewEncapsulation, input, computed } from '@angular/core';

export type PonyoButtonVariant = 'filled' | 'outlined' | 'text';
export type PonyoButtonColor = 'primary' | 'danger';
export type PonyoButtonSize = 'sm' | 'md';

@Component({
  selector: 'ponyo-button, button[ponyo-button], a[ponyo-button]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ponyo-button',
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.aria-disabled]': 'disabled()',
    '[tabindex]': 'disabled() ? -1 : 0',
  },
  template: `<ng-content />`,
  styleUrl: './button.component.scss',
})
export class PonyoButtonComponent {
  readonly variant = input<PonyoButtonVariant>('filled');
  readonly color = input<PonyoButtonColor>('primary');
  readonly size = input<PonyoButtonSize>('md');
  readonly disabled = input<boolean>(false);

  protected readonly hostClasses = computed(() => {
    const classes = [
      `ponyo-button--${this.variant()}`,
      `ponyo-button--${this.color()}`,
      `ponyo-button--${this.size()}`,
    ];
    if (this.disabled()) {
      classes.push('ponyo-button--disabled');
    }
    return classes.join(' ');
  });
}
