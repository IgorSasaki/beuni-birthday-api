import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { User } from './User'

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  employeeId!: string

  @Column()
  fullName!: string

  @Column()
  birthDate!: Date

  @Column()
  cep!: string

  @Column()
  street!: string

  @Column()
  number!: string

  @Column()
  complement!: string

  @Column()
  neighborhood!: string

  @Column()
  city!: string

  @Column()
  state!: string

  @Column()
  giftSize!: string

  @Column()
  position!: string

  @Column()
  department!: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
