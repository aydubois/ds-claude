import {
  Component,
  input,
  signal,
  computed,
} from '@angular/core'

let nextId = 0

@Component({
  selector: 'ay-accordion-panel',
  standalone: true,
  host: {
    'class': 'ay-accordion-panel',
    '[class.ay-accordion-panel--collapsed]': '!expanded()',
    '[class.ay-accordion-panel--dragging]': 'dragging()',
    '[attr.data-panel-id]': 'panelId()',
  },
  templateUrl: './accordion-panel.component.html',
  styleUrl: './accordion-panel.component.scss',
})
export class AyAccordionPanelComponent {
  private readonly uid = nextId++

  readonly panelId = input<string>(`panel-${this.uid}`)
  readonly startExpanded = input<boolean>(true)

  readonly expanded = signal(true)
  readonly dragging = signal(false)

  readonly headerId = computed(() => `ay-accordion-header-${this.uid}`)
  readonly contentId = computed(() => `ay-accordion-content-${this.uid}`)

  constructor() {
    // Defer reading startExpanded to after input binding
    Promise.resolve().then(() => {
      this.expanded.set(this.startExpanded())
    })
  }

  toggle(): void {
    this.expanded.update(v => !v)
  }

  onDragStart(event: DragEvent): void {
    this.dragging.set(true)
    event.dataTransfer?.setData('text/plain', this.panelId())
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  onDragEnd(): void {
    this.dragging.set(false)
  }

  onHandleKeydown(event: KeyboardEvent): void {
    // Keyboard reorder is handled by the parent accordion container
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const customEvent = new CustomEvent('ay-panel-move', {
        bubbles: true,
        detail: {
          panelId: this.panelId(),
          direction: event.key === 'ArrowUp' ? 'up' : 'down',
        },
      });
      (event.target as HTMLElement).dispatchEvent(customEvent)
    }
  }
}
