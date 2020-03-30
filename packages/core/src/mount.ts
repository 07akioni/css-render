import {
  CNode
} from './types'
import { CSSRenderInstance } from './CSSRender'

export function mount (
  nodes: CNode[] | CNode,
  id: string | number,
  instance: CSSRenderInstance
): HTMLStyleElement {
  let targetElement = document.querySelector(`style[css-render-id="${id}"][css-render-ns="${instance.id}]"`) as HTMLStyleElement
  if (targetElement === null) {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('css-render-id', String(id))
    styleElement.setAttribute('css-render-ns', String(instance.id))
    targetElement = styleElement
    document.head.appendChild(targetElement)
  }
  const style = Array.isArray(nodes)
    ? nodes.map(node => node.render()).join('\n')
    : nodes.render()
  if (targetElement.innerHTML !== style) {
    targetElement.innerHTML = style
  }
  return targetElement
}
