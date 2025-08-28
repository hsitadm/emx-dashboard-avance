import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// GET /api/tasks - Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const { region, status, assignee, priority } = req.query
    
    let query = `
      SELECT t.*, u.name as assignee_name 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      WHERE 1=1
    `
    const params = []
    let paramCount = 0

    if (region && region !== 'TODAS') {
      paramCount++
      query += ` AND (t.region = $${paramCount} OR t.region = 'TODAS')`
      params.push(region)
    }

    if (status) {
      paramCount++
      query += ` AND t.status = $${paramCount}`
      params.push(status)
    }

    if (assignee) {
      paramCount++
      query += ` AND t.assignee_id = $${paramCount}`
      params.push(assignee)
    }

    if (priority) {
      paramCount++
      query += ` AND t.priority = $${paramCount}`
      params.push(priority)
    }

    query += ' ORDER BY t.created_at DESC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// POST /api/tasks - Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const { title, description, status, assignee_id, due_date, priority, region } = req.body

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, assignee_id, due_date, priority, region) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, status || 'planning', assignee_id, due_date, priority || 'medium', region]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, assignee_id, due_date, priority, region, progress } = req.body

    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, status = $3, assignee_id = $4, 
           due_date = $5, priority = $6, region = $7, progress = $8, updated_at = NOW()
       WHERE id = $9 
       RETURNING *`,
      [title, description, status, assignee_id, due_date, priority, region, progress, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// GET /api/tasks/:id/comments - Obtener comentarios de una tarea
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT c.*, u.name as author_name 
       FROM comments c 
       LEFT JOIN users u ON c.author_id = u.id 
       WHERE c.task_id = $1 
       ORDER BY c.created_at ASC`,
      [id]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

// POST /api/tasks/:id/comments - Agregar comentario
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params
    const { content, author_id } = req.body

    const result = await pool.query(
      `INSERT INTO comments (task_id, content, author_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [id, content, author_id]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating comment:', error)
    res.status(500).json({ error: 'Failed to create comment' })
  }
})

export default router
