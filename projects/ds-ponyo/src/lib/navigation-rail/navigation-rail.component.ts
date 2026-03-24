import {
  Component,
  input,
  output,
  signal,
  forwardRef,
} from '@angular/core'

import { AyNavRailItem } from './navigation-rail.model'

@Component({
  selector: 'ay-navigation-rail',
  standalone: true,
  host: {
    'class': 'ay-navigation-rail',
    '[class.ay-navigation-rail--collapsed]': 'collapsed()',
    'role': 'navigation',
  },
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss',
})
export class AyNavigationRailComponent {
  readonly items = input.required<AyNavRailItem[]>()
  readonly collapsed = input<boolean>(false)

  readonly valueChange = output<string>()

  readonly value = signal<string>('')

  select(item: AyNavRailItem): void {
    this.value.set(item.value)
    this.valueChange.emit(item.value)
  }

  isActive(item: AyNavRailItem): boolean {
    return this.value() === item.value
  }
}
