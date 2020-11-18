import {
  CNode,
  CssRenderInstance,
  CRenderProps,
  MountTarget
} from './types'

import {
  createElement, queryElement, removeElement
} from './utils'

function getCount (el: HTMLStyleElement): number | null {
  const count = el.getAttribute('mount-count')
  if (count === null) return null
  return Number(count)
}

function setCount (el: HTMLStyleElement, count: number): void {
  el.setAttribute('mount-count', String(count))
}

export {
  getCount, setCount
}

export function unmount (
  intance: CssRenderInstance,
  node: CNode,
  target: MountTarget,
  count: boolean
): void {
  const { els } = node
  // If target is undefined, unmount all styles
  if (target === undefined) {
    els.forEach(removeElement)
    node.els = []
  } else {
    const targetElement = queryElement(target)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (targetElement && els.includes(targetElement)) {
      const mountCount = getCount(targetElement)
      if (!count) {
        if (mountCount !== null) {
          console.error(`[css-render/unmount]: The style with target='${target}' is mounted in no-count mode.`)
        } else {
          removeElement(targetElement)
          node.els = els.filter(el => el !== targetElement)
        }
      } else {
        if (mountCount === null) {
          console.error(`[css-render/unmount]: The style with target='${target}' is mounted in count mode.`)
        } else {
          if (mountCount <= 1) {
            removeElement(targetElement)
            node.els = els.filter(el => el !== targetElement)
          }
          else setCount(targetElement, mountCount - 1)
        }
      }
    }
  }
}

function addElementToList (els: HTMLStyleElement[], target: HTMLStyleElement): void {
  els.push(target)
}

export function mount<T extends CRenderProps> (
  instance: CssRenderInstance,
  node: CNode,
  target: MountTarget,
  props: T,
  count: boolean
): HTMLStyleElement {
  let targetElement: HTMLStyleElement | null = null
  const { els } = node
  if (target === undefined) {
    targetElement = document.createElement('style')
    document.head.appendChild(targetElement)
    addElementToList(els, targetElement)
  } else {
    targetElement = queryElement(target)
    if (targetElement === null) {
      targetElement = createElement(target)
      document.head.appendChild(targetElement)
      if (count) {
        setCount(targetElement, 1)
      }
      addElementToList(els, targetElement)
    } else {
      const mountCount = getCount(targetElement)
      if (count) {
        if (mountCount === null) {
          console.error(`[css-render/mount]: The style with target='${target}' has been mounted in no-count mode.`)
        } else {
          setCount(targetElement, mountCount + 1)
        }
      } else {
        if (mountCount !== null) {
          console.error(`[css-render/mount]: The style with target='${target}' has been mounted in count mode.`)
        }
      }
      return targetElement
    }
  }
  // not rendered
  const style = node.render(props)
  if (targetElement.textContent !== style) {
    targetElement.textContent = style
  }
  return targetElement
}
