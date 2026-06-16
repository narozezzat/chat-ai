import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون ثنائي على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  role: z.enum(['admin', 'member'], {
    message: 'الرجاء اختيار دور صالح',
  }),
  limit: z.number().min(100, 'الحد الأدنى للاستعلام هو 100').max(100000, 'الحد الأقصى هو 100,000'),
})

export type UserFormData = z.infer<typeof userSchema>
