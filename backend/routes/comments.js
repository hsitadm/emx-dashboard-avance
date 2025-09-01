import express from 'express'
import db from '../config/database.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Aplicar autenticación a todas las rutas
router.use(authenticateUser)

// GET /api/comments/:entityType/:entityId - Obtener comentarios
router.get('/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params

    const comments = await db.query(`
      SELECT c.*, u.name as user_name, u.role as user_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.entity_type = ? AND c.entity_id = ?
      ORDER BY c.created_at DESC
    `, [entityType, entityId])

    res.json(comments.rows)
  } catch (error) {
    console.error('Error obteniendo comentarios:', error)
    res.status(500).json({ error: 'Error obteniendo comentarios' })
  }
})

// POST /api/comments - Crear comentario
router.post('/', async (req, res) => {
  try {
    const { entityType, entityId, content } = req.body
    const userId = req.user.user_id

    if (!entityType || !entityId || !content) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    const result = await db.run(`
      INSERT INTO comments (user_id, entity_type, entity_id, content)
      VALUES (?, ?, ?, ?)
    `, [userId, entityType, entityId, content])

    const comment = await db.query(`
      SELECT c.*, u.name as user_name, u.role as user_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.lastID])

    res.status(201).json(comment.rows[0])
  } catch (error) {
    console.error('Error creando comentario:', error)
    res.status(500).json({ error: 'Error creando comentario' })
  }
})

// DELETE /api/comments/:id - Eliminar comentario (solo admin o autor)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.user_id
    const userRole = req.user.role

    // Verificar si es el autor o admin
    const comment = await db.query('SELECT * FROM comments WHERE id = ?', [id])
    
    if (comment.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    if (comment.rows[0].user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Sin permisos para eliminar' })
    }

    await db.run('DELETE FROM comments WHERE id = ?', [id])
    res.json({ message: 'Comentario eliminado' })
  } catch (error) {
    console.error('Error eliminando comentario:', error)
    res.status(500).json({ error: 'Error eliminando comentario' })
  }
})

export default router
