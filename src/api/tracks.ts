import { apiClient } from './client'
import type { Track } from '../types'

export type TrackPayload = Omit<Track, 'id'>

export async function getTracks() {
  const response = await apiClient.get<Track[]>('/tracks')
  return response.data
}

export async function createTrack(payload: TrackPayload) {
  const response = await apiClient.post<Track>('/tracks', payload)
  return response.data
}

export async function updateTrack(id: number, payload: TrackPayload) {
  const response = await apiClient.put<Track>(`/tracks/${id}`, payload)
  return response.data
}

export async function deleteTrack(id: number) {
  await apiClient.delete(`/tracks/${id}`)
}
