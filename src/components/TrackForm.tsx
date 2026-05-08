import { useState } from 'react'
import { trackSchema, type TrackFormValues } from '../schemas/trackSchema'
import type { Line, Track } from '../types'
import { Button } from './Button'
import { FormField, SelectField } from './FormField'

type TrackFormProps = {
  track?: Track
  lines: Line[]
  onSubmit: (values: TrackFormValues) => Promise<void>
  onCancel: () => void
}

export function TrackForm({ track, lines, onSubmit, onCancel }: TrackFormProps) {
  const [values, setValues] = useState({
    id_line: track?.id_line ?? '',
    length: track?.length.toString() ?? '',
    bending: track?.bending.toString() ?? '',
    elevation: track?.elevation.toString() ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = trackSchema.safeParse(values)

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
      <SelectField
        label="Line"
        value={values.id_line}
        error={errors.id_line}
        onChange={(event) => setValues((state) => ({ ...state, id_line: event.target.value }))}
      >
        <option value="">Select line</option>
        {lines.map((line) => (
          <option key={line.id} value={line.id}>
            {line.name}
          </option>
        ))}
      </SelectField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="Length"
          type="number"
          min="0"
          step="0.1"
          value={values.length}
          error={errors.length}
          onChange={(event) => setValues((state) => ({ ...state, length: event.target.value }))}
        />
        <FormField
          label="Bending"
          type="number"
          min="0"
          step="0.1"
          value={values.bending}
          error={errors.bending}
          onChange={(event) => setValues((state) => ({ ...state, bending: event.target.value }))}
        />
        <FormField
          label="Elevation"
          type="number"
          step="1"
          value={values.elevation}
          error={errors.elevation}
          onChange={(event) => setValues((state) => ({ ...state, elevation: event.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || lines.length === 0}>
          {saving ? 'Saving' : 'Save track'}
        </Button>
      </div>
    </form>
  )
}
