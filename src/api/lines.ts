import { apiClient } from './client'
import type { Line } from '../types'

export type LinePayload = Omit<Line, 'id'>

export async function getLines() {
  const response = await apiClient.get<Line[]>('/lines')
  return response.data
}

export async function createLine(payload: LinePayload) {
  const response = await apiClient.post<Line>('/lines', payload)
  return response.data
}

export async function updateLine(id: string, payload: LinePayload) {
  const response = await apiClient.put<Line>(`/lines/${id}`, payload)
  return response.data
}

export async function deleteLine(id: string) {
  await apiClient.delete(`/lines/${id}`)
}
