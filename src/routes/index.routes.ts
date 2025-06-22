import { Router } from 'express'

import { AuthController } from '@/controllers/auth.controller'

const AppRoutes = Router()

const authController = new AuthController()

AppRoutes.post('/users', authController.register)
AppRoutes.post('/auth', authController.login)

export default AppRoutes
