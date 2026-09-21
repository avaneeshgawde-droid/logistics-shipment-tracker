import React, { useEffect } from 'react'

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const type = toast.type || 'info'
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'

  return (
    <div className={`toast-container toast-${type}`}>
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  )
}
