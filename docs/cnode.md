# Create a `CNode`
To create a `CNode`, you need to create a `CSSRender` instance and get the `c` method out of it:
```js
import CSSRender from 'css-render'

const {
  c
} = CSSRender()
```
The `c` method is use to create a `CNode`.
## Basic Usage
### `c` method
It can be use in the following forms:
- `c(selector: string, properties: CSSProperties | () => CSSProperties)`
- `c(selector: string, properties: CSSProperties | () => CSSProperties, children: CNode[])`
- `c(selector: string, children: CNode[])`
- `c(children: CNode[])`
Both of them will return a `CNode`.
#### selector
selector can be a CSS selector, it also support `&` syntax.

For example:
```js
c('.button', {
  color: 'black'
}, [
  c('.button__icon', {
    fill: 'black'
  }),
  c('.button--error', {
    color: 'red'
  })
])
```