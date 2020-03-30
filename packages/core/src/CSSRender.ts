import {
  CNode,
  CSelector,
  CProperties
} from './types'
import {
  h
} from './h'
import {
  mount
} from './mount'

export interface createCNode {
  (path: string | CSelector): CNode
  (path: string | CSelector, children: CNode[]): CNode
  (path: string | CSelector, properties: CProperties): CNode
  (path: string | CSelector, properties: CProperties, children: CNode[]): CNode
}

export interface CSSRenderInstance {
  context: {
    [key: string]: any
  }
  id: string
  h: createCNode
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
    h: ((...args: any[]) => h(cssr, args[0], args[1], args[2])) as createCNode,
    mount: (nodes: CNode[] | CNode, id: string | number) => mount(nodes, id, cssr),
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    id: Math.random().toString(36).slice(2, 10),
    context: {},
    config
  }
  return cssr
}
