import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { RestrictedDialog } from '../components/RestrictedDialog.jsx'
import './ComingSoon.css'

// Kalendorius kol kas tuščias – bus pridėtas vėliau.
export default function CalendarPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const closeDialog = useCallback(() => navigate('/'), [navigate])

  if (loading) return null

  if (!user) return <RestrictedDialog onClose={closeDialog} />

  return (
    <div className="coming">
      <h1>Kalendorius</h1>
      <p>Rezervacijų kalendorius bus pridėtas vėliau.</p>
    </div>
  )
}
