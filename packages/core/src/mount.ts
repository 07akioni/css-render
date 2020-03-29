import {
  CNode
} from './types'
import { render } from './render'

export function mount (nodes: CNode[] | CNode, id: string | number): void {
  let targetElement = document.querySelector(`[css-render-id=${id}]`)
  if (targetElement === null) {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('css-render-id', String(id))
    targetElement = styleElement
  }
  const style = Array.isArray(nodes)
    ? nodes.map(node => render(node)).join('\n')
    : render(nodes)
  if (targetElement.innerHTML !== style) {
    targetElement.innerHTML = style
  }
}
