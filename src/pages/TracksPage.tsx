import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { DataTable, type Column } from '../components/DataTable'
import { FormField, SelectField } from '../components/FormField'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { TrackForm } from '../components/TrackForm'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLineStore } from '../stores/lineStore'
import { useTrackStore } from '../stores/trackStore'
import { useUiStore } from '../stores/uiStore'
import type { Track } from '../types'
import { formatNumber } from '../utils/format'

function TracksPage() {
  const tracks = useTrackStore((state) => state.tracks)
  const createTrack = useTrackStore((state) => state.createTrack)
  const updateTrack = useTrackStore((state) => state.updateTrack)
  const deleteTrack = useTrackStore((state) => state.deleteTrack)
  const lines = useLineStore((state) => state.lines)
  const showToast = useUiStore((state) => state.showToast)
  const [creating, setCreating] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | undefined>()
  const [deletingTrack, setDeletingTrack] = useState<Track | undefined>()
  const [filters, setFilters] = useState({
    lineId: '',
    minElevation: '',
    maxBending: '',
  })
  const debouncedFilters = useDebouncedValue(filters)

  const lineNameById = useMemo(
    () => new Map(lines.map((line) => [line.id, line.name])),
    [lines],
  )

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const lineMatches = debouncedFilters.lineId === '' || track.id_line === debouncedFilters.lineId
      const elevationMatches =
        debouncedFilters.minElevation === '' || track.elevation >= Number(debouncedFilters.minElevation)
      const bendingMatches =
        debouncedFilters.maxBending === '' || track.bending <= Number(debouncedFilters.maxBending)

      return lineMatches && elevationMatches && bendingMatches
    })
  }, [debouncedFilters, tracks])

  const columns: Column<Track>[] = [
    { key: 'id', header: 'ID', sortable: true, sortValue: (track) => track.id, render: (track) => `#${track.id}` },
    { key: 'line', header: 'Line', sortable: true, sortValue: (track) => lineNameById.get(track.id_line) ?? '', render: (track) => lineNameById.get(track.id_line) ?? 'Unassigned' },
    { key: 'length', header: 'Length', sortable: true, sortValue: (track) => track.length, render: (track) => `${formatNumber(track.length)} km` },
    { key: 'bending', header: 'Bending', sortable: true, sortValue: (track) => track.bending, render: (track) => formatNumber(track.bending) },
    { key: 'elevation', header: 'Elevation', sortable: true, sortValue: (track) => track.elevation, render: (track) => `${formatNumber(track.elevation)} m` },
    {
      key: 'actions',
      header: 'Actions',
      render: (track) => (
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => setEditingTrack(track)}>Edit</Button>
          <Button type="button" variant="danger" onClick={() => setDeletingTrack(track)}>Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Tracks"
        description="Create, edit, delete, and filter track segments by line, elevation, and bending."
        actions={<Button type="button" onClick={() => setCreating(true)}>Create track</Button>}
      />
      <section className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <SelectField
          label="Filter by line"
          value={filters.lineId}
          onChange={(event) => setFilters((state) => ({ ...state, lineId: event.target.value }))}
        >
          <option value="">All lines</option>
          {lines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </SelectField>
        <FormField
          label="Minimum elevation"
          type="number"
          value={filters.minElevation}
          onChange={(event) => setFilters((state) => ({ ...state, minElevation: event.target.value }))}
        />
        <FormField
          label="Maximum bending"
          type="number"
          min="0"
          step="0.1"
          value={filters.maxBending}
          onChange={(event) => setFilters((state) => ({ ...state, maxBending: event.target.value }))}
        />
      </section>
      <DataTable data={filteredTracks} columns={columns} getRowKey={(track) => track.id} emptyMessage="No tracks match the current filters." />
      <Modal title={editingTrack ? 'Edit track' : 'Create track'} open={creating || Boolean(editingTrack)} onClose={() => { setCreating(false); setEditingTrack(undefined) }}>
        <TrackForm
          track={editingTrack}
          lines={lines}
          onCancel={() => { setCreating(false); setEditingTrack(undefined) }}
          onSubmit={async (values) => {
            if (editingTrack) {
              await updateTrack(editingTrack.id, values)
              showToast('success', 'Track updated')
            } else {
              await createTrack(values)
              showToast('success', 'Track created')
            }
            setCreating(false)
            setEditingTrack(undefined)
          }}
        />
      </Modal>
      <ConfirmDialog
        open={Boolean(deletingTrack)}
        title="Delete track"
        message="This track segment will be removed from line statistics."
        onCancel={() => setDeletingTrack(undefined)}
        onConfirm={() => {
          if (deletingTrack) {
            void deleteTrack(deletingTrack.id)
            showToast('success', 'Track deleted')
            setDeletingTrack(undefined)
          }
        }}
      />
    </>
  )
}

export default TracksPage
