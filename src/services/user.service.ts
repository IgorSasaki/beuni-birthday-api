import { Repository } from 'typeorm'

import { User } from '@/entities/User'

export class UserService {
  private repository: Repository<User>

  constructor(repository: Repository<User>) {
    this.repository = repository
  }

  async createUser(user: User) {
    return await this.repository.save(user)
  }

  async findUserByEmail(email: string) {
    return await this.repository.findOneBy({ email })
  }

  async findUserById(userId: string) {
    return await this.repository.findOneBy({ userId })
  }
}
