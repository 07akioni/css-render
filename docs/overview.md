# Overview
## First Step
### Create a `css-render` object (`CNode`)
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
### Render CNode to String
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
### Mount CNode to HTML document
Use `style.mount()` to mount the style.
```js
style.mount()
```
It will create a `HTMLStyleElement` with rendered style and mount it to `document.head`.
### Unmount CNode's style
Use `style.unmount()` to unmount the style.
```js
style.unmount()
```
It will remove all the mounted style elemented of the `style` object.

## Advanced Mount & Unmount Options
A `CNode` has `mount` & `unmount` methods.
### Mount
#### `mount(target?: string | number | HTMLStyleElement)`
- If target is `undefined`, every call of mount method will create a `style` element with rendered styles and mount it `document.head`.
- If target is a `string` or `number`. It will mount the style to a `style[css-render-id="${target}"]` element to `document.head` and set `mount-count` attribute of the element to `1`. If the element already exists, the `mount` method will **not** refresh the content of the element but plus the `mount-count` attribute of the element by `1`.
- If target is a `HTMLStyleElement`, and the target has no `mount-count` attribute, the `innerHTML` of the target will be set to the rendered style and the attribute will be set to `1`. Or it will only plus the `mount-count` attribute of the target by `1`.
#### `unmount(target?: string | number | HTMLStyleElement)`
- If target is `undefined`, every mounted elements of the `CNode` will be unmounted.
- If target is a `string` or `number`. It will unmount `style[css-render-id="${target}"]` element mounted by the `CNode` if the element's `mount-count` is `1`. Or it will minus the element's `mount-count` by `1`.
- If target is a `HTMLStyleElement`. It will unmount target element if it is mounted by the `CNode` when the element's `mount-count` is `1`. Or it will minus the element's `mount-count` by `1`.