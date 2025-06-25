import CryptoJS from 'crypto-js'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { AppDataSource } from '@/config/data-source'
import { User } from '@/entities/User'
import { UserService } from '@/services/user.service'
import { loginUserSchema } from '@/validators/login-user.validator'
import { registerUserSchema } from '@/validators/register-user.validator'

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)

export class AuthController {
  public async register(request: Request, response: Response) {
    const validation = registerUserSchema.safeParse(request.body)

    if (!validation.success) {
      response.status(400).json({
        errors: validation.error.flatten().fieldErrors,
        message: 'Validation failed'
      })
      return
    }

    const { email, name, password } = validation.data

    try {
      const userExists = await userService.findUserByEmail(email)

      if (userExists) {
        response.status(409).json({ message: 'User already exists' })
        return
      }

      const encryptedPassword = CryptoJS.SHA256(password).toString()

      const newUser = userRepository.create({
        email,
        name,
        password: encryptedPassword
      })

      const savedUser = await userService.createUser(newUser)

      const token = jwt.sign(
        { sub: savedUser.userId },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      )

      response.status(201).json({
        token,
        user: {
          createdAt: savedUser.createdAt,
          email: savedUser.email,
          name: savedUser.name,
          userId: savedUser.userId
        }
      })
    } catch (error) {
      console.error('[AuthController::register]', error)

      response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async login(request: Request, response: Response) {
    const validation = loginUserSchema.safeParse(request.body)

    if (!validation.success) {
      response.status(400).json({
        errors: validation.error.flatten().fieldErrors,
        message: 'Validation failed'
      })
      return
    }

    const { email, password } = validation.data

    try {
      const user = await userService.findUserByEmail(email)

      if (!user) {
        response.status(401).json({ message: 'Invalid credentials' })
        return
      }

      const encryptedPassword = CryptoJS.SHA256(password).toString()

      if (user.password !== encryptedPassword) {
        response.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { sub: user.userId },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1d'
        }
      )

      response.status(200).json({
        token,
        user: {
          createdAt: user.createdAt,
          email: user.email,
          name: user.name,
          userId: user.userId
        }
      })
    } catch (err) {
      console.error('[AuthController::login]', err)

      response.status(500).json({ message: 'Internal server error' })
    }
  }
}
