import db from '../config/database.js'
import crypto from 'crypto'

// Generar token de sesión
export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex')
}

// Middleware de autenticación
export async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' })
    }

    const session = await db.query(`
      SELECT s.*, u.id as user_id, u.name, u.email, u.role, u.region
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `, [token])

    if (session.rows.length === 0) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }

    req.user = session.rows[0]
    next()
  } catch (error) {
    console.error('Error en autenticación:', error)
    res.status(500).json({ error: 'Error de autenticación' })
  }
}

// Middleware de autorización por rol
export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permisos insuficientes' })
    }

    next()
  }
}

// Verificar permisos de edición
export function canEdit(userRole) {
  return ['admin', 'editor'].includes(userRole)
}

// Verificar permisos de administración
export function canAdmin(userRole) {
  return userRole === 'admin'
}
