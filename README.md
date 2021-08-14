# coadmin-web-quasar

Coadmin 管理系统 Web 客户端

基于 Quasar-admin-template 开发

Quasar相比ElementUI，胜在可定制性上比较强，同时官网文档也相当详细，看文档能解决绝大多数问题。界面也相对漂亮一些，另外还有一个很大的优势，Quasar对于移动端的适配做得非常棒。

## 代码仓库
[Github](https://github.com/jinjingmail/coadmin-web-quasar)
[Gitee](https://gitee.com/jinjinge/coadmin-web-quasar)

## 主要特点
- 给个`star`吧
- 良好的适配移动端小屏幕
- 感谢：eladmin-web、vue-element-admin、quasar-admin-crm、quasar-element-pro
- 更多特性请查阅 Quasar-admin-template 项目

```bash
TODO 添加 co-btn、q-btn-dropdown、q-btn-group、q-btn-toggle 的 design全局配置
TODO co-dialog
  - TODO 可移动的dialog的标题栏图标显示移动图标
  - 标题栏添加可以折叠对话框内容的按钮
  - TODO dialog里面内容滚动时，可以不滚动标题栏、底部工具栏
TODO 页面增加字段选择的存储
TODO 页面增加表格大小选择（存储）
TODO 如果不显示 Tab 栏，则所有页面都不 keep-alive（不缓存）
TODO 加快图标页加载速度
TODO 菜单caption 附加文字颜色，改为灰色
TODO 在右侧打开外部url（iframe或其他方案）
TODO 菜单增加“new”标签支持

TODO co-input 的tips功能
TODO co-input 的规则验证完善
TODO co-table 的expand功能
TODO option-group/select 组件string和number类型互相能识别（单选、多选）
TODO 优化一下tree-table查找expand列的代码，只在列显示发生变化时确定
TODO 菜单crud的rules
TODO PageTagView 增加右键菜单：关闭全部、关闭其他、关闭右边
为 co-tree 添加 tree-class / tree-style tree-class-mobile tree-style-mobile
TODO 树表懒加载
TODO 树表增加图标显示
“在当前页查找”支持ESC键盘按键
TODO 增加 co-table-select
TODO 增加用户配置：左侧菜单栏是否阴影、table字体颜色、co-table的separator
TODO crud-operation 增加选项“按grid显示”
TODO 针对mac系统，适配一下自定义组件（比如dialog的关闭按钮放到左上角）
TODO CoForm 表单配置型 Validator
TODO CoOptionGroup 自定义form项的错误提示
TODO CoDateSelect 可以手工输入日期、可以选择“最近7天、最近30天、本月、上月。。。”
TODO CoTree selected和ticked，可以设置“只选parent，只选leaf”
TODO CoTreeSelect 的select 模式，选择一项后，自动关闭弹出界面
TODO CoDate 支持 number 类型

TODO BUG 在iphone上，输入框也要小一些
TODO BUG CoInput 在popup-proxy 里面时，有时候prepend、append、before、after 的slot会失效
对话框最大化后，取消拖动
TODO BUG 图表dark模式文字颜色
TODO BUG CoTreeSelect 的 v-model不合理
```

## 界面截图
### PC上的效果
![user](https://gitee.com/jinjinge/coadmin-web-quasar/raw/main/public/img/screen.jpg)

## Install the dependencies（安装依赖）
```bash
首先，安装nodejs（注意：只能是12和14版本，更新的版本可能有问题）
然后，安装 quasar 工具：
npm install -g @quasar/cli

安装依赖:
npm install
```

### Start development mode (启动app开发模式)
```bash
quasar dev
```

### Lint the files（Lint校验）
```bash
npm run lint
```

### Build the production（构建发行版本）
```bash
quasar build
```

### Customize the configuration（修改配置）
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
