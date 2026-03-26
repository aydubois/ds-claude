import { Component, Input } from '@angular/core'

export type AySpinnerSize = 'sm' | 'md' | 'lg'
export type AySpinnerColor = 'primary' | 'danger' | 'muted'

@Component({
  selector: 'ay-spinner',
  standalone: true,
  host: {
    'class': 'ay-spinner',
    '[class.ay-spinner--sm]': 'size === "sm"',
    '[class.ay-spinner--md]': 'size === "md"',
    '[class.ay-spinner--lg]': 'size === "lg"',
    '[class.ay-spinner--primary]': 'color === "primary"',
    '[class.ay-spinner--danger]': 'color === "danger"',
    '[class.ay-spinner--muted]': 'color === "muted"',
    'role': 'status',
    'aria-label': 'Chargement',
  },
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class AySpinnerComponent {
  @Input() size: AySpinnerSize = 'md'
  @Input() color: AySpinnerColor = 'primary'
}
