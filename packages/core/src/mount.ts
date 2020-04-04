import {
  CNode,
  CSSRenderInstance
} from './types'

import {
  _ce, _qe, _re
} from './utils'

/** get count of element */
function _gc (el: HTMLStyleElement): number {
  const count = el.getAttribute('mount-count')
  if (count === null) return 0
  return Number(count)
}
/** set count of element */
function _sc (el: HTMLStyleElement, count: number): void {
  el.setAttribute('mount-count', String(count))
}

export {
  _gc, _sc
}

/** unmount */
export function _u (
  intance: CSSRenderInstance,
  node: CNode,
  target: HTMLStyleElement | string | number | undefined
): void {
  const els = node.els
  if (target === undefined) {
    els.forEach(_re)
    node.els = []
  } else if (typeof target === 'string' || typeof target === 'number') {
    const targetElement = _qe(target)
    if (targetElement !== null && els.includes(targetElement)) {
      const mountCount = _gc(targetElement)
      if (mountCount === 1) {
        _re(targetElement)
        node.els = els.filter(el => el !== targetElement)
      } else {
        _sc(targetElement, mountCount - 1)
      }
    }
  } else if (els.includes(target)) {
    const mountCount = _gc(target)
    if (mountCount === 1) {
      _re(target)
      node.els = els.filter(el => el !== target)
    } else {
      _sc(target, mountCount - 1)
    }
  }
}

/** mount */
export function _m (
  instance: CSSRenderInstance,
  node: CNode,
  target: HTMLStyleElement | string | number | undefined,
  props: any
): HTMLStyleElement {
  let targetElement: HTMLStyleElement | null = null
  if (target === undefined) {
    targetElement = document.createElement('style')
    document.head.appendChild(targetElement)
  } else if (typeof target === 'string' || typeof target === 'number') {
    targetElement = _qe(target)
    if (targetElement === null) {
      targetElement = _ce(target)
      document.head.appendChild(targetElement)
      _sc(targetElement, 1)
    } else {
      _sc(targetElement, _gc(targetElement) + 1)
      return targetElement
    }
  } else {
    targetElement = target
    const mountCount = _gc(targetElement)
    if (mountCount > 0) {
      _sc(targetElement, mountCount + 1)
    } else {
      return targetElement
    }
  }
  const style = node.render(props)
  if (targetElement.innerHTML !== style) {
    targetElement.innerHTML = style
  }
  return targetElement
}
