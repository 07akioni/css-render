1. <del>允许创建多个 CSS Render 的实例，通过 create 方法或者构造函数，现在所有的渲染会共用一个上下文，这显然是有一些问题的</del>✅
2. 当多个 CSS Render 存在的时候，Mount 节点需要能被手动控制，否则有的时候可能会产生冲突，主要取决于挂载的时候看不看命名空间
3. declarationMap, tsbuildinfo 都是什么玩意？Project Reference 又是啥？
4. <del>可能把 render 方法放在 CNode 上比较好</del>✅
5. 插件 API 是不是友好？把 selector 换成 $ 可以带来 1% 左右的打包尺寸提升，emmmm，十分困扰，是要维持还说换呢
6. 对属性的类型得写的严谨一点