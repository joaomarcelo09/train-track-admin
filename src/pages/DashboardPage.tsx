import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { GaugeIcon, LineIcon, RailIcon, TrainIcon } from '../components/Icons'
import { useLineStore } from '../stores/lineStore'
import { useTrackStore } from '../stores/trackStore'
import { useTrainStore } from '../stores/trainStore'
import { average, formatNumber } from '../utils/format'

function DashboardPage() {
  const trains = useTrainStore((state) => state.trains)
  const lines = useLineStore((state) => state.lines)
  const tracks = useTrackStore((state) => state.tracks)

  const totalLength = tracks.reduce((total, track) => total + track.length, 0)
  const averageElevation = average(tracks.map((track) => track.elevation))
  const averageBending = average(tracks.map((track) => track.bending))

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Operational snapshot for trains, lines, tracks, network length, and elevation."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total trains" value={String(trains.length)} detail="Active fleet records" icon={<TrainIcon />} />
        <KpiCard label="Total lines" value={String(lines.length)} detail="Managed routes" icon={<LineIcon />} />
        <KpiCard label="Total tracks" value={String(tracks.length)} detail="Track segments" icon={<RailIcon />} />
        <KpiCard label="Network length" value={`${formatNumber(totalLength)} km`} detail="Combined track length" icon={<RailIcon />} />
        <KpiCard label="Average elevation" value={`${formatNumber(averageElevation)} m`} detail="Across all tracks" icon={<GaugeIcon />} />
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Network profile</h2>
          <div className="mt-5 space-y-4">
            {lines.map((line) => {
              const lineTracks = tracks.filter((track) => track.id_line === line.id)
              const lineLength = lineTracks.reduce((total, track) => total + track.length, 0)
              const width = totalLength > 0 ? Math.max(6, (lineLength / totalLength) * 100) : 0

              return (
                <div key={line.id}>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-700">{line.name}</span>
                    <span className="text-slate-500">{formatNumber(lineLength)} km</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-amber-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Track statistics</h2>
          <dl className="mt-5 space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <dt className="text-slate-500">Average bending</dt>
              <dd className="font-semibold text-slate-950">{formatNumber(averageBending)}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <dt className="text-slate-500">Highest elevation</dt>
              <dd className="font-semibold text-slate-950">{formatNumber(Math.max(0, ...tracks.map((track) => track.elevation)))} m</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Longest segment</dt>
              <dd className="font-semibold text-slate-950">{formatNumber(Math.max(0, ...tracks.map((track) => track.length)))} km</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  )
}

export default DashboardPage
