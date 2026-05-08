import { apiClient } from './client'
import type { SimulationPayload, SimulationResult } from '../types'

export async function executeSimulation(payload: SimulationPayload) {
  const response = await apiClient.post<SimulationResult>('/simulation/run', payload)
  return response.data
}
