import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, region FROM users ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

export default router
