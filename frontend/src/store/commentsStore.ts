import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Comment {
  id: number
  entityType: 'task' | 'story' | 'milestone'
  entityId: number
  userId: number
  userName: string
  userRole: string
  content: string
  createdAt: string
}

interface CommentsState {
  comments: Comment[]
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void
  getComments: (entityType: string, entityId: number) => Comment[]
  deleteComment: (commentId: number) => void
}

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      comments: [],

      addComment: (commentData) => {
        const newComment: Comment = {
          ...commentData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        }
        
        set(state => ({
          comments: [...state.comments, newComment]
        }))
      },

      getComments: (entityType, entityId) => {
        const { comments } = get()
        return comments
          .filter(comment => 
            comment.entityType === entityType && 
            comment.entityId === entityId
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      deleteComment: (commentId) => {
        set(state => ({
          comments: state.comments.filter(comment => comment.id !== commentId)
        }))
      }
    }),
    {
      name: 'comments-storage'
    }
  )
)
