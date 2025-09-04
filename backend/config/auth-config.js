const crypto = require('crypto');

// Generar secret seguro si no existe
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

const AUTH_CONFIG = {
  // JWT Configuration
  jwt: {
    secret: JWT_SECRET,
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    issuer: 'emx-dashboard',
    audience: 'emx-dashboard-users'
  },
  
  // Password Policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 12
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDuration: 15 * 60 * 1000 // 15 minutes
  },
  
  // Session Configuration
  session: {
    maxConcurrentSessions: 3,
    inactivityTimeout: 8 * 60 * 60 * 1000, // 8 hours
    absoluteTimeout: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Security Headers
  security: {
    cors: {
      origin: [
        'https://emx-dashboard.tiendavirtualdemo.com',
        'http://localhost:5173'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }
  }
};

module.exports = AUTH_CONFIG;
