import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { RestrictedDialog } from '../components/RestrictedDialog.jsx'
import { RoomPhoto } from '../components/RoomPhoto.jsx'
import { useToast } from '../components/toast/useToast.js'
import { useRooms } from '../hooks/useRooms.js'
import { equipmentLabel } from '../lib/rooms.js'
import './RoomDetailPage.css'

export default function RoomDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const { data, loading, error, reload } = useRooms()
  const [showDialog, setShowDialog] = useState(false)
  const closeDialog = useCallback(() => setShowDialog(false), [])

  if (loading) return <p className="room-status">Kraunama…</p>

  if (error) {
    return (
      <div className="room-status">
        <p>{error}</p>
        <button type="button" className="btn btn-green" onClick={reload}>
          Bandyti dar kartą
        </button>
      </div>
    )
  }

  const room = data.kambariai.find((r) => String(r.id) === id)
  if (!room) {
    return (
      <div className="room-status">
        <p>Toks kambarys nerastas.</p>
        <Link to="/kambariai" className="btn btn-green">
          Visi kambariai
        </Link>
      </div>
    )
  }

  const library = data.bibliotekos.find((l) => l.id === room.bibliotekos_id)

  function handleReserve() {
    if (!user) {
      setShowDialog(true)
      return
    }
    toast.info('Rezervavimas bus pridėtas kitame etape.')
  }

  return (
    <div className="room-detail">
      <Link to="/kambariai" className="room-back">
        ← Visi kambariai
      </Link>

      <div className="room-detail-grid">
        <div className="room-detail-photo">
          <RoomPhoto room={room} />
        </div>

        <div className="room-detail-info">
          <h1>
            {room.pavadinimas}, {room.nr}
          </h1>
          {library && (
            <p className="room-detail-lib">
              {library.pavadinimas}, {library.adresas}
            </p>
          )}

          <dl className="room-facts">
            <div>
              <dt>Aukštas</dt>
              <dd>{room.aukstas}</dd>
            </div>
            <div>
              <dt>Talpa</dt>
              <dd>{room.talpa}</dd>
            </div>
            <div>
              <dt>Stalų</dt>
              <dd>{room.stalu_sk}</dd>
            </div>
            <div>
              <dt>Kėdžių</dt>
              <dd>{room.kedziu_sk}</dd>
            </div>
          </dl>

          <h2>Įranga</h2>
          {room.iranga.length > 0 ? (
            <ul className="room-equipment">
              {room.iranga.map((item) => (
                <li key={item.id}>{equipmentLabel(item)}</li>
              ))}
            </ul>
          ) : (
            <p className="room-none">Papildomos įrangos nėra.</p>
          )}

          <button type="button" className="btn btn-orange" onClick={handleReserve}>
            Rezervuoti
          </button>
        </div>
      </div>

      {showDialog && <RestrictedDialog onClose={closeDialog} />}
    </div>
  )
}
