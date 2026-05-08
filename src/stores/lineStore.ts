import { create } from 'zustand'
import { createLine, deleteLine, getLines, updateLine } from '../api/lines'
import { isApiUnavailable } from '../api/client'
import { seedLines } from '../api/mockData'
import type { Line } from '../types'
import type { LineFormValues } from '../schemas/lineSchema'

type LineStore = {
  lines: Line[]
  loading: boolean
  error: string | null
  fetchLines: () => Promise<void>
  createLine: (payload: LineFormValues) => Promise<void>
  updateLine: (id: string, payload: LineFormValues) => Promise<void>
  deleteLine: (id: string) => Promise<void>
}

export const useLineStore = create<LineStore>((set, get) => ({
  lines: [],
  loading: false,
  error: null,
  fetchLines: async () => {
    set({ loading: true, error: null })
    try {
      set({ lines: await getLines(), loading: false })
    } catch (error) {
      if (!isApiUnavailable(error)) {
        set({ error: 'Line loading failed' })
      }
      set({ lines: seedLines, loading: false })
    }
  },
  createLine: async (payload) => {
    const duplicate = get().lines.some(
      (line) => line.name.toLowerCase() === payload.name.toLowerCase(),
    )

    if (duplicate) {
      throw new Error('Line name already exists')
    }

    const fallback = { id: crypto.randomUUID(), ...payload }
    try {
      const line = await createLine(payload)
      set((state) => ({ lines: [...state.lines, line] }))
    } catch {
      set((state) => ({ lines: [...state.lines, fallback] }))
    }
  },
  updateLine: async (id, payload) => {
    const duplicate = get().lines.some(
      (line) =>
        line.id !== id && line.name.toLowerCase() === payload.name.toLowerCase(),
    )

    if (duplicate) {
      throw new Error('Line name already exists')
    }

    const fallback = { id, ...payload }
    try {
      const line = await updateLine(id, payload)
      set((state) => ({
        lines: state.lines.map((item) => (item.id === id ? line : item)),
      }))
    } catch {
      set((state) => ({
        lines: state.lines.map((item) => (item.id === id ? fallback : item)),
      }))
    }
  },
  deleteLine: async (id) => {
    try {
      await deleteLine(id)
    } finally {
      set({ lines: get().lines.filter((line) => line.id !== id) })
    }
  },
}))
