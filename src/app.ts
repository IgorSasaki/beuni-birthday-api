import 'reflect-metadata'
import cors from 'cors'
import express from 'express'

import { AppDataSource } from './config/data-source'
import AppRoutes from './routes/index.routes'

const app = express()

app.use(
  cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*'
  })
)

app.use(express.json())

app.use('/api', AppRoutes)

AppDataSource.initialize()
  .then(() => console.log('Database connected 📦'))
  .catch(err => console.log(err))

export default app
