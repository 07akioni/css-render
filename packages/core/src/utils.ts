/* remove el */
export function _re (el: HTMLStyleElement | null): void {
  if (el === null) return
  const parentElement = el.parentElement
  if (parentElement !== null) parentElement.removeChild(el)
}

/** query element */
export function _qe (id: string | number): HTMLStyleElement | null {
  return document.querySelector(`style[css-render-id="${String(id)}"]`)
}

/** create element */
export function _ce (id: string | number): HTMLStyleElement {
  const el = document.createElement('style')
  el.setAttribute('css-render-id', String(id))
  return el
}
