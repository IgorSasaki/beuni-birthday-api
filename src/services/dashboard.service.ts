import { startOfMonth, endOfMonth } from 'date-fns'
import { Between, Repository } from 'typeorm'

import { Employee } from '@/entities/Employee'
import { Gifts } from '@/entities/Gifts'

export class DashboardService {
  private employeeRepository: Repository<Employee>
  private giftRepository: Repository<Gifts>

  constructor(
    employeeRepository: Repository<Employee>,
    giftRepository: Repository<Gifts>
  ) {
    this.employeeRepository = employeeRepository
    this.giftRepository = giftRepository
  }

  public async getTotalEmployees(userId: string) {
    const employees = await this.employeeRepository.find({
      where: {
        createdBy: {
          userId
        }
      }
    })

    return employees.length
  }

  public async birthdaysThisMonth(userId: string) {
    const month = String(new Date().getMonth() + 1).padStart(2, '0')

    const employees = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoin('employee.createdBy', 'user')
      .where("strftime('%m', employee.birthDate) = :month", { month })
      .andWhere('user.userId = :userId', { userId })
      .orderBy('employee.birthDate', 'ASC')
      .getMany()

    return employees
  }

  public async getRequestGiftsThisMonth(userId: string) {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())

    const gifts = await this.giftRepository.find({
      relations: ['createdBy', 'sendTo'],
      where: {
        createdAt: Between(start, end),
        createdBy: {
          userId
        }
      }
    })

    return gifts
  }
}
