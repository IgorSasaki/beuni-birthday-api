import { User } from './User'

export interface Employee {
  birthDate: Date
  cep: string
  city: string
  complement?: string
  createdAt: Date
  createdBy: User
  department: string
  employeeId: string
  fullName: string
  giftSize: 'P' | 'M' | 'G' | 'GG' | 'XG'
  neighborhood: string
  number: string
  position: string
  state: string
  street: string
  updatedAt: Date
}
