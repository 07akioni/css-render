# css-render
`css-render` is a library focusing on using JS to generate CSS at client side in a flexible and extensible way.

It can
1. Reduce your CSS bundle size if there're many styles generated in a duplicate logics.
2. Generate styles dynamically based on JS variables (which can styling `::before` more easliy than inline style).
3. Reuse of style generation logic in JS.

## Get Started
```js
import { CSSRender } from 'css-render'

const {
  h,
  render
} = CSSRender()

console.log(render(
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
))
```
It will output
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