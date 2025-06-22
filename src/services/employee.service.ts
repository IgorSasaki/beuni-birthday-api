import { Repository } from 'typeorm'

import { Employee } from '@/entities/Employee'

export class EmployeeService {
  private repository: Repository<Employee>

  constructor(repository: Repository<Employee>) {
    this.repository = repository
  }

  async createEmployee(employee: Employee) {
    return await this.repository.save(employee)
  }

  async listEmployeesByCreatedBy(userId: string) {
    const employees = await this.repository.find({
      order: {
        createdAt: 'DESC'
      },
      relations: ['createdBy'],
      where: {
        createdBy: {
          userId: userId
        }
      }
    })

    return employees.map(employee => {
      const { password, ...safeUser } = employee.createdBy

      return {
        ...employee,
        createdBy: safeUser
      }
    })
  }
}
