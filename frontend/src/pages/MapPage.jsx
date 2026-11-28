import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { MapView } from '../components/MapView.jsx'
import { RoomLayout } from '../components/RoomLayout.jsx'
import { useToast } from '../components/toast/useToast.js'
import { useRooms } from '../hooks/useRooms.js'
import { peopleLabel, splitEquipment } from '../lib/rooms.js'
import './MapPage.css'

// Adreso juostoje: /zemelapis?biblioteka=1&kambarys=3
export default function MapPage() {
  const { data, loading, error, reload } = useRooms()
  const [params, setParams] = useSearchParams()

  const libraryId = Number(params.get('biblioteka')) || null
  const roomId = Number(params.get('kambarys')) || null

  const library = useMemo(() => {
    if (!data) return null
    return data.bibliotekos.find((l) => l.id === libraryId) ?? data.bibliotekos[0] ?? null
  }, [data, libraryId])

  const libraryRooms = useMemo(
    () => (data && library ? data.kambariai.filter((r) => r.bibliotekos_id === library.id) : []),
    [data, library],
  )
  const selectedRoom = libraryRooms.find((r) => r.id === roomId) ?? null

  if (loading) return <p className="map-status">Kraunama…</p>

  if (error) {
    return (
      <div className="map-status">
        <p>{error}</p>
        <button type="button" className="btn btn-green" onClick={reload}>
          Bandyti dar kartą
        </button>
      </div>
    )
  }

  if (!library) return <p className="map-status">Kol kas nėra jokių bibliotekų.</p>

  const selectLibrary = (id) => setParams({ biblioteka: String(id) })
  const selectRoom = (room) => setParams({ biblioteka: String(library.id), kambarys: String(room.id) })
  const backToMap = () => setParams({ biblioteka: String(library.id) })

  return (
    <div className="map-page">
      <div className="map-stage">
        {selectedRoom ? (
          <MapRoomInfo room={selectedRoom} onBack={backToMap} />
        ) : library.zemelapis ? (
          <MapView
            key={library.id}
            svgUrl={library.zemelapis}
            rooms={libraryRooms}
            floor={library.aukstas}
            onSelect={selectRoom}
          />
        ) : (
          <div className="map-status">
            <p>Šios bibliotekos žemėlapis bus pridėtas vėliau.</p>
            <div className="map-room-links">
              {libraryRooms.map((room) => (
                <button key={room.id} type="button" className="btn btn-outline" onClick={() => selectRoom(room)}>
                  {room.pavadinimas}, {room.nr}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="map-libraries" role="group" aria-label="Bibliotekos">
        {data.bibliotekos.map((lib) => (
          <button
            key={lib.id}
            type="button"
            className={`map-lib${lib.id === library.id ? ' map-lib-active' : ''}`}
            aria-pressed={lib.id === library.id}
            onClick={() => selectLibrary(lib.id)}
          >
            {lib.pavadinimas}
          </button>
        ))}
      </div>
    </div>
  )
}

function MapRoomInfo({ room, onBack }) {
  const { user } = useAuth()
  const toast = useToast()
  const { tech, extra } = splitEquipment(room)

  return (
    <div className="map-info">
      <div className="map-info-text">
        <button type="button" className="map-back" onClick={onBack}>
          ← Atgal į žemėlapį
        </button>

        <h1>
          {room.pavadinimas}, {room.nr}
        </h1>

        <dl>
          <div>
            <dt>Talpa:</dt>
            <dd>{peopleLabel(room.talpa)}</dd>
          </div>
          <div>
            <dt>Įranga:</dt>
            <dd>{tech.length > 0 ? tech.join(', ') : 'Nėra'}</dd>
          </div>
          {extra.length > 0 && (
            <div>
              <dt>Papildomi įrankiai:</dt>
              <dd>{extra.join(', ').toLowerCase()}</dd>
            </div>
          )}
        </dl>

        {user ? (
          <button type="button" className="btn btn-orange" onClick={() => toast.info('Rezervavimas bus pridėtas kitame etape.')}>
            Rezervuoti
          </button>
        ) : (
          <>
            <p className="map-info-note">Norėdami rezervuoti darbo kambarį, prisijunkite prie sistemos.</p>
            <Link to="/prisijungti" className="btn btn-outline">
              Prisijungti
            </Link>
          </>
        )}
      </div>

      <div className="map-info-layout">
        <RoomLayout room={room} />
      </div>
    </div>
  )
}
