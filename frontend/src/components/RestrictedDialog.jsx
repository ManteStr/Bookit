import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './RestrictedDialog.css'

// Langas svečiui: funkcija tik registruotiems naudotojams.
export function RestrictedDialog({ onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restricted-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="restricted-title">Ši funkcija galima tik registruotiems naudotojams!</h2>
        <div className="dialog-actions">
          <Link to="/prisijungti" className="btn btn-white">
            Prisijungti
          </Link>
          <Link to="/registruotis" className="btn btn-outline-white">
            Registruotis
          </Link>
        </div>
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Uždaryti">
          ×
        </button>
      </div>
    </div>
  )
}
