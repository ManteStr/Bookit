import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { useToast } from '../components/toast/useToast.js'
import './Auth.css'

const UNIVERSITY_EMAIL = /@(stud\.)?vilniustech\.lt$/i

export default function RegisterPage() {
  const { user, register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ vardas: '', pavarde: '', el_pastas: '', slaptazodis: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (user && !submitting) return <Navigate to="/" replace />

  const update = (name) => (event) => setForm((f) => ({ ...f, [name]: event.target.value }))

  function validate() {
    const e = {}
    if (form.vardas.trim() === '') e.vardas = 'Prašome įvesti vardą.'
    if (form.pavarde.trim() === '') e.pavarde = 'Prašome įvesti pavardę.'
    if (form.el_pastas.trim() === '') {
      e.el_pastas = 'Prašome įvesti el. pašto adresą.'
    } else if (!UNIVERSITY_EMAIL.test(form.el_pastas.trim())) {
      e.el_pastas = 'Registracija galima tik su universiteto el. paštu (@vilniustech.lt arba @stud.vilniustech.lt).'
    }
    if (form.slaptazodis === '') {
      e.slaptazodis = 'Prašome įvesti slaptažodį.'
    } else if (form.slaptazodis.length < 8) {
      e.slaptazodis = 'Slaptažodį turi sudaryti bent 8 simboliai.'
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
      const created = await register({
        vardas: form.vardas.trim(),
        pavarde: form.pavarde.trim(),
        el_pastas: form.el_pastas.trim(),
        slaptazodis: form.slaptazodis,
      })
      toast.success(`Paskyra sukurta. Sveiki, ${created.vardas}!`)
      navigate('/', { replace: true })
    } catch (err) {
      setErrors(err.field ? { [err.field]: err.message } : { form: err.message })
      setSubmitting(false)
    }
  }

  const field = (name, label, type, autoComplete, hint) => (
    <div className={`field${errors[name] ? ' field-invalid' : ''}`}>
      <label htmlFor={`reg-${name}`}>{label}</label>
      <input
        id={`reg-${name}`}
        type={type}
        autoComplete={autoComplete}
        value={form[name]}
        onChange={update(name)}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] ? <p className="field-error">{errors[name]}</p> : hint && <p className="field-hint">{hint}</p>}
    </div>
  )

  return (
    <section className="auth-card">
      <h1>Registracija</h1>
      <p className="auth-sub">Registruotis galima tik su VILNIUS TECH el. paštu.</p>

      <form onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="form-error" role="alert">
            {errors.form}
          </p>
        )}
        {field('vardas', 'Vardas', 'text', 'given-name')}
        {field('pavarde', 'Pavardė', 'text', 'family-name')}
        {field('el_pastas', 'El. paštas', 'email', 'username', '@vilniustech.lt arba @stud.vilniustech.lt')}
        {field('slaptazodis', 'Slaptažodis', 'password', 'new-password', 'Bent 8 simboliai.')}

        <button type="submit" className="btn btn-green btn-block" disabled={submitting}>
          {submitting ? 'Kuriama paskyra…' : 'Registruotis'}
        </button>
      </form>

      <p className="auth-switch">
        Jau turite paskyrą? <Link to="/prisijungti">Prisijungti</Link>
      </p>
    </section>
  )
}
