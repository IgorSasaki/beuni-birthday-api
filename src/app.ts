import 'reflect-metadata'
import express from 'express'

import { AppDataSource } from './config/data-source'

const app = express()

app.use(express.json())

AppDataSource.initialize()
  .then(() => console.log('Database connected 📦'))
  .catch(err => console.log(err))

export default app
