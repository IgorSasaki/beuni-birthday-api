import { Request, Response } from 'express'

import { AppDataSource } from '@/config/data-source'
import { Employee } from '@/entities/Employee'
import { Gifts } from '@/entities/Gifts'
import { DashboardService } from '@/services/dashboard.service'

const employeeRepository = AppDataSource.getRepository(Employee)
const giftRepository = AppDataSource.getRepository(Gifts)
const dashboardService = new DashboardService(
  employeeRepository,
  giftRepository
)

export class DashboardController {
  public async getDashboard(request: Request, response: Response) {
    try {
      const userId = request.user?.userId as string

      const totalEmployees = await dashboardService.getTotalEmployees(userId)
      const birthdaysThisMonth =
        await dashboardService.birthdaysThisMonth(userId)
      const giftsThisMonth =
        await dashboardService.getRequestGiftsThisMonth(userId)

      const pendingGifts = giftsThisMonth.filter(
        gift => gift.status === 'PENDING'
      )
      const sendingGifts = giftsThisMonth.filter(gift => gift.status === 'SENT')

      response.status(200).json({
        birthdaysThisMonth,
        pendingGifts,
        sendingGifts,
        totalEmployees
      })
    } catch (error) {
      console.error('[DashboardController::getDashboard]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }
}
