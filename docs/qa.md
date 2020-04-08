# Q & A
#### This sounds a bit like styled-components to me. How does this package differ?

I'm not very familiar with styled-components, if you find I misunderstand something, feel free to tell me.

1. I saw styled-components use template string to do styling, however a function interface is better for auto completion and type checking.

2. css-render has a rather small minified gzip size, the core is smaller than 2kb (currently less than 1.5kb).

3. It just generate CSS and mount it to html so doesn't bind with any specific framework.

4. You can write style in a similar way such as Sass or Less, for css-render provides a dynamic selector generation API with configurable context. For example you can write BEM CSS code like `cB('block', [cE('element', [cM('modifier', {})]])` to generate `block__element--modifier {}`. That's what I've done in my Sass code using mixin. In my development, I find sometimes global CSS is more easily to organize.

5. You can easily reuse any part of your css-render node tree, since they are pure javascript objects. For example, split button style into buttonType.cssr.js, buttonSize.cssr.js and something like that.

6. Style can be generated in node side.

However, I want to stress that it can be just a supplementary method. If you find everything you are using, for example pure CSS, preprocessors, or other libraries work fine, just keep going, they are doing great jobs.

When you find some bottleneck in bundle size or want to use global CSS with some dynamic functionality, you may need css-render.