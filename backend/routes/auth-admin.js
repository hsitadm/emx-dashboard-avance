import express from 'express'
import { CognitoIdentityProviderClient, AdminResetUserPasswordCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider'

const router = express.Router()

const cognitoClient = new CognitoIdentityProviderClient({
  region: 'us-east-1'
})

const USER_POOL_ID = 'us-east-1_A7TjCD2od'

// Reset password (fuerza cambio en próximo login)
router.post('/reset-password', async (req, res) => {
  try {
    const { username } = req.body
    
    // Verificar que el usuario actual es admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden resetear passwords' })
    }

    const command = new AdminResetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: username
    })

    await cognitoClient.send(command)

    res.json({ 
      success: true, 
      message:  
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Error al resetear password' })
  }
})

// Set password temporal
router.post('/set-temp-password', async (req, res) => {
  try {
    const { username, password } = req.body
    
    // Verificar que el usuario actual es admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden establecer passwords' })
    }

    const command = new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      Password: password,
      Temporary: true
    })

    await cognitoClient.send(command)

    res.json({ 
      success: true, 
      message:  
    })
  } catch (error) {
    console.error('Error setting password:', error)
    res.status(500).json({ error: 'Error al establecer password' })
  }
})

export default router
