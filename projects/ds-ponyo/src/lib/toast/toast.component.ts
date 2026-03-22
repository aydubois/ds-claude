import { Component, inject } from '@angular/core';
import { PonyoToastService } from './toast.service';

@Component({
  selector: 'ponyo-toast-container',
  standalone: true,
  host: {
    'class': 'ponyo-toast-container',
  },
  template: `
    @for (toast of toastService.toasts(); track toast.id) {
      <div
        class="ponyo-toast ponyo-toast--{{ toast.type }}"
        [attr.role]="toast.type === 'error' ? 'alert' : 'status'"
        [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
      >
        <span class="ponyo-toast-icon">
          @switch (toast.type) {
            @case ('success') { &#10003; }
            @case ('warning') { &#9888; }
            @case ('error') { &#10007; }
            @case ('info') { &#8505; }
          }
        </span>
        <span class="ponyo-toast-message">{{ toast.message }}</span>
        <button
          class="ponyo-toast-close"
          type="button"
          aria-label="Fermer la notification"
          (click)="toastService.dismiss(toast.id)"
        >&times;</button>
      </div>
    }
  `,
  styleUrl: './toast.component.scss',
})
export class PonyoToastContainerComponent {
  protected readonly toastService = inject(PonyoToastService);
}
