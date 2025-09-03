import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET /api/tasks - Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, u.name as assignee_name, s.title as story_title 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id LEFT JOIN stories s ON t.story_id = s.id 
      ORDER BY t.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// POST /api/tasks - Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const { title, description, status, assignee_id, due_date, priority, region, progress, story_id } = req.body
    
    const result = await db.query(`
      INSERT INTO tasks (title, description, status, assignee_id, due_date, priority, region, progress, story_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `, [title, description, status || 'planning', assignee_id, due_date, priority || 'medium', region || 'TODAS', progress || 0, story_id])
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT /api/tasks/:id - Actualizar tarea (maneja actualizaciones parciales)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Get current task data
    const currentTask = await db.query('SELECT * FROM tasks WHERE id = ?', [id])
    if (currentTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    const current = currentTask.rows[0]
    
    // Merge current data with provided updates
    const {
      title = current.title,
      description = current.description,
      status = current.status,
      assignee_id = current.assignee_id,
      due_date = current.due_date,
      priority = current.priority,
      region = current.region,
      progress = current.progress,
      story_id = current.story_id
    } = req.body

    // Auto-update progress based on status
    let finalProgress = progress
    if (status === 'completed') {
      finalProgress = 100
    } else if (status === 'planning' && progress === current.progress) {
      finalProgress = progress || 0
    }

    await db.run(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, assignee_id = ?, 
           due_date = ?, priority = ?, region = ?, progress = ?, story_id = ?
       WHERE id = ?`,
      [title, description, status, assignee_id, due_date, priority, region, finalProgress, story_id, id]
    )

    const result = await db.query(`
      SELECT t.*, u.name as assignee_name, s.title as story_title 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id LEFT JOIN stories s ON t.story_id = s.id 
      WHERE t.id = ?
    `, [id])

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
    
    const result = await db.query('DELETE FROM tasks WHERE id = ? RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router
