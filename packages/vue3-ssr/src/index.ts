import { defineComponent, provide, inject, InjectionKey, App } from 'vue'

const ssrContextKey: InjectionKey<string[]> = Symbol('@css-render/vue3-ssr')

function createStyleString (id: string, style: string): string {
  return `<style cssr-id="${id}">\n${style}\n</style>`
}

export function ssrAdapter (id: string, style: string): void {
  const styles = inject(ssrContextKey, null)
  if (styles !== null) {
    styles.push(createStyleString(id, style))
  }
}

export const SsrContext = defineComponent({
  name: 'CssRenderVue3SsrContext',
  setup () {
    const styles: string[] = []
    provide(ssrContextKey, styles)
    return {
      styles
    }
  },
  render () {
    const { $slots } = this
    return $slots.default?.()
  }
})

export function collect (app: App): string {
  return ''
}
