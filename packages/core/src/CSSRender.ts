import {
  CSSRenderConfig,
  CSSRenderInstance,
  createCNode,
  CSSRenderPlugin
} from './types'
import {
  c
} from './c'
import {
  queryElement
} from './utils'

export function CSSRender (config: CSSRenderConfig = {
  preserveEmptyBlock: false
}): CSSRenderInstance {
  const cssr: CSSRenderInstance = {
    c: (
      (...args: any[]) => c(cssr, ...args as [any, any, any])
    ) as createCNode,
    use: (plugin: CSSRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    find: queryElement,
    context: {},
    config
  }
  return cssr
}
