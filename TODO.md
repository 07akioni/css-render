1. <del>允许创建多个 CSS Render 的实例，通过 create 方法或者构造函数，现在所有的渲染会共用一个上下文，这显然是有一些问题的</del>✅
2. 当多个 CSS Render 存在的时候，Mount 节点需要能被手动控制，否则有的时候可能会产生冲突，主要取决于挂载的时候看不看命名空间
3. declarationMap, tsbuildinfo 都是什么玩意？Project Reference 又是啥？
4. <del>可能把 render 方法放在 CNode 上比较好</del>✅
5. 插件 API 是不是友好？把 selector 换成 $ 可以带来 1% 左右的打包尺寸提升，emmmm，十分困扰，是要维持还说换呢
6. <del>对属性的类型得写的严谨一点</del> <del>通过 `csstype` 包已经解决了这个问题，可是关键是为啥本地 typescript 就不能帮我 resolve 正确的类型呢？我没法在这个文件夹内部测试啊！！！搞的只能 xjb 涨 npm 版本号（这必然也是个错误的行为）</del> 我通过软连接解决这个问题了，似乎是一个说的过去的解决方案...
7. `karma-typescript` 似乎有个 bug，没法正确的 resolve 一个只包含 index.d.ts 的 npm 包！麻烦
8. mount 函数的测试
9. Minify 的 build，使用 rollup 和 terser
10. 在 render 时候类型的传递我似乎应该用泛型，现在全都是 any，not good