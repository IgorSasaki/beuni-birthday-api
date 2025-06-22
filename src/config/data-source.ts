import { DataSource } from 'typeorm'

import { Employee } from '@/entities/Employee'
import { Gifts } from '@/entities/Gifts'
import { User } from '@/entities/User'

export const AppDataSource = new DataSource({
  database: './src/database/birthday.db',
  entities: [Employee, Gifts, User],
  logging: false,
  synchronize: true,
  type: 'sqlite'
})
