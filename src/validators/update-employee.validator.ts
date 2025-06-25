import { z } from 'zod'

export const updateEmployeeSchema = z.object({
  birthDate: z.string().refine(date => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime())
  }, 'Invalid date format'),
  cep: z.string().min(8),
  city: z.string(),
  complement: z.string().optional(),
  department: z.string(),
  fullName: z.string().min(3).max(100),
  giftSize: z.string(),
  neighborhood: z.string(),
  number: z.string(),
  position: z.string(),
  state: z.string(),
  street: z.string()
})
