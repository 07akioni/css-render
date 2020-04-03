import {
  CSSRenderConfig,
  CSSRenderInstance,
  createCNode,
  CSSRenderPlugin
} from './types'
import {
  c
} from './c'

export function CSSRender (config: CSSRenderConfig = {
  preserveEmptyBlock: false
}): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    c: ((...args: any[]) => c(cssr, ...args as [any, any, any])) as createCNode,
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    id: Math.random().toString(36).slice(2, 10),
    context: {},
    config
  }
  return cssr
}
