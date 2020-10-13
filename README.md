# css-render &middot; [![GitHub Liscense](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/07akioni/css-render/blob/master/LICENSE) [![Coverage Status](https://coveralls.io/repos/github/07akioni/css-render/badge.svg?branch=master)](https://coveralls.io/github/07akioni/css-render?branch=master) [![npm](https://img.shields.io/npm/v/css-render)](https://www.npmjs.com/package/css-render) · [![Total alerts](https://img.shields.io/lgtm/alerts/g/07akioni/css-render.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/07akioni/css-render/alerts/)

Generating CSS using JS with considerable flexibility and extensibility, at both server side and client side.

It is not designed to totally replace other style-related solutions, but to be a progressive tool which can just work as a supplementary of your style files or totally replace your `.css` files.

## Why Using It
1. If you have a large CSS bundle with duplicate generation logic, such as a `button.css` with info, success, warning, error and ... buttons, you will need to transfer all the style literals in network. By using `css-render`, you can generate CSS at client side and reduce your app's bundle size. (This is a exchange between `bandwidth` and `CPU time`)
2. You may write `sass`, `less` or other preprocessors' mixins. However the logic can't be reused at client side (at a small cost). For example, you can generate a red button's style in preprocessors at server side, but you can't handle a dynamic color input at client side. By using `css-render`, you can generate styles dynamically based on JS variables (which can styling something like `::before` or `:hover` more easliy than inline style).
3. You want to write style variables in JS.

If you still have any question, [Q&A](docs/qa.md) may help you.

## Documentation
- [First Step](https://github.com/07akioni/css-render/blob/master/docs/overview.md)
- [Create a CNode & Render a CNode Tree](https://github.com/07akioni/css-render/blob/master/docs/cnode-and-render.md)
- [CssRender Instance](https://github.com/07akioni/css-render/blob/master/docs/css-render-instance.md)
- [Advanced Mount & Unmount Options](https://github.com/07akioni/css-render/blob/master/docs/mount.md)
- [Plugin Development](https://github.com/07akioni/css-render/blob/master/docs/plugin-development.md)

## Examples
### Basic
```bash
$ npm install --save-dev css-render
```
```js
import CssRender from 'css-render'
/**
 * common js:
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
import CssRenderBemPlugin from '@css-render/plugin-bem'
/**
 * common js:
 * const { CssRender } = require('css-render')
 * const { plugin: CssRenderBemPlugin } = require('@css-render/plugin-bem')
 */

const cssr = CssRender()
const plugin = CssRenderBemPlugin({
  blockPrefix: '.c-'
})
cssr.use(plugin)
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
