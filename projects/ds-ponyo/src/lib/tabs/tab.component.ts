import {
  Component,
  input,
  signal,
} from '@angular/core'

let nextTabId = 0

@Component({
  selector: 'ay-tab',
  standalone: true,
  host: {
    'class': 'ay-tab',
    '[class.ay-tab--active]': 'active()',
  },
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class AyTabComponent {
  readonly uid = nextTabId++

  readonly label = input.required<string>()
  readonly disabled = input<boolean>(false)

  readonly active = signal(false)
}
