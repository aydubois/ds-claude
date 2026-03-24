import { Component, input } from '@angular/core'

export type AySkeletonVariant = 'text' | 'circle' | 'rect'

@Component({
  selector: 'ay-skeleton',
  standalone: true,
  host: {
    'class': 'ay-skeleton',
    '[class.ay-skeleton--text]': 'variant() === "text"',
    '[class.ay-skeleton--circle]': 'variant() === "circle"',
    '[class.ay-skeleton--rect]': 'variant() === "rect"',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    'aria-hidden': 'true',
  },
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class AySkeletonComponent {
  readonly variant = input<AySkeletonVariant>('text')
  readonly width = input<string>('100%')
  readonly height = input<string>('1rem')
}
