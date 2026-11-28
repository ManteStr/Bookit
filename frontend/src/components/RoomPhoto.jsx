import { useState } from 'react'
import { roomImageUrl } from '../lib/rooms.js'
import './RoomPhoto.css'

// Kambario nuotrauka; jei jos nėra arba nepavyksta užkrauti – pilkas pakaitinis blokas.
export function RoomPhoto({ room }) {
  const src = roomImageUrl(room.nuotrauka)
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src || failedSrc === src) {
    return (
      <div className="room-photo room-photo-empty" role="img" aria-label="Nuotrauka bus pridėta vėliau">
        <span>Nuotrauka bus pridėta</span>
      </div>
    )
  }

  return (
    <img
      className="room-photo"
      src={src}
      alt={`${room.pavadinimas}, ${room.nr}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
    />
  )
}
