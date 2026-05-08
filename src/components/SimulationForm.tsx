import { Button } from './Button'
import type { Line, Train } from '../types'

type SimulationFormProps = {
  trains: Train[]
  lines: Line[]
  selectedTrainId: string
  selectedLineId: string
  loading: boolean
  onTrainChange: (trainId: string) => void
  onLineChange: (lineId: string) => void
  onSubmit: () => void
}

export function SimulationForm({
  trains,
  lines,
  selectedTrainId,
  selectedLineId,
  loading,
  onTrainChange,
  onLineChange,
  onSubmit,
}: SimulationFormProps) {
  return (
    <form
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label className="block">
        <span className="text-sm font-medium text-slate-600">Train</span>
        <select
          className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          value={selectedTrainId}
          onChange={(event) => onTrainChange(event.target.value)}
        >
          <option value="">Select train</option>
          {trains.map((train) => (
            <option key={train.id} value={train.id}>
              Train #{train.id} - {train.weight} t, {train.train_cars} cars
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-600">Line</span>
        <select
          className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          value={selectedLineId}
          onChange={(event) => onLineChange(event.target.value)}
        >
          <option value="">Select line</option>
          {lines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end">
        <Button type="submit" className="h-11 w-full lg:w-40" disabled={loading}>
          {loading ? 'Running...' : 'Run'}
        </Button>
      </div>
    </form>
  )
}
