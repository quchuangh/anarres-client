#### 修改内容
1. 添加 styles.scss , 在angular.json -> styles中添加引用
2. 添加 JWT 拦截器，并在 alainConfig.auth 中添加 token_send_key: 'Authorization' ,这将使request中自动加上 Authorization头信息
3. 添加proxy.conf.json

#### 说明
1. Lodop 组件在pro版本中没有默认支持，此组件的作用是用于打印文档



#### 项目中导入简写成同模块导入 简写为 .. 会引发循环依赖

#### 行模型
client-side: 客户端模型, 默认值, 这个模型将一次性加载所有数据。(这个模型仍然可以通过把每页都当做所有数据来实现翻页)。
infinite: 无限模型 
server-side: 服务端模型, 服务端模型建立在 无限模型之上, 用户向下滚动时除了能延迟加载外，还能使用服务端对数据进行聚合（但这个考验服务端的能力） 
viewport: 视窗模型, 表格将通知服务器要显示的数据（第一行和最后一行），借此来实现分页。 （之前的脚手架用的就是这个模型），不建议使用这个，太特么复杂，而且客户端模式就能模拟。

### 行模型的选择
踩了一些坑之后，发现 infinite 和 viewport 没有使用的必要。官方也明确推荐在能够使用 server-side的情况下，不要使用infinite。同时也强调对viewport没有特别理解和特别需要，也不推荐使用。
然而跟infinite和viewport相比如此优秀的server-side也有很多坑。比如不支持checkbox。
最终无奈的发现最符合一般人使用习惯的反而是使用client-side来获取服务端数据后进行处理。
最后的结论是：分页使用client-side最合适。无限使用server-side最合适。

### 任务


### ng-template ng-container ng-content 
* 参考  https://blog.csdn.net/wuyuxing24/article/details/82825608
* ng-template 不会展示，<ng-template #标识>.....</ng-template>
    对应对象: TemplateRef<any>
* ng-container 为容器，不会展示自身，可以通过 <ng-container *ngTemplateOutlet='标识'></ng-container> 来展示一个模板
    还能通过 let-xx 来定义变量
    对应的对象为: ViewContainerRef
    createEmbeddedView(TemplateRef) 可以给其添加一个模板
    
#### 表格默认行为
早前，ngx-table-grid 内置了默认的增删改查功能，表格根据传入的 IDatasource对象对数据进行增加，删除，修改和查询。\
这种做法已经被放弃，IDatasource也修改成简单的查询接口。这样做的原因如下：
1. 表格的作用主要是用于展示数据，过多默认行为会让表格显得比较重。
2. 自带的功能虽然尽可能地做到通用，但通用意味着它总是无法让人满意。当用户想要重写时，不仅得不到表格的任何帮助，还可能因为需要考虑表格默认行为的影响而让事情变得复杂。
3. 服务端的Generator已经给 增,删,改 功能提供替代方案。服务端代码生成工具将会自动生成相关代码。虽然它也不总是令人满意。但它很容易修改。
