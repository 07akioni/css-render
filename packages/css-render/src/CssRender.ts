import {
  CssRenderConfig,
  CssRenderInstance,
  createCNode,
  CssRenderPlugin
} from './types'
import {
  c
} from './c'
import {
  queryElement
} from './utils'

export function CssRender (config: CssRenderConfig = {}): CssRenderInstance {
  const cssr: CssRenderInstance = {
    c: (
      (...args: any[]) => c(cssr, ...args as [any, any, any])
    ) as createCNode,
    use: (plugin: CssRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    find: queryElement,
    context: {},
    config
  }
  return cssr
}
