import { Router } from 'express'

import { AuthController } from '@/controllers/auth.controller'
import { EmployeeController } from '@/controllers/employee.controller'
import { authenticate } from '@/middlewares/auth.middleware'

const AppRoutes = Router()

const authController = new AuthController()
const employeeController = new EmployeeController()

AppRoutes.post('/users', authController.register)
AppRoutes.post('/auth', authController.login)

AppRoutes.post('/employees', authenticate, employeeController.createEmployee)
AppRoutes.get('/employees', authenticate, employeeController.getEmployees)

export default AppRoutes
