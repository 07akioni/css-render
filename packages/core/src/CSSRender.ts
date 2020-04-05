import {
  CSSRenderConfig,
  CSSRenderInstance,
  createCNode,
  CSSRenderPlugin,
  CNodeOptions
} from './types'
import {
  c
} from './c'

export function CSSRender (config: CSSRenderConfig = {
  preserveEmptyBlock: false
}): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    c: ((...args: any[]) => c(cssr, ...args as [any, any, any])) as createCNode<string | CNodeOptions>,
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    context: {},
    config
  }
  return cssr
}
