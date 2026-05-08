import { z } from 'zod'
import { numberField } from './numberField'

export const trainSchema = z.object({
  weight: numberField('Weight is required').pipe(
    z.number().positive('Weight must be greater than 0'),
  ),
  train_cars: numberField('Train cars is required')
    .pipe(
      z
        .number()
        .int('Train cars must be a whole number')
        .positive('Train cars must be greater than 0'),
    ),
})

export type TrainFormValues = z.infer<typeof trainSchema>
