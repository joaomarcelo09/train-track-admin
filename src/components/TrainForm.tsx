import { useState } from 'react'
import { trainSchema, type TrainFormValues } from '../schemas/trainSchema'
import type { Train } from '../types'
import { Button } from './Button'
import { FormField } from './FormField'

type TrainFormProps = {
  train?: Train
  onSubmit: (values: TrainFormValues) => Promise<void>
  onCancel: () => void
}

export function TrainForm({ train, onSubmit, onCancel }: TrainFormProps) {
  const [values, setValues] = useState({
    weight: train?.weight.toString() ?? '',
    train_cars: train?.train_cars.toString() ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = trainSchema.safeParse(values)

    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])))
      return
    }

    setSaving(true)
    await onSubmit(parsed.data)
    setSaving(false)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormField
        label="Weight"
        type="number"
        min="0"
        step="0.1"
        value={values.weight}
        error={errors.weight}
        onChange={(event) => setValues((state) => ({ ...state, weight: event.target.value }))}
      />
      <FormField
        label="Train cars"
        type="number"
        min="1"
        step="1"
        value={values.train_cars}
        error={errors.train_cars}
        onChange={(event) => setValues((state) => ({ ...state, train_cars: event.target.value }))}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving' : 'Save train'}
        </Button>
      </div>
    </form>
  )
}
