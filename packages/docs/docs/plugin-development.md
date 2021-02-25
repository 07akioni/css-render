# Plugin Development
A `css-render` plugin should be a function that return a plugin object.

The plugin need to follow the following rules:
1. If you want to access the properties of a [CssRender](css-render-instance.md) instance, the object should has a `install` method.
2. If you want your plugin has options, you should accept the options from the plugin function's params.
```js
import CssRender from 'css-render'

const cssr = CssRender()

const plugin = function (options) {
  return {
    install (CssRenderInstance) {
      // do something on CssRenderInstance.context as initialization
      // or get the c method of the CssRenderInstance
    }
  }
}

cssr.use(plugin) // it will make install methods called
```

There is no limitation on what other properties should the plugin object have. But it is recommended that provide the functionality by create some high-order functions of `c` method. (My convention is that the high-order function need to starts with 'c'.)

Here is an example accumulator plugin (which is literally nonsense).
```js
import CssRender from 'css-render'

const cssr = CssRender()

const Plugin = function ({
  startsFrom
} = {
  startsFrom: 1
}) {
  let context
  let c
  return {
    install (CssRenderInstance) {
      c = CssRenderInstance.c
      context = CssRenderInstance.context
      context.number = startsFrom
    },
    cAcc () {
      return c({
        $: '.number',
        before: (context) => {
          context.number += 1
        }
      }, ({ context }) => ({
        value: context.number
      }))
    }
  }
}

const plugin = Plugin({ startsFrom: 0 })
cssr.use(plugin) // it will make install methods called

const { cAcc } = plugin

console.log(cAcc().render())
console.log()
console.log(cAcc().render())
console.log()
console.log(cAcc().render())
```
It outputs:

```css
.number {
  value: 1;
}

.number {
  value: 2;
}

.number {
  value: 3;
}
```

If you still have no idea on how to create a plugin, you may see [@css-render/plugin-bem](https://github.com/07akioni/css-render/tree/master/packages/plugins/bem) for some inspirations.
