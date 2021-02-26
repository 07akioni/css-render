# Getting Started
`css-render` has a concept of `CNode`.

Basically, a `CNode` is an object with `selector`, `properties` and `chilren`(child `CNodes`) properties.

`CNode` has methods to render it to CSS literals, mount to `document` or unmount it from `document`.

## Create a `CNode`
```js
import { CssRender } from 'css-render'
/**
 * common js:
 * const { CssRender } = require('css-render')
 */

const {
  c
} = CssRender() // create a css-render instance

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
Now you have a `CNode` contains your `style`.
## Render the `CNode` to String
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

// Style can be mount with id.
// If you provide an id, the style won't be regenerated again and again.
style.mound({ id: 'my-style' })
```
It will create a `HTMLStyleElement` with rendered style and mount it to `document.head`.
## Unmount style of the `CNode`
Use `style.unmount()` to unmount the style.
```js
// unmount all the mounted style from the CNode
style.unmount()

// Style can be unmount with id.
// Only the mounted style with same id will be affected.
style.unmount({ id: 'my-style' })
```
It will remove all the mounted style elemented of the `style` object.

---

- If you want to mount & unmount percisely, see [Advanced Mount & Unmount Options](mount.md).

- If you want to create `CNode` and render `CNode` tree with more options, see [Create a CNode & Render a CNode Tree](cnode-and-render.md).

- If you want to know what does the `CssRender` function returns, see [CssRender Instance](css-render-instance.md).

- If you are interested in developing a plugin, see [Plugin Development](plugin-development.md).
