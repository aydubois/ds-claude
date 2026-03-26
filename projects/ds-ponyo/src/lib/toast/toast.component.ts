import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AyToastService } from './toast.service';

@Component({
  selector: 'ay-toast-container',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'ay-toast-container',
  },
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class AyToastContainerComponent {
  protected readonly toastService = inject(AyToastService)
}
