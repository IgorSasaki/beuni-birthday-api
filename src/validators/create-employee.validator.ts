import { z } from 'zod'

export const createEmployeeSchema = z.object({
  birthDate: z.string().refine(date => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime())
  }, 'Invalid date format'),
  cep: z.string().min(1, 'CEP is required'),
  city: z.string().min(1, 'City is required'),
  complement: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  fullName: z.string().min(1, 'Full name is required'),
  giftSize: z.enum(['P', 'M', 'G', 'GG', 'XG'], {
    errorMap: () => ({ message: 'Invalid gift size' })
  }),
  neighborhood: z.string().min(1, 'Neighborhood is required'),
  number: z.string().min(1, 'Number is required'),
  position: z.string().min(1, 'Position is required'),
  state: z.string().min(1, 'State is required'),
  street: z.string().min(1, 'Street is required')
})
