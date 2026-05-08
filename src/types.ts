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

export type SimulationPayload = {
  train_id: string
  line_id: string
}

export type SimulationPoint = {
  trackId: number
  trackIndex: number
  distance: number
  cumulativeDistance: number
  electricityUsage: number
  elevation: number
  bending: number
  trackLength: number
}

export type SimulationSummary = {
  totalElectricityUsage: number
  totalLineLength: number
  averageElectricityConsumption: number
  highestEnergyPoint: SimulationPoint | null
  highestElevationPoint: SimulationPoint | null
}

export type SimulationResult = {
  payload: SimulationPayload
  points: SimulationPoint[]
  summary: SimulationSummary
  source: 'api' | 'local'
}

export type ToastKind = 'success' | 'error'

export type AuthUser = {
  id?: number | string
  email: string
  role?: string
}
