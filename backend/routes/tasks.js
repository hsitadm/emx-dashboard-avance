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
    let { title, description, status, assignee_id, due_date, priority, region, story_id } = req.body

    if (!story_id) {
      return res.status(400).json({ error: 'story_id is required' })
    }

    // Auto-establecer progreso basado en status
    const finalStatus = status || 'planning'
    const progress = finalStatus === 'completed' ? 100 : 0

    const result = await db.run(
      `INSERT INTO tasks (title, description, status, assignee_id, due_date, priority, region, story_id, progress) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, finalStatus, assignee_id, due_date, priority || 'medium', region, story_id, progress]
    )

    // Get the created task with story info
    const task = await db.query(`
      SELECT t.*, u.name as assignee_name, s.title as story_title
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      LEFT JOIN stories s ON t.story_id = s.id
      WHERE t.id = ?
    `, [result.lastID])
    
    // Actualizar progreso de la historia
    await updateStoryProgress(story_id)
    
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
    let { title, description, status, assignee_id, due_date, priority, region, progress, story_id } = req.body

    // Auto-actualizar progreso basado en status
    if (status === 'completed') {
      progress = 100
    } else if (status === 'planning') {
      progress = progress || 0
    }

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

    // Actualizar progreso de la historia
    if (story_id) {
      await updateStoryProgress(story_id)
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// Función para calcular progreso de historia basado en tareas
async function updateStoryProgress(storyId) {
  try {
    const tasks = await db.query('SELECT progress FROM tasks WHERE story_id = ?', [storyId])
    
    if (tasks.rows.length === 0) {
      return 0
    }
    
    const totalProgress = tasks.rows.reduce((sum, task) => sum + (task.progress || 0), 0)
    const averageProgress = Math.round(totalProgress / tasks.rows.length)
    
    await db.run('UPDATE stories SET progress = ? WHERE id = ?', [averageProgress, storyId])
    
    return averageProgress
  } catch (error) {
    console.error('Error updating story progress:', error)
    return 0
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
