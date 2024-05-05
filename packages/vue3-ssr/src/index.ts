import { inject, InjectionKey, App } from 'vue'

interface CssrSsrContext {
  styles: string[]
  ids: Set<string>
}

const ssrContextKey =
  '@css-render/vue3-ssr' as unknown as InjectionKey<CssrSsrContext>

function createStyleString (id: string, style: string): string {
  return `<style cssr-id="${id}">\n${style}\n</style>`
}

function ssrAdapter (
  id: string,
  style: string,
  ssrContext: CssrSsrContext
): void {
  const { styles, ids } = ssrContext
  // we need to impl other options to make it behaves the same as the client side
  if (ids.has(id)) return
  if (styles !== null) {
    ids.add(id)
    styles.push(createStyleString(id, style))
  }
}

const isBrowser = typeof document !== 'undefined'

export function useSsrAdapter ():
| {
  adapter: (id: string, style: string) => void
  context: CssrSsrContext
}
| undefined {
  if (isBrowser) return undefined
  const context = inject(ssrContextKey, null)
  if (context === null) return undefined
  return {
    adapter: (id, style) => ssrAdapter(id, style, context),
    context
  }
}

interface SsrHandle {
  collect: () => string
}

export function setup (app: App): SsrHandle {
  const styles: string[] = []
  const ssrContext: CssrSsrContext = {
    styles,
    ids: new Set<string>()
  }
  app.provide(ssrContextKey, ssrContext)
  return {
    collect () {
      const res = styles.join('\n')
      styles.length = 0
      return res
    }
  }
}
