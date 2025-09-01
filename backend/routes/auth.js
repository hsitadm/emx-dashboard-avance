import express from 'express'
import db from '../config/database.js'
import { generateSessionToken } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/login - Login simple por email
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' })
    }

    // Buscar usuario
    const user = await db.query('SELECT * FROM users WHERE email = ?', [email])
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const userData = user.rows[0]

    // Generar token de sesión
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Guardar sesión
    await db.run(`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `, [userData.id, sessionToken, expiresAt.toISOString()])

    res.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        region: userData.region
      },
      token: sessionToken,
      expiresAt: expiresAt.toISOString()
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error en login' })
  }
})

// POST /api/auth/logout - Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (token) {
      await db.run('DELETE FROM user_sessions WHERE session_token = ?', [token])
    }

    res.json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ error: 'Error en logout' })
  }
})

// GET /api/auth/me - Obtener usuario actual
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' })
    }

    const session = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.region
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `, [token])

    if (session.rows.length === 0) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    res.json({ user: session.rows[0] })
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    res.status(500).json({ error: 'Error obteniendo usuario' })
  }
})

export default router
