import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'

// Užkrauna kambarių sąrašą iš API.
// Grąžina: { data, loading, error, reload }
export function useRooms() {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    api
      .get('rooms')
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message })
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const reload = useCallback(() => {
    setState({ data: null, loading: true, error: null })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, reload }
}
