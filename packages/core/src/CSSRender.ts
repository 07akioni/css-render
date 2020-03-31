import {
  CNode,
  CSSRenderConfig,
  CSSRenderInstance,
  createCNode,
  CSSRenderPlugin
} from './types'
import {
  h
} from './h'
import {
  mount
} from './mount'

export function CSSRender (config: CSSRenderConfig = {
  preserveEmptyBlock: false
}): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    h: ((...args: any[]) => h(cssr, ...args as [any, any, any])) as createCNode,
    mount: (nodes: CNode[] | CNode, id: string | number) => mount(nodes, id, cssr),
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    id: Math.random().toString(36).slice(2, 10),
    context: {},
    config
  }
  return cssr
}
