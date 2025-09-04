const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');

class AuthController {
  
  async login(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de entrada inválidos',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { email, password } = req.body;
      
      // Get user from database
      const user = authMiddleware.statements.getUserByEmail.get(email);
      
      // Validate user
      const userValidation = authMiddleware.validateUser(user);
      if (!userValidation.valid) {
        authMiddleware.logAuditEvent(user?.id || null, 'login_failed', 'auth', req);
        
        const errorMessages = {
          USER_NOT_FOUND: 'Credenciales inválidas',
          USER_INACTIVE: 'Cuenta desactivada',
          PASSWORD_NOT_SET: 'Contraseña no configurada',
          USER_LOCKED: 'Cuenta bloqueada temporalmente'
        };
        
        return res.status(401).json({
          error: errorMessages[userValidation.reason] || 'Error de autenticación',
          code: userValidation.reason
        });
      }

      // Verify password
      const isValidPassword = await authMiddleware.comparePassword(password, user.password_hash);
      
      if (!isValidPassword) {
        // Increment failed attempts
        authMiddleware.statements.incrementFailedAttempts.run(user.id);
        
        // Lock user after max attempts
        if (user.failed_attempts >= 4) { // 5 total attempts
          authMiddleware.statements.lockUser.run(user.id);
          authMiddleware.logAuditEvent(user.id, 'account_locked', 'auth', req);
        }
        
        authMiddleware.logAuditEvent(user.id, 'login_failed', 'auth', req);
        return res.status(401).json({
          error: 'Credenciales inválidas',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = authMiddleware.generateTokens(user);
      
      // Update user login info
      authMiddleware.statements.updateUserLogin.run(user.id);
      
      // Create session
      authMiddleware.createSession(user.id, accessToken, refreshToken, req);
      
      // Log successful login
      authMiddleware.logAuditEvent(user.id, 'login_success', 'auth', req);
      
      // Set secure cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return success response
      res.json({
        success: true,
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region
        },
        expiresIn: '15m'
      });

    } catch (error) {
      console.error('Login error:', error);
      authMiddleware.logAuditEvent(null, 'login_error', 'auth', req);
      res.status(500).json({
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  async logout(req, res) {
    try {
      // Delete user sessions
      authMiddleware.statements.deleteUserSessions.run(req.user.id);
      
      // Log logout
      authMiddleware.logAuditEvent(req.user.id, 'logout', 'auth', req);
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Logout exitoso'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = authMiddleware.statements.getUserById.get(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region,
        lastLogin: user.last_login
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        return res.status(401).json({
          error: 'Refresh token requerido',
          code: 'REFRESH_TOKEN_REQUIRED'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, AUTH_CONFIG.jwt.secret);
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          error: 'Token inválido',
          code: 'INVALID_TOKEN_TYPE'
        });
      }

      // Get user
      const user = authMiddleware.statements.getUserById.get(decoded.id);
      if (!user) {
        return res.status(401).json({
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      // Generate new tokens
      const tokens = authMiddleware.generateTokens(user);
      
      // Update session
      authMiddleware.createSession(user.id, tokens.accessToken, tokens.refreshToken, req);
      
      // Set new refresh token cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        accessToken: tokens.accessToken,
        expiresIn: '15m'
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        error: 'Token inválido o expirado',
        code: 'TOKEN_INVALID'
      });
    }
  }
}

module.exports = new AuthController();
