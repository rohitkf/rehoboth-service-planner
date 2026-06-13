import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Info, Undo2, X } from 'lucide-react'
import type { Toast } from '../../hooks/useToast'

interface ContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ContainerProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 no-print pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

const STYLES: Record<Toast['type'], { bg: string; bar: string; icon: React.ReactNode }> = {
  success: { bg: 'bg-gray-900', bar: 'bg-green-400', icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> },
  error: { bg: 'bg-gray-900', bar: 'bg-red-400', icon: <XCircle className="w-4 h-4 text-red-400" /> },
  info: { bg: 'bg-gray-900', bar: 'bg-blue-400', icon: <Info className="w-4 h-4 text-blue-400" /> },
  undo: { bg: 'bg-gray-900', bar: 'bg-amber-400', icon: <Undo2 className="w-4 h-4 text-amber-400" /> },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(100)
  const style = STYLES[toast.type]

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [toast.duration])

  function handleUndo() {
    toast.onUndo?.()
    onDismiss(toast.id)
  }

  return (
    <div
      className={`${style.bg} text-white rounded-xl shadow-2xl overflow-hidden pointer-events-auto transition-all duration-300 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="shrink-0">{style.icon}</span>
        <span className="flex-1 text-sm font-medium">{toast.message}</span>
        {toast.type === 'undo' && toast.onUndo && (
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </button>
        )}
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-gray-400 hover:text-white shrink-0 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Countdown progress bar */}
      <div className="h-0.5 bg-white/10">
        <div
          className={`h-full ${style.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
