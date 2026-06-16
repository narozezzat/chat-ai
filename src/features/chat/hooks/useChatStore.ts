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
  
  createSession: (modelId: string, effort: 'low' | 'medium' | 'high', title?: string) => string
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
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      isStreaming: false,

      createSession: (modelId, effort, title) => {
        // If the current active session is already empty, reuse it instead of creating a duplicate
        const currentState = get()
        const activeSession = currentState.sessions.find(
          (s) => s.id === currentState.activeSessionId
        )
        if (activeSession && activeSession.messages.length === 0) {
          return activeSession.id
        }

        const id = crypto.randomUUID()
        const newSession: ChatSession = {
          id,
          title: title || 'new_chat',
          messages: [],
          modelId,
          effort,
          createdAt: Date.now(),
        }
        // Remove any other empty sessions before adding the new one
        set((state) => ({
          sessions: [newSession, ...state.sessions.filter((s) => s.messages.length > 0)],
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
        const defaultTitles = ['محادثة جديدة', 'New Chat', 'new_chat', 'New chat']
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id === sessionId) {
              let title = s.title
              if (defaultTitles.includes(s.title) && messages.length > 0) {
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
      // Only persist sessions that have at least one message
      partialize: (state) => ({
        ...state,
        sessions: state.sessions.filter((s) => s.messages.length > 0),
      }),
    }
  )
)
