import {
  CSSRenderConfig,
  CSSRenderInstance,
  createCNode,
  CSSRenderPlugin,
  CSelector
} from './types'
import {
  c
} from './c'

export function CSSRender (config: CSSRenderConfig = {
  preserveEmptyBlock: false
}): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    c: (
      (...args: any[]) => c(cssr, ...args as [any, any, any])
    ) as createCNode<CSelector>,
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    context: {},
    config
  }
  return cssr
}
