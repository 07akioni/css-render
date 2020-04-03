import {
  CSSRenderConfig,
  CSSRenderInstance,
  createCNode,
  CSSRenderPlugin
} from './types'
import {
  h
} from './h'

export function CSSRender (config: CSSRenderConfig = {
  preserveEmptyBlock: false
}): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    h: ((...args: any[]) => h(cssr, ...args as [any, any, any])) as createCNode,
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    id: Math.random().toString(36).slice(2, 10),
    context: {},
    config
  }
  return cssr
}
