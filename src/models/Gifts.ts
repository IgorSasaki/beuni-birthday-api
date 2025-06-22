import { Employee } from './Employee'
import { User } from './User'

export interface Gift {
  createdAt: Date
  createdBy: User
  giftId: string
  sendTo: Employee
  status: string
  updatedAt: Date
}
