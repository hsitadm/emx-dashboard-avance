import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const client = jwksClient({
  jwksUri: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_A7TjCD2od/.well-known/jwks.json'
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null)
      return
    }
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

export const cognitoAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  // BLOQUEAR requests sin token
  if (!token) {
    return res.status(401).json({ 
      error: 'Token de autenticación requerido',
      message: 'Debes estar autenticado para acceder a esta API'
    })
  }

  jwt.verify(token, getKey, {
    audience: '17lv6rcvcop1mgm7opi3ib1irb',
    issuer: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_A7TjCD2od',
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message)
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'El token de autenticación no es válido'
      })
    }
    
    // Usuario autenticado correctamente
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded['custom:role'] || 'viewer',
      region: decoded['custom:region'] || 'TODAS'
    }
    
    next()
  })
}
