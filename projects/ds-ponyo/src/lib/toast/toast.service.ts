import { Injectable } from '@angular/core';
import { AyToast, AyToastType } from './toast.model'

let toastId = 0

@Injectable({ providedIn: 'root' })
export class AyToastService {
  toasts: AyToast[] = []

  show(message: string, type: AyToastType = 'info', duration = 5000): void {
    const id = toastId++
    const autoDismiss = type !== 'error'

    this.toasts = [...this.toasts, { id, message, type, autoDismiss }]

    if (autoDismiss && duration > 0) {
      setTimeout(() => this.dismiss(id), duration)
    }
  }

  success(message: string, duration = 5000): void {
    this.show(message, 'success', duration)
  }

  warning(message: string, duration = 5000): void {
    this.show(message, 'warning', duration)
  }

  error(message: string): void {
    this.show(message, 'error', 0)
  }

  info(message: string, duration = 5000): void {
    this.show(message, 'info', duration)
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
  }
}
