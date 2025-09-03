import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET /api/stories - Get all stories with calculated progress
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.*, 
        m.title as milestone_title,
        u.name as assignee_name,
        COUNT(t.id) as task_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
        COALESCE(AVG(t.progress), 0) as story_progress
      FROM stories s 
      LEFT JOIN milestones m ON s.milestone_id = m.id
      LEFT JOIN users u ON s.assignee_id = u.id
      LEFT JOIN tasks t ON s.id = t.story_id
      GROUP BY s.id, s.title, s.description, s.status, s.priority, s.region, s.assignee_id, s.start_date, s.target_date, s.progress, s.milestone_id, s.created_at
      ORDER BY s.created_at DESC
    `)
    
    // Normalize status and calculate progress
    const stories = result.rows.map(story => ({
      ...story,
      status: story.status === 'active' ? 'in-progress' : (story.status || 'planning'),
      story_progress: Math.round(story.story_progress || 0)
    }))
    
    res.json(stories)
  } catch (error) {
    console.error('Error fetching stories:', error)
    res.status(500).json({ error: 'Failed to fetch stories' })
  }
})

// GET /api/stories/:id - Get specific story
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await db.query(`
      SELECT s.*, m.title as milestone_title, u.name as assignee_name 
      FROM stories s 
      LEFT JOIN milestones m ON s.milestone_id = m.id
      LEFT JOIN users u ON s.assignee_id = u.id
      WHERE s.id = ?
    `, [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' })
    }
    
    const story = result.rows[0]
    story.status = story.status === 'active' ? 'in-progress' : (story.status || 'planning')
    
    res.json(story)
  } catch (error) {
    console.error('Error fetching story:', error)
    res.status(500).json({ error: 'Failed to fetch story' })
  }
})

// POST /api/stories - Create new story
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, region, assignee_id, start_date, target_date, milestone_id } = req.body
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const result = await db.query(
      'INSERT INTO stories (title, description, status, priority, region, assignee_id, start_date, target_date, milestone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *',
      [title, description, status || 'planning', priority || 'medium', region || 'TODAS', assignee_id, start_date, target_date, milestone_id]
    )
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating story:', error)
    res.status(500).json({ error: 'Failed to create story' })
  }
})

// PUT /api/stories/:id - Update story
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, region, assignee_id, start_date, target_date, milestone_id } = req.body
    
    const result = await db.query(
      'UPDATE stories SET title = ?, description = ?, status = ?, priority = ?, region = ?, assignee_id = ?, start_date = ?, target_date = ?, milestone_id = ? WHERE id = ? RETURNING *',
      [title, description, status, priority, region, assignee_id, start_date, target_date, milestone_id, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating story:', error)
    res.status(500).json({ error: 'Failed to update story' })
  }
})

// DELETE /api/stories/:id - Delete story
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await db.query('DELETE FROM stories WHERE id = ? RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' })
    }
    
    res.json({ message: 'Story deleted successfully' })
  } catch (error) {
    console.error('Error deleting story:', error)
    res.status(500).json({ error: 'Failed to delete story' })
  }
})

export default router
