# First Step
`css-render` has a concept of `CNode`.

Basically, a `CNode` is an object with `selector`, `properties` and `chilren`(child `CNodes`) properties.

`CNode` has methods to render it to CSS literals, mount to `document` or unmount it from `document`.

## Create a `css-render` object (`CNode`)
```js
import CSSRender from 'css-render'
/**
 * common js:
 * const { CSSRender } = require('css-render')
 */

const {
  c
} = CSSRender()

// style is a CNode
const style = c('body', {
  margin: 0,
  backgroundColor: 'white'
}, [
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
console.log(style.render())
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
  width: '100%';
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

If you want to mount & unmount percisely, see [Advanced Mount & Unmount Options](https://github.com/07akioni/css-render/blob/master/docs/mount.md).

If you want to know the detail of creating a `CNode` and rendering `CNode` tree , see [Create a CNode & Render a CNode Tree](https://github.com/07akioni/css-render/blob/master/docs/cnode-and-render.md).

If you want to know what does the `CSSRender` function returns, see [CSSRender Instance](https://github.com/07akioni/css-render/blob/master/docs/css-render-instance.md).

If you are interested in developing a plugin, see [Plugin Development](https://github.com/07akioni/css-render/blob/master/docs/plugin-development.md).
