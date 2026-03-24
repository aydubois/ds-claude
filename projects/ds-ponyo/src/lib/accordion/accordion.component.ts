import {
  Component,
  input,
  output,
  signal,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'ay-accordion',
  standalone: true,
  host: {
    'class': 'ay-accordion',
  },
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AyAccordionComponent {
  private readonly elRef = inject(ElementRef<HTMLElement>);

  readonly gap = input<string>('0.5rem');

  readonly orderChange = output<string[]>();

  readonly dragOverIndex = signal<number | null>(null);

  @HostListener('ay-panel-move', ['$event'])
  onPanelMove(event: CustomEvent<{ panelId: string; direction: 'up' | 'down' }>): void {
    event.stopPropagation();
    const { panelId, direction } = event.detail;
    this.movePanel(panelId, direction);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    const target = this.findPanelElement(event.target as HTMLElement);
    if (target) {
      const panels = this.getPanelElements();
      const idx = panels.indexOf(target);
      this.dragOverIndex.set(idx);

      // Remove all drop indicators
      panels.forEach(p => p.classList.remove('ay-accordion-panel--drop-above', 'ay-accordion-panel--drop-below'));

      // Add indicator
      const rect = target.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (event.clientY < midY) {
        target.classList.add('ay-accordion-panel--drop-above');
      } else {
        target.classList.add('ay-accordion-panel--drop-below');
      }
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    const target = this.findPanelElement(event.target as HTMLElement);
    if (target) {
      target.classList.remove('ay-accordion-panel--drop-above', 'ay-accordion-panel--drop-below');
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const draggedId = event.dataTransfer?.getData('text/plain');
    if (!draggedId) return;

    // Clean up indicators
    this.getPanelElements().forEach(p =>
      p.classList.remove('ay-accordion-panel--drop-above', 'ay-accordion-panel--drop-below')
    );

    const target = this.findPanelElement(event.target as HTMLElement);
    if (!target) return;

    const targetId = target.getAttribute('data-panel-id');
    if (!targetId || targetId === draggedId) return;

    const container = this.elRef.nativeElement;
    const draggedEl = container.querySelector(`[data-panel-id="${draggedId}"]`);
    if (!draggedEl) return;

    const rect = target.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const insertBefore = event.clientY < midY;

    if (insertBefore) {
      container.insertBefore(draggedEl, target);
    } else {
      container.insertBefore(draggedEl, target.nextSibling);
    }

    this.dragOverIndex.set(null);
    this.emitOrder();
  }

  private movePanel(panelId: string, direction: 'up' | 'down'): void {
    const container = this.elRef.nativeElement;
    const panels = this.getPanelElements();
    const currentEl = container.querySelector(`[data-panel-id="${panelId}"]`) as HTMLElement;
    if (!currentEl) return;

    const currentIdx = panels.indexOf(currentEl);

    if (direction === 'up' && currentIdx > 0) {
      container.insertBefore(currentEl, panels[currentIdx - 1]);
    } else if (direction === 'down' && currentIdx < panels.length - 1) {
      container.insertBefore(panels[currentIdx + 1], currentEl);
    }

    this.emitOrder();

    // Re-focus the drag handle
    setTimeout(() => {
      const handle = currentEl.querySelector('.ay-accordion-drag-handle') as HTMLElement;
      handle?.focus();
    });
  }

  private getPanelElements(): HTMLElement[] {
    return Array.from(
      this.elRef.nativeElement.querySelectorAll(':scope > ay-accordion-panel')
    );
  }

  private findPanelElement(el: HTMLElement | null): HTMLElement | null {
    while (el && el !== this.elRef.nativeElement) {
      if (el.tagName === 'AY-ACCORDION-PANEL') return el;
      el = el.parentElement;
    }
    return null;
  }

  private emitOrder(): void {
    const ids = this.getPanelElements().map(
      el => el.getAttribute('data-panel-id') ?? ''
    );
    this.orderChange.emit(ids);
  }
}
