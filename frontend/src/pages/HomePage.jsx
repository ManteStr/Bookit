import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import './HomePage.css'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="home">
      <h1 className="home-title">Sveiki atvykę į BookIT!</h1>
      <p className="home-lead">VILNIUS TECH bibliotekų darbo kambarių rezervacijos sistema.</p>

      <section className="home-card">
        <h2>Rezervuokite darbo kambarį greitai ir patogiai</h2>
        <p>
          Peržiūrėkite bibliotekų kambarius, jų įrangą ir vietas žemėlapyje. Registruoti naudotojai gali
          rezervuoti kambarį pasirinktam laikui.
        </p>
        <div className="home-actions">
          {user ? (
            <Link to="/kalendorius" className="btn btn-white">
              Rezervuoti kambarį
            </Link>
          ) : (
            <>
              <Link to="/prisijungti" className="btn btn-white">
                Prisijungti
              </Link>
              <Link to="/registruotis" className="btn btn-white">
                Registruotis
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
