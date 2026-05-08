import { apiClient } from './client'
import type { Train } from '../types'

export type TrainPayload = Omit<Train, 'id'>

export async function getTrains() {
  const response = await apiClient.get<Train[]>('/trains')
  return response.data
}

export async function createTrain(payload: TrainPayload) {
  const response = await apiClient.post<Train>('/trains', payload)
  return response.data
}

export async function updateTrain(id: number, payload: TrainPayload) {
  const response = await apiClient.put<Train>(`/trains/${id}`, payload)
  return response.data
}

export async function deleteTrain(id: number) {
  await apiClient.delete(`/trains/${id}`)
}
