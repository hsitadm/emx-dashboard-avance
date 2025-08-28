import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// GET /api/dashboard/metrics - Obtener métricas del dashboard
router.get('/metrics', async (req, res) => {
  try {
    // Total de tareas
    const totalTasks = await pool.query('SELECT COUNT(*) FROM tasks')
    
    // Tareas completadas
    const completedTasks = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'completed'")
    
    // Progreso general
    const progressResult = await pool.query('SELECT AVG(progress) as avg_progress FROM tasks')
    const generalProgress = Math.round(progressResult.rows[0].avg_progress || 0)
    
    // Tareas por región
    const tasksByRegion = await pool.query(`
      SELECT region, 
             COUNT(*) as total,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM tasks 
      WHERE region IS NOT NULL 
      GROUP BY region
    `)
    
    // Tareas por estado
    const tasksByStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM tasks 
      GROUP BY status
    `)

    res.json({
      totalTasks: parseInt(totalTasks.rows[0].count),
      completedTasks: parseInt(completedTasks.rows[0].count),
      generalProgress,
      tasksByRegion: tasksByRegion.rows,
      tasksByStatus: tasksByStatus.rows
    })
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' })
  }
})

export default router
