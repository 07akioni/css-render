import hash from './hash'
import {
  CNode,
  CssRenderInstance,
  CRenderProps,
  MountId
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
  id: MountId,
  count: boolean
): void {
  const { els } = node
  // If target is undefined, unmount all styles
  if (id === undefined) {
    els.forEach(removeElement)
    node.els = []
  } else {
    const target = queryElement(id)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (target && els.includes(target)) {
      const mountCount = getCount(target)
      if (!count) {
        if (mountCount !== null) {
          console.error(`[css-render/unmount]: The style with target='${id}' is mounted in no-count mode.`)
        } else {
          removeElement(target)
          node.els = els.filter(el => el !== target)
        }
      } else {
        if (mountCount === null) {
          console.error(`[css-render/unmount]: The style with target='${id}' is mounted in count mode.`)
        } else {
          if (mountCount <= 1) {
            removeElement(target)
            node.els = els.filter(el => el !== target)
          }
          else setCount(target, mountCount - 1)
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
  id: MountId,
  props: T,
  count: boolean
): HTMLStyleElement {
  let target: HTMLStyleElement | null = null
  const { els } = node
  let style: string | undefined
  if (id === undefined) {
    style = node.render(props)
    id = hash(style)
  }
  target = queryElement(id)
  if (target === null) {
    target = createElement(id)
    if (style === undefined) style = node.render(props)
    target.textContent = style
    document.head.appendChild(target)
    if (count) {
      setCount(target, 1)
    }
    addElementToList(els, target)
  } else {
    const mountCount = getCount(target)
    if (count) {
      if (mountCount === null) {
        console.error(`[css-render/mount]: The style with id='${id}' has been mounted in no-count mode.`)
      } else {
        setCount(target, mountCount + 1)
      }
    } else {
      if (mountCount !== null) {
        console.error(`[css-render/mount]: The style with id='${id}' has been mounted in count mode.`)
      }
    }
  }
  return target
}
