import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'
import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Programai užsikrovus paklausiame serverio, ar sesija dar galioja.
  useEffect(() => {
    let cancelled = false
    api
      .get('auth/me')
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async ({ el_pastas, slaptazodis, prisiminti }) => {
    const data = await api.post('auth/login', { el_pastas, slaptazodis, prisiminti })
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (fields) => {
    const data = await api.post('auth/register', fields)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('auth/logout', {})
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
