import { useCallback, useRef, useState } from 'react'
import { useDismiss } from '../hooks/useDismiss.js'
import { EMPTY_FILTERS, countFilters } from '../lib/rooms.js'
import './RoomFilter.css'

function FunnelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 5h18l-7 8v6l-4 2v-8z" />
    </svg>
  )
}

// Pridėti arba išimti reikšmę iš sąrašo.
const toggleIn = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

/**
 * Filtro mygtukas + iškrentantis langas.
 *  applied  – šiuo metu pritaikyti filtrai (rodomi kambariai)
 *  onApply  – iškviečiama paspaudus TAIKYTI
 * Pakeitimai lange (draft) pritaikomi tik paspaudus TAIKYTI.
 */
export function RoomFilter({ libraries, equipment, maxCapacity, applied, onApply }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(applied)
  const rootRef = useRef(null)

  const close = useCallback(() => setOpen(false), [])
  useDismiss(rootRef, open, close)

  const appliedCount = countFilters(applied)

  function toggleOpen() {
    if (!open) setDraft(applied) // atidarant rodome tai, kas dabar pritaikyta
    setOpen((v) => !v)
  }

  function apply() {
    onApply(draft)
    setOpen(false)
  }

  function clearAll() {
    setDraft(EMPTY_FILTERS)
    onApply(EMPTY_FILTERS)
    setOpen(false)
  }

  const allLibraries = draft.libraries.length === 0

  return (
    <div className="filter" ref={rootRef}>
      <button
        type="button"
        className={`filter-btn${appliedCount > 0 ? ' filter-btn-active' : ''}`}
        aria-expanded={open}
        onClick={toggleOpen}
      >
        <span>{appliedCount > 0 ? `Pritaikyta filtrų: ${appliedCount}` : 'Nėra pritaikytų filtrų'}</span>
        <FunnelIcon />
      </button>

      {open && (
        <div className="filter-panel" role="dialog" aria-label="Filtras">
          <h2>Filtras</h2>

          <fieldset>
            <legend>Filialai</legend>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={allLibraries}
                onChange={() => setDraft((d) => ({ ...d, libraries: [] }))}
              />
              Visi
            </label>
            {libraries.map((lib) => (
              <label key={lib.id} className="filter-check filter-check-sub">
                <input
                  type="checkbox"
                  checked={draft.libraries.includes(lib.id)}
                  onChange={() => setDraft((d) => ({ ...d, libraries: toggleIn(d.libraries, lib.id) }))}
                />
                {lib.pavadinimas}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Talpa</legend>
            <label htmlFor="filter-capacity" className="filter-capacity-label">
              Nuo <strong>{draft.minCapacity}</strong> {draft.minCapacity === 1 ? 'vietos' : 'vietų'}
            </label>
            <input
              id="filter-capacity"
              type="range"
              min={1}
              max={maxCapacity}
              step={1}
              value={draft.minCapacity}
              onChange={(e) => setDraft((d) => ({ ...d, minCapacity: Number(e.target.value) }))}
            />
            <div className="filter-range-ends" aria-hidden="true">
              <span>1</span>
              <span>{maxCapacity}</span>
            </div>
          </fieldset>

          <fieldset>
            <legend>Įranga</legend>
            {equipment.map((item) => (
              <label key={item.id} className="filter-check">
                <input
                  type="checkbox"
                  checked={draft.equipment.includes(item.id)}
                  onChange={() => setDraft((d) => ({ ...d, equipment: toggleIn(d.equipment, item.id) }))}
                />
                {item.pavadinimas}
              </label>
            ))}
          </fieldset>

          <div className="filter-actions">
            <button type="button" className="btn btn-green" onClick={apply}>
              Taikyti
            </button>
            <button type="button" className="filter-clear" onClick={clearAll}>
              Išvalyti
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
