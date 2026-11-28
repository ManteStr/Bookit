import { useEffect, useMemo, useRef, useState } from 'react'
import { prepareSvg } from '../lib/map.js'
import './MapView.css'

// "room-211" arba "label-211" -> "211"
const ROOM_ID = /^(?:room|label)-(.+)$/

/**
 * Interaktyvus bibliotekos aukšto planas iš SVG failo.
 *
 * SVG failo reikalavimai (kaip sutarta su Figma eksportu):
 *   room-<nr>      – kambario plotas (pvz. room-211), nr sutampa su kambariai.kambario_nr
 *   label-<nr>     – kambario numerio užrašas
 *   arrow-<nr>-<n> – rodyklės, rodomos užvedus kambarį
 *
 * Šį komponentą reikia kurti su key={bibliotekos_id}, kad keičiantis bibliotekai
 * viskas užsikrautų iš naujo.
 */
export function MapView({ svgUrl, rooms, floor, onSelect }) {
  const [markup, setMarkup] = useState(null)
  const [failed, setFailed] = useState(false)
  const [hover, setHover] = useState(null) // { nr, left, top, side }
  const wrapRef = useRef(null)

  const roomsByNr = useMemo(() => new Map(rooms.map((room) => [String(room.nr), room])), [rooms])

  // 1) Užkrauname SVG failą
  useEffect(() => {
    let cancelled = false
    fetch(svgUrl)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error('not ok'))))
      .then((text) => {
        const prepared = prepareSvg(text)
        if (cancelled) return
        if (prepared) setMarkup(prepared)
        else setFailed(true)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [svgUrl])

  // 2) Pažymime, kurie SVG kambariai yra "gyvi" (yra DB ir aktyvūs)
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !markup) return
    wrap.querySelectorAll('[id^="room-"]').forEach((el) => {
      const nr = el.id.slice('room-'.length)
      el.dataset.interactive = roomsByNr.has(nr) ? 'true' : 'false'
    })
  }, [markup, roomsByNr])

  // 3) Užvedus kambarį: jis parudėja, parodomos jo rodyklės
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !markup) return
    wrap.querySelectorAll('[id^="room-"]').forEach((el) => {
      el.dataset.active = hover && el.id === `room-${hover.nr}` ? 'true' : 'false'
    })
    wrap.querySelectorAll('[id^="arrow-"]').forEach((el) => {
      el.style.opacity = hover && el.id.startsWith(`arrow-${hover.nr}-`) ? '1' : '0'
    })
  }, [hover, markup])

  // Ar žymeklis ant kokio nors žinomo kambario?
  function roomFromEvent(event) {
    const el = event.target instanceof Element ? event.target.closest('[id^="room-"], [id^="label-"]') : null
    const match = el ? ROOM_ID.exec(el.id) : null
    return match && roomsByNr.has(match[1]) ? roomsByNr.get(match[1]) : null
  }

  function handleOver(event) {
    const room = roomFromEvent(event)
    if (!room) {
      setHover(null)
      return
    }
    const nr = String(room.nr)
    if (hover && hover.nr === nr) return

    // Paaiškinimo langelio vieta: kairėje nuo kambario (arba dešinėje, jei kairėje nepakanka vietos)
    const wrap = wrapRef.current
    const target = wrap.querySelector(`[id="room-${CSS.escape(nr)}"]`)
    if (!target) return
    const box = target.getBoundingClientRect()
    const area = wrap.getBoundingClientRect()
    const side = box.left - area.left > 240 ? 'left' : 'right'
    setHover({
      nr,
      side,
      top: box.top - area.top,
      left: side === 'left' ? box.left - area.left - 12 : box.right - area.left + 12,
    })
  }

  function handleClick(event) {
    const room = roomFromEvent(event)
    if (room) onSelect(room)
  }

  if (failed) {
    return <p className="map-message">Nepavyko užkrauti žemėlapio.</p>
  }
  if (!markup) {
    return <p className="map-message">Kraunamas žemėlapis…</p>
  }

  const hoveredRoom = hover ? roomsByNr.get(hover.nr) : null

  return (
    <div className="map-wrap">
      {floor && <span className="map-floor">{floor} aukštas</span>}

      {/* SVG yra mūsų pačių failas (išvalytas prepareSvg), todėl jį galima įterpti */}
      <div
        ref={wrapRef}
        className="map-svg"
        onMouseOver={handleOver}
        onMouseLeave={() => setHover(null)}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: markup }}
      />

      {hoveredRoom && (
        <div className={`map-tip map-tip-${hover.side}`} style={{ top: hover.top, left: hover.left }}>
          <strong>
            {hoveredRoom.pavadinimas}, {hoveredRoom.nr}
          </strong>
          <span>Spustelėkite, norėdami pamatyti daugiau informacijos</span>
        </div>
      )}

      {/* Klaviatūrai ir ekrano skaitytuvams: tie patys kambariai kaip mygtukai */}
      <ul className="sr-only">
        {rooms.map((room) => (
          <li key={room.id}>
            <button type="button" onClick={() => onSelect(room)}>
              {room.pavadinimas}, {room.nr}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
