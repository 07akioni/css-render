import {
  CNode,
  CSSRenderInstance
} from './types'

import {
  _ce, _qe
} from './utils'

export function mount (
  instance: CSSRenderInstance,
  node: CNode,
  target?: HTMLStyleElement | string | number
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
    }
  } else {
    targetElement = target
  }
  const style = node.render()
  if (targetElement.innerHTML !== style) {
    targetElement.innerHTML = style
  }
  return targetElement
}
