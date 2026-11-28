import { Link } from 'react-router-dom'
import './Logo.css'

export function Logo({ size = 'md' }) {
  return (
    <Link to="/" className={`logo logo-${size}`} aria-label="BookIT – į pradžią">
      <img src="/BookIT.svg" alt="BookIT" />
    </Link>
  )
}