1. <del>允许创建多个 CSS Render 的实例，通过 create 方法或者构造函数，现在所有的渲染会共用一个上下文，这显然是有一些问题的</del>✅
2. <del>当多个 CSS Render 存在的时候，Mount 节点需要能被手动控制，否则有的时候可能会产生冲突，主要取决于挂载的时候看不看命名空间</del>让用户去管理 id 吧，我不管了✅
3. declarationMap, tsbuildinfo 都是什么玩意？Project Reference 又是啥？
4. <del>可能把 render 方法放在 CNode 上比较好</del>✅
5. <del>插件 API 是不是友好？把 selector 换成 $ 可以带来 1% 左右的打包尺寸提升，emmmm，十分困扰，是要维持还说换呢</del>换，API 可以理解，短一点是一点✅
6. <del>对属性的类型得写的严谨一点</del> <del>通过 `csstype` 包已经解决了这个问题，可是关键是为啥本地 typescript 就不能帮我 resolve 正确的类型呢？我没法在这个文件夹内部测试啊！！！搞的只能 xjb 涨 npm 版本号（这必然也是个错误的行为）</del> <del>我通过软连接解决这个问题了，似乎是一个说的过去的解决方案...</del> 但是这个软连接会把测试覆盖率搞坏，总是得清掉= =✅
7. `karma-typescript` 似乎有个 bug，没法正确的 resolve 一个只包含 index.d.ts 的 npm 包！麻烦
8. <del>mount 函数的测试</del>✅
9. Minify 的 build，使用 rollup 和 terser
10. <del>在 render 时候类型的传递我似乎应该用泛型，现在全都是 any，not good</del>虽然对外没啥区别✅
11. <del>感觉我应该允许 mount 和 unmount `null`, `undefined`，因为初始化的时候真的很难避免这两个值</del> 我琢磨了一下，`undefined` 和现有的 API 冲突，里面还要传 props 呢，所以就只让 `null` 什么都不干好了✅
12. 然后我还感觉发布的包类型提醒不老对的，是不是重启 vscode 就能好了？
13. <del>处理 `:is(a, b, c)` 这种 selector</del>✅
14. <del>mount 的返回值类型不能改改吗，某些情况下不可能返回 null 的</del>通过泛型解决✅