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
    h: ((...args: any[]) => h(cssr, args[0], args[1], args[2])) as createCNode,
    mount: (nodes: CNode[] | CNode, id: string | number) => mount(nodes, id, cssr),
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    id: Math.random().toString(36).slice(2, 10),
    context: {},
    config
  }
  return cssr
}
