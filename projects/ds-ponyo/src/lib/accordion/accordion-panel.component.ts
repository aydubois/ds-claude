import {
  Component,
  Input,
  OnInit,
} from '@angular/core'
import { CommonModule } from '@angular/common'

let nextId = 0

@Component({
  selector: 'ay-accordion-panel',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'ay-accordion-panel',
    '[class.ay-accordion-panel--collapsed]': '!expanded',
    '[class.ay-accordion-panel--dragging]': 'dragging',
    '[attr.data-panel-id]': 'panelId',
  },
  templateUrl: './accordion-panel.component.html',
  styleUrls: ['./accordion-panel.component.scss'],
})
export class AyAccordionPanelComponent implements OnInit {
  private readonly uid = nextId++

  @Input() panelId: string = `panel-${this.uid}`
  @Input() startExpanded: boolean = true

  expanded = true
  dragging = false

  get headerId(): string { return `ay-accordion-header-${this.uid}` }
  get contentId(): string { return `ay-accordion-content-${this.uid}` }

  ngOnInit(): void {
    this.expanded = this.startExpanded
  }

  toggle(): void {
    this.expanded = !this.expanded
  }

  onDragStart(event: DragEvent): void {
    this.dragging = true
    event.dataTransfer?.setData('text/plain', this.panelId)
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  onDragEnd(): void {
    this.dragging = false
  }

  onHandleKeydown(event: KeyboardEvent): void {
    // Keyboard reorder is handled by the parent accordion container
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const customEvent = new CustomEvent('ay-panel-move', {
        bubbles: true,
        detail: {
          panelId: this.panelId,
          direction: event.key === 'ArrowUp' ? 'up' : 'down',
        },
      });
      (event.target as HTMLElement).dispatchEvent(customEvent)
    }
  }
}
