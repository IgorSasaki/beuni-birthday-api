import { Request, Response } from 'express'

import { AppDataSource } from '@/config/data-source'
import { Employee } from '@/entities/Employee'
import { Gifts } from '@/entities/Gifts'
import { EmployeeService } from '@/services/employee.service'
import { GiftsService } from '@/services/gifts.service'
import { normalizeString } from '@/utils/helpers/normalizeString'
import { createEmployeeSchema } from '@/validators/create-employee.validator'

const employeeRepository = AppDataSource.getRepository(Employee)
const employeeService = new EmployeeService(employeeRepository)

const giftsRepository = AppDataSource.getRepository(Gifts)
const giftsService = new GiftsService(giftsRepository)

export class EmployeeController {
  public async createEmployee(request: Request, response: Response) {
    const validation = createEmployeeSchema.safeParse(request.body)

    if (!validation.success) {
      response.status(400).json({
        errors: validation.error.flatten().fieldErrors,
        message: 'Validation failed'
      })
      return
    }

    const {
      birthDate,
      cep,
      city,
      complement,
      department,
      fullName,
      giftSize,
      neighborhood,
      number,
      position,
      state,
      street
    } = validation.data

    try {
      const newEmployee = employeeRepository.create({
        birthDate: new Date(birthDate),
        cep,
        city,
        complement,
        createdBy: request.user,
        department,
        fullName,
        giftSize,
        neighborhood,
        number,
        position,
        state,
        street
      })

      const savedEmployee = await employeeService.createEmployee(newEmployee)

      const newGiftRequest = giftsRepository.create({
        createdBy: request.user,
        sendTo: savedEmployee,
        status: 'NOT_REQUESTED'
      })

      await giftsService.createGiftRequest(newGiftRequest)

      response.status(201).json(savedEmployee)
    } catch (error) {
      console.error('[EmployeeController::createEmployee]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async getEmployees(request: Request, response: Response) {
    try {
      const userId = request.user?.userId as string

      const { department, month, searchText, status } = request.query

      let employees = await employeeService.listEmployeesByCreatedBy(userId)

      if (typeof searchText === 'string') {
        const search = normalizeString(searchText)

        employees = employees.filter(employee =>
          [employee.fullName, employee.position, employee.department].some(
            field => normalizeString(field).includes(search)
          )
        )
      }

      if (typeof department === 'string') {
        const dept = normalizeString(department)

        employees = employees.filter(employee =>
          normalizeString(employee.department).includes(dept)
        )
      }

      if (typeof month === 'string' && !isNaN(+month)) {
        const monthNumber = parseInt(month, 10)

        if (monthNumber < 1 || monthNumber > 12) {
          response.status(400).json({ message: 'Invalid month number' })
        }
        employees = employees.filter(
          employee => employee.birthDate.getMonth() + 1 === monthNumber
        )
      }

      const employeesWithStatus = await Promise.all(
        employees.map(async employee => {
          const gift = await giftsService.getGiftBySendTo(employee.employeeId)

          return {
            ...employee,
            status: gift?.status ?? 'NOT_REQUESTED'
          }
        })
      )

      let finalResult = employeesWithStatus

      if (typeof status === 'string') {
        const normalizedStatus = normalizeString(status)

        finalResult = employeesWithStatus.filter(
          employee => normalizeString(employee.status) === normalizedStatus
        )
      }

      response.status(200).json(finalResult)
    } catch (error) {
      console.error('[EmployeeController::getEmployees]', error)
      response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async getEmployeeById(request: Request, response: Response) {
    const { employeeId } = request.params

    try {
      const employee = await employeeService.getEmployeeById(employeeId)

      if (!employee) {
        response.status(404).json({ message: 'Employee not found' })

        return
      }

      const gift = await giftsService.getGiftBySendTo(employeeId)

      const employeeWithStatus = {
        ...employee,
        status: gift ? gift.status : 'NOT_REQUESTED'
      }

      response.status(200).json(employeeWithStatus)
    } catch (error) {
      console.error('[EmployeeController::getEmployeeById]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }
}
