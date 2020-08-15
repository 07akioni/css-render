import {
  CNode,
  CssRenderInstance,
  CRenderProps
} from './types'

import {
  createElement, queryElement, removeElement
} from './utils'

function getCountOfElement (el: HTMLStyleElement): number {
  const count = el.getAttribute('mount-count')
  if (count === null) return 0
  return Number(count)
}

function setCountOfElement (el: HTMLStyleElement, count: number | null): void {
  if (count === null) {
    el.removeAttribute('mount-count')
  } else {
    el.setAttribute('mount-count', String(count))
  }
}

export {
  getCountOfElement, setCountOfElement
}

export function unmount (
  intance: CssRenderInstance,
  node: CNode,
  target: HTMLStyleElement | string | number | undefined,
  count: boolean
): void {
  const els = node.els
  if (target === undefined) {
    els.forEach(removeElement)
    node.els = []
  } else if (typeof target === 'string' || typeof target === 'number') {
    const targetElement = queryElement(target)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (targetElement && els.includes(targetElement)) {
      const mountCount = getCountOfElement(targetElement)
      if (!count || mountCount <= 1) {
        removeElement(targetElement)
        node.els = els.filter(el => el !== targetElement)
      } else {
        setCountOfElement(targetElement, mountCount - 1)
      }
    }
  } else {
    const mountCount = getCountOfElement(target)
    if (!count || mountCount <= 1) {
      setCountOfElement(target, null)
      target.textContent = ''
    } else {
      setCountOfElement(target, mountCount - 1)
    }
  }
}

function addElementToList (els: HTMLStyleElement[], target: HTMLStyleElement): void {
  if (!els.includes(target)) {
    els.push(target)
  }
}

export function mount<T extends CRenderProps> (
  instance: CssRenderInstance,
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
    addElementToList(els, targetElement)
  } else if (typeof target === 'string' || typeof target === 'number') {
    targetElement = queryElement(target)
    if (targetElement === null) {
      targetElement = createElement(target)
      document.head.appendChild(targetElement)
      if (count) {
        setCountOfElement(targetElement, 1)
      }
      addElementToList(els, targetElement)
    } else {
      if (count) {
        setCountOfElement(targetElement, getCountOfElement(targetElement) + 1)
      }
      addElementToList(els, targetElement)
      return targetElement
    }
  } else {
    targetElement = target
    const mountCount = getCountOfElement(targetElement)
    if (mountCount > 0) {
      if (count) {
        setCountOfElement(targetElement, mountCount + 1)
      }
      return target
    } else if (count) {
      setCountOfElement(targetElement, 1)
    }
  }
  const style = node.render(props)
  if (targetElement.textContent !== style) {
    targetElement.textContent = style
  }
  return targetElement
}
