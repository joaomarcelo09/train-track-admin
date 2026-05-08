import { useMemo, useState } from 'react'
import { EnergyChart } from '../components/EnergyChart'
import { PageHeader } from '../components/PageHeader'
import { SimulationForm } from '../components/SimulationForm'
import { StatisticsCards } from '../components/StatisticsCards'
import { simulationPayloadSchema } from '../schemas/simulationSchema'
import { useLineStore } from '../stores/lineStore'
import { useSimulationStore } from '../stores/simulationStore'
import { useTrackStore } from '../stores/trackStore'
import { useTrainStore } from '../stores/trainStore'
import { useUiStore } from '../stores/uiStore'
import { formatNumber } from '../utils/format'

function SimulationPage() {
  const trains = useTrainStore((state) => state.trains)
  const lines = useLineStore((state) => state.lines)
  const tracks = useTrackStore((state) => state.tracks)
  const loading = useSimulationStore((state) => state.loading)
  const error = useSimulationStore((state) => state.error)
  const result = useSimulationStore((state) => state.result)
  const chartData = useSimulationStore((state) => state.chartData)
  const executeSimulation = useSimulationStore((state) => state.executeSimulation)
  const showToast = useUiStore((state) => state.showToast)
  const [selectedTrainId, setSelectedTrainId] = useState('')
  const [selectedLineId, setSelectedLineId] = useState('')

  const selectedLineTracks = useMemo(
    () => tracks.filter((track) => track.id_line === selectedLineId),
    [selectedLineId, tracks],
  )
  const selectedTrain = trains.find((train) => String(train.id) === selectedTrainId)
  const selectedLine = lines.find((line) => line.id === selectedLineId)
  const selectedLineLength = selectedLineTracks.reduce(
    (total, track) => total + track.length,
    0,
  )

  async function handleRunSimulation() {
    const parsed = simulationPayloadSchema.safeParse({
      train_id: selectedTrainId,
      line_id: selectedLineId,
    })

    if (!parsed.success) {
      showToast('error', parsed.error.issues[0]?.message ?? 'Invalid simulation payload')
      return
    }

    try {
      const simulation = await executeSimulation(parsed.data)
      showToast(
        'success',
        simulation.source === 'local'
          ? 'Simulation calculated locally'
          : 'Simulation completed',
      )
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Simulation failed')
    }
  }

  return (
    <>
      <PageHeader
        title="Simulation"
        description="Select a train and line to simulate track-by-track electricity consumption."
      />
      <div className="space-y-5">
        <SimulationForm
          trains={trains}
          lines={lines}
          selectedTrainId={selectedTrainId}
          selectedLineId={selectedLineId}
          loading={loading}
          onTrainChange={setSelectedTrainId}
          onLineChange={setSelectedLineId}
          onSubmit={handleRunSimulation}
        />

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Selected train</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {selectedTrain ? `Train #${selectedTrain.id}` : 'No train selected'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {selectedTrain
                ? `${formatNumber(selectedTrain.weight)} t, ${selectedTrain.train_cars} cars`
                : 'Choose a fleet record to set weight and length inputs.'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Selected line</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {selectedLine?.name ?? 'No line selected'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {selectedLine
                ? `${selectedLineTracks.length} tracks, ${formatNumber(selectedLineLength)} km`
                : 'Choose a route to load elevation, bending, and length inputs.'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Execution source</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {result ? (result.source === 'api' ? 'Backend API' : 'Local fallback') : 'Awaiting run'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {error ?? 'Backend results are cached by train and line selection.'}
            </p>
          </div>
        </section>

        <StatisticsCards summary={result?.summary ?? null} />
        <EnergyChart points={chartData} />
      </div>
    </>
  )
}

export default SimulationPage
