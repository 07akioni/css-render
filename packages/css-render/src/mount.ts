/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import hash from './hash'
import { render } from './render'
import {
  CNode,
  CssRenderInstance,
  CRenderProps,
  MountId,
  SsrAdapter
} from './types'
import {
  createElement, queryElement, removeElement
} from './utils'

if (typeof window !== 'undefined') {
  (window as any).__cssrContext = {}
}

type CssrContext = Record<string, boolean>

export function unmount (
  intance: CssRenderInstance,
  node: CNode,
  id: MountId
): void {
  const { els } = node
  // If id is undefined, unmount all styles
  if (id === undefined) {
    els.forEach(removeElement)
    node.els = []
  } else {
    const target = queryElement(id)
    // eslint-disable-next-line
    if (target && els.includes(target)) {
      removeElement(target)
      node.els = els.filter(el => el !== target)
    }
  }
}

function addElementToList (els: HTMLStyleElement[], target: HTMLStyleElement): void {
  els.push(target)
}

function mount<T extends CRenderProps, U extends SsrAdapter | undefined = undefined> (
  instance: CssRenderInstance,
  node: CNode,
  id: MountId,
  props: T,
  head: boolean,
  slient: boolean,
  force: boolean,
  ssrAdapter?: U
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): U extends undefined ? HTMLStyleElement : void {
  if (slient && !ssrAdapter) {
    if (id === undefined) {
      // it is possible to use hash to get rid of the requirements of id
      // if you are interested in it, please create a pr
      // i have no time to impl it
      console.error('[css-render/mount]: `id` is required in `slient` mode.')
      // @ts-expect-error
      return
    }
    const cssrContext: CssrContext = (window as any).__cssrContext
    if (!cssrContext[id]) {
      cssrContext[id] = true
      render(node, instance, props, slient)
    }
    // @ts-expect-error
    return
  }
  let style: string | undefined
  if (id === undefined) {
    style = node.render(props)
    id = hash(style)
  }
  if (ssrAdapter) {
    ssrAdapter(id, style ?? node.render(props))
    // @ts-expect-error
    return
  }
  const queriedTarget = queryElement(id)
  if (queriedTarget !== null && !force) {
    // @ts-expect-error
    return queriedTarget
  }
  const target = queriedTarget ?? createElement(id)
  if (style === undefined) style = node.render(props)
  target.textContent = style
  // @ts-expect-error
  if (queriedTarget !== null) return queriedTarget
  if (head) {
    const firstStyleEl = document.head.getElementsByTagName('style')[0] || null as (HTMLStyleElement | null)
    document.head.insertBefore(target, firstStyleEl)
  } else {
    document.head.appendChild(target)
  }
  addElementToList(node.els, target)
  // @ts-expect-error
  return queriedTarget ?? target
}

export { mount }
