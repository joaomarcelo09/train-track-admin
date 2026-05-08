import { create } from 'zustand'
import { createTrack, deleteTrack, getTracks, updateTrack } from '../api/tracks'
import { isApiUnavailable } from '../api/client'
import { seedTracks } from '../api/mockData'
import type { Track } from '../types'
import type { TrackFormValues } from '../schemas/trackSchema'

type TrackStore = {
  tracks: Track[]
  loading: boolean
  error: string | null
  fetchTracks: () => Promise<void>
  createTrack: (payload: TrackFormValues) => Promise<void>
  updateTrack: (id: number, payload: TrackFormValues) => Promise<void>
  deleteTrack: (id: number) => Promise<void>
}

export const useTrackStore = create<TrackStore>((set, get) => ({
  tracks: [],
  loading: false,
  error: null,
  fetchTracks: async () => {
    set({ loading: true, error: null })
    try {
      set({ tracks: await getTracks(), loading: false })
    } catch (error) {
      if (!isApiUnavailable(error)) {
        set({ error: 'Track loading failed' })
      }
      set({ tracks: seedTracks, loading: false })
    }
  },
  createTrack: async (payload) => {
    const fallback = { id: Date.now(), ...payload }
    try {
      const track = await createTrack(payload)
      set((state) => ({ tracks: [...state.tracks, track] }))
    } catch {
      set((state) => ({ tracks: [...state.tracks, fallback] }))
    }
  },
  updateTrack: async (id, payload) => {
    const fallback = { id, ...payload }
    try {
      const track = await updateTrack(id, payload)
      set((state) => ({
        tracks: state.tracks.map((item) => (item.id === id ? track : item)),
      }))
    } catch {
      set((state) => ({
        tracks: state.tracks.map((item) => (item.id === id ? fallback : item)),
      }))
    }
  },
  deleteTrack: async (id) => {
    try {
      await deleteTrack(id)
    } finally {
      set({ tracks: get().tracks.filter((track) => track.id !== id) })
    }
  },
}))
