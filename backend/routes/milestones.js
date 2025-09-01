import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET /api/milestones - Obtener todos los milestones
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM milestones ORDER BY due_date ASC')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching milestones:', error)
    res.status(500).json({ error: 'Failed to fetch milestones' })
  }
})

// POST /api/milestones - Crear nuevo milestone
router.post('/', async (req, res) => {
  try {
    const { title, description, due_date, status, progress, story_id, region } = req.body

    const result = await db.run(
      `INSERT INTO milestones (title, description, due_date, status, progress, story_id, region) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, due_date, status || 'pending', progress || 0, story_id || null, region || null]
    )

    const milestone = await db.query('SELECT * FROM milestones WHERE id = ?', [result.lastID])
    res.status(201).json(milestone.rows[0])
  } catch (error) {
    console.error('Error creating milestone:', error)
    res.status(500).json({ error: 'Failed to create milestone' })
  }
})

// PUT /api/milestones/:id - Actualizar milestone
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, due_date, status, progress, story_id, region } = req.body

    await db.run(
      `UPDATE milestones 
       SET title = ?, description = ?, due_date = ?, status = ?, progress = ?, story_id = ?, region = ?
       WHERE id = ?`,
      [title, description, due_date, status, progress, story_id || null, region || null, id]
    )

    const result = await db.query('SELECT * FROM milestones WHERE id = ?', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Milestone not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating milestone:', error)
    res.status(500).json({ error: 'Failed to update milestone' })
  }
})

// DELETE /api/milestones/:id - Eliminar milestone
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.run('DELETE FROM milestones WHERE id = ?', [id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Milestone not found' })
    }

    res.json({ message: 'Milestone deleted successfully' })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    res.status(500).json({ error: 'Failed to delete milestone' })
  }
})

export default router
