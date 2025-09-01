import React, { useState } from 'react'
import { MessageCircle, Send, Trash2, User } from 'lucide-react'
import { useCommentsStore } from '../store/commentsStore'
import { useAuthStore } from '../store/authStore'

interface CommentsSectionProps {
  entityType: 'task' | 'story' | 'milestone'
  entityId: number
  entityTitle: string
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  entityType,
  entityId,
  entityTitle
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const { comments, addComment, getComments, deleteComment } = useCommentsStore()
  const { user, canEdit } = useAuthStore()

  const entityComments = getComments(entityType, entityId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    addComment({
      entityType,
      entityId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newComment.trim()
    })

    setNewComment('')
  }

  const handleDelete = (commentId: number) => {
    if (window.confirm('¿Eliminar este comentario?')) {
      deleteComment(commentId)
    }
  }

  const canDeleteComment = (comment: any) => {
    return canEdit() || comment.userId === user?.id
  }

  return (
    <div className="border-t pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Comentarios ({entityComments.length})</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Lista de comentarios */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {entityComments.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay comentarios aún</p>
            ) : (
              entityComments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500 ml-2 capitalize">
                          {comment.userRole}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()} {' '}
                        {new Date(comment.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {canDeleteComment(comment) && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulario para nuevo comentario */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Agregar comentario en ${entityTitle}...`}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="text-xs text-gray-500">
            {user?.role === 'viewer' 
              ? 'Como visualizador, puedes agregar comentarios pero no editar contenido.'
              : 'Puedes agregar comentarios y editar contenido.'
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentsSection
