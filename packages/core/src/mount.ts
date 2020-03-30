import {
  CNode
} from './types'
import { CSSRenderInstance } from './CSSRender'

export function mount (
  nodes: CNode[] | CNode,
  id: string | number,
  instance: CSSRenderInstance
): void {
  let targetElement = document.querySelector(`[css-render-id=${id}][css-render-ns=${instance.id}]`)
  if (targetElement === null) {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('css-render-id', String(id))
    styleElement.setAttribute('css-render-ns', String(instance.id))
    targetElement = styleElement
  }
  const style = Array.isArray(nodes)
    ? nodes.map(node => instance.render(node)).join('\n')
    : instance.render(nodes)
  if (targetElement.innerHTML !== style) {
    targetElement.innerHTML = style
  }
}
