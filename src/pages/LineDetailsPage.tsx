import { Link, useParams } from 'react-router-dom'
import { DataTable, type Column } from '../components/DataTable'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { GaugeIcon, RailIcon } from '../components/Icons'
import { useLineStore } from '../stores/lineStore'
import { useTrackStore } from '../stores/trackStore'
import type { Track } from '../types'
import { average, formatNumber } from '../utils/format'

function LineDetailsPage() {
  const params = useParams()
  const lineId = params.lineId ?? ''
  const line = useLineStore((state) => state.lines.find((item) => item.id === lineId))
  const tracks = useTrackStore((state) => state.tracks.filter((track) => track.id_line === lineId))

  if (!line) {
    return (
      <>
        <PageHeader title="Line not found" description="The requested rail line is not available." />
        <Link className="text-sm font-semibold text-amber-700 hover:text-amber-800" to="/lines">Back to lines</Link>
      </>
    )
  }

  const totalLength = tracks.reduce((total, track) => total + track.length, 0)
  const averageElevation = average(tracks.map((track) => track.elevation))
  const averageBending = average(tracks.map((track) => track.bending))
  const columns: Column<Track>[] = [
    { key: 'id', header: 'ID', sortable: true, sortValue: (track) => track.id, render: (track) => `#${track.id}` },
    { key: 'length', header: 'Length', sortable: true, sortValue: (track) => track.length, render: (track) => `${formatNumber(track.length)} km` },
    { key: 'bending', header: 'Bending', sortable: true, sortValue: (track) => track.bending, render: (track) => formatNumber(track.bending) },
    { key: 'elevation', header: 'Elevation', sortable: true, sortValue: (track) => track.elevation, render: (track) => `${formatNumber(track.elevation)} m` },
  ]

  return (
    <>
      <PageHeader
        title={line.name}
        description={`Line #${line.id} detail view with track list, total length, elevation statistics, and average bending.`}
        actions={<Link className="inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100" to="/lines">Back to lines</Link>}
      />
      <section className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total line length" value={`${formatNumber(totalLength)} km`} detail={`${tracks.length} track segments`} icon={<RailIcon />} />
        <KpiCard label="Average elevation" value={`${formatNumber(averageElevation)} m`} detail="Elevation statistics" icon={<GaugeIcon />} />
        <KpiCard label="Average bending" value={formatNumber(averageBending)} detail="Mean track curvature" icon={<GaugeIcon />} />
      </section>
      <section className="mt-6">
        <DataTable data={tracks} columns={columns} getRowKey={(track) => track.id} emptyMessage="No tracks are assigned to this line." />
      </section>
    </>
  )
}

export default LineDetailsPage
