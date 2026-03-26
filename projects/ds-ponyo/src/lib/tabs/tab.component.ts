import {
  Component,
  Input,
} from '@angular/core'
import { CommonModule } from '@angular/common'

let nextTabId = 0

@Component({
  selector: 'ay-tab',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'ay-tab',
    '[class.ay-tab--active]': 'active',
  },
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class AyTabComponent {
  readonly uid = nextTabId++

  @Input({ required: true }) label!: string
  @Input() disabled: boolean = false

  active = false
}
