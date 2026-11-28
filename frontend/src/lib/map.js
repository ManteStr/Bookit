// SVG žemėlapio paruošimas rodymui puslapyje.

/**
 * Paverčia SVG tekstą į saugų HTML tekstą, kurį galima įterpti į puslapį:
 *  - pašalina <script> ir on...="" įvykių atributus (saugumas),
 *  - pašalina fiksuotą plotį/aukštį (kad žemėlapis prisitaikytų prie ekrano),
 *  - pašalina baltą foną (Figmos eksportuotas fonas netinka prie puslapio spalvos).
 * Grąžina null, jei tai ne SVG (pvz., serveris grąžino klaidos puslapį).
 */
export function prepareSvg(text) {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
  const svg = doc.documentElement
  if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) return null

  svg.querySelectorAll('script, foreignObject').forEach((el) => el.remove())
  svg.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (attr.name.toLowerCase().startsWith('on')) el.removeAttribute(attr.name)
    }
  })

  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('role', 'img')
  svg.setAttribute('aria-label', 'Bibliotekos aukšto planas')

  // Fono stačiakampiai: pirmas tiesioginis vaikas ir pirmas "Frame" vaikas.
  const firstRect = [...svg.children].find((el) => el.nodeName.toLowerCase() === 'rect')
  if (firstRect) firstRect.remove()
  svg.querySelectorAll(':scope > g > rect:first-child').forEach((rect) => {
    if (rect.getAttribute('fill') === 'white' && !rect.id) rect.remove()
  })

  return new XMLSerializer().serializeToString(svg)
}
