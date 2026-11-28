import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { useToast } from '../components/toast/useToast.js'
import './Auth.css'

export default function LoginPage() {
  const { user, login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Jau prisijungęs – nėra ko čia daryti.
  if (user && !submitting) return <Navigate to="/" replace />

  function validate() {
    const e = {}
    const hasEmail = email.trim() !== ''
    const hasPassword = password !== ''
    if (!hasEmail && !hasPassword) {
      e.form = 'Prašome įvesti el. paštą ir slaptažodį!'
    } else if (!hasEmail) {
      e.el_pastas = 'Prašome įvesti el. paštą!'
    } else if (!hasPassword) {
      e.slaptazodis = 'Prašome įvesti slaptažodį!'
    }
    return e
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      const loggedIn = await login({
        el_pastas: email.trim(),
        slaptazodis: password,
        prisiminti: remember,
      })
      toast.success(`Sveiki, ${loggedIn.vardas}!`)
      navigate('/', { replace: true })
    } catch (err) {
      setErrors(err.field ? { [err.field]: err.message } : { form: err.message })
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Prisijungimas</h1>
      <p className="auth-sub">Prisijunkite universiteto el. paštu.</p>

      <form onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="form-error" role="alert">
            {errors.form}
          </p>
        )}

        <div className={`field${errors.el_pastas ? ' field-invalid' : ''}`}>
          <label htmlFor="login-email">El. paštas</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.el_pastas)}
          />
          {errors.el_pastas && <p className="field-error">{errors.el_pastas}</p>}
        </div>

        <div className={`field${errors.slaptazodis ? ' field-invalid' : ''}`}>
          <label htmlFor="login-password">Slaptažodis</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.slaptazodis)}
          />
          {errors.slaptazodis && <p className="field-error">{errors.slaptazodis}</p>}
        </div>

        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Prisimink mane
        </label>

        <button type="submit" className="btn btn-green btn-block" disabled={submitting}>
          {submitting ? 'Jungiamasi…' : 'Prisijungti'}
        </button>
      </form>

      <p className="auth-switch">
        Neturite paskyros? <Link to="/registruotis">Registruotis</Link>
      </p>
    </section>
  )
}
