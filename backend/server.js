import path from 'path'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Routes
import taskRoutes from './routes/tasks.js'
import userRoutes from './routes/users.js'
import dashboardRoutes from './routes/dashboard.js'
import milestoneRoutes from './routes/milestones.js'
import storyRoutes from './routes/stories.js'
import cognitoUsersRoutes from './routes/cognito-users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP'
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    auth: 'Temporarily disabled',
    service: 'EMx Dashboard API'
  })
})

// API Routes (sin middleware temporalmente)
app.use('/api/tasks', taskRoutes)
app.use('/api/users', userRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/milestones', milestoneRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/cognito-users', cognitoUsersRoutes)

// Serve static files from frontend
app.use(express.static(path.join(process.cwd(), '../frontend/dist')))

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../frontend/dist/index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log()
  console.log()
})
