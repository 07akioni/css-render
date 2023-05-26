/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import hash from './hash'
import {
  CNode,
  CssRenderInstance,
  CRenderProps,
  MountId,
  SsrAdapter
} from './types'
import { createElement, queryElement, removeElement } from './utils'

if (typeof window !== 'undefined') {
  (window as any).__cssrContext = {}
}

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
      node.els = els.filter((el) => el !== target)
    }
  }
}

function addElementToList (
  els: HTMLStyleElement[],
  target: HTMLStyleElement
): void {
  els.push(target)
}

function mount (
  instance: CssRenderInstance,
  node: CNode,
  id: MountId,
  props: CRenderProps,
  head: boolean,
  force: boolean,
  anchorMetaName: string | undefined,
  ssrAdapter: SsrAdapter
): void
function mount (
  instance: CssRenderInstance,
  node: CNode,
  id: MountId,
  props: CRenderProps,
  head: boolean,
  force: boolean,
  anchorMetaName: string | undefined,
  ssrAdapter?: undefined
): HTMLStyleElement
function mount (
  instance: CssRenderInstance,
  node: CNode,
  id: MountId,
  props: CRenderProps,
  head: boolean,
  force: boolean,
  anchorMetaName: string | undefined,
  ssrAdapter?: SsrAdapter
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): HTMLStyleElement | void
function mount (
  instance: CssRenderInstance,
  node: CNode,
  id: MountId,
  props: CRenderProps,
  head: boolean,
  force: boolean,
  anchorMetaName: string | undefined,
  ssrAdapter?: SsrAdapter
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): HTMLStyleElement | void {
  let style: string | undefined
  if (id === undefined) {
    style = node.render(props)
    id = hash(style)
  }
  if (ssrAdapter) {
    ssrAdapter.adapter(id, style ?? node.render(props))
    return
  }
  const queriedTarget = queryElement(id)
  if (queriedTarget !== null && !force) {
    return queriedTarget
  }
  const target = queriedTarget ?? createElement(id)
  if (style === undefined) style = node.render(props)
  target.textContent = style
  if (queriedTarget !== null) return queriedTarget
  if (anchorMetaName) {
    const anchorMetaEl = document.head.querySelector(
      `meta[name="${anchorMetaName}"]`
    )
    if (anchorMetaEl) {
      document.head.insertBefore(target, anchorMetaEl)
      addElementToList(node.els, target)
      return target
    }
  }

  if (head) {
    const firstStyleOrLinkEl = document.head.querySelector('style, link')
    // ensure Target and firstStyleOrLinkEl are under the same parent node
    if (firstStyleOrLinkEl?.parentNode) {
      firstStyleOrLinkEl.parentNode.insertBefore(target, firstStyleOrLinkEl)
    } else {
      document.head.appendChild(target)
    }
  } else {
    document.head.appendChild(target)
  }
  addElementToList(node.els, target)
  return target
}

export { mount }
