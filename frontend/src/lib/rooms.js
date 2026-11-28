// Pagalbinės funkcijos darbui su kambarių duomenimis.

export const EMPTY_FILTERS = { libraries: [], minCapacity: 1, equipment: [] }

/**
 * Nuotraukos adresas iš DB (kambariai.nuotraukos_url) -> adresas, kurį gali rodyti naršyklė.
 *   'https://...'        -> kaip yra
 *   '/images/rooms/a.jpg' -> kaip yra
 *   'kambarys-220.jpg'    -> /images/rooms/kambarys-220.jpg (failas frontend/public/images/rooms/)
 *   tuščia               -> null (rodomas pakaitinis paveikslėlis)
 */
export function roomImageUrl(value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value
  return `/images/rooms/${value}`
}

/** Kiek filtrų šiuo metu pritaikyta (rodoma ant filtro mygtuko). */
export function countFilters(filters) {
  return (
    (filters.libraries.length > 0 ? 1 : 0) +
    (filters.minCapacity > 1 ? 1 : 0) +
    (filters.equipment.length > 0 ? 1 : 0)
  )
}

/** Palieka tik tuos kambarius, kurie atitinka visus pasirinktus filtrus. */
export function filterRooms(rooms, filters) {
  return rooms.filter((room) => {
    if (filters.libraries.length > 0 && !filters.libraries.includes(room.bibliotekos_id)) return false
    if (room.talpa < filters.minCapacity) return false
    // Pasirinkta kelia įrangos rūšių – kambaryje turi būti VISOS.
    return filters.equipment.every((id) => room.iranga.some((item) => item.id === id))
  })
}

/** "Kompiuteris" arba "Kompiuteris × 2". */
export function equipmentLabel(item) {
  return item.kiekis > 1 ? `${item.pavadinimas} × ${item.kiekis}` : item.pavadinimas
}

/** "8 žmonės", "1 žmogus", "10 žmonių" (lietuviška galūnė pagal skaičių). */
export function peopleLabel(n) {
  const last = n % 10
  const lastTwo = n % 100
  if (last === 1 && lastTwo !== 11) return `${n} žmogus`
  if (last === 0 || (lastTwo >= 11 && lastTwo <= 19)) return `${n} žmonių`
  return `${n} žmonės`
}

// Ką laikome "technine įranga"; visa kita rodoma kaip "Papildomi įrankiai".
const TECH_EQUIPMENT = ['Kompiuteris', 'Projektorius']

/** Padalija kambario įrangą į { tech: [...], extra: [...] } (tekstai jau su kiekiu). */
export function splitEquipment(room) {
  const tech = []
  const extra = []
  for (const item of room.iranga) {
    ;(TECH_EQUIPMENT.includes(item.pavadinimas) ? tech : extra).push(equipmentLabel(item))
  }
  return { tech, extra }
}
