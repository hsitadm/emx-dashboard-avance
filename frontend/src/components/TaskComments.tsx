import { useState } from 'react'
import { MessageCircle, Send, User, Clock } from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  mentions?: string[]
}

interface TaskCommentsProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
}

const TaskComments = ({ taskId, isOpen, onClose }: TaskCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'María González',
      content: 'He completado la migración de los primeros 20 clientes. @Carlos Ruiz ¿puedes revisar la configuración?',
      timestamp: '2025-01-28T10:30:00Z',
      mentions: ['Carlos Ruiz']
    },
    {
      id: '2',
      author: 'Carlos Ruiz',
      content: 'Perfecto @María González, todo se ve bien. Procede con el siguiente lote.',
      timestamp: '2025-01-28T11:15:00Z',
      mentions: ['María González']
    }
  ])
  
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Usuario Demo',
      content: newComment,
      timestamp: new Date().toISOString(),
      mentions: extractMentions(newComment)
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+\s\w+)/g
    const matches = text.match(mentionRegex)
    return matches ? matches.map(match => match.substring(1)) : []
  }

  const formatContent = (content: string) => {
    return content.replace(/@(\w+\s\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace unos minutos'
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Comentarios de la Tarea</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{comment.author}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(comment.timestamp)}
                  </span>
                </div>
                <div 
                  className="text-gray-700 text-sm"
                  dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario... (usa @nombre para mencionar)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={16} />
              Enviar
            </button>
          </form>
          <div className="text-xs text-gray-500 mt-2">
            Tip: Usa @nombre apellido para mencionar a alguien
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskComments
