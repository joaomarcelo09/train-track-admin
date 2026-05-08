import { z } from 'zod'
import { numberField } from './numberField'

export const trackSchema = z.object({
  id_line: z.string().trim().min(1, 'Line is required'),
  length: numberField('Length is required').pipe(
    z.number().positive('Length must be greater than 0'),
  ),
  bending: numberField('Bending is required').pipe(
    z.number().min(0, 'Bending cannot be negative'),
  ),
  elevation: numberField('Elevation is required'),
})

export type TrackFormValues = z.infer<typeof trackSchema>
