import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import './NavTabs.css'

// restricted = svečias (neprisijungęs) šio skyriaus matyti negali.
const TABS = [
  { to: '/kambariai', label: 'Visi kambariai', restricted: false },
  { to: '/zemelapis', label: 'Žemėlapis', restricted: false },
  { to: '/kalendorius', label: 'Kalendorius', restricted: true },
]

export function NavTabs() {
  const { user } = useAuth()

  return (
    <nav className="tabs" aria-label="Skyriai">
      <div className="tabs-inner">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              ['tab', isActive ? 'tab-active' : '', isActive && tab.restricted && !user ? 'tab-restricted' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
