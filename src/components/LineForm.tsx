import { useState } from 'react'
import { lineSchema, type LineFormValues } from '../schemas/lineSchema'
import type { Line } from '../types'
import { Button } from './Button'
import { FormField } from './FormField'

type LineFormProps = {
  line?: Line
  onSubmit: (values: LineFormValues) => Promise<void>
  onCancel: () => void
}

export function LineForm({ line, onSubmit, onCancel }: LineFormProps) {
  const [name, setName] = useState(line?.name ?? '')
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = lineSchema.safeParse({ name })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message)
      return
    }

    setSaving(true)
    try {
      await onSubmit(parsed.data)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Line save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormField
        label="Name"
        value={name}
        error={error}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving' : 'Save line'}
        </Button>
      </div>
    </form>
  )
}
