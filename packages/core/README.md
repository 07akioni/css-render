# css-render &middot; [![GitHub Liscense](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/07akioni/css-render/blob/master/LICENSE) [![Coverage Status](https://coveralls.io/repos/github/07akioni/css-render/badge.svg?branch=master)](https://coveralls.io/github/07akioni/css-render?branch=master) [![npm](https://img.shields.io/npm/v/css-render)](https://www.npmjs.com/package/css-render)

Generating CSS using JS with considerable flexibility and extensibility, at both server side and client side.

It's design to be a progressive tool which can just work as a supplementary of your style files or totally replace your `.css` files.

## Why Using It
1. If you have a large CSS bundle with duplicate generation logic, such as a `button.css` with info, success, warning, error and ... buttons, you will need to transfer all the style literals in network. By using `css-render`, you can generate CSS at client side and reduce your app's bundle size. (This is a exchange between `bandwidth` and `CPU time`)
2. You may write `sass`, `less` or other preprocessors' mixins. However the logic can't be reused at client side (at a small cost). For example, you can generate a red button's style in preprocessors at server side, but you can't handle a dynamic color input at client side. By using `css-render`, you can generate styles dynamically based on JS variables (which can styling something like `::before` or `:hover` more easliy than inline style).
3. You want to write style variables in JS.

## Get Started
```bash
$ npm install --save-dev css-render
```
```js
import CSSRender from 'css-render'
/**
 * common js:
 * const { CSSRender } = require('css-render')
 */

const {
  h
} = CSSRender()

console.log((
  h('body', {
    margin: 0,
    backgroundColor: 'white'
  }, [
    h('&.dark', {
      backgroundColor: 'black'
    }),
    h('.container', {
      width: '100%'
    })
  ])
).render())
```
which outputs
```css
body {
  margin: 0;
  background-color: white;
}
body.dark {
  background-color: black;
}
body .container {
  width: '100%';
}
```

## Plugins
### BEM
```bash
$ npm install --save-dev css-render @css-render/plugin-bem
```

You can use bem plugin to generate bem CSS like this:

```js
import CSSRender from 'css-render'
import CSSRenderBEMPlugin from '@css-render/plugin-bem'
/**
 * common js:
 * const { CSSRender } = require('css-render')
 * const { plugin: CSSRenderBEMPlugin } = require('@css-render/plugin-bem')
 */

const cssr = CSSRender()
const plugin = CSSRenderBEMPlugin({
  blockPrefix: '.c-'
})
cssr.use(plugin)
const {
  hB, hE, hM
} = plugin

console.log(
  hB(
    'container',
    [
      hE(
        'left, right', 
        {
          width: '50%'
        }
      ),
      hM(
        'dark', 
        [
          hE(
            'left, right',
            {
              backgroundColor: 'black'
            }
          )
        ]
      )
    ]
  ).render()
)
```
which outputs
```css
.c-container .c-container__left, .c-container .c-container__right {
  width: 50%;
}
.c-container.c-container--dark .c-container__left, .c-container.c-container--dark .c-container__right {
  background-color: black;
}
```
