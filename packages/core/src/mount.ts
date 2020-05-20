import {
  CNode,
  CSSRenderInstance,
  CRenderProps
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
function _sc (el: HTMLStyleElement, count: number | null): void {
  if (count === null) {
    el.removeAttribute('mount-count')
  } else {
    el.setAttribute('mount-count', String(count))
  }
}

export {
  _gc, _sc
}

/** unmount */
export function _u (
  intance: CSSRenderInstance,
  node: CNode,
  target: HTMLStyleElement | string | number | undefined,
  count: boolean
): void {
  const els = node.els
  if (target === undefined) {
    els.forEach(_re)
    node.els = []
  } else if (typeof target === 'string' || typeof target === 'number') {
    const targetElement = _qe(target)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (targetElement && els.includes(targetElement)) {
      const mountCount = _gc(targetElement)
      if (!count || mountCount <= 1) {
        _re(targetElement)
        node.els = els.filter(el => el !== targetElement)
      } else {
        _sc(targetElement, mountCount - 1)
      }
    }
  } else {
    const mountCount = _gc(target)
    if (!count || mountCount <= 1) {
      _sc(target, null)
      target.innerHTML = ''
    } else {
      _sc(target, mountCount - 1)
    }
  }
}

/** add element */
function _ae (els: HTMLStyleElement[], target: HTMLStyleElement): void {
  if (!els.includes(target)) {
    els.push(target)
  }
}

/** mount */
export function _m<T extends CRenderProps> (
  instance: CSSRenderInstance,
  node: CNode,
  target: HTMLStyleElement | string | number | undefined,
  props: T,
  count: boolean
): HTMLStyleElement {
  let targetElement: HTMLStyleElement | null = null
  const els = node.els
  if (target === undefined) {
    targetElement = document.createElement('style')
    document.head.appendChild(targetElement)
    _ae(els, targetElement)
  } else if (typeof target === 'string' || typeof target === 'number') {
    targetElement = _qe(target)
    if (targetElement === null) {
      targetElement = _ce(target)
      document.head.appendChild(targetElement)
      if (count) {
        _sc(targetElement, 1)
      }
      _ae(els, targetElement)
    } else {
      if (count) {
        _sc(targetElement, _gc(targetElement) + 1)
      }
      _ae(els, targetElement)
      return targetElement
    }
  } else {
    targetElement = target
    const mountCount = _gc(targetElement)
    if (mountCount > 0) {
      if (count) {
        _sc(targetElement, mountCount + 1)
      }
      return target
    } else if (count) {
      _sc(targetElement, 1)
    }
  }
  const style = node.render(props)
  if (targetElement.innerHTML !== style) {
    targetElement.innerHTML = style
  }
  return targetElement
}
