import { z } from 'zod'

export const lineSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
})

export type LineFormValues = z.infer<typeof lineSchema>
