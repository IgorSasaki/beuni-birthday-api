import { Request, Response } from 'express'

import { AppDataSource } from '@/config/data-source'
import { Employee } from '@/entities/Employee'
import { EmployeeService } from '@/services/employee.service'
import { createEmployeeSchema } from '@/validators/create-employee.validator'

const employeeRepository = AppDataSource.getRepository(Employee)
const employeeService = new EmployeeService(employeeRepository)

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

      response.status(201).json(savedEmployee)
    } catch (error) {
      console.error('[EmployeeController::createEmployee]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async getEmployees(request: Request, response: Response) {
    try {
      const userId = request.user?.userId as string

      const employees = await employeeService.listEmployeesByCreatedBy(userId)

      response.status(200).json(employees)
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
      }

      response.status(200).json(employee)
    } catch (error) {
      console.error('[EmployeeController::getEmployeeById]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }
}
