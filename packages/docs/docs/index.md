# css-render &middot; [![GitHub Liscense](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/07akioni/css-render/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/css-render)](https://www.npmjs.com/package/css-render) [![Total alerts](https://img.shields.io/lgtm/alerts/g/07akioni/css-render.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/07akioni/css-render/alerts/) [![codecov](https://codecov.io/gh/07akioni/css-render/branch/master/graph/badge.svg?token=28OJZAHLK4&precision=2)](https://codecov.io/gh/07akioni/css-render)

Generating CSS using JS with considerable flexibility and extensibility, at both server side and client side.

It's mainly built for **library builders** (who wants make their library work without css import at small overhead). It's not recommend to use it in a webapp.

It is not designed to totally replace other style-related solutions, but to be a progressive tool which can just work as a supplementary of your style files or totally replace your `.css` files.

## Docs
[css-render](https://css-render.vercel.app/)

## Why Using It
1. You want to ship a library without css at a small price (gzip < 2kb).
2. Reduce size compared with static css (which contains duplicate logic).
3. You can't write `sass-like` or `less-like` css-in-js (eg. `mixin` in sass or less).
4. You want to write style variables in JS.
5. Support an simple SSR API (now only for vue3).

## Comparasion with other CSS-in-JS framework

Main differences between css-render and styled-component, jss or emotion:
1. It doesn't do the bindings between components and styles. It is more like a style generator with low level mount and unmount API.
2. It's easier to write like a sass mixin or less mixin.


## Examples
### Realword Example
- [XScroll](https://github.com/07akioni/vueuc/blob/main/src/x-scroll/src/index.ts)
- [VirtualList](https://github.com/07akioni/vueuc/blob/main/src/virtual-list/src/VirtualList.ts)

### Basic Example
```bash
$ npm install --save-dev css-render
```
```js
import CssRender from 'css-render'
/**
 * CommonJS:
 * const { CssRender } = require('css-render')
 */

const {
  c
} = CssRender()

const style = c('body', ({ props }) => ({
  margin: 0,
  backgroundColor: props.backgroundColor
}), [
  c('&.dark', {
    backgroundColor: 'black'
  }),
  c('.container', {
    width: '100%'
  })
])

/** use it as string */
console.log(style.render({ backgroundColor: 'white' }))
/**
 * or mount on document.head. (the following lines only work in the browser.)
 */
style.mount()
// ...
style.unmount()
```
```css
body {
  margin: 0;
  background-color: white;
}

body.dark {
  background-color: black;
}

body .container {
  width: 100%;
}
```

### BEM Plugin Example
```bash
$ npm install --save-dev css-render @css-render/plugin-bem
```

You can use bem plugin to generate bem CSS like this:

```js
import CssRender from 'css-render'
import bem from '@css-render/plugin-bem'
/**
 * CommonJS:
 * const { CssRender } = require('css-render')
 * const { plugin: bem } = require('@css-render/plugin-bem')
 */

const cssr = CssRender()
const plugin = bem({
  blockPrefix: '.c-'
})
cssr.use(plugin) // bind the plugin with the cssr instance
const {
  cB, cE, cM
} = plugin

const style = cB(
  'container',
  [
    cE(
      'left, right', 
      {
        width: '50%'
      }
    ),
    cM(
      'dark', 
      [
        cE(
          'left, right',
          {
            backgroundColor: 'black'
          }
        )
      ]
    )
  ]
)

/** use it as string */
console.log(style.render())
/**
 * or mount on document.head
 * the following lines only works in browser, don't call them in node.js
 */
style.mount()
// ...
style.unmount()
```
```css
.c-container .c-container__left, .c-container .c-container__right {
  width: 50%;
}

.c-container.c-container--dark .c-container__left, .c-container.c-container--dark .c-container__right {
  background-color: black;
}
```

## Vue3 SSR
```bash
$ npm install --save-dev css-render @css-render/vue3-ssr
```

To make ssr works, you need to make
```tsx
import { h, createSSRApp, defineComponent } from 'vue'
import { renderToString } from '@vue/server-renderer'

import { CssRender } from 'css-render'
import { SsrContext, ssrAdapter } from '@css-render/vue3-ssr'

const Child = defineComponent({
  setup () {
    c('div', {
      color: 'red'
    }).mount({
      id: 'mount-id',
      // You need to pass the ssrAdapter to `mount` function
      // to make ssr work.
      // If you want it work with CSR, just set it to undefined
      ssr: ssrAdapter 
    })
  },
  render () {
    return 'Child'
  }
})

const App = defineComponent({
  render () {
    // Wrap the SsrContext at the root of your app
    return h(SsrContext, null, {
      default: () => h(Child)
    })
  }
})

const app = createSSRApp(App)

renderToString(app).then(v => { console.log(v) })
```

Finally you will find the rendered SSR HTML includes mounted style.

## Packages
|Name|Cov|
|-|-|
|css-render|[![codecov](https://codecov.io/gh/07akioni/css-render/branch/master/graph/badge.svg?token=28OJZAHLK4&flag=css-render)](https://codecov.io/gh/07akioni/css-render)|
|@css-render/plugin-bem| [![codecov](https://codecov.io/gh/07akioni/css-render/branch/master/graph/badge.svg?token=28OJZAHLK4&flag=plugin-bem)](https://codecov.io/gh/07akioni/css-render)|
|vue3-ssr| [![codecov](https://codecov.io/gh/07akioni/css-render/branch/master/graph/badge.svg?token=28OJZAHLK4&flag=vue3-ssr)](https://codecov.io/gh/07akioni/css-render)|