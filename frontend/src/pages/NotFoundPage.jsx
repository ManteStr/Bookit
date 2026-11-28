import { Link } from 'react-router-dom'
import './ComingSoon.css'

export default function NotFoundPage() {
  return (
    <div className="coming">
      <h1>Puslapis nerastas</h1>
      <p>Tokio adreso nėra.</p>
      <Link to="/" className="btn btn-green">
        Į pradžią
      </Link>
    </div>
  )
}
