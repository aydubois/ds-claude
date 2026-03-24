export type AyToastType = 'success' | 'warning' | 'error' | 'info'

export interface AyToast {
  id: number
  message: string
  type: AyToastType
  autoDismiss: boolean
}
