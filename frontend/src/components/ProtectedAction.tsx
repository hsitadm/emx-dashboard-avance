import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Lock } from 'lucide-react'

interface ProtectedActionProps {
  children: React.ReactNode
  requireEdit?: boolean
  requireAdmin?: boolean
  fallback?: React.ReactNode
  showMessage?: boolean
}

const ProtectedAction: React.FC<ProtectedActionProps> = ({
  children,
  requireEdit = false,
  requireAdmin = false,
  fallback = null,
  showMessage = false
}) => {
  const { canEdit, canAdmin, user } = useAuthStore()

  // Verificar permisos
  const hasPermission = () => {
    if (requireAdmin) return canAdmin()
    if (requireEdit) return canEdit()
    return true
  }

  if (!hasPermission()) {
    if (showMessage) {
      return (
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <Lock className="w-4 h-4" />
          <span>
            {requireAdmin 
              ? 'Requiere permisos de administrador' 
              : 'Requiere permisos de edición'
            }
          </span>
        </div>
      )
    }
    return fallback
  }

  return <>{children}</>
}

export default ProtectedAction
