import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Employee } from './Employee'
import { User } from './User'

@Entity('gifts')
export class Gifts {
  @PrimaryGeneratedColumn('uuid')
  giftId!: string

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'sendTo' })
  sendTo!: Employee

  @Column()
  status!: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User

  @CreateDateColumn()
  createdAt!: Date
}
