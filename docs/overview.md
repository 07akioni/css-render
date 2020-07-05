# First Step
`css-render` has a concept of `CNode`.

Basically, a `CNode` is an object with `selector`, `properties` and `chilren`(child `CNodes`) properties.

`CNode` has methods to render it to CSS literals, mount to `document` or unmount it from `document`.

## Create a `css-render` object (`CNode`)
```js
import CssRender from 'css-render'
/**
 * common js:
 * const { CssRender } = require('css-render')
 */

const {
  c
} = CssRender()

// style is a CNode
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
```
Now you have a `css-render` object `style`.
## Render `CNode` to String
```js
console.log(style.render({ backgroundColor: 'white' }))
```
Now you have
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
## Mount `CNode` to HTML document
Use `style.mount()` to mount the style.
```js
style.mount()
```
It will create a `HTMLStyleElement` with rendered style and mount it to `document.head`.
## Unmount style of the `CNode`
Use `style.unmount()` to unmount the style.
```js
style.unmount()
```
It will remove all the mounted style elemented of the `style` object.

---

- If you want to mount & unmount percisely, see [Advanced Mount & Unmount Options](mount.md).

- If you want to create `CNode` and render `CNode` tree with more options, see [Create a CNode & Render a CNode Tree](cnode-and-render.md).

- If you want to know what does the `CssRender` function returns, see [CssRender Instance](css-render-instance.md).

- If you are interested in developing a plugin, see [Plugin Development](plugin-development.md).
