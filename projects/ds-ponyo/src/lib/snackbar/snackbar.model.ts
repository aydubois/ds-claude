export interface AySnackbarConfig {
  action?: string
  duration?: number
  position?: AySnackbarPosition
}

export type AySnackbarPosition = 'bottom-center'

export interface AySnackbar {
  id: number
  message: string
  action?: string
  duration: number
}
