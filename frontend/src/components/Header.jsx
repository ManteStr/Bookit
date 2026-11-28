import { useCallback, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { useDismiss } from '../hooks/useDismiss.js'
import { Logo } from './Logo.jsx'
import { ChevronDownIcon, MenuIcon, UserIcon } from './icons.jsx'
import { useToast } from './toast/useToast.js'
import './Header.css'

export function Header() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const menuRef = useRef(null)
  const profileRef = useRef(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeProfile = useCallback(() => setProfileOpen(false), [])
  useDismiss(menuRef, menuOpen, closeMenu)
  useDismiss(profileRef, profileOpen, closeProfile)

  async function handleLogout() {
    setProfileOpen(false)
    try {
      await logout()
      toast.success('Sėkmingai atsijungta.')
    } catch {
      toast.error('Nepavyko atsijungti. Bandykite dar kartą.')
    }
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <div className="dropdown" ref={menuRef}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Meniu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MenuIcon />
            </button>
            {menuOpen && (
              <nav className="dropdown-panel" aria-label="Pagrindinis meniu">
                <NavLink to="/" end onClick={closeMenu}>
                  Pradžia
                </NavLink>
                <NavLink to="/kambariai" onClick={closeMenu}>
                  Visi kambariai
                </NavLink>
                <NavLink to="/zemelapis" onClick={closeMenu}>
                  Žemėlapis
                </NavLink>
                <NavLink to="/kalendorius" onClick={closeMenu}>
                  Kalendorius
                </NavLink>
              </nav>
            )}
          </div>
          <Logo />
        </div>

        <div className="header-right">
          {user ? (
            <div className="dropdown" ref={profileRef}>
              <button
                type="button"
                className="profile-btn"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <UserIcon />
                <span className="profile-name">{user.vardas}</span>
                <ChevronDownIcon />
              </button>
              {profileOpen && (
                <div className="dropdown-panel dropdown-right">
                  <div className="dropdown-info">
                    <strong>
                      {user.vardas} {user.pavarde}
                    </strong>
                    <span>{user.el_pastas}</span>
                  </div>
                  <button type="button" onClick={handleLogout}>
                    Atsijungti
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/prisijungti" className="btn btn-white header-btn">
                Prisijungti
              </Link>
              <Link to="/registruotis" className="btn btn-white header-btn">
                Registruotis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
