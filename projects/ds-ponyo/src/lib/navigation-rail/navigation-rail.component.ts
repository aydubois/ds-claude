import {
  Component,
  input,
  output,
  signal,
} from '@angular/core'

import { AyIconComponent } from '../icon/icon.component'
import { AyNavRailItem } from './navigation-rail.model'

@Component({
  selector: 'ay-navigation-rail',
  standalone: true,
  imports: [AyIconComponent],
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

  readonly collapsible = input<boolean>(true)

  readonly valueChange = output<string>()
  readonly collapsedChange = output<boolean>()

  readonly value = signal<string>('')

  toggleCollapse(): void {
    this.collapsedChange.emit(!this.collapsed())
  }

  select(item: AyNavRailItem): void {
    this.value.set(item.value)
    this.valueChange.emit(item.value)
  }

  isActive(item: AyNavRailItem): boolean {
    return this.value() === item.value
  }
}
