import { useState } from 'react'
import './RoomLayout.css'

/**
 * Kambario išdėstymo maketas (stalai, kėdės). Failas dedamas čia:
 *   frontend/public/maps/rooms/<bibliotekos_id>/<kambario_nr>.svg
 *   pvz.: frontend/public/maps/rooms/1/211.svg
 * Kol failo nėra – rodomas rudas langelis su užrašu.
 */
export function RoomLayout({ room }) {
  const src = `/maps/rooms/${room.bibliotekos_id}/${encodeURIComponent(room.nr)}.svg`
  const [failedSrc, setFailedSrc] = useState(null)
  const missing = failedSrc === src

  return (
    <div className="room-layout">
      {missing ? (
        <p>Kambario išdėstymas bus pridėtas vėliau.</p>
      ) : (
        <img src={src} alt={`Kambario ${room.nr} išdėstymas`} onError={() => setFailedSrc(src)} />
      )}
      <span className="room-layout-nr">{room.nr}</span>
    </div>
  )
}
