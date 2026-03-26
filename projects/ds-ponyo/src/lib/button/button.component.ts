import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AyIconComponent } from '../icon/icon.component'
import { AyButtonVariant, AyButtonColor, AyButtonSize } from './button.model'

@Component({
  selector: 'ay-button, button[ay-button], a[ay-button]',
  standalone: true,
  imports: [CommonModule, AyIconComponent],
  host: {
    'class': 'ay-button',
    '[class.ay-button--filled]': 'variant === "filled"',
    '[class.ay-button--outlined]': 'variant === "outlined"',
    '[class.ay-button--text]': 'variant === "text"',
    '[class.ay-button--primary]': 'color === "primary"',
    '[class.ay-button--danger]': 'color === "danger"',
    '[class.ay-button--sm]': 'size === "sm"',
    '[class.ay-button--md]': 'size === "md"',
    '[class.ay-button--disabled]': 'isDisabled',
    '[attr.aria-disabled]': 'isDisabled',
    '[tabindex]': 'isDisabled ? -1 : 0',
  },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class AyButtonComponent {
  @Input() variant: AyButtonVariant = 'filled'
  @Input() color: AyButtonColor = 'primary'
  @Input() size: AyButtonSize = 'md'
  @Input() icon: string = ''
  @Input() iconPosition: 'left' | 'right' = 'left'
  @Input('disabled') isDisabled = false
}
