import {
  CNode
} from './types'
import {
  h,
  createCNode
} from './h'
import {
  render
} from './render'
import {
  mount
} from './mount'

export interface CSSRenderInstance {
  context: {
    [key: string]: any
  }
  h: createCNode
  render: (node: CNode) => string
  mount: (nodes: CNode[] | CNode, id: string | number) => void
  use: (plugin: CSSRenderPlugin, ...args: any[]) => void
}

export interface CSSRenderPlugin {
  install: (instance: CSSRenderInstance, ...args: any[]) => void
  [key: string]: any
}

export function CSSRender (): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    h,
    render: (node: CNode) => render(node, cssr),
    mount: (nodes: CNode[] | CNode, id: string | number) => mount(nodes, id, cssr),
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    context: {}
  }
  return cssr
}
