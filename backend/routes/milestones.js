import express from 'express'
import db from '../config/database.js'

const router = express.Router()

// GET /api/milestones - Get all milestones with auto-calculated progress
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        m.*,
        COUNT(s.id) as total_stories,
        COUNT(CASE WHEN s.id IS NOT NULL THEN 1 END) as stories_count,
        COALESCE(AVG(
          CASE 
            WHEN s.id IS NOT NULL THEN (
              SELECT AVG(t.progress) 
              FROM tasks t 
              WHERE t.story_id = s.id
            )
            ELSE NULL
          END
        ), 0) as calculated_progress,
        GROUP_CONCAT(s.title, '|') as story_titles
      FROM milestones m
      LEFT JOIN stories s ON m.id = s.milestone_id
      GROUP BY m.id, m.title, m.description, m.due_date, m.status, m.region, m.created_at
      ORDER BY m.due_date ASC
    `)
    
    // Format the response
    const milestones = result.rows.map(milestone => ({
      ...milestone,
      progress: Math.round(milestone.calculated_progress || 0),
      story_titles: milestone.story_titles ? milestone.story_titles.split('|').filter(Boolean) : [],
      stories_count: milestone.stories_count || 0
    }))
    
    res.json(milestones)
  } catch (error) {
    console.error('Error fetching milestones:', error)
    res.status(500).json({ error: 'Failed to fetch milestones' })
  }
})

// GET /api/milestones/:id - Get specific milestone with stories
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Get milestone with calculated progress
    const milestoneResult = await db.query(`
      SELECT 
        m.*,
        COALESCE(AVG(
          CASE 
            WHEN s.id IS NOT NULL THEN (
              SELECT AVG(t.progress) 
              FROM tasks t 
              WHERE t.story_id = s.id
            )
            ELSE NULL
          END
        ), 0) as calculated_progress
      FROM milestones m
      LEFT JOIN stories s ON m.id = s.milestone_id
      WHERE m.id = ?
      GROUP BY m.id
    `, [id])
    
    if (milestoneResult.rows.length === 0) {
      return res.status(404).json({ error: 'Milestone not found' })
    }
    
    // Get associated stories
    const storiesResult = await db.query(`
      SELECT s.*, 
        COALESCE(AVG(t.progress), 0) as story_progress,
        COUNT(t.id) as task_count
      FROM stories s
      LEFT JOIN tasks t ON s.id = t.story_id
      WHERE s.milestone_id = ?
      GROUP BY s.id
      ORDER BY s.id
    `, [id])
    
    const milestone = {
      ...milestoneResult.rows[0],
      progress: Math.round(milestoneResult.rows[0].calculated_progress || 0),
      stories: storiesResult.rows.map(story => ({
        ...story,
        story_progress: Math.round(story.story_progress || 0)
      }))
    }
    
    res.json(milestone)
  } catch (error) {
    console.error('Error fetching milestone:', error)
    res.status(500).json({ error: 'Failed to fetch milestone' })
  }
})

// POST /api/milestones - Create new milestone
router.post('/', async (req, res) => {
  try {
    const { title, description, due_date, status, region } = req.body
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const result = await db.query(
      'INSERT INTO milestones (title, description, due_date, status, region) VALUES (?, ?, ?, ?, ?) RETURNING *',
      [title, description, due_date, status || 'planning', region || 'TODAS']
    )
    
    res.status(201).json({ ...result.rows[0], progress: 0, stories_count: 0 })
  } catch (error) {
    console.error('Error creating milestone:', error)
    res.status(500).json({ error: 'Failed to create milestone' })
  }
})

// PUT /api/milestones/:id - Update milestone
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, due_date, status, region } = req.body
    
    const result = await db.query(
      'UPDATE milestones SET title = ?, description = ?, due_date = ?, status = ?, region = ? WHERE id = ? RETURNING *',
      [title, description, due_date, status, region, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Milestone not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating milestone:', error)
    res.status(500).json({ error: 'Failed to update milestone' })
  }
})

// DELETE /api/milestones/:id - Delete milestone
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if milestone has associated stories
    const storiesResult = await db.query('SELECT COUNT(*) as count FROM stories WHERE milestone_id = ?', [id])
    if (storiesResult.rows[0].count > 0) {
      return res.status(409).json({ error: 'Cannot delete milestone with associated stories' })
    }
    
    const result = await db.query('DELETE FROM milestones WHERE id = ? RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Milestone not found' })
    }
    
    res.json({ message: 'Milestone deleted successfully' })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    res.status(500).json({ error: 'Failed to delete milestone' })
  }
})

export default router
