import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UIMessage } from '@/lib/types'

export interface ChatSession {
  id: string
  title: string
  messages: UIMessage[]
  modelId: string
  effort: 'low' | 'medium' | 'high'
  createdAt: number
}

interface ChatState {
  sessions: ChatSession[]
  activeSessionId: string | null
  isStreaming: boolean
  
  createSession: (modelId: string, effort: 'low' | 'medium' | 'high') => string
  deleteSession: (id: string) => void
  selectSession: (id: string) => void
  updateSessionMessages: (sessionId: string, messages: UIMessage[]) => void
  updateSessionModel: (sessionId: string, modelId: string) => void
  updateSessionEffort: (sessionId: string, effort: 'low' | 'medium' | 'high') => void
  setStreaming: (isStreaming: boolean) => void
  clearAll: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessions: [],
      activeSessionId: null,
      isStreaming: false,

      createSession: (modelId, effort) => {
        const id = crypto.randomUUID()
        const newSession: ChatSession = {
          id,
          title: 'محادثة جديدة',
          messages: [],
          modelId,
          effort,
          createdAt: Date.now(),
        }
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: id,
        }))
        return id
      },

      deleteSession: (id) => {
        set((state) => {
          const sessions = state.sessions.filter((s) => s.id !== id)
          let activeSessionId = state.activeSessionId
          if (activeSessionId === id) {
            activeSessionId = sessions.length > 0 ? sessions[0].id : null
          }
          return { sessions, activeSessionId }
        })
      },

      selectSession: (id) => {
        set({ activeSessionId: id })
      },

      updateSessionMessages: (sessionId, messages) => {
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id === sessionId) {
              let title = s.title
              if (s.title === 'محادثة جديدة' && messages.length > 0) {
                const userMsg = messages.find((m) => m.role === 'user')
                if (userMsg && userMsg.content) {
                  title = userMsg.content.slice(0, 30) + (userMsg.content.length > 30 ? '...' : '')
                }
              }
              return { ...s, messages, title }
            }
            return s
          }),
        }))
      },

      updateSessionModel: (sessionId, modelId) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, modelId } : s
          ),
        }))
      },

      updateSessionEffort: (sessionId, effort) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, effort } : s
          ),
        }))
      },

      setStreaming: (isStreaming) => {
        set({ isStreaming })
      },

      clearAll: () => {
        set({ sessions: [], activeSessionId: null, isStreaming: false })
      },
    }),
    {
      name: 'ai-studio-chat-store',
    }
  )
)
