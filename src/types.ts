export type Train = {
  id: number
  weight: number
  train_cars: number
}

export type Line = {
  id: string
  name: string
}

export type Track = {
  id: number
  id_line: string
  length: number
  bending: number
  elevation: number
}

export type ToastKind = 'success' | 'error'

export type AuthUser = {
  id?: number | string
  email: string
  role?: string
}
