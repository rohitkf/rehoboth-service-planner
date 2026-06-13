import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import { ToastContainer } from '../components/ui/Toast'

export type ToastType = 'success' | 'error' | 'info' | 'undo'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
  onUndo?: () => void
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
  showUndoToast: (message: string, onUndo: () => void, duration?: number) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const pushToast = useCallback((toast: Toast) => {
    setToasts(prev => [...prev, toast])
    const timer = setTimeout(() => dismissToast(toast.id), toast.duration)
    timers.current.set(toast.id, timer)
  }, [dismissToast])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    pushToast({ id: crypto.randomUUID(), message, type, duration: 3500 })
  }, [pushToast])

  const showUndoToast = useCallback((message: string, onUndo: () => void, duration = 10000) => {
    pushToast({ id: crypto.randomUUID(), message, type: 'undo', duration, onUndo })
  }, [pushToast])

  return (
    <ToastContext.Provider value={{ showToast, showUndoToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
