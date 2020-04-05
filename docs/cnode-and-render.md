# Create a `CNode` & Render a `CNode` Tree
To create a `CNode`, you need to create a [CSSRender instance](https://github.com/07akioni/css-render/blob/master/docs/css-render-instance.md) and get the `c` method out of it:
```js
import CSSRender from 'css-render'

const {
  c
} = CSSRender() // return a CSSRender instance
```
The `c` method is use to create a `CNode`.
## `c` method
It can be use in the following forms:
- `c(selector: string | CNodeOptions, properties: CSSProperties | ({ context?, props? }) => CSSProperties)`
- `c(selector: string | CNodeOptions, properties: CSSProperties | ({ context?, props? }) => CSSProperties, children: CNode[])`
- `c(selector: string | CNodeOptions, children: CNode[])`
- `c(children: CNode[])`
Both of them will return a `CNode`.
### `selector`
#### string `selector`
selector can be a CSS selector, it also support `&` syntax.

For example:
```js
console.log(c('.button', {
  color: 'black'
}, [
  c('.button__icon', {
    fill: 'black'
  }),
  c('&.button--error', {
    color: 'red'
  })
]).render())
```
It outputs:
```css
.button {
  color: black;
}

.button .button__icon {
  fill: black;
}

.button.button--error {
  color: red;
}
```
#### `CNodeOptions` typed `selector`
`CNodeOptions` is a object looks like:
```typescript
interface CNodeOptions {
  $: (({ context, props }) => string) | string,
  before: (context) => void,
  after: (context) => void
}
```
`context` is the `context` of `c` method's corresponding `CSSRender` instance.

If you want to know more about `context`, see [CSSRender](https://github.com/07akioni/css-render/blob/master/docs/css-render-instance.md).

- `$` is a selector string or a function that accepts the context and return a selector string as demostrated before. `props` is the passed from itself or it ascendant node's render function, for example, `cnode.render({ color: 'black' })`.
- `before` is the hook before the `CNode` tree is rendered. You can setup the `context` in the hook.
- `after` is the hook after the `CNode` tree is rendered. You can do some cleaning in the hook.
### `properties`
#### object typed `properties`
You can put just a plain object:
```js
console.log(c('.button', {
  backgroundColor: 'green'
}).render())

console.log()

console.log(c('@keyframes my-animation', {
  from: {
    color: 'white'
  },
  to: {
    color: 'black'
  }
}).render())
```
It outputs:
```css
.button {
  background-color: green;
}

@keyframes my-animation {
  from {
    color: white;
  }
  to {
    color: black
  }
}
```
#### function typed `properties`
If you want to determine the properties of a `CNode` at rendering phase. Use a `({ context?, props? }) => CSSProperties` typed properties as the properties of `CNode`.

- `context` is the `context` of `c` method's corresponding `CSSRender` instance.
- `props` is the `props` argument passed to `render` function.

```js
const style = c('.button', ({
  props
}) => ({
  color: props.color
}))

console.log(style.render({ color: 'red' }))

console.log()

console.log(style.render({ color: 'blue' }))
```
It outputs:
```css
.button {
  color: red;
}

.button {
  color: blue;
}
```

Lazy evaluation is good for performance because you can reuse a `CNode` tree rather than rebuild one.

### `children`
children is an array of `CNode`.

The only thing worth saying is that you can render a style fragment like this:
```js
c([
  c('.button.button--blue', {
    color: 'blue'
  }),
  c('.button.button--red', {
    color: 'red'
  })
]).render()
```
It outputs:
```css
.button.button--blue {
  color: blue;
}

.button.button--red {
  color: red;
}
```
