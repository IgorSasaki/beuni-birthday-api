import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { AppDataSource } from '@/config/data-source'
import { User } from '@/entities/User'
import { UserService } from '@/services/user.service'

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)

export const authenticate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Missing or invalid token' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string
    }

    const user = await userService.findUserById(decoded.sub)

    if (!user) {
      response.status(401).json({ message: 'Invalid token: user not found' })
      return
    }

    request.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    response.status(401).json({ message: 'Invalid or expired token' })
  }
}
