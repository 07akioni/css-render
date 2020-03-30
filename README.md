# css-render &middot; [![GitHub Liscense](https://img.shields.io/github/license/07akioni/css-render?color=%232080f0)]() [![Coverage Status](https://coveralls.io/repos/github/07akioni/css-render/badge.svg?branch=master)](https://coveralls.io/github/07akioni/css-render?branch=master)

`css-render` is a library focusing on using JS to generate CSS at client side in a flexible and extensible way.

It can
1. Reduce your CSS bundle size if there're many styles generated in duplicate logic.
2. Generate styles dynamically based on JS variables (which can styling something like `::before` or `:hover` more easliy than inline style).
3. Reuse of style generation logic in JS.

## Get Started
```js
import CSSRender from 'css-render'

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
You can use bem plugin to generate bem css like this:
```js
import CSSRender from 'css-render'
import CSSRenderBEMPlugin from '@css-render/plugin-bem'

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

.c-container.c-container--dark .c-container__left,
.c-container.c-container--dark .c-container__right {
  background-color: black;
}
```
