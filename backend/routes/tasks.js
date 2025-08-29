import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET /api/tasks - Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const { region, status, assignee, priority, story_id } = req.query
    
    let query = `
      SELECT t.*, u.name as assignee_name, s.title as story_title
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      LEFT JOIN stories s ON t.story_id = s.id
      WHERE 1=1
    `
    const params = []

    if (region && region !== 'TODAS') {
      query += ` AND (t.region = ? OR t.region = 'TODAS')`
      params.push(region)
    }

    if (status) {
      query += ` AND t.status = ?`
      params.push(status)
    }

    if (assignee) {
      query += ` AND t.assignee_id = ?`
      params.push(assignee)
    }

    if (priority) {
      query += ` AND t.priority = ?`
      params.push(priority)
    }

    if (story_id) {
      query += ` AND t.story_id = ?`
      params.push(story_id)
    }

    query += ' ORDER BY t.created_at DESC'

    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// POST /api/tasks - Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const { title, description, status, assignee_id, due_date, priority, region, story_id } = req.body

    if (!story_id) {
      return res.status(400).json({ error: 'story_id is required' })
    }

    const result = await db.run(
      `INSERT INTO tasks (title, description, status, assignee_id, due_date, priority, region, story_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, status || 'planning', assignee_id, due_date, priority || 'medium', region, story_id]
    )

    // Get the created task with story info
    const task = await db.query(`
      SELECT t.*, u.name as assignee_name, s.title as story_title
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      LEFT JOIN stories s ON t.story_id = s.id
      WHERE t.id = ?
    `, [result.lastID])
    
    res.status(201).json(task.rows[0])
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, assignee_id, due_date, priority, region, progress, story_id } = req.body

    await db.run(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, assignee_id = ?, 
           due_date = ?, priority = ?, region = ?, progress = ?, story_id = ?
       WHERE id = ?`,
      [title, description, status, assignee_id, due_date, priority, region, progress, story_id, id]
    )

    const result = await db.query(`
      SELECT t.*, u.name as assignee_name, s.title as story_title
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      LEFT JOIN stories s ON t.story_id = s.id
      WHERE t.id = ?
    `, [id])
    
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

    const result = await db.run('DELETE FROM tasks WHERE id = ?', [id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// GET /api/tasks/:id/comments - Obtener comentarios
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `SELECT c.*, u.name as author_name 
       FROM comments c 
       LEFT JOIN users u ON c.author_id = u.id 
       WHERE c.task_id = ? 
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

    const result = await db.run(
      `INSERT INTO comments (task_id, content, author_id) 
       VALUES (?, ?, ?)`,
      [id, content, author_id || 8] // Default to Usuario Demo
    )

    const comment = await db.query('SELECT * FROM comments WHERE id = ?', [result.lastID])
    res.status(201).json(comment.rows[0])
  } catch (error) {
    console.error('Error creating comment:', error)
    res.status(500).json({ error: 'Failed to create comment' })
  }
})

export default router
