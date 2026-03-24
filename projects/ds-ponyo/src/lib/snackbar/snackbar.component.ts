import { Component, inject } from '@angular/core';
import { AySnackbarService } from './snackbar.service';

@Component({
  selector: 'ay-snackbar-container',
  standalone: true,
  host: {
    'class': 'ay-snackbar-container',
  },
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class AySnackbarContainerComponent {
  protected readonly snackbarService = inject(AySnackbarService)
}
