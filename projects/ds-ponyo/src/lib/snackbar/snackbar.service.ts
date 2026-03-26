import { Injectable } from '@angular/core';
import { AySnackbar, AySnackbarConfig } from './snackbar.model'

let snackbarId = 0

@Injectable({ providedIn: 'root' })
export class AySnackbarService {
  snackbar: AySnackbar | null = null

  private dismissTimer: ReturnType<typeof setTimeout> | null = null
  private actionCallback: (() => void) | null = null

  show(message: string, config?: AySnackbarConfig): { onAction: (fn: () => void) => void } {
    this.clearTimer()

    const duration = config?.duration ?? 4000
    const entry: AySnackbar = {
      id: snackbarId++,
      message,
      action: config?.action,
      duration,
    }

    this.snackbar = entry
    this.actionCallback = null

    if (duration > 0) {
      this.dismissTimer = setTimeout(() => this.dismiss(), duration)
    }

    return {
      onAction: (fn: () => void) => {
        this.actionCallback = fn
      },
    }
  }

  triggerAction(): void {
    if (this.actionCallback) {
      this.actionCallback()
    }
    this.dismiss()
  }

  dismiss(): void {
    this.clearTimer()
    this.snackbar = null
    this.actionCallback = null
  }

  private clearTimer(): void {
    if (this.dismissTimer !== null) {
      clearTimeout(this.dismissTimer)
      this.dismissTimer = null
    }
  }
}
