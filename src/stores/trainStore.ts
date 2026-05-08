import { create } from 'zustand'
import { createTrain, deleteTrain, getTrains, updateTrain } from '../api/trains'
import { isApiUnavailable } from '../api/client'
import { seedTrains } from '../api/mockData'
import type { Train } from '../types'
import type { TrainFormValues } from '../schemas/trainSchema'

type TrainStore = {
  trains: Train[]
  loading: boolean
  error: string | null
  fetchTrains: () => Promise<void>
  createTrain: (payload: TrainFormValues) => Promise<void>
  updateTrain: (id: number, payload: TrainFormValues) => Promise<void>
  deleteTrain: (id: number) => Promise<void>
}

export const useTrainStore = create<TrainStore>((set, get) => ({
  trains: [],
  loading: false,
  error: null,
  fetchTrains: async () => {
    set({ loading: true, error: null })
    try {
      set({ trains: await getTrains(), loading: false })
    } catch (error) {
      if (!isApiUnavailable(error)) {
        set({ error: 'Train loading failed' })
      }
      set({ trains: seedTrains, loading: false })
    }
  },
  createTrain: async (payload) => {
    const fallback = { id: Date.now(), ...payload }
    try {
      const train = await createTrain(payload)
      set((state) => ({ trains: [...state.trains, train] }))
    } catch {
      set((state) => ({ trains: [...state.trains, fallback] }))
    }
  },
  updateTrain: async (id, payload) => {
    const fallback = { id, ...payload }
    try {
      const train = await updateTrain(id, payload)
      set((state) => ({
        trains: state.trains.map((item) => (item.id === id ? train : item)),
      }))
    } catch {
      set((state) => ({
        trains: state.trains.map((item) => (item.id === id ? fallback : item)),
      }))
    }
  },
  deleteTrain: async (id) => {
    try {
      await deleteTrain(id)
    } finally {
      set({ trains: get().trains.filter((train) => train.id !== id) })
    }
  },
}))
