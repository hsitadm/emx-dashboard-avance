import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// POST /api/auth/login - Login simple para desarrollo
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    
    // En desarrollo, no validamos password
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region
      },
      token: 'dev-token-' + user.id
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/auth/me - Obtener usuario actual
router.get('/me', async (req, res) => {
  try {
    // Para desarrollo, devolver usuario demo
    const result = await pool.query('SELECT * FROM users WHERE email = $1', ['demo@emx.com'])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router
