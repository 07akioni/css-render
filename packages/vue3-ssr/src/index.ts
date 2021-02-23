import { defineComponent, provide, inject, InjectionKey, renderSlot, Fragment, h } from 'vue'

interface StyleVNodeProps {
  class: string
  innerHTML: string
}

const ssrContextKey: InjectionKey<StyleVNodeProps> = Symbol('@css-render/vue3-ssr')

function createStyleString (id: string, style: string) {
  return `<style cssr-id="${id}">\n${style}\n</style>`
}

export function ssrAdapter (id: string, style: string): void {
  const styleVNodeProps = inject(ssrContextKey)
  if (styleVNodeProps) {
    styleVNodeProps.innerHTML += createStyleString(id, style)
  }
}

export const SsrContext = defineComponent({
  name: 'CssRenderVue3SsrContext',
  setup (_, { slots }) {
    const styleVNodeProps: StyleVNodeProps = {
      class: 'cssr-ssr-container',
      innerHTML: ''
    }
    provide(ssrContextKey, styleVNodeProps)
    return () => h(Fragment, null, [
      renderSlot(slots, 'default'),
      h('div', styleVNodeProps)
    ])
  }
})