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
  id: string
  h: createCNode
  render: (node: CNode) => string
  mount: (nodes: CNode[] | CNode, id: string | number) => HTMLStyleElement
  use: (plugin: CSSRenderPlugin, ...args: any[]) => void
  config: CSSRenderConfig
}

export interface CSSRenderPlugin {
  install: (instance: CSSRenderInstance, ...args: any[]) => void
  [key: string]: any
}

interface CSSRenderConfig {
  preserveEmptyBlock: boolean
}

export function CSSRender (config: CSSRenderConfig = {
  preserveEmptyBlock: false
}): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    h,
    render: (node: CNode) => render(node, cssr),
    mount: (nodes: CNode[] | CNode, id: string | number) => mount(nodes, id, cssr),
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    id: Math.random().toString(36).slice(2, 10),
    context: {},
    config
  }
  return cssr
}
