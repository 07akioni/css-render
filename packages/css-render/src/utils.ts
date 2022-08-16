export function removeElement (el: HTMLStyleElement | null): void {
  /* istanbul ignore if */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!el) return
  const parentElement = el.parentElement
  /* istanbul ignore else */
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (parentElement) parentElement.removeChild(el)
}

export function queryElement (id: string): HTMLStyleElement | null {
  return document.head.querySelector(`style[cssr-id="${id}"]`)
}

export function createElement (id: string): HTMLStyleElement {
  const el = document.createElement('style')
  el.setAttribute('cssr-id', id)
  return el
}

export function isMediaOrSupports (selector: string | undefined | null): selector is string {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!selector) return false
  return /^\s*@(s|m)/.test(selector)
}
