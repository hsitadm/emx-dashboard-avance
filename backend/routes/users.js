import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, region FROM users ORDER BY name')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/users/:id - Obtener un usuario específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await db.query('SELECT id, name, email, role, region FROM users WHERE id = ?', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// POST /api/users - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { name, email, role, region } = req.body
    
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email and role are required' })
    }
    
    const result = await db.query(
      'INSERT INTO users (name, email, role, region) VALUES (?, ?, ?, ?) RETURNING *',
      [name, email, role, region || 'TODAS']
    )
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating user:', error)
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: 'Failed to create user' })
    }
  }
})

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, region } = req.body
    
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email and role are required' })
    }
    
    const result = await db.query(
      'UPDATE users SET name = ?, email = ?, role = ?, region = ? WHERE id = ? RETURNING *',
      [name, email, role, region || 'TODAS', id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating user:', error)
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: 'Failed to update user' })
    }
  }
})

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if user has assigned tasks
    const tasksResult = await db.query('SELECT COUNT(*) as count FROM tasks WHERE assignee_id = ?', [id])
    if (tasksResult.rows[0].count > 0) {
      return res.status(409).json({ error: 'Cannot delete user with assigned tasks' })
    }
    
    const result = await db.query('DELETE FROM users WHERE id = ? RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
