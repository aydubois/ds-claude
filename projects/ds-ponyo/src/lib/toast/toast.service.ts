import { Injectable, signal } from '@angular/core';

export type PonyoToastType = 'success' | 'warning' | 'error' | 'info';

export interface PonyoToast {
  id: number;
  message: string;
  type: PonyoToastType;
  autoDismiss: boolean;
}

let toastId = 0;

@Injectable({ providedIn: 'root' })
export class PonyoToastService {
  readonly toasts = signal<PonyoToast[]>([]);

  show(message: string, type: PonyoToastType = 'info', duration = 5000): void {
    const id = toastId++;
    const autoDismiss = type !== 'error';

    this.toasts.update(t => [...t, { id, message, type, autoDismiss }]);

    if (autoDismiss && duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration = 5000): void {
    this.show(message, 'success', duration);
  }

  warning(message: string, duration = 5000): void {
    this.show(message, 'warning', duration);
  }

  error(message: string): void {
    this.show(message, 'error', 0);
  }

  info(message: string, duration = 5000): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
