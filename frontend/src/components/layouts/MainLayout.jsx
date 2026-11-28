import { Outlet } from 'react-router-dom'
import { Header } from '../Header.jsx'
import { NavTabs } from '../NavTabs.jsx'
import './layouts.css'

// Pagrindinis maketas: antraštė + skyrių mygtukai + puslapio turinys.
export function MainLayout() {
  return (
    <div className="page">
      <Header />
      <NavTabs />
      <main className="page-main">
        <Outlet />
      </main>
    </div>
  )
}
