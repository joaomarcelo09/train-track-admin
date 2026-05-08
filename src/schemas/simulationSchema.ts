import { z } from 'zod'

export const simulationPayloadSchema = z.object({
  train_id: z.string().trim().min(1, 'Train is required'),
  line_id: z.string().trim().min(1, 'Line is required'),
})

export type SimulationPayloadValues = z.infer<typeof simulationPayloadSchema>
