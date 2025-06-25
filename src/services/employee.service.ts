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

  async getEmployeeById(employeeId: string) {
    const employee = await this.repository.findOne({
      relations: ['createdBy'],
      where: {
        employeeId: employeeId
      }
    })

    if (!employee) {
      return null
    }

    const { password, ...safeUser } = employee.createdBy

    return {
      ...employee,
      createdBy: safeUser
    }
  }

  async deleteEmployee(employeeId: string) {
    const employee = await this.repository.findOne({
      where: {
        employeeId: employeeId
      }
    })

    if (!employee) {
      throw new Error('Employee not found')
    }

    await this.repository.remove(employee)
  }

  async updateEmployee(employeeId: string, data: Partial<Employee>) {
    const existingEmployee = await this.repository.findOneBy({ employeeId })

    if (!existingEmployee) {
      throw new Error('Employee not found')
    }

    const updatedEmployee = this.repository.merge(existingEmployee, data)

    return await this.repository.save(updatedEmployee)
  }
}
