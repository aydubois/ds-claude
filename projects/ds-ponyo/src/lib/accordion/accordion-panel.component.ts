import {
  Component,
  ViewEncapsulation,
  input,
  signal,
  computed,
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'ponyo-accordion-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ponyo-accordion-panel',
    '[class.ponyo-accordion-panel--collapsed]': '!expanded()',
    '[class.ponyo-accordion-panel--dragging]': 'dragging()',
    '[attr.data-panel-id]': 'panelId()',
  },
  template: `
    <div
      class="ponyo-accordion-header"
      role="heading"
      aria-level="3"
    >
      <span
        class="ponyo-accordion-drag-handle"
        role="button"
        aria-label="Réordonner"
        tabindex="0"
        draggable="true"
        (dragstart)="onDragStart($event)"
        (dragend)="onDragEnd()"
        (keydown)="onHandleKeydown($event)"
      >≡</span>
      <button
        class="ponyo-accordion-toggle"
        type="button"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="contentId()"
        [id]="headerId()"
        (click)="toggle()"
      >
        <span class="ponyo-accordion-title">
          <ng-content select="[ponyo-accordion-title]" />
        </span>
        <span class="ponyo-accordion-chevron" aria-hidden="true">
          @if (expanded()) { &#9662; } @else { &#9656; }
        </span>
      </button>
    </div>
    <div
      class="ponyo-accordion-content"
      [id]="contentId()"
      role="region"
      [attr.aria-labelledby]="headerId()"
      [hidden]="!expanded()"
    >
      <div class="ponyo-accordion-body">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './accordion-panel.component.scss',
})
export class PonyoAccordionPanelComponent {
  private readonly uid = nextId++;

  readonly panelId = input<string>(`panel-${this.uid}`);
  readonly startExpanded = input<boolean>(true);

  readonly expanded = signal(true);
  readonly dragging = signal(false);

  readonly headerId = computed(() => `ponyo-accordion-header-${this.uid}`);
  readonly contentId = computed(() => `ponyo-accordion-content-${this.uid}`);

  constructor() {
    // Defer reading startExpanded to after input binding
    Promise.resolve().then(() => {
      this.expanded.set(this.startExpanded());
    });
  }

  toggle(): void {
    this.expanded.update(v => !v);
  }

  onDragStart(event: DragEvent): void {
    this.dragging.set(true);
    event.dataTransfer?.setData('text/plain', this.panelId());
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(): void {
    this.dragging.set(false);
  }

  onHandleKeydown(event: KeyboardEvent): void {
    // Keyboard reorder is handled by the parent accordion container
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const customEvent = new CustomEvent('ponyo-panel-move', {
        bubbles: true,
        detail: {
          panelId: this.panelId(),
          direction: event.key === 'ArrowUp' ? 'up' : 'down',
        },
      });
      (event.target as HTMLElement).dispatchEvent(customEvent);
    }
  }
}
