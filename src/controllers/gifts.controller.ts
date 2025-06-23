import { Request, Response } from 'express'

import { AppDataSource } from '@/config/data-source'
import { Employee } from '@/entities/Employee'
import { Gifts } from '@/entities/Gifts'
import { EmployeeService } from '@/services/employee.service'
import { GiftsService } from '@/services/gifts.service'
import { normalizeString } from '@/utils/helpers/normalizeString'

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
      const { department, month, searchText, status } = request.query

      let gifts = await giftService.listGiftsByCreatedBy(userId)

      if (typeof searchText === 'string') {
        const search = normalizeString(searchText)

        gifts = gifts.filter(gift =>
          [
            gift.sendTo.fullName,
            gift.sendTo.position,
            gift.sendTo.department
          ].some(field => normalizeString(field).includes(search))
        )
      }

      if (typeof department === 'string') {
        const dept = normalizeString(department)

        gifts = gifts.filter(gift =>
          normalizeString(gift.sendTo.department).includes(dept)
        )
      }

      if (typeof month === 'string' && !isNaN(+month)) {
        const monthNumber = parseInt(month, 10)

        if (monthNumber < 1 || monthNumber > 12) {
          response.status(400).json({ message: 'Invalid month number' })
        }
        gifts = gifts.filter(
          employee => employee.sendTo.birthDate.getMonth() + 1 === monthNumber
        )
      }

      if (typeof status === 'string') {
        const normalizedStatus = normalizeString(status)

        gifts = gifts.filter(
          gift => normalizeString(gift.status) === normalizedStatus
        )
      }

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
