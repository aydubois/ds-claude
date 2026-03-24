import { Component, inject } from '@angular/core';
import { AyToastService } from './toast.service';

@Component({
  selector: 'ay-toast-container',
  standalone: true,
  host: {
    'class': 'ay-toast-container',
  },
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class AyToastContainerComponent {
  protected readonly toastService = inject(AyToastService);
}
