import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'
import { CommonModule } from '@angular/common'

import { AyIconComponent } from '../icon/icon.component'
import { AyNavRailItem } from './navigation-rail.model'

@Component({
  selector: 'ay-navigation-rail',
  standalone: true,
  imports: [CommonModule, AyIconComponent],
  host: {
    'class': 'ay-navigation-rail',
    '[class.ay-navigation-rail--collapsed]': 'collapsed',
    'role': 'navigation',
  },
  templateUrl: './navigation-rail.component.html',
  styleUrls: ['./navigation-rail.component.scss'],
})
export class AyNavigationRailComponent {
  @Input({ required: true }) items!: AyNavRailItem[]
  @Input() collapsed: boolean = false

  @Input() collapsible: boolean = true

  @Output() valueChange = new EventEmitter<string>()
  @Output() collapsedChange = new EventEmitter<boolean>()

  value: string = ''

  toggleCollapse(): void {
    this.collapsedChange.emit(!this.collapsed)
  }

  select(item: AyNavRailItem, event: MouseEvent): void {
    this.value = item.value
    this.valueChange.emit(item.value)
  }

  isActive(item: AyNavRailItem): boolean {
    return this.value === item.value
  }
}
