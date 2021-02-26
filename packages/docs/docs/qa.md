# Q & A
#### This sounds a bit like styled-components to me. How does this package differ?

1. css-render is mainly built for **library builders**. It helps the maintainer ship a library wihout css at a small cost. (gzip < 2kb)

2. css-render doesn't do the bindings between components and styles. It is more like a style generator with low level mount and unmount API. So it's not recommend to build style for web-apps.

3. As result of `2`, it just generate CSS and mount it to html so doesn't bind with any specific framework.

4. css-render is easier to write like a sass mixin or less mixin.
```ts
// For example
cB('block', [
  cE('element', [
    cM('modifier', {})
  ]
])
// generates css:
// block__element--modifier {}
```
If you build library with sass or less, you may have a try with css-render.

5. Style (CNode) can be reused at any granularity.

6. Style can be generated in node side simplelly.

However, I want to stress that it can be just a supplementary method. If you find everything you are using, for example pure CSS, preprocessors, or other libraries work fine, just keep going, they are doing great jobs.

When you got some bottleneck and find the mentioned features are useful for you. Why not have a try?