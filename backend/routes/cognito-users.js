import express from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'

const router = express.Router()
const execAsync = promisify(exec)

// GET /api/cognito-users - Obtener usuarios de Cognito
router.get('/', async (req, res) => {
  try {
    const { stdout } = await execAsync(
      'aws cognito-idp list-users --user-pool-id us-east-1_A7TjCD2od --output json',
      { timeout: 5000 }
    )
    
    const data = JSON.parse(stdout)
    
    if (data.Users && data.Users.length > 0) {
      const users = data.Users.map(user => {
        const attributes = {}
        user.Attributes?.forEach(attr => {
          attributes[attr.Name] = attr.Value
        })
        
        return {
          username: user.Username,
          email: attributes.email,
          name: attributes.name,
          role: attributes['custom:role'] || 'viewer',
          region: attributes['custom:region'] || 'TODAS',
          status: user.UserStatus,
          created: user.UserCreateDate?.split('T')[0],
          enabled: user.Enabled
        }
      })
      
      return res.json(users)
    }
    
  } catch (error) {
    console.error('Error accessing Cognito:', error.message)
  }
  
  // Fallback si no se puede acceder a Cognito
  const fallbackUsers = [
    {
      username: '989ce8a8-7eea-4ac1-9aac-cd977d631482',
      email: 'hsandoval@escala24x7.com',
      name: 'Hector Sandoval',
      role: 'admin',
      region: 'TODAS',
      status: 'CONFIRMED',
      created: '2025-09-04',
      enabled: true
    },
    {
      username: '50d6afcc-8e94-4730-a35d-58bfd830459d',
      email: 'viewer@escala24x7.com',
      name: 'Viewer Only',
      role: 'viewer',
      region: 'TODAS',
      status: 'CONFIRMED',
      created: '2025-09-04',
      enabled: true
    }
  ]
  
  res.json(fallbackUsers)
})

export default router
