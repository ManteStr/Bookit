import { Link } from 'react-router-dom'
import { RoomPhoto } from './RoomPhoto.jsx'
import './RoomCard.css'

export function RoomCard({ room }) {
  return (
    <article className="room-card">
      <div className="room-card-media">
        <RoomPhoto room={room} />
        <h3 className="room-card-title">
          {room.pavadinimas}, {room.nr}
        </h3>
      </div>
      <Link to={`/kambariai/${room.id}`} className="room-card-more">
        Plačiau
      </Link>
    </article>
  )
}
