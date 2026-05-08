import { useState } from 'react'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { DataTable, type Column } from '../components/DataTable'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { TrainForm } from '../components/TrainForm'
import { useTrainStore } from '../stores/trainStore'
import { useUiStore } from '../stores/uiStore'
import type { Train } from '../types'

function TrainsPage() {
  const trains = useTrainStore((state) => state.trains)
  const createTrain = useTrainStore((state) => state.createTrain)
  const updateTrain = useTrainStore((state) => state.updateTrain)
  const deleteTrain = useTrainStore((state) => state.deleteTrain)
  const showToast = useUiStore((state) => state.showToast)
  const [editingTrain, setEditingTrain] = useState<Train | undefined>()
  const [creating, setCreating] = useState(false)
  const [deletingTrain, setDeletingTrain] = useState<Train | undefined>()

  const columns: Column<Train>[] = [
    { key: 'id', header: 'ID', sortable: true, sortValue: (train) => train.id, render: (train) => `#${train.id}` },
    { key: 'weight', header: 'Weight', sortable: true, sortValue: (train) => train.weight, render: (train) => `${train.weight} t` },
    { key: 'train_cars', header: 'Train Cars', sortable: true, sortValue: (train) => train.train_cars, render: (train) => train.train_cars },
    {
      key: 'actions',
      header: 'Actions',
      render: (train) => (
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => setEditingTrain(train)}>Edit</Button>
          <Button type="button" variant="danger" onClick={() => setDeletingTrain(train)}>Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Trains"
        description="Create, edit, delete, and review fleet capacity."
        actions={<Button type="button" onClick={() => setCreating(true)}>Create train</Button>}
      />
      <DataTable data={trains} columns={columns} getRowKey={(train) => train.id} emptyMessage="No trains found." />
      <Modal title={editingTrain ? 'Edit train' : 'Create train'} open={creating || Boolean(editingTrain)} onClose={() => { setCreating(false); setEditingTrain(undefined) }}>
        <TrainForm
          train={editingTrain}
          onCancel={() => { setCreating(false); setEditingTrain(undefined) }}
          onSubmit={async (values) => {
            if (editingTrain) {
              await updateTrain(editingTrain.id, values)
              showToast('success', 'Train updated')
            } else {
              await createTrain(values)
              showToast('success', 'Train created')
            }
            setCreating(false)
            setEditingTrain(undefined)
          }}
        />
      </Modal>
      <ConfirmDialog
        open={Boolean(deletingTrain)}
        title="Delete train"
        message="This train record will be removed from the dashboard."
        onCancel={() => setDeletingTrain(undefined)}
        onConfirm={() => {
          if (deletingTrain) {
            void deleteTrain(deletingTrain.id)
            showToast('success', 'Train deleted')
            setDeletingTrain(undefined)
          }
        }}
      />
    </>
  )
}

export default TrainsPage
