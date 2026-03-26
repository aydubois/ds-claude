import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AySnackbarService } from './snackbar.service';

@Component({
  selector: 'ay-snackbar-container',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'ay-snackbar-container',
  },
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class AySnackbarContainerComponent {
  protected readonly snackbarService = inject(AySnackbarService)
}
