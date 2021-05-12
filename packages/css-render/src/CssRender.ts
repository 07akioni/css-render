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
  let styleSheet: CSSStyleSheet | null = null
  const cssr: CssRenderInstance = {
    c: (
      (...args: any[]) => c(cssr, ...args as [any, any, any])
    ) as createCNode,
    use: (plugin: CssRenderPlugin, ...args: any[]) => plugin.install(cssr, ...args),
    find: queryElement,
    context: {},
    config,
    get __styleSheet () {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!styleSheet) {
        const style = document.createElement('style')
        document.head.appendChild(style)
        styleSheet = document.styleSheets[document.styleSheets.length - 1]
        return styleSheet
      }
      return styleSheet
    }
  }
  return cssr
}
