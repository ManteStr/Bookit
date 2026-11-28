// Mažas "fetch" apvalkalas: visos užklausos į PHP API eina per čia.
// Naršyklė kreipiasi į /api/..., o Vite (vite.config.js) perduoda Apache serveriui.

export class ApiError extends Error {
  constructor(message, status = 0, field = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.field = field // kuris formos laukas klaidingas (jei API nurodė)
  }
}

async function request(method, route, body) {
  const options = {
    method,
    credentials: 'same-origin', // siunčia sesijos slapuką
    headers: { Accept: 'application/json' },
  }
  if (method !== 'GET') {
    // API reikalauja JSON Content-Type (apsauga nuo CSRF)
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body ?? {})
  }

  let response
  try {
    response = await fetch(`/api/${route}`, options)
  } catch {
    throw new ApiError('Nepavyko prisijungti prie serverio. Patikrinkite, ar veikia Apache (XAMPP).')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // ne JSON atsakymas (pvz., Apache klaidos puslapis)
  }

  if (!response.ok || !data || data.ok === false) {
    throw new ApiError(
      data?.klaida || data?.error || 'Serverio klaida. Bandykite dar kartą vėliau.',
      response.status,
      data?.laukas || data?.field || null,
    )
  }
  return data
}

export const api = {
  get: (route) => request('GET', route),
  post: (route, body) => request('POST', route, body),
}
