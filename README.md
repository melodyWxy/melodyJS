# melody

## 关于项目的script命令

### 启动demo项目

npm run demo-start

### 打包输出melody-es模块-生产环境

npm run build-es

### 打包输出melody-commonjs模块-生产环境

npm run build-cjs

### 打包输出melody-es模块-开发环境
npm run build-dev

## 设计思想

melodyJS设计思想是 更轻量/高扩展/低开销。

### PC or Mobile ？

都可以的。

### jsx+

melodyJS中的jsx+语法是在jsx基础上多集成了一些有效指令——这些指令形式上类似vue的指令，但根本上是源于melodyJS的re-render策略———在react-diff方案的基础上给vDom标记了静态/动态，以提供更快的更轻量的diff开销。 

### 编程风格

melodyJS在使用形式上偏向react，当然也拥有自己的特色(我将尽量保证它的API设计和react统一风格，并为此集成jsx+)。

### why vDom？
vDom存在显然的优点：比如差量算法高效快速，对移动设备足够轻量，user众多。
但同时也有明显的缺点：内存DOM导致高内存消耗，没有区分静态和动态元素。
因此：虚拟dom结合diff算法的方案对一个框架的渲染性能来讲其实不是很好的方案——它的优点更多体现在让user感到开发更便捷(业务代码对渲染机制无影响，user无感知)。但它每次re-render的时候相对会做很大部分的额外工作，这将产生很多额外不必要的内存开销。
但在melody中，作者借鉴了Ember.js，给vDom标记静态/动态分类，提供了更快的更轻量的diff开销。 
这是melody的优势所在，也是它的魅力所在

### 特别说明

melodyjs 基于rollup打包输出, 支持主流的各类型模块化。

### 谁设计了melodyJS并将其是实现？

我就知道！这么厉害的人是melodyWxy(六弦/时雨，email: 18210711176@163.com).如果你想参与melodyJS生态的建设维护，请通过邮箱联系他吧！

### 开源？
yes！开源社区我的家，集体贡献靠大家！

## melody api解析

## 图解melody

## melody生态