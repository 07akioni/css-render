/* remove el */
export function _re (el: HTMLStyleElement | null): void {
  /* istanbul ignore if */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!el) return
  const parentElement = el.parentElement
  /* istanbul ignore else */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (parentElement) parentElement.removeChild(el)
}

/** query element */
export function _qe (id: string | number): HTMLStyleElement | null {
  return document.querySelector(`style[cssr-id="${String(id)}"]`)
}

/** create element */
export function _ce (id: string | number): HTMLStyleElement {
  const el = document.createElement('style')
  el.setAttribute('cssr-id', String(id))
  return el
}
