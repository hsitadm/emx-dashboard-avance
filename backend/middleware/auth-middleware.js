const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Database = require('better-sqlite3');
const AUTH_CONFIG = require('../config/auth-config');

class AuthMiddleware {
  constructor() {
    this.db = new Database('./database.sqlite');
    this.initializeStatements();
  }

  initializeStatements() {
    // Prepared statements for security and performance
    this.statements = {
      getUserByEmail: this.db.prepare(`
        SELECT * FROM users 
        WHERE email = ? AND is_active = 1
      `),
      
      getUserById: this.db.prepare(`
        SELECT id, name, email, role, region, last_login 
        FROM users 
        WHERE id = ? AND is_active = 1
      `),
      
      updateUserLogin: this.db.prepare(`
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP, failed_attempts = 0, locked_until = NULL 
        WHERE id = ?
      `),
      
      incrementFailedAttempts: this.db.prepare(`
        UPDATE users 
        SET failed_attempts = failed_attempts + 1 
        WHERE id = ?
      `),
      
      lockUser: this.db.prepare(`
        UPDATE users 
        SET locked_until = datetime('now', '+15 minutes') 
        WHERE id = ?
      `),
      
      insertSession: this.db.prepare(`
        INSERT INTO sessions (user_id, access_token, refresh_token, expires_at, ip_address, user_agent) 
        VALUES (?, ?, ?, ?, ?, ?)
      `),
      
      deleteUserSessions: this.db.prepare(`
        DELETE FROM sessions WHERE user_id = ?
      `),
      
      insertAuditLog: this.db.prepare(`
        INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent, timestamp) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `)
    };
  }

  // Rate limiting middleware
  createLoginLimiter() {
    return rateLimit({
      windowMs: AUTH_CONFIG.rateLimit.windowMs,
      max: AUTH_CONFIG.rateLimit.maxAttempts,
      message: { 
        error: 'Demasiados intentos de login. Intenta en 15 minutos.',
        code: 'RATE_LIMIT_EXCEEDED'
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        return req.ip + ':' + (req.body?.email || 'unknown');
      }
    });
  }

  // Input validation middleware
  validateLoginInput() {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email válido es requerido'),
      body('password')
        .isLength({ min: AUTH_CONFIG.password.minLength })
        .withMessage(`Contraseña debe tener al menos ${AUTH_CONFIG.password.minLength} caracteres`)
    ];
  }

  // Authentication middleware
  authenticateToken() {
    return (req, res, next) => {
      try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
          this.logAuditEvent(null, 'unauthorized_access', 'api', req);
          return res.status(401).json({ 
            error: 'Token de acceso requerido',
            code: 'TOKEN_REQUIRED'
          });
        }

        jwt.verify(token, AUTH_CONFIG.jwt.secret, {
          issuer: AUTH_CONFIG.jwt.issuer,
          audience: AUTH_CONFIG.jwt.audience
        }, (err, decoded) => {
          if (err) {
            this.logAuditEvent(null, 'invalid_token', 'api', req);
            return res.status(403).json({ 
              error: 'Token inválido o expirado',
              code: 'TOKEN_INVALID'
            });
          }

          // Verify user still exists and is active
          const user = this.statements.getUserById.get(decoded.id);
          if (!user) {
            this.logAuditEvent(decoded.id, 'user_not_found', 'api', req);
            return res.status(401).json({ 
              error: 'Usuario no encontrado',
              code: 'USER_NOT_FOUND'
            });
          }

          req.user = decoded;
          next();
        });
      } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ 
          error: 'Error de autenticación interno',
          code: 'AUTH_ERROR'
        });
      }
    };
  }

  // Authorization middleware
  authorizeRoles(allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Usuario no autenticado',
          code: 'NOT_AUTHENTICATED'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        this.logAuditEvent(req.user.id, 'unauthorized_role_access', 'api', req);
        return res.status(403).json({ 
          error: 'No tienes permisos para esta acción',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    };
  }

  // Password utilities
  async hashPassword(password) {
    return await bcrypt.hash(password, AUTH_CONFIG.password.saltRounds);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Token generation
  generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      region: user.region,
      name: user.name,
      iat: Math.floor(Date.now() / 1000)
    };

    const accessToken = jwt.sign(payload, AUTH_CONFIG.jwt.secret, {
      expiresIn: AUTH_CONFIG.jwt.accessTokenExpiry,
      issuer: AUTH_CONFIG.jwt.issuer,
      audience: AUTH_CONFIG.jwt.audience
    });

    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' }, 
      AUTH_CONFIG.jwt.secret, 
      {
        expiresIn: AUTH_CONFIG.jwt.refreshTokenExpiry,
        issuer: AUTH_CONFIG.jwt.issuer,
        audience: AUTH_CONFIG.jwt.audience
      }
    );

    return { accessToken, refreshToken };
  }

  // User validation
  validateUser(user) {
    if (!user) return { valid: false, reason: 'USER_NOT_FOUND' };
    if (!user.is_active) return { valid: false, reason: 'USER_INACTIVE' };
    if (!user.password_hash) return { valid: false, reason: 'PASSWORD_NOT_SET' };
    
    // Check if user is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return { valid: false, reason: 'USER_LOCKED' };
    }

    return { valid: true };
  }

  // Audit logging
  logAuditEvent(userId, action, resource, req) {
    try {
      this.statements.insertAuditLog.run(
        userId,
        action,
        resource,
        req.ip,
        req.get('User-Agent') || 'Unknown'
      );
    } catch (error) {
      console.error('Audit log error:', error);
    }
  }

  // Session management
  createSession(userId, accessToken, refreshToken, req) {
    const expiresAt = new Date(Date.now() + AUTH_CONFIG.session.absoluteTimeout);
    
    this.statements.insertSession.run(
      userId,
      accessToken,
      refreshToken,
      expiresAt.toISOString(),
      req.ip,
      req.get('User-Agent') || 'Unknown'
    );
  }

  // Cleanup expired sessions
  cleanupExpiredSessions() {
    try {
      this.db.prepare('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP').run();
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
}

module.exports = new AuthMiddleware();
