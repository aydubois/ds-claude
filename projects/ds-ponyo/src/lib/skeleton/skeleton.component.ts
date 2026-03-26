import { Component, Input } from '@angular/core'

export type AySkeletonVariant = 'text' | 'circle' | 'rect'

@Component({
  selector: 'ay-skeleton',
  standalone: true,
  host: {
    'class': 'ay-skeleton',
    '[class.ay-skeleton--text]': 'variant === "text"',
    '[class.ay-skeleton--circle]': 'variant === "circle"',
    '[class.ay-skeleton--rect]': 'variant === "rect"',
    '[style.width]': 'width',
    '[style.height]': 'height',
    'aria-hidden': 'true',
  },
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class AySkeletonComponent {
  @Input() variant: AySkeletonVariant = 'text'
  @Input() width: string = '100%'
  @Input() height: string = '1rem'
}
