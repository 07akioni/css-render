# Create a `CNode` & Render a `CNode` Tree
To create a `CNode`, you need to create a [CssRender instance](https://github.com/07akioni/css-render/blob/master/docs/css-render-instance.md) and get the `c` method out of it. For example:
```js
import CssRender from 'css-render'

const {
  c
} = CssRender() // return a CssRender instance
```
The `c` method is use to create a `CNode`.
## `c` method
It can be use in the following forms:
- `c(selector: string | Function | Object | null, properties: Object | string | Function)`
- `c(selector: string | Function | Object | null, properties: Object | string | Function, children: Array)`
- `c(selector: string | Function | Object | null, children: Array)`
- `c(children: Array)`
Both of them will return a `CNode`.
### `selector`
#### String `selector`
selector can be any CSS selector, it also support `&` syntax.
For example:
```js
c('.button', {
  color: 'black'
}, [
  c('.button__icon', {
    fill: 'black'
  }),
  c('&.button--error', {
    color: 'red'
  })
]).render()
```
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
#### Function `selector`
Except `string`, `selector` can be a function that returns a string:
```js
c(({
  context,
  props
}) => props.selector, {
  color: 'black'
}).render({
  selector: '.selector'
})
```
```css
.selector {
  color: black;
}
```
- `props` is passed from render function of itself or its ascendant's `CNode`. For example, in `cnode.render({ color: 'black' })`, `{ color: 'black' }` is the `props`.
- `context` is the `context` of `c` method's corresponding `CssRender` instance.

If you want to know more about `context`, see [CssRender](https://github.com/07akioni/css-render/blob/master/docs/css-render-instance.md).

#### Object `selector`

`selector` can also be a object which has more utilities. The object can be typed as
```typescript
{
  $?: (({ context, props }) => string | null) | string | null,
  before?: (context) => void,
  after?: (context) => void
}
```
- `$` can be a string selector or a function selector or `null`.
- `before` is the hook before the `CNode` tree is rendered. You can setup the `context` in the hook.
- `after` is the hook after the `CNode` tree is rendered. You can do some cleaning in the hook.

#### Null `selector`
It will work as if the selector does not exist:
```js
c('div', [
  c(null, [
    c('button', {
      color: 'black'
    })
  ])
]).render()
```
```css
div button {
  color: black;
}
```

### `properties`
#### Object `properties` & string `properties`
You can put just a plain object or string:
```js
c('.button', 'background-color: green;').render()

c('@keyframes my-animation', {
  from: {
    color: 'white'
  },
  to: {
    color: 'black'
  }
}).render()
```
```css
.button {
  background-color: green;
}

@keyframes my-animation {
  from {
    color: white;
  }
  to {
    color: black;
  }
}
```
#### Function `properties`
If you want to determine the properties of a `CNode` at rendering phase. Use a `({ context, props }) => string | Object` typed function as the properties of `CNode`.

```js
const style = c('.button', ({
  context,
  props
}) => ({
  color: props.color
}))

style.render({ color: 'red' })

style.render({ color: 'blue' })
```
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
children is an array of `CNode` and function. If a function is in the array, its need to return a `CNode` or an array of `CNode`.
```js
c('div', [
  // function returns a CNode
  ({ context, props }) => c('button', {
    color: props.color
  }),
  // CNode
  c('ul', {
    backgroundColor: 'red'
  }),
  // Nested CNode Array
  [
    [c('dl', {
      backgroundColor: 'red'
    })]
  ],
  // function returns a CNode Array
  () => [
    c('ol', {
      backgroundColor: 'red'
    })
  ]
]).render({
  color: 'black'
})
```
```css
div button {
  color: black;
}

div ul {
  background-color: red;
}

div dl {
  background-color: red;
}

div ol {
  background-color: red;
}
```

Also, you can render a style fragment like this:
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
```css
.button.button--blue {
  color: blue;
}

.button.button--red {
  color: red;
}
```

Maybe the only limitation of style generation is your imagination.