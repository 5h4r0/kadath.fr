import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export const passwordSchema = z
  .string()
  .min(10, 'Minimum 10 caractères')
  .max(30, 'Maximum 30 caractères')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[0-9]/, 'Au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial')

export const clientProfileSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  siret: z.string().length(14).optional(),
  address: z.string().max(500).optional(),
  activity: z.string().max(255).optional(),
})

export const quoteSchema = z.object({
  client_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  amount: z.number().positive(),
  valid_until: z.string().datetime().optional(),
})

export const invoiceSchema = z.object({
  client_id: z.string().uuid(),
  quote_id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  amount: z.number().positive(),
  due_date: z.string().datetime().optional(),
})

export const cmsPageSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/),
  content: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
  meta_description: z.string().max(160).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
export type ClientProfileInput = z.infer<typeof clientProfileSchema>
export type QuoteInput = z.infer<typeof quoteSchema>
export type InvoiceInput = z.infer<typeof invoiceSchema>
export type CmsPageInput = z.infer<typeof cmsPageSchema>
