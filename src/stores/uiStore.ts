import { create } from 'zustand'
import type { ToastKind } from '../types'

type Toast = {
  id: number
  kind: ToastKind
  message: string
}

type UiStore = {
  toasts: Toast[]
  showToast: (kind: ToastKind, message: string) => void
  dismissToast: (id: number) => void
}

export const useUiStore = create<UiStore>((set) => ({
  toasts: [],
  showToast: (kind, message) => {
    const id = Date.now()
    set((state) => ({
      toasts: [...state.toasts, { id, kind, message }],
    }))
    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }))
    }, 3200)
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
