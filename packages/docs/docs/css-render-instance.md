# `CssRender` Instance
You may wonder why css-render doesn't provide a `c` method from its entry point like `React.createElement` or `Vue.h`. The reason is the `c` method shared a context can be modified by plugins. I can't make `c` a singleton since it may be influenced accidentally by other packages.

`CssRender` instance can be created by the following codes:
```js
import CssRender from 'css-render'

const config = {
  // ... 
}
const cssr = CssRender(config) // cssr is a CssRender instance
```
## Config
```ts
interface Config {
  // whether to render the CSS of a CNode with empty properties (eg. {})
  // default is false
  keepEmptyBlock: boolean
}
```
## Properties on the Instance
the instance(`cssr`) has some public properties:
- `c(...)`: the method to create a `CNode`, see [Create a CNode & Render a CNode Tree](cnode-and-render.md).
- `context`: the context of the instance, default is `{}`. It may be used by a plugin or in the rendering phase of a `CNode` tree.
- `use(plugin)`: bind the instance with a plugin.

### Example
```ts
import CssRender from 'css-render'

const {
  c, context, use
} = CssRender()
```
