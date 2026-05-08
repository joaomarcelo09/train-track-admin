import { create } from 'zustand'
import { executeSimulation as requestSimulation } from '../api/simulations'
import { isApiUnavailable } from '../api/client'
import { simulationPayloadSchema } from '../schemas/simulationSchema'
import { useTrackStore } from './trackStore'
import { useTrainStore } from './trainStore'
import type {
  SimulationPayload,
  SimulationPoint,
  SimulationResult,
  SimulationSummary,
  Track,
  Train,
} from '../types'

type SimulationStore = {
  result: SimulationResult | null
  chartData: SimulationPoint[]
  loading: boolean
  error: string | null
  cache: Record<string, SimulationResult>
  executeSimulation: (payload: SimulationPayload) => Promise<SimulationResult>
  clearSimulation: () => void
}

function getCacheKey(payload: SimulationPayload) {
  return `${payload.train_id}:${payload.line_id}`
}

function buildSummary(points: SimulationPoint[]): SimulationSummary {
  const totalElectricityUsage = points.reduce(
    (total, point) => total + point.electricityUsage,
    0,
  )
  const totalLineLength = points.reduce((total, point) => total + point.trackLength, 0)
  const averageElectricityConsumption =
    totalLineLength > 0 ? totalElectricityUsage / totalLineLength : 0

  return {
    totalElectricityUsage,
    totalLineLength,
    averageElectricityConsumption,
    highestEnergyPoint:
      points.length > 0
        ? points.reduce((highest, point) =>
            point.electricityUsage > highest.electricityUsage ? point : highest,
          )
        : null,
    highestElevationPoint:
      points.length > 0
        ? points.reduce((highest, point) =>
            point.elevation > highest.elevation ? point : highest,
          )
        : null,
  }
}

function buildLocalSimulation(
  payload: SimulationPayload,
  train: Train,
  tracks: Track[],
): SimulationResult {
  const trainLengthMeters = train.train_cars * 24
  let cumulativeDistance = 0

  const points = tracks.map((track, index) => {
    cumulativeDistance += track.length

    const massFactor = train.weight / 100
    const trainLengthFactor = trainLengthMeters / 1000
    const elevationFactor = Math.max(0.2, 1 + track.elevation / 1000)
    const bendingFactor = 1 + Math.abs(track.bending) / 10
    const distanceFactor = track.length
    const electricityUsage =
      distanceFactor * massFactor * elevationFactor * bendingFactor +
      trainLengthFactor * track.length

    return {
      trackId: track.id,
      trackIndex: index + 1,
      distance: cumulativeDistance,
      cumulativeDistance,
      electricityUsage,
      elevation: track.elevation,
      bending: track.bending,
      trackLength: track.length,
    }
  })

  return {
    payload,
    points,
    summary: buildSummary(points),
    source: 'local',
  }
}

function normalizeResult(payload: SimulationPayload, result: SimulationResult) {
  const points = result.points.map((point, index) => ({
    ...point,
    trackIndex: point.trackIndex ?? index + 1,
    distance: point.distance ?? point.cumulativeDistance,
    cumulativeDistance: point.cumulativeDistance ?? point.distance,
  }))

  return {
    ...result,
    payload,
    points,
    summary: result.summary ?? buildSummary(points),
    source: result.source ?? 'api',
  }
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  result: null,
  chartData: [],
  loading: false,
  error: null,
  cache: {},
  executeSimulation: async (rawPayload) => {
    const payload = simulationPayloadSchema.parse(rawPayload)
    const cacheKey = getCacheKey(payload)
    const cached = get().cache[cacheKey]

    if (cached) {
      set({ result: cached, chartData: cached.points, error: null })
      return cached
    }

    const train = useTrainStore
      .getState()
      .trains.find((item) => item.id === payload.train_id)
    const lineTracks = useTrackStore
      .getState()
      .tracks.filter((track) => track.id_line === payload.line_id)

    if (!train) {
      const message = 'Select a valid train before running the simulation'
      set({ error: message })
      throw new Error(message)
    }

    if (lineTracks.length === 0) {
      const message = 'The selected line has no track segments'
      set({ error: message })
      throw new Error(message)
    }

    set({ loading: true, error: null })

    try {
      const result = normalizeResult(payload, await requestSimulation(payload))
      set((state) => ({
        result,
        chartData: result.points,
        cache: { ...state.cache, [cacheKey]: result },
        loading: false,
      }))
      return result
    } catch (error) {
      if (!isApiUnavailable(error)) {
        const message = 'Simulation failed'
        set({ error: message, loading: false })
        throw new Error(message, { cause: error })
      }

      const result = buildLocalSimulation(payload, train, lineTracks)
      set((state) => ({
        result,
        chartData: result.points,
        cache: { ...state.cache, [cacheKey]: result },
        loading: false,
      }))
      return result
    }
  },
  clearSimulation: () => set({ result: null, chartData: [], error: null }),
}))
