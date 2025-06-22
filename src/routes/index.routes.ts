import { Router } from 'express'

import { AuthController } from '@/controllers/auth.controller'
import { DashboardController } from '@/controllers/dashboard.controller'
import { EmployeeController } from '@/controllers/employee.controller'
import { GiftsController } from '@/controllers/gifts.controller'
import { authenticate } from '@/middlewares/auth.middleware'

const AppRoutes = Router()

const authController = new AuthController()
const dashboardController = new DashboardController()
const employeeController = new EmployeeController()
const giftsController = new GiftsController()

AppRoutes.post('/users', authController.register)
AppRoutes.post('/auth', authController.login)

AppRoutes.get('/dashboard', authenticate, dashboardController.getDashboard)

AppRoutes.post('/employees', authenticate, employeeController.createEmployee)
AppRoutes.get('/employees', authenticate, employeeController.getEmployees)
AppRoutes.get(
  '/employees/:employeeId',
  authenticate,
  employeeController.getEmployeeById
)

AppRoutes.post('/gifts', authenticate, giftsController.createGiftRequest)
AppRoutes.get('/gifts', authenticate, giftsController.getGifts)
AppRoutes.put('/gifts/:giftId', authenticate, giftsController.updateGiftStatus)

export default AppRoutes
