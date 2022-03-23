# @css-render/vue3-ssr

## Example

### Server

```js
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { setup } = from '@css-render/vue3-ssr'

// For each request, you need to create a new app
const ssrApp = createSSRApp(App)
const { collect } = setup(ssrApp)

renderToString(ssrApp).then(appHtml => {
  const css = collect()
  const page = `<!DOCTYPE html>
  <html>
    <head>${css}</head>
    <body><div id="app">${appHtml}</div></body>
  </html>`
})
```

### Component

```js
import { defineComponent } from 'vue'
import { useSsrAdapter } from '@css-render/vue3-ssr'

const Child = defineComponent({
  setup() {
    c("div", {
      color: "red",
    }).mount({
      id: "mount-id",
      // It always returns undefined in browser (document === undefined)
      ssr: useSsrAdapter(),
    });
  },
  render() {
    return h("div", null, "Child");
  },
});
```
