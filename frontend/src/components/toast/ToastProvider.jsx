import { useCallback, useMemo, useRef, useState } from 'react'
import { ToastContext } from './ToastContext.js'
import './Toast.css'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (type, message) => {
      const id = nextId.current++
      setToasts((list) => [...list, { id, type, message }])
      setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <span>{t.message}</span>
            <button type="button" className="toast-close" onClick={() => dismiss(t.id)} aria-label="Uždaryti">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
