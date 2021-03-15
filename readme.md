#### 修改内容
1. 添加 styles.scss , 在angular.json -> styles中添加引用
2. 添加 JWT 拦截器，并在 alainConfig.auth 中添加 token_send_key: 'Authorization' ,这将使request中自动加上 Authorization头信息
3. 添加proxy.conf.json




#### 笔记
1. Lodop 组件在pro版本中没有默认支持，此组件的作用是用于打印文档
2. <ng-content></ng-content> 表示之后会写在标签内的内容
3. TemplateRef<void> + 页面的 <ng-template [ngTemplateOutlet]=""></ng-template> 可以传入一个模板


#### 项目中导入简写成同模块导入 简写为 .. 会引发循环依赖

#### 行模型
client-side: 客户端模型, 默认值, 这个模型将一次性加载所有数据。(这个模型仍然可以通过把每页都当做所有数据来实现翻页)。
infinite: 无限模型 
server-side: 服务端模型, 服务端模型建立在 无限模型之上, 用户向下滚动时除了能延迟加载外，还能使用服务端对数据进行聚合（但这个考验服务端的能力） 
viewport: 视窗模型, 表格将通知服务器要显示的数据（第一行和最后一行），借此来实现分页。 （之前的脚手架用的就是这个模型），不建议使用这个，太特么复杂，而且客户端模式就能模拟。


### 任务
1. 菜单开发 -> 完成
2. 表格开发 -> 进行中..  暂时使用归档1的表格，回头参考front进行修改。
