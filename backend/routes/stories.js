import express from 'express'
import db from '../config/database.js'
// import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Temporalmente deshabilitado para desarrollo
// router.use(authenticateUser)

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
}

// GET /api/stories - Obtener todas las historias con sus tareas
router.get('/', async (req, res) => {
  try {
    const stories = await db.query(`
      SELECT s.*, u.name as assignee_name,
             COUNT(t.id) as task_count,
             COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
      FROM stories s 
      LEFT JOIN users u ON s.assignee_id = u.id 
      LEFT JOIN tasks t ON s.id = t.story_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `)
    
    res.json(stories.rows)
  } catch (error) {
    console.error('Error fetching stories:', error)
    res.status(500).json({ error: 'Failed to fetch stories' })
  }
})

// GET /api/stories/:id/tasks - Obtener tareas de una historia
router.get('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params
    const tasks = await db.query(`
      SELECT t.*, u.name as assignee_name 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      WHERE t.story_id = ? 
      ORDER BY t.created_at DESC
    `, [id])
    
    res.json(tasks.rows)
  } catch (error) {
    console.error('Error fetching story tasks:', error)
    res.status(500).json({ error: 'Failed to fetch story tasks' })
  }
})

// POST /api/stories - Crear nueva historia
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, region, assignee_id, start_date, target_date } = req.body

    const result = await db.run(
      `INSERT INTO stories (title, description, priority, region, assignee_id, start_date, target_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, priority || 'medium', region, assignee_id, start_date, target_date]
    )

    const story = await db.query('SELECT * FROM stories WHERE id = ?', [result.lastID])
    res.status(201).json(story.rows[0])
  } catch (error) {
    console.error('Error creating story:', error)
    res.status(500).json({ error: 'Failed to create story' })
  }
})

// PUT /api/stories/:id - Actualizar historia
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, region, assignee_id, start_date, target_date, progress } = req.body

    await db.run(
      `UPDATE stories 
       SET title = ?, description = ?, status = ?, priority = ?, region = ?, 
           assignee_id = ?, start_date = ?, target_date = ?, progress = ?
       WHERE id = ?`,
      [title, description, status, priority, region, assignee_id, start_date, target_date, progress, id]
    )

    const result = await db.query('SELECT * FROM stories WHERE id = ?', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating story:', error)
    res.status(500).json({ error: 'Failed to update story' })
  }
})

// POST /api/stories/:id/complete - Completar historia y crear hito
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params
    
    // Get story details
    const storyResult = await db.query('SELECT * FROM stories WHERE id = ?', [id])
    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' })
    }
    
    const story = storyResult.rows[0]
    
    // Create milestone from story
    const milestoneResult = await db.run(
      `INSERT INTO milestones (title, description, due_date, status, progress) 
       VALUES (?, ?, ?, 'completed', 100)`,
      [`Hito: ${story.title}`, story.description, story.target_date]
    )
    
    // Update story status and link to milestone
    await db.run(
      `UPDATE stories SET status = 'completed', progress = 100, milestone_id = ? WHERE id = ?`,
      [milestoneResult.lastID, id]
    )
    
    // Mark all story tasks as completed
    await db.run('UPDATE tasks SET status = "completed", progress = 100 WHERE story_id = ?', [id])
    
    const milestone = await db.query('SELECT * FROM milestones WHERE id = ?', [milestoneResult.lastID])
    res.json({ 
      message: 'Story completed and milestone created',
      milestone: milestone.rows[0]
    })
  } catch (error) {
    console.error('Error completing story:', error)
    res.status(500).json({ error: 'Failed to complete story' })
  }
})

// DELETE /api/stories/:id - Eliminar historia
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // First, unlink tasks from this story
    await db.run('UPDATE tasks SET story_id = NULL WHERE story_id = ?', [id])
    
    // Then delete the story
    const result = await db.run('DELETE FROM stories WHERE id = ?', [id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Story not found' })
    }

    res.json({ message: 'Story deleted successfully' })
  } catch (error) {
    console.error('Error deleting story:', error)
    res.status(500).json({ error: 'Failed to delete story' })
  }
})

export default router
