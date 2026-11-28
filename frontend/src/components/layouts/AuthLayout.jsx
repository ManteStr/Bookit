import { Outlet } from 'react-router-dom'
import { Logo } from '../Logo.jsx'
import './layouts.css'

// Prisijungimo ir registracijos puslapių maketas (be skyrių mygtukų).
export function AuthLayout() {
  return (
    <div className="auth-page">
      <div className="auth-logo">
        <Logo size="lg" />
      </div>
      <main className="auth-main">
        <Outlet />
      </main>
    </div>
  )
}
