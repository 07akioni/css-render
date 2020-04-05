# Something I Can't Solve (我解决不了的一些问题)
## en-US
 I'd appreciate it if you can help me solve some of the problems (I'll at least offer you a cup coffee 😂🙏).
1. Some lines are not covered after run `npm run test`. Most of coverage works very well. However, the uncovered lines are unreasonable because most of them should be covered when I look at them...
2. In VS Code (1.43.2, mac), if I use a .js file to use the library, CNode.mount's return type can't be inferred correctly when target is null. The generic of the function should be <null, ...> but actually it will be <any, ...>. See [snapshot]('playground/whyGenericIsntCorrectlyMatched.jpg')。
## zh-CN
如果你能帮忙解决一下某个问题的话我会不胜感激（至少请你一杯咖啡😂🙏）。
1. 在运行 `npm run test` 之后有一些行没有被覆盖。大部分覆盖看起来都没啥问题。但是，有一些没覆盖的行就莫名其妙，我看了里面好几个地方都觉得应该会运行到的。
2. 在 VS Code（1.43.2，mac）里面，如果用 js 文件引用库，CNode.mount 在 target 为 null 的时候不能争取的推断出类型。这个方法的泛型应该是 <null, ...>，但是却显示为 <any, ...>。参考 [截图]('playground/whyGenericIsntCorrectlyMatched.jpg')。
