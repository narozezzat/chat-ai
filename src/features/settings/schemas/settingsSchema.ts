import { z } from 'zod'

export const settingsSchema = z.object({
  openaiKey: z.string().optional(),
  anthropicKey: z.string().optional(),
  geminiKey: z.string().optional(),
  enableThinking: z.boolean().default(true),
  enableFallback: z.boolean().default(true),
  monthlyLimit: z.number().min(50, 'الحد الأدنى للميزانية هو 50$').max(100000, 'الحد الأقصى هو 100,000$'),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
