import { Request, Response } from 'express'

import { AppDataSource } from '@/config/data-source'
import { Employee } from '@/entities/Employee'
import { Gifts } from '@/entities/Gifts'
import { EmployeeService } from '@/services/employee.service'
import { GiftsService } from '@/services/gifts.service'

const employeeRepository = AppDataSource.getRepository(Employee)
const employeeService = new EmployeeService(employeeRepository)

const giftRepository = AppDataSource.getRepository(Gifts)
const giftService = new GiftsService(giftRepository)

export class GiftsController {
  public async createGiftRequest(request: Request, response: Response) {
    try {
      const { employeeId } = request.body

      const employee = await employeeService.getEmployeeById(employeeId)

      if (!employee) {
        response.status(404).json({ message: 'Employee not found' })
        return
      }

      const newGift = giftRepository.create({
        createdBy: request.user,
        sendTo: employee,
        status: 'PENDING'
      })

      const savedGift = await giftService.createGiftRequest(newGift)

      response.status(201).json(savedGift)
    } catch (error) {
      console.error('[GiftsController::createGiftRequest]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async getGifts(request: Request, response: Response) {
    try {
      const userId = request.user?.userId as string

      const gifts = await giftService.listGiftsByCreatedBy(userId)

      response.status(200).json(gifts)
    } catch (error) {
      console.error('[GiftsController::getGifts]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async updateGiftStatus(request: Request, response: Response) {
    try {
      const { giftId } = request.params
      const { status } = request.body

      const gift = await giftService.getGiftById(giftId)

      if (!gift) {
        response.status(404).json({ message: 'Gift not found' })
        return
      }

      gift.status = status

      const updatedGift = await giftRepository.save(gift)

      response.status(200).json(updatedGift)
    } catch (error) {
      console.error('[GiftsController::updateGiftStatus]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }
}
