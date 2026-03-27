import { Component, input } from '@angular/core'

@Component({
  selector: 'ay-card',
  standalone: true,
  host: {
    'class': 'ay-card',
    '[class.ay-card--clickable]': 'clickable()',
    '[class.ay-card--flat]': 'variant() === "flat"',
    '[class.ay-card--elevated]': 'variant() === "elevated"',
    '[class.ay-card--outlined]': 'variant() === "outlined"',
    '[attr.tabindex]': 'clickable() ? 0 : null',
    '[attr.role]': 'clickable() ? "button" : null',
  },
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class AyCardComponent {
  readonly variant = input<'flat' | 'elevated' | 'outlined'>('outlined')
  readonly clickable = input<boolean>(false)
}
