# melody

## 关于项目的script命令

### 启动demo项目

npm run demo-start

### 打包输出melody-es模块

npm run build-es

### 打包输出melody-commonjs模块

npm run build-cjs


## 设计思想

melodyJS设计思想是 更轻量/高扩展/低开销。

### PC or Mobile ？

都可以的。

### jsx+

melodyJS中的jsx+语法是在jsx基础上多集成了一些有效指令——这些指令形式上类似vue的指令，但根本上是为了源于melodyJS的re-render策略———增量dom方案

### 编程风格

melodyJS在使用形式上偏向react，当然也拥有自己的特色(我将尽量保证它的API设计和react统一风格，并为此集成jsx+)。

### why not vDom？

虚拟dom结合diff算法的方案对一个框架的渲染性能来讲其实不是很好的方案——它的优点更多体现在让user感到开发更便捷(业务代码对渲染机制无影响，user无感知)。但它每次re-render的时候相对会做很大部分的额外工作，这将产生很多额外不必要的内存开销。
而基于增量dom方案，则对所占用的内存大小让user可控，从而带来更快更流畅的体验。

### 特别说明

melodyjs 基于rollup打包输出, 支持主流的各类型模块化。

### 谁设计了melodyJS并将其是实现？

我就知道！这么厉害的人是melodyWxy(六弦/时雨，email: 18210711176@163.com).如果你想参与melodyJS生态的建设维护，请通过邮箱联系他吧！

### 开源？
yes！开源社区我的家，集体贡献靠大家！

## melody api解析

## 图解melody

## melody生态