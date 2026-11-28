import { useMemo, useState } from 'react'
import { RoomCard } from '../components/RoomCard.jsx'
import { RoomFilter } from '../components/RoomFilter.jsx'
import { useRooms } from '../hooks/useRooms.js'
import { EMPTY_FILTERS, countFilters, filterRooms } from '../lib/rooms.js'
import './RoomsPage.css'

export default function RoomsPage() {
  const { data, loading, error, reload } = useRooms()
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  const visibleRooms = useMemo(() => (data ? filterRooms(data.kambariai, filters) : []), [data, filters])
  const maxCapacity = useMemo(
    () => (data && data.kambariai.length > 0 ? Math.max(...data.kambariai.map((r) => r.talpa)) : 1),
    [data],
  )

  if (loading) return <p className="rooms-status">Kraunami kambariai…</p>

  if (error) {
    return (
      <div className="rooms-status">
        <p>{error}</p>
        <button type="button" className="btn btn-green" onClick={reload}>
          Bandyti dar kartą
        </button>
      </div>
    )
  }

  return (
    <div className="rooms">
      <div className="rooms-toolbar">
        <RoomFilter
          libraries={data.bibliotekos}
          equipment={data.iranga}
          maxCapacity={Math.max(maxCapacity, 2)}
          applied={filters}
          onApply={setFilters}
        />
      </div>

      {data.bibliotekos.map((lib) => {
        const rooms = visibleRooms.filter((room) => room.bibliotekos_id === lib.id)
        if (rooms.length === 0) return null
        return (
          <section key={lib.id} className="rooms-library">
            <h2 className="rooms-library-title">
              <strong>{lib.pavadinimas}</strong>, {lib.adresas}
            </h2>
            <div className="rooms-grid">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>
        )
      })}

      {visibleRooms.length === 0 && (
        <div className="rooms-status">
          <p>
            {countFilters(filters) > 0
              ? 'Pagal pasirinktus filtrus kambarių nerasta.'
              : 'Kol kas nėra jokių kambarių.'}
          </p>
          {countFilters(filters) > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setFilters(EMPTY_FILTERS)}>
              Išvalyti filtrus
            </button>
          )}
        </div>
      )}
    </div>
  )
}
