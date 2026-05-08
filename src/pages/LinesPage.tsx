import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { DataTable, type Column } from '../components/DataTable'
import { LineForm } from '../components/LineForm'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useLineStore } from '../stores/lineStore'
import { useTrackStore } from '../stores/trackStore'
import { useUiStore } from '../stores/uiStore'
import type { Line } from '../types'

function LinesPage() {
  const lines = useLineStore((state) => state.lines)
  const createLine = useLineStore((state) => state.createLine)
  const updateLine = useLineStore((state) => state.updateLine)
  const deleteLine = useLineStore((state) => state.deleteLine)
  const tracks = useTrackStore((state) => state.tracks)
  const showToast = useUiStore((state) => state.showToast)
  const [creating, setCreating] = useState(false)
  const [editingLine, setEditingLine] = useState<Line | undefined>()
  const [deletingLine, setDeletingLine] = useState<Line | undefined>()

  const columns: Column<Line>[] = [
    { key: 'id', header: 'ID', sortable: true, sortValue: (line) => line.id, render: (line) => `#${line.id}` },
    { key: 'name', header: 'Name', sortable: true, sortValue: (line) => line.name, render: (line) => line.name },
    {
      key: 'trackCount',
      header: 'Tracks',
      sortable: true,
      sortValue: (line) => tracks.filter((track) => track.id_line === line.id).length,
      render: (line) => tracks.filter((track) => track.id_line === line.id).length,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (line) => (
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100" to={`/lines/${line.id}`}>
            View Details
          </Link>
          <Button type="button" variant="secondary" onClick={() => setEditingLine(line)}>Edit</Button>
          <Button type="button" variant="danger" onClick={() => setDeletingLine(line)}>Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Lines"
        description="Manage rail lines and inspect track-level details."
        actions={<Button type="button" onClick={() => setCreating(true)}>Create line</Button>}
      />
      <DataTable data={lines} columns={columns} getRowKey={(line) => line.id} emptyMessage="No lines found." />
      <Modal title={editingLine ? 'Edit line' : 'Create line'} open={creating || Boolean(editingLine)} onClose={() => { setCreating(false); setEditingLine(undefined) }}>
        <LineForm
          line={editingLine}
          onCancel={() => { setCreating(false); setEditingLine(undefined) }}
          onSubmit={async (values) => {
            if (editingLine) {
              await updateLine(editingLine.id, values)
              showToast('success', 'Line updated')
            } else {
              await createLine(values)
              showToast('success', 'Line created')
            }
            setCreating(false)
            setEditingLine(undefined)
          }}
        />
      </Modal>
      <ConfirmDialog
        open={Boolean(deletingLine)}
        title="Delete line"
        message="This line will be removed. Existing tracks will remain available for reassignment."
        onCancel={() => setDeletingLine(undefined)}
        onConfirm={() => {
          if (deletingLine) {
            void deleteLine(deletingLine.id)
            showToast('success', 'Line deleted')
            setDeletingLine(undefined)
          }
        }}
      />
    </>
  )
}

export default LinesPage
